const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 14.5M14.25 3.104c.251.023.501.05.75.082M19.8 14.5l-2.147 2.146a.75.75 0 01-.53.22H6.877a.75.75 0 01-.53-.22L4.2 14.5" />
      </svg>
    ),
    title: 'Skill Extraction',
    description: 'Automatically pull and categorise skills from your LinkedIn profile and GitHub repositories.',
    illustration: (
      <div className="mt-4 flex flex-wrap gap-1.5">
        {['React', 'Python', 'Node.js', 'Docker', 'SQL', 'TypeScript'].map((s) => (
          <span key={s} className="px-2.5 py-1 rounded-md bg-brand-50 border border-brand-200 text-brand-700 text-[10px] font-semibold">{s}</span>
        ))}
      </div>
    ),
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
      </svg>
    ),
    title: 'Account Management',
    description: 'Sign up, log in, and manage your profile. Keep your professional information always up to date.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3" />
      </svg>
    ),
    title: 'Skill Gap Analysis',
    description: 'Compare your skills against any target role and instantly see where you need to develop.',
    illustration: (
      <div className="mt-4 space-y-2">
        {[
          { name: 'React', have: 90, need: 80, met: true },
          { name: 'Docker', have: 40, need: 70, met: false },
          { name: 'AWS', have: 20, need: 65, met: false },
        ].map((s) => (
          <div key={s.name} className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-text-muted w-12">{s.name}</span>
            <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${s.met ? 'bg-accent-emerald' : 'bg-accent-amber'}`} style={{ width: `${s.have}%` }} />
            </div>
            <span className={`text-[9px] font-bold ${s.met ? 'text-accent-emerald' : 'text-accent-amber'}`}>{s.met ? 'Met' : 'Gap'}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0z" />
      </svg>
    ),
    title: 'Learning Roadmap',
    description: 'Get a personalised, step-by-step learning plan with curated resources to bridge your skill gaps.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
    title: 'Quiz Generation',
    description: 'Auto-generated quizzes for every TODO in your roadmap to test and reinforce your learning.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25" />
      </svg>
    ),
    title: 'Job Matching',
    description: 'AI matches you with real jobs from LinkedIn and Indeed, ranked by compatibility score.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
    title: 'Job Listings',
    description: 'Browse available jobs across platforms in one place, filtered by your skill set.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22" />
      </svg>
    ),
    title: 'Market Demand',
    description: 'Visualise which skills are trending so you can stay ahead of industry demand.',
  },
]

function FeaturesGrid() {
  return (
    <section id="features" className="py-24 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Core Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Everything you need to <span className="text-brand-600">level up</span>
          </h2>
          <p className="mt-4 text-text-secondary max-w-lg mx-auto">
            From skill extraction to job matching, Apex covers your entire career growth journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border-light bg-white p-5 hover:shadow-lg hover:border-brand-200 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-4">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1.5">{f.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{f.description}</p>
              {f.illustration && f.illustration}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesGrid
