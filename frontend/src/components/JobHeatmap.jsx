import { useState, useEffect, useMemo, useRef } from 'react';
import { getLocationCounts, getJobCount, getRoleInsights, getCachedPopularRoles, setCachedPopularRoles, getCachedLocationCounts } from '../services/jobService';
import GeoMap from './GeoMap';

const POPULAR_ROLES = [
  'Software Engineer', 'Data Scientist', 'Frontend Developer',
  'Backend Developer', 'Full Stack Developer', 'DevOps Engineer',
  'AI/ML Engineer', 'Mobile Developer', 'QA Engineer',
  'Cyber Security Engineer', 'Data Engineer', 'Product Manager'
];

function JobHeatmap({ userRole, userSkills }) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [selectedCountry, setSelectedCountry] = useState('Pakistan');

  const cachedLocations = useMemo(() => getCachedLocationCounts(selectedCountry), [selectedCountry]);
  const [locations, setLocations] = useState(cachedLocations || []);
  const [loadingMap, setLoadingMap] = useState(!cachedLocations);

  const cachedRoles = useMemo(() => getCachedPopularRoles(), []);
  const [roleCounts, setRoleCounts] = useState(cachedRoles || {});
  const [loadingGrid, setLoadingGrid] = useState(!cachedRoles);
  const [selectedRole, setSelectedRole] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [activeInsight, setActiveInsight] = useState(null);

  const abortControllerRef = useRef(null);

  // Fetch Map Data
  useEffect(() => {
    const fetchLocations = async () => {
      if (!getCachedLocationCounts(selectedCountry)) {
        setLoadingMap(true);
        setLocations([]);
      }

      try {
        const data = await getLocationCounts(selectedCountry);
        setLocations(data || []);
      } catch (err) {
        console.error("Failed to fetch location data", err);
      } finally {
        setLoadingMap(false);
      }
    };
    fetchLocations();
  }, [selectedCountry]);

  // Fetch Grid Data
  useEffect(() => {
    if (getCachedPopularRoles()) {
      return;
    }

    const fetchRoles = async () => {
      const results = {};
      try {
        const promises = POPULAR_ROLES.map(async (role) => {
          const data = await getJobCount(role);
          return { role, count: data.count || 0 };
        });
        const solved = await Promise.all(promises);
        solved.forEach(({ role, count }) => {
          results[role] = count;
        });
        setRoleCounts(results);
        setCachedPopularRoles(results);
      } catch (err) {
        console.error("Failed to fetch role counts", err);
      } finally {
        setLoadingGrid(false);
      }
    };
    fetchRoles();
  }, []);

  const handleCloseInsights = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setSelectedRole(null);
    setActiveInsight(null);
    setInsightsLoading(false);
  };

  const handleRoleClick = async (role) => {
    if (selectedRole === role) {
      handleCloseInsights();
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setSelectedRole(role);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setInsightsLoading(true);
    try {
      const data = await getRoleInsights(
        userRole || 'Software Engineer',
        role,
        userSkills || [],
        controller.signal
      );
      if (data && !data.error) {
        setActiveInsight(data);
      }
    } catch (err) {
      console.error("Error fetching insights", err);
    } finally {
      if (abortControllerRef.current === controller) {
        setInsightsLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  const getIntensity = useMemo(() => (count) => {
    if (count > 50) return 'bg-brand-600 text-white';
    if (count > 20) return 'bg-brand-400 text-white';
    if (count > 10) return 'bg-brand-200 text-brand-900';
    if (count > 0) return 'bg-brand-50 text-brand-700';
    return 'bg-surface text-text-muted';
  }, []);

  const currentInsights = useMemo(() => {
    return selectedRole ? activeInsight : null;
  }, [selectedRole, activeInsight]);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-text-primary mb-1">
              {viewMode === 'map' ? `Geographic Talent Density: ${selectedCountry}` : 'Market Sentiment Analysis'}
            </h3>
            <p className="text-text-secondary text-sm">
              {viewMode === 'map'
                ? `Job volume distribution across regions in ${selectedCountry}.`
                : 'Real-time demand metrics across industry-leading roles.'}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-3">
            <div className="flex bg-surface p-1 rounded-xl border border-border-light self-start sm:self-auto">
              <button
                disabled={insightsLoading}
                onClick={() => {
                  setViewMode('map');
                  handleCloseInsights();
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${insightsLoading ? 'opacity-50 cursor-not-allowed' : ''} ${viewMode === 'map' ? 'bg-white shadow-sm text-brand-600' : 'text-text-muted hover:text-text-primary'}`}
              >
                Map View
              </button>
              <button
                disabled={insightsLoading}
                onClick={() => {
                  setViewMode('grid');
                  handleCloseInsights();
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${insightsLoading ? 'opacity-50 cursor-not-allowed' : ''} ${viewMode === 'grid' ? 'bg-white shadow-sm text-brand-600' : 'text-text-muted hover:text-text-primary'}`}
              >
                Grid View
              </button>
            </div>

            {viewMode === 'map' && (
              <div className="flex bg-surface p-1 rounded-xl border border-border-light self-start sm:self-auto">
                <button
                  disabled={loadingMap || insightsLoading}
                  onClick={() => setSelectedCountry('Pakistan')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${(loadingMap || insightsLoading) ? 'opacity-50 cursor-not-allowed' : ''} ${selectedCountry === 'Pakistan' ? 'bg-brand-600 text-white shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
                >
                  Pakistan
                </button>
                <button
                  disabled={loadingMap || insightsLoading}
                  onClick={() => setSelectedCountry('United States')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${(loadingMap || insightsLoading) ? 'opacity-50 cursor-not-allowed' : ''} ${selectedCountry === 'United States' ? 'bg-brand-600 text-white shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
                >
                  USA
                </button>
              </div>
            )}
          </div>
        </div>

        {viewMode === 'map' ? (
          loadingMap ? (
            <div className="flex flex-col items-center justify-center bg-surface/30 rounded-3xl border border-border-light shadow-inner min-h-[440px] w-full">
              <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-6 shadow-sm" />
              <h4 className="text-2xl font-black text-text-primary tracking-tight mb-2">cooking maps for u... </h4>
              <p className="text-xs font-black text-text-muted uppercase tracking-widest animate-pulse">
                let him cook... mapping {selectedCountry}
              </p>
            </div>
          ) : (
            <div className="">
              <GeoMap
                country={selectedCountry}
                locationCounts={locations}
              />
            </div>
          )
        ) : (
          (selectedRole || insightsLoading) ? (
            <div className="p-0.5 bg-gradient-to-r from-brand-500 via-purple-500 to-brand-500 rounded-[26px] shadow-2xl relative">
              <div className="bg-white rounded-[24px] p-8 relative overflow-hidden min-h-[440px]">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
                  <svg className="w-48 h-48 text-brand-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                </div>

                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center shadow-inner">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-text-primary tracking-tight">Apex AI Pathfinding</h4>
                      <p className="text-sm font-bold text-brand-600 uppercase tracking-widest">{selectedRole}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseInsights}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-surface hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors border border-border-light shadow-sm"
                    aria-label="Close insights"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {insightsLoading ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 bg-surface rounded-2xl animate-pulse" />
                      <div className="h-20 bg-surface rounded-2xl animate-pulse" />
                    </div>
                    <div className="h-32 bg-surface rounded-2xl animate-pulse" />
                  </div>
                ) : currentInsights && (
                  <div className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-surface/50 rounded-2xl border border-border-light hover:border-brand-200 transition-colors">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Growth Outlook</p>
                        <p className="text-[15px] text-text-primary font-bold leading-snug">{currentInsights.selected_role_growth}</p>
                      </div>
                      <div className="p-5 bg-surface/50 rounded-2xl border border-border-light hover:border-brand-200 transition-colors">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Recommendation</p>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full shadow-sm ${currentInsights.decision ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
                          <p className="text-lg font-black text-text-primary tracking-tight">{currentInsights.decision ? 'Need to Change Role' : 'No Need to Change'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-brand-50/40 p-6 rounded-3xl border border-brand-100 shadow-inner">
                      <p className="text-xs font-black text-brand-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        Strategic AI Directive
                      </p>
                      <p className="text-lg text-text-primary leading-relaxed font-semibold tracking-tight">"{currentInsights.advice}"</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-border-light">
                      <div className="flex items-center gap-8 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                        <div>
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Live Volume</p>
                          <p className="text-2xl font-black text-text-primary">{currentInsights.selected_role_count}</p>
                        </div>
                        <div className="w-px h-10 bg-border-light" />
                        <div>
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Market Velocity</p>
                          <p className="text-2xl font-black text-brand-600">
                            {((currentInsights.selected_role_count / (currentInsights.current_role_count + 1)) * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleCloseInsights}
                        className="w-full sm:w-auto px-6 py-2.5 bg-text-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-600 transition-all shadow-lg hover:shadow-brand-500/20"
                      >
                        Return to Grid
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            loadingGrid ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 gap-3">
                {Array(12).fill(0).map((_, i) => (
                  <div key={i} className="h-24 bg-surface rounded-2xl animate-pulse border border-border-light" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-3 font-sans">
                {POPULAR_ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleClick(role)}
                    className={`group relative h-24 p-4 rounded-2xl transition-all duration-300 hover:shadow-lg flex flex-col justify-between border-2 ${selectedRole === role ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-transparent'} ${getIntensity(roleCounts[role] || 0)}`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80 text-left leading-tight">{role}</span>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-black">{roleCounts[role] || 0}</span>
                      <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">View Path →</span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/5 backdrop-blur-[1px] rounded-2xl transition-opacity">
                      <div className="bg-white text-text-primary text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm tracking-wider">
                        Check role switchability
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default JobHeatmap;
