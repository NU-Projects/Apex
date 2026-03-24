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

function formatDescription(desc) {
  if (!desc) return <p className="text-sm leading-6 text-text-secondary">No description available for this listing.</p>;
  
  // Collapse 3 or more newlines into exactly 2
  const cleaned = desc.replace(/\n{3,}/g, '\n\n').trim();
  const paragraphs = cleaned.split('\n\n');
  
  return paragraphs.map((p, idx) => (
    <p key={idx} className="mb-4 text-sm md:text-base leading-relaxed text-text-secondary whitespace-pre-line last:mb-0">
      {p.trim()}
    </p>
  ));
}

function JobResultCard({ job, compatibility, onCheckCompatibility }) {
  const normalizedPlatform = normalizePlatform(job.platform)
  const platformLabel = formatPlatform(normalizedPlatform)
  const iconSrc = PLATFORM_ICONS[normalizedPlatform]

  return (
    <article className="rounded-3xl border border-border-light bg-white p-5 shadow-sm hover:border-brand-300 hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="text-lg md:text-xl font-black text-text-primary wrap-break-word tracking-tight">{job.title}</h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary bg-surface px-2 py-1 rounded-lg border border-border-light">
              {iconSrc ? <img src={iconSrc} alt={platformLabel} className="h-3 w-3" /> : null}
              <span>{platformLabel}</span>
            </span>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col sm:flex-row items-stretch sm:items-center gap-2.5 md:w-auto md:justify-end">
          <a
            href={job.applyUrl || '#'}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => {
              if (!job.applyUrl) event.preventDefault()
            }}
            className={`flex h-[45px] w-full sm:w-28 items-center justify-center rounded-xl px-4 text-xs font-black uppercase tracking-widest ${
              job.applyUrl
                ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-500/10'
                : 'cursor-not-allowed bg-border-default text-text-muted'
            }`}
          >
            Apply
          </a>

          <button
            type="button"
            onClick={() => onCheckCompatibility(job)}
            disabled={compatibility.loading || !job.description}
            className="flex h-[45px] w-full sm:w-auto items-center justify-center rounded-xl border-2 border-brand-200 px-4 text-xs font-black uppercase tracking-widest text-brand-700 bg-white hover:bg-brand-50 hover:border-brand-300 md:flex-none disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-muted disabled:border-border-light"
          >
            {compatibility.loading
              ? 'Checking...'
              : compatibility.score !== undefined
                ? `Score: ${compatibility.score}%`
                : 'Check Compatibility'}
          </button>
        </div>
      </div>

      <details className="group mt-4 overflow-hidden rounded-2xl border border-border-default bg-surface shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 marker:content-none">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 12h8m-8 5h5" />
            </svg>
            Job Description
          </span>

          <span className="inline-flex items-center gap-2 text-xs text-text-muted font-bold">
            <span>Details</span>
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

        <div className="border-t border-border-default bg-white px-5 py-4">
            {formatDescription(job.description)}
        </div>
      </details>

    </article>
  )
}

export default JobResultCard
