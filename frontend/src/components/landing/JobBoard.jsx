const jobs = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    company: 'Systems Ltd.',
    location: 'Remote',
    salary: 'Rs 300k – Rs 500k',
    platform: 'LinkedIn',
    compatibility: 94,
    skills: ['React', 'TypeScript', 'Next.js', 'CSS'],
    posted: '2d ago',
  },
  {
    id: 2,
    title: 'Full-Stack Developer',
    company: 'Arbisoft',
    location: 'Lahore, PK',
    salary: 'Rs 350k – Rs 600k',
    platform: 'Indeed',
    compatibility: 87,
    skills: ['Node.js', 'React', 'PostgreSQL', 'REST APIs'],
    posted: '1d ago',
  },
  {
    id: 3,
    title: 'Backend Engineer',
    company: 'Afiniti',
    location: 'Karachi, PK',
    salary: 'Rs 250k – Rs 450k',
    platform: 'LinkedIn',
    compatibility: 78,
    skills: ['Python', 'Docker', 'Kubernetes', 'AWS'],
    posted: '3d ago',
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'Netsol',
    location: 'Remote',
    salary: 'Rs 200k – Rs 400k',
    platform: 'Indeed',
    compatibility: 72,
    skills: ['Docker', 'CI/CD', 'Terraform', 'AWS'],
    posted: '5d ago',
  },
  {
    id: 5,
    title: 'ML Engineer',
    company: 'Motive',
    location: 'Islamabad, PK',
    salary: 'Rs 400k – Rs 700k',
    platform: 'LinkedIn',
    compatibility: 65,
    skills: ['Python', 'PyTorch', 'ML Ops', 'Data Pipelines'],
    posted: '1d ago',
  },
]

function getScoreColor(score) {
  if (score >= 90) return 'stroke-accent-emerald'
  if (score >= 75) return 'stroke-brand-500'
  if (score >= 60) return 'stroke-accent-amber'
  return 'stroke-accent-rose'
}

function JobBoard() {
  return (
    <section id="jobs" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Job Matching</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Jobs ranked by <span className="text-brand-600">your fit</span>
          </h2>
          <p className="mt-4 text-text-secondary max-w-lg mx-auto">
            Real listings from LinkedIn and Indeed, matched against your skill profile and ranked by compatibility.
          </p>
        </div>

        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 rounded-2xl border border-border-light bg-white hover:shadow-lg hover:border-brand-200 transition-all duration-300">
              {/* Compatibility ring */}
              <div className="flex-shrink-0">
                <div className="relative w-14 h-14">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="24" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <circle cx="28" cy="28" r="24" fill="none" className={getScoreColor(job.compatibility)} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${(job.compatibility / 100) * 150.8} 150.8`} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text-primary">{job.compatibility}%</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-text-primary truncate">{job.title}</h3>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${job.platform === 'LinkedIn' ? 'text-brand-600 bg-brand-50 border-brand-200' : 'text-accent-purple bg-purple-50 border-purple-200'}`}>
                    {job.platform}
                  </span>
                </div>
                <p className="text-xs text-text-muted">{job.company} · {job.location} · {job.salary}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {job.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-surface border border-border-light text-[10px] font-medium text-text-secondary">{s}</span>
                  ))}
                </div>
              </div>

              {/* Apply */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-text-muted hidden sm:block">{job.posted}</span>
                <button className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 rounded-lg shadow-md hover:bg-brand-700 transition-all whitespace-nowrap">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default JobBoard
