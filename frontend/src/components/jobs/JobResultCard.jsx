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

function formatJobDescription(text) {
  if (!text) return <span className="text-text-muted italic">No description available for this listing.</span>;

  const lines = text.split('\n');
  const formatted = [];
  let lastHeadingText = null;

  const exactHeadings = [
    'requirements', 'qualifications', 'responsibilities', 'key responsibilities',
    'primary responsibilities', 'about the role', "what you'll do", 'what you will do',
    'benefits', 'job description', 'skills', 'required skills', 'preferred skills',
    'education', 'experience', 'duties', "what we're looking for", 'who you are',
    'role', 'purpose', 'job purpose', 'required qualifications', 'minimum qualifications',
    'preferred qualifications', 'about us', 'company overview', 'what we offer',
    'bonus points', 'nice to have', 'nice-to-have', 'required education', 'required experience', 'company description', 'required skills and abilities',
    'responsibilities and duties', 'job summary', 'job responsibilities', 'compensation range', 'our mission', 'our values', 'the role', 'our team', 'job overview'
  ];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;

    const explicitBulletMatch = trimmed.match(/^([-*•]|\d+\.)\s*(.*)/);
    const trimmedLower = trimmed.toLowerCase().replace(/:$/, '');

    const isHeading =
      trimmed.length > 2 &&
      trimmed.length <= 70 &&
      !explicitBulletMatch &&
      (
        trimmed.endsWith(':') ||
        exactHeadings.includes(trimmedLower) ||
        (trimmed === trimmed.toUpperCase() && !trimmed.match(/^\d/))
      );

    let bulletText = null;
    if (!isHeading) {
      if (explicitBulletMatch) {
        bulletText = explicitBulletMatch[2] || trimmed.replace(/^([-*•]|\d+\.)\s*/, '');
      } else if (!trimmed.match(/[.!?]$/) && !trimmed.includes('. ')) {
        bulletText = trimmed;
      } else if (trimmed.length < 150 && !trimmed.includes('. ')) {
        bulletText = trimmed;
      }
    }

    if (isHeading) {
      const headingClean = trimmedLower.replace(/:$/, '');
      if (lastHeadingText === headingClean) {
        continue;
      }
      lastHeadingText = headingClean;

      formatted.push(
        <h4 key={i} className="font-black text-text-primary mt-6 mb-3 text-base tracking-tight">
          {trimmed.replace(/:$/, '')}
        </h4>
      );
    } else if (bulletText !== null) {
      let content = bulletText;
      const labelMatch = bulletText.match(/^([\w\s-]+):\s*(.*)/);
      if (labelMatch && labelMatch[1].length <= 35) {
        content = <><strong className="font-bold text-text-primary">{labelMatch[1]}:</strong> {labelMatch[2]}</>;
      }

      formatted.push(
        <div key={i} className="flex items-start gap-2.5 my-1.5 pl-1">
          <span className="text-brand-500 font-bold mt-[2px] text-lg leading-none">•</span>
          <span className="text-text-secondary leading-relaxed">{content}</span>
        </div>
      );
    } else {
      let content = trimmed;
      const labelMatch = trimmed.match(/^([\w\s-]+):\s*(.*)/);
      if (labelMatch && labelMatch[1].length <= 35) {
        content = <><strong className="font-bold text-text-primary">{labelMatch[1]}:</strong> {labelMatch[2]}</>;
      }

      formatted.push(
        <p key={i} className="mb-3 text-text-secondary leading-relaxed">
          {content}
        </p>
      );
    }
  }

  return <div className="text-sm font-medium">{formatted}</div>;
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
            className={`inline-flex h-10 min-w-24 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors ${job.applyUrl
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

        <div className="border-t border-brand-100/80 bg-white/80 px-5 py-4">
          {formatJobDescription(job.description)}
        </div>
      </details>

    </article>
  )
}

export default JobResultCard
