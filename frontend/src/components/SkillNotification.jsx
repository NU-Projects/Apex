import { useEffect, useState } from 'react';

function SkillNotification({ data, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto-close after 8 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!data) return null;

  const { stageCompleted, stageName, skillsMoved, nextStageUnlocked, nextStageName, allStagesCompleted } = data;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible && !isExiting ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-md transform transition-all duration-300 ${
          isVisible && !isExiting ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration confetti effect */}
        {stageCompleted && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][i % 5],
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Main notification card */}
        <div className="relative rounded-3xl border border-border-light bg-white shadow-xl overflow-hidden">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close notification"
          >
            <svg className="w-5 h-5 text-text-muted" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Header */}
          <div className="px-6 pt-8 pb-6 text-center">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className={`flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg ${
                stageCompleted 
                  ? 'bg-emerald-500' 
                  : 'bg-brand-600'
              }`}>
                {stageCompleted ? (
                  <svg className="w-8 h-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {stageCompleted ? 'Stage Completed!' : 'Quiz Passed!'}
            </h2>
            
            {stageName && (
              <p className="text-sm font-medium text-text-muted">
                {stageName}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-3">
            {/* Skills moved message */}
            {stageCompleted && skillsMoved > 0 && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-emerald-900 mb-1">
                      Skills Added to Your Inventory!
                    </p>
                    <p className="text-sm text-emerald-700">
                      {skillsMoved} skill{skillsMoved > 1 ? 's have' : ' has'} been added to your current skills.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next stage unlocked */}
            {nextStageUnlocked && nextStageName && (
              <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-brand-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-brand-900 mb-1">
                      Next Stage Unlocked!
                    </p>
                    <p className="text-sm text-brand-700">
                      {nextStageName}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* All stages completed */}
            {allStagesCompleted && (
              <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-900 mb-1">
                      Congratulations!
                    </p>
                    <p className="text-sm text-purple-700">
                      You've completed all stages in your learning roadmap!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Simple pass message */}
            {!stageCompleted && (
              <div className="rounded-2xl border border-border-light bg-surface p-4 text-center">
                <p className="text-sm text-text-secondary">
                  Great job! Keep going to complete the stage.
                </p>
              </div>
            )}

            {/* Call to action */}
            <div className="pt-3">
              <p className="text-xs text-center text-text-muted mb-3">
                Check your progress in the{' '}
                <span className="font-semibold text-brand-600">Skills</span> section
              </p>
              <button
                onClick={handleClose}
                className="w-full rounded-xl px-4 py-3 text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-sm"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillNotification;
