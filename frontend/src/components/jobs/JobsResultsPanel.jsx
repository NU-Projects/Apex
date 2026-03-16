import JobResultCard from './JobResultCard'

function JobsIntroState() {
  return (
    <div className="rounded-2xl border border-dashed border-border-default bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5h6M9 9h6M9 13h3m8 6H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-text-primary">Choose Role and Filter</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
        Pick a role and click Filter Jobs to load matching openings from available platforms.
      </p>
    </div>
  )
}

function JobsResultsPanel({ hasSearched, jobsError, jobs, compatibilityState, onCheckCompatibility }) {
  if (!hasSearched) {
    return <JobsIntroState />
  }

  return (
    <section className="space-y-4">
      {jobsError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{jobsError}</div>
      ) : null}

      {!jobsError && jobs.length === 0 ? (
        <div className="rounded-xl border border-border-default bg-white p-6 text-sm text-text-muted shadow-sm">No jobs found.</div>
      ) : null}

      {jobs.map((job) => (
        <JobResultCard
          key={job.id}
          job={job}
          compatibility={compatibilityState[job.id] || {}}
          onCheckCompatibility={onCheckCompatibility}
        />
      ))}
    </section>
  )
}

export default JobsResultsPanel
