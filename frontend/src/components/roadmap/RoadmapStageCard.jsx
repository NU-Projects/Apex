const getStatusMeta = (status) => {
  if (status === 'completed') {
    return {
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.415 0l-3.2-3.2a1 1 0 111.414-1.414l2.493 2.493 6.493-6.493a1 1 0 011.415 0z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Completed',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  }
  if (status === 'in_progress') {
    return {
      icon: (
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
          <path d="M10 5.5v4.5l3 1.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      label: 'In Progress',
      classes: 'bg-amber-50 text-amber-700 border-amber-200'
    };
  }
  return {
    icon: (
      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <circle cx="10" cy="10" r="5.5" />
      </svg>
    ),
    label: 'Not Started',
    classes: 'bg-sky-50 text-sky-700 border-sky-200'
  };
};

function RoadmapStageCard({ stage, onActionClick, onTestClick }) {
  return (
    <article className="rounded-3xl border border-border-light bg-white p-6 shadow-sm animate-fade-in relative overflow-hidden">
      <div className="absolute left-0 top-0 h-full w-1.5 bg-linear-to-b from-brand-400 to-brand-700" />
      {!stage.is_unlocked && (
        <div className="absolute inset-0 z-20 rounded-3xl border border-white/60 bg-white/45 backdrop-blur-[2px] pointer-events-none">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/70 px-4 py-2 text-xs font-bold tracking-wide text-slate-700 shadow-sm">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                <rect x="4" y="9" width="12" height="8" rx="2" />
                <path d="M7 9V7a3 3 0 116 0v2" />
              </svg>
              Complete previous stage to unlock
            </span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between gap-4 mb-5 pl-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted font-semibold">Stage {stage.stage_order}</p>
          <h3 className="text-xl font-bold text-text-primary mt-1">{stage.stage_name}</h3>
        </div>
        {!stage.is_unlocked && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="4" y="9" width="12" height="8" rx="2" />
              <path d="M7 9V7a3 3 0 116 0v2" />
            </svg>
            Locked
          </span>
        )}
      </div>

      <div className="space-y-4 pl-3">
        {stage.skills.map((skill) => {
          const statusMeta = getStatusMeta(skill.status);
          const canInteract = stage.is_unlocked;
          const actionLabel = skill.status === 'not_started' ? 'Start' : skill.status === 'in_progress' ? 'Done' : 'Done';
          const actionDisabled = !canInteract || skill.status === 'completed';
          const testEnabled = canInteract && skill.status === 'completed';

          const actionIcon = skill.status === 'not_started' ? (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M7.25 5.15c0-.89.97-1.44 1.74-.98l6.14 3.75c.74.45.74 1.52 0 1.97L9 13.64c-.77.47-1.74-.08-1.74-.98V5.15z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.415 0l-3.2-3.2a1 1 0 111.414-1.414l2.493 2.493 6.493-6.493a1 1 0 011.415 0z" clipRule="evenodd" />
            </svg>
          );

          return (
            <div key={skill.ui_id} className="rounded-2xl border border-border-light p-4 bg-surface-raised hover:border-brand-200 transition-colors duration-200">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-base font-semibold text-text-primary">{skill.skill_name}</p>
                  <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusMeta.classes}`}>
                    {statusMeta.icon} {statusMeta.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onTestClick(skill)}
                    disabled={!testEnabled}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-semibold border transition-all ${
                      skill.quiz_passed
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700 disabled:opacity-60'
                        : 'border-border-default bg-white text-text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {skill.quiz_passed ? (
                      <>
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.415 0l-3.2-3.2a1 1 0 111.414-1.414l2.493 2.493 6.493-6.493a1 1 0 011.415 0z" clipRule="evenodd" />
                        </svg>
                        Quiz Passed
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                          <path d="M7.25 4.75h5.5" strokeLinecap="round" />
                          <path d="M8 4.75l.25 2m3.5-2l-.25 2" strokeLinecap="round" />
                          <path d="M6.5 8.5h7l-.8 6.2a2 2 0 01-1.98 1.75H9.28a2 2 0 01-1.98-1.75L6.5 8.5z" />
                          <path d="M9.2 11.1h1.6m-1.6 2.2h1.6" strokeLinecap="round" />
                        </svg>
                        Test
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onActionClick(skill)}
                    disabled={actionDisabled}
                    className="inline-flex items-center gap-2 rounded-xl px-4.5 py-2.5 text-[15px] font-bold bg-brand-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-700 transition-all"
                  >
                    {actionIcon}
                    {actionLabel}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default RoadmapStageCard;
