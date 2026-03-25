function RoadmapLoadingState({ loadingProgress }) {
  return (
    <div className="rounded-3xl border border-border-light bg-white/95 backdrop-blur-sm p-8 shadow-sm animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center animate-pulse-soft ring-8 ring-brand-50">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h6" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 3v8" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary">Building your roadmap...</h2>
          <p className="text-text-secondary">This may take up to 60 seconds while we generate your personalized stages.</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="h-3 w-full bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-brand-500 to-brand-700 transition-all duration-700"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-text-muted">{loadingProgress}%</p>
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-14 rounded-xl bg-slate-100 animate-pulse" />
        <div className="h-14 rounded-xl bg-slate-100 animate-pulse" />
        <div className="h-14 rounded-xl bg-slate-100 animate-pulse" />
      </div>
    </div>
  );
}

export default RoadmapLoadingState;
