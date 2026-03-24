function CompatibilityModal({ open, job, compatibility, onClose, onRetry }) {
  if (!open || !job) return null

  const score = compatibility?.score
  const gap = compatibility?.gap
  const error = compatibility?.error
  const loading = Boolean(compatibility?.loading)

  const scoreColor =
    score >= 80
      ? 'text-accent-emerald'
      : score >= 60
        ? 'text-accent-amber'
        : 'text-accent-rose'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border-default bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative max-h-[90vh] overflow-y-auto p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl border border-border-default bg-white px-3 py-1.5 text-xs font-bold text-text-secondary hover:border-brand-300 hover:text-brand-700 transition-colors"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Go Back
            </button>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-100">
              Analysis Report
            </span>
          </div>

          <header>
            <h2 className="text-xl md:text-2xl font-black text-text-primary tracking-tight leading-tight">{job.title}</h2>
            <p className="mt-1 text-xs font-bold text-text-muted">Personalized AI Skill-Gap Assessment</p>
          </header>

          <div className="mt-6">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center bg-surface rounded-3xl border border-dashed border-border-default">
                <div className="h-10 w-10 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin mb-4" />
                <p className="text-sm font-black text-brand-700 uppercase tracking-widest animate-pulse">Analyzing Requirements...</p>
                <p className="mt-1 text-xs text-text-muted font-medium">This usually takes 10-15 seconds</p>
              </div>
            ) : null}

            {!loading && error ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
                <p className="text-sm font-bold text-red-700 mb-4">{error}</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center rounded-xl bg-red-600 px-6 py-2 text-sm font-bold text-white hover:bg-red-700 shadow-sm"
                >
                  Try Again
                </button>
              </div>
            ) : null}

            {!loading && !error && score !== undefined ? (
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-2xl border border-border-light bg-white p-5 shadow-sm border-l-4 border-l-brand-500">
                  <p className="text-[10px] font-black uppercase tracking-wider text-text-muted mb-1">Compatibility Hit Rate</p>
                  <p className={`text-5xl font-black tracking-tighter ${scoreColor}`}>{score}%</p>
                </div>

                <div className="rounded-2xl border border-border-light bg-white p-5 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-wider text-text-muted mb-3">Skill Gap Intelligence</p>
                  <div className="text-sm md:text-base font-medium leading-relaxed text-text-secondary whitespace-pre-wrap">
                    {gap || 'No analysis data found.'}
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    AI generated insight based on your profile & job requirements
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompatibilityModal
