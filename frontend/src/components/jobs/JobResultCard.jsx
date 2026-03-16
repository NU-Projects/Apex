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
                ? `Score: ${compatibility.score}%`
                : 'Check Compatibility'}
          </button>
        </div>
      </div>

      <details className="mt-4 rounded-xl border border-border-default bg-surface p-3">
        <summary className="cursor-pointer text-sm font-medium text-brand-700">View description</summary>
        <p className="mt-2 whitespace-pre-wrap text-sm text-text-secondary">
          {job.description || 'No description available for this listing.'}
        </p>
      </details>

      {compatibility.gap ? <p className="mt-3 text-sm text-text-secondary">{compatibility.gap}</p> : null}
      {compatibility.error ? <p className="mt-3 text-sm text-red-600">{compatibility.error}</p> : null}
    </article>
  )
}

export default JobResultCard
