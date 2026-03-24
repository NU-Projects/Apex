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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-100/70 blur-3xl" />
        <div className="absolute left-10 top-0 h-32 w-32 rounded-full bg-accent-cyan/20 blur-3xl" />

        <div className="relative max-h-[85vh] overflow-y-auto p-6 md:p-8">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-white px-3 py-2 text-sm font-semibold text-text-secondary transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <header className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Compatibility Report</p>
            <h2 className="mt-2 text-2xl font-bold text-text-primary">{job.title}</h2>
            <p className="mt-1 text-sm text-text-muted">AI-based skill-fit analysis for this role</p>
          </header>

          <section className="mt-6 rounded-2xl border border-brand-100 bg-linear-to-br from-brand-50/50 via-white to-accent-cyan/10 p-5">
            {loading ? (
              <div className="flex items-center gap-3 text-text-secondary">
                <div className="h-8 w-8 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
                <p className="text-sm font-medium">Calculating compatibility score...</p>
              </div>
            ) : null}

            {!loading && error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-700">{error}</p>
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-3 inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            ) : null}

            {!loading && !error ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-border-light bg-white p-4">
                  <p className="text-xs uppercase tracking-wider text-text-muted">Compatibility Score</p>
                  <p className={`mt-1 text-4xl font-bold ${scoreColor}`}>{score ?? 0}%</p>
                </div>

                <div className="rounded-xl border border-border-light bg-white p-4">
                  <p className="text-xs uppercase tracking-wider text-text-muted">Gap Analysis</p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {gap || 'No gap analysis available yet.'}
                  </p>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  )
}

export default CompatibilityModal
