const PLATFORM_ICONS = {
  linkedin: '/linkedin-svgrepo-com.svg',
  indeed: '/indeed-svgrepo-com.svg',
}

function normalizePlatform(platform) {
  const normalized = (platform || '').trim().toLowerCase()

  if (normalized.includes('linkedin')) return 'linkedin'
  if (normalized.includes('indeed')) return 'indeed'

  return normalized
}

function formatPlatform(platform) {
  const normalized = normalizePlatform(platform)
  if (!normalized) return 'Unknown'
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

function JobResultCard({ job, compatibility, onCheckCompatibility }) {
  const normalizedPlatform = normalizePlatform(job.platform)
  const platformLabel = formatPlatform(normalizedPlatform)
  const iconSrc = PLATFORM_ICONS[normalizedPlatform]

  return (
    <article className="rounded-2xl border border-border-light bg-white p-5 shadow-sm transition-all hover:border-brand-300 hover:shadow-md">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="text-lg md:text-xl font-semibold text-text-primary wrap-break-word">{job.title}</h3>
            <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
              {iconSrc ? <img src={iconSrc} alt={platformLabel} className="h-4 w-4" /> : null}
              <span>{platformLabel}</span>
            </span>
          </div>
        </div>

        <div className="flex w-full shrink-0 items-center gap-2 md:w-auto md:justify-end">
          <a
            href={job.applyUrl || '#'}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => {
              if (!job.applyUrl) event.preventDefault()
            }}
            className={`inline-flex h-10 min-w-24 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors ${
              job.applyUrl
                ? 'bg-brand-600 text-white hover:bg-brand-700'
                : 'cursor-not-allowed bg-brand-200 text-white'
            }`}
          >
            Apply
          </a>

          <button
            type="button"
            onClick={() => onCheckCompatibility(job)}
            disabled={compatibility.loading || !job.description}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-brand-300 px-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 md:flex-none disabled:cursor-not-allowed disabled:border-brand-200 disabled:text-brand-300"
          >
            {compatibility.loading
              ? 'Checking...'
              : compatibility.score !== undefined
                ? 'View Compatibility'
                : 'Check Compatibility'}
          </button>
        </div>
      </div>

      <details className="group mt-4 overflow-hidden rounded-2xl border border-brand-100 bg-linear-to-br from-brand-50/40 via-white to-accent-cyan/10 shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 marker:content-none">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 12h8m-8 5h5" />
            </svg>
            Job description
          </span>

          <span className="inline-flex items-center gap-2 text-xs text-text-muted">
            <span>Expand</span>
            <svg
              className="h-4 w-4 transition-transform duration-200 group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </summary>

        <div className="border-t border-brand-100/80 bg-white/80 px-4 py-3">
          <p className="whitespace-pre-wrap text-sm leading-6 text-text-secondary">
            {job.description || 'No description available for this listing.'}
          </p>
        </div>
      </details>

    </article>
  )
}

export default JobResultCard
