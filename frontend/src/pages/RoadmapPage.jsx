import { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { generateRoadmap, getRoadmapByEmail } from '../services/roadmapService';
import RoadmapHeader from '../components/roadmap/RoadmapHeader';
import RoadmapProgressBar from '../components/roadmap/RoadmapProgressBar';
import RoadmapStageCard from '../components/roadmap/RoadmapStageCard';
import RoadmapLoadingState from '../components/roadmap/RoadmapLoadingState';

const MAX_LOADING_MS = 60000;

const normalizeStatus = (status) => {
  if (status === 'completed') return 'completed';
  if (status === 'in_progress') return 'in_progress';
  return 'not_started';
};

const addUiIds = (items) => {
  return items.map((item, index) => ({
    ...item,
    status: normalizeStatus(item.status),
    ui_id: `${item.stage_order}-${item.skill_name}-${index}`
  }));
};

const buildStages = (roadmapItems) => {
  const stageMap = new Map();

  roadmapItems.forEach((item) => {
    const key = `${item.stage_order}-${item.stage_name}`;
    if (!stageMap.has(key)) {
      stageMap.set(key, {
        stage_name: item.stage_name,
        stage_order: item.stage_order,
        original_unlocked: Boolean(item.is_unlocked),
        skills: []
      });
    }

    stageMap.get(key).skills.push(item);
  });

  const stages = [...stageMap.values()].sort((a, b) => a.stage_order - b.stage_order);
  if (stages.length === 0) return [];

  const unlockedOrders = new Set();
  unlockedOrders.add(stages[0].stage_order);
  stages.forEach((stage) => {
    if (stage.original_unlocked) {
      unlockedOrders.add(stage.stage_order);
    }
  });

  for (let i = 0; i < stages.length; i += 1) {
    const current = stages[i];
    const currentUnlocked = unlockedOrders.has(current.stage_order);
    const allDone = current.skills.every((skill) => skill.status === 'completed');

    if (currentUnlocked && allDone && i < stages.length - 1) {
      unlockedOrders.add(stages[i + 1].stage_order);
    }
  }

  return stages.map((stage) => ({
    ...stage,
    is_unlocked: unlockedOrders.has(stage.stage_order)
  }));
};

const getLevelLabel = (progressPercent) => {
  if (progressPercent >= 85) return 'Expert';
  if (progressPercent >= 60) return 'Advanced';
  if (progressPercent >= 30) return 'Intermediate';
  return 'Beginner';
};

function RoadmapPage() {
  const { user, loading: authLoading } = useAuth();

  const [role, setRole] = useState('Learning Roadmap');
  const [roadmapItems, setRoadmapItems] = useState([]);
  const [isFetchingStored, setIsFetchingStored] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState('');
  const [hasStoredRoadmap, setHasStoredRoadmap] = useState(false);

  const generateRoadmapFlow = useCallback(async () => {
    if (!user?.email) {
      setError('Logged-in email not found. Please login again.');
      setIsGenerating(false);
      return;
    }

    setIsGenerating(true);
    setLoadingProgress(0);
    setError('');

    const controller = new AbortController();
    const startedAt = Date.now();
    let requestSettled = false;

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const percent = Math.min(100, Math.round((elapsed / MAX_LOADING_MS) * 100));
      setLoadingProgress(percent);
    }, 250);

    const timeoutTimer = setTimeout(() => {
      controller.abort('ROADMAP_TIMEOUT');
    }, MAX_LOADING_MS);

    try {
      const data = await generateRoadmap(user.email, { signal: controller.signal });
      setRole(data?.role || user.role || 'Learning Roadmap');
      const nextItems = addUiIds(Array.isArray(data?.roadmap) ? data.roadmap : []);
      setRoadmapItems(nextItems);
      setHasStoredRoadmap(nextItems.length > 0);
      setLoadingProgress(100);
      clearInterval(progressTimer);
      clearTimeout(timeoutTimer);
      requestSettled = true;
      setIsGenerating(false);
    } catch (err) {
      if (err?.name === 'AbortError') {
        setError('Roadmap generation timed out after 60 seconds. Please retry.');
      } else {
        setError(err?.message || 'Failed to generate roadmap. Please retry.');
      }
    } finally {
      clearInterval(progressTimer);
      clearTimeout(timeoutTimer);
      if (!requestSettled) {
        setIsGenerating(false);
      }
    }
  }, [user]);

  const fetchStoredRoadmap = useCallback(async () => {
    if (!user?.email) {
      setError('Logged-in email not found. Please login again.');
      setIsFetchingStored(false);
      return;
    }

    setIsFetchingStored(true);
    setError('');

    try {
      const data = await getRoadmapByEmail(user.email);
      const nextItems = addUiIds(Array.isArray(data?.roadmap) ? data.roadmap : []);

      setRole(data?.role || user.role || 'Learning Roadmap');
      setRoadmapItems(nextItems);
      setHasStoredRoadmap(nextItems.length > 0);
    } catch (err) {
      // Treat missing user/profile as an empty roadmap state so user can generate one.
      if ((err?.message || '').toLowerCase().includes('user not found')) {
        setRole(user?.role || 'Learning Roadmap');
        setRoadmapItems([]);
        setHasStoredRoadmap(false);
        setError('');
      } else {
        setError(err?.message || 'Failed to load roadmap. Please retry.');
        setRoadmapItems([]);
        setHasStoredRoadmap(false);
      }
    } finally {
      setIsFetchingStored(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    fetchStoredRoadmap();
  }, [authLoading, fetchStoredRoadmap]);

  const stages = useMemo(() => buildStages(roadmapItems), [roadmapItems]);

  const { progressPercent, completedCount, totalCount, level } = useMemo(() => {
    const total = roadmapItems.length;
    const completed = roadmapItems.filter((item) => item.status === 'completed').length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      progressPercent: percent,
      completedCount: completed,
      totalCount: total,
      level: getLevelLabel(percent)
    };
  }, [roadmapItems]);

  const onActionClick = (skill) => {
    setRoadmapItems((prev) => prev.map((item) => {
      if (item.ui_id !== skill.ui_id) return item;
      if (item.status === 'not_started') return { ...item, status: 'in_progress' };
      if (item.status === 'in_progress') return { ...item, status: 'completed' };
      return item;
    }));
  };

  const onTestClick = () => {
    // Intentionally empty for now as requested.
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans relative overflow-hidden">
      <div className="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-24 h-72 w-72 rounded-full bg-accent-cyan/20 blur-3xl" />
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10 relative z-10">
        {isGenerating ? (
          <RoadmapLoadingState loadingProgress={loadingProgress} />
        ) : authLoading || isFetchingStored ? (
          <section className="min-h-[calc(100vh-220px)] flex items-center justify-center animate-fade-in">
            <div className="w-8 h-8 rounded-full border-t-2 border-b-2 border-brand-600 animate-spin" />
          </section>
        ) : error ? (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-8 shadow-sm animate-fade-in">
            <h2 className="text-xl font-bold text-rose-700">Unable to load roadmap</h2>
            <p className="mt-2 text-rose-600">{error}</p>
            <button
              type="button"
              onClick={fetchStoredRoadmap}
              className="mt-5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
            >
              Retry
            </button>
          </section>
        ) : !hasStoredRoadmap ? (
          <section className="min-h-[calc(100vh-220px)] flex items-center justify-center animate-fade-in">
            <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-border-default bg-white p-8 md:p-10 shadow-xl">
              <div className="relative z-10">
                <div className="mx-auto w-fit rounded-full border border-brand-100 bg-white px-4 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
                  Learning Plan
                </div>

                <h2 className="mt-4 text-center text-3xl md:text-4xl font-black text-text-primary leading-tight">
                  Build Your Personalized Roadmap
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-center text-text-secondary text-base md:text-lg">
                  No saved roadmap found yet. Generate one tailored to your role and skill gaps, then track every stage of your progress in one place.
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-border-light bg-white px-4 py-4 text-center">
                    <p className="text-sm font-bold text-text-primary">Role-Aligned Stages</p>
                    <p className="mt-1 text-xs text-text-muted">Focused progression for your target role</p>
                  </div>
                  <div className="rounded-2xl border border-border-light bg-white px-4 py-4 text-center">
                    <p className="text-sm font-bold text-text-primary">Missing Skills Coverage</p>
                    <p className="mt-1 text-xs text-text-muted">Every key gap gets mapped to a stage</p>
                  </div>
                  <div className="rounded-2xl border border-border-light bg-white px-4 py-4 text-center">
                    <p className="text-sm font-bold text-text-primary">Progress Tracking</p>
                    <p className="mt-1 text-xs text-text-muted">Mark tasks complete as you level up</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={generateRoadmapFlow}
                    className="inline-flex items-center justify-center rounded-full bg-brand-600 px-9 py-3 text-sm md:text-base font-semibold text-white shadow-lg shadow-brand-300/40 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
                  >
                    Generate Roadmap
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="space-y-6">
            <RoadmapHeader
              role={role}
              progressPercent={progressPercent}
              level={level}
              completedCount={completedCount}
              totalCount={totalCount}
            />
            <RoadmapProgressBar value={progressPercent} />

            {stages.length === 0 ? (
              <section className="rounded-3xl border border-border-default border-dashed bg-white/90 backdrop-blur-sm p-10 text-center animate-fade-in shadow-sm">
                <h3 className="text-xl font-semibold text-text-primary">All core skills achieved for your target role</h3>
                <p className="mt-2 text-text-secondary">Salute to your progress. You are fully equipped for this role right now.</p>
              </section>
            ) : (
              <section className="space-y-5">
                {stages.map((stage) => (
                  <RoadmapStageCard
                    key={`${stage.stage_order}-${stage.stage_name}`}
                    stage={stage}
                    onActionClick={onActionClick}
                    onTestClick={onTestClick}
                  />
                ))}
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default RoadmapPage;
