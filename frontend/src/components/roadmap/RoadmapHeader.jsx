function RoadmapHeader({ role, progressPercent, level, completedCount, totalCount }) {
  const safePercent = Math.max(0, Math.min(100, Number(progressPercent) || 0));
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (safePercent / 100) * circumference;

  return (
    <header className="rounded-3xl border border-brand-100 bg-linear-to-br from-white to-brand-50/40 p-6 md:p-8 shadow-sm animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="mt-1 h-11 w-11 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19h16" strokeLinecap="round" />
              <path d="M6 15l3-3 3 2 5-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">Personalized Learning Track</p>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mt-1 leading-tight">{role || 'Learning Roadmap'}</h1>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full md:w-auto text-sm">
          <div className="rounded-2xl border border-border-light bg-white px-4 py-3 text-text-secondary font-medium flex items-center gap-3 min-h-24">
            <div className="relative h-18 w-18">
              <svg className="h-18 w-18 -rotate-90" viewBox="0 0 80 80" aria-hidden="true">
                <circle cx="40" cy="40" r={radius} fill="none" stroke="currentColor" className="text-slate-200" strokeWidth="8" />
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  className="text-brand-600 transition-all duration-500"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-base font-bold text-text-primary">
                {safePercent}%
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Progress</p>
              <p className="text-xs text-text-muted">Roadmap completion</p>
            </div>
          </div>
          <div className="rounded-2xl border border-border-light bg-white px-4 py-3 text-text-secondary font-medium min-h-24 flex flex-col justify-center">
            <p className="text-sm font-semibold text-text-primary">Level</p>
            <p className="text-2xl font-bold text-brand-700 leading-none mt-1">{level}</p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-text-secondary">{completedCount} of {totalCount} roadmap skills completed</p>
    </header>
  );
}

export default RoadmapHeader;
