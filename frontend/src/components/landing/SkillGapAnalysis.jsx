const currentSkills = [
  { name: 'React', level: 90 },
  { name: 'JavaScript', level: 85 },
  { name: 'Node.js', level: 70 },
  { name: 'Python', level: 60 },
  { name: 'SQL', level: 55 },
  { name: 'Docker', level: 40 },
]

const requiredSkills = [
  { name: 'React', level: 80 },
  { name: 'JavaScript', level: 85 },
  { name: 'Node.js', level: 75 },
  { name: 'Python', level: 80 },
  { name: 'SQL', level: 70 },
  { name: 'Docker', level: 70 },
  { name: 'Kubernetes', level: 60 },
  { name: 'AWS', level: 65 },
]

function SkillGapAnalysis() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-surface to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Illustration */}
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl border border-border-light bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-text-primary">Target Role: Senior Full-Stack Engineer</h3>
                <span className="text-xs font-medium text-accent-amber bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">3 Gaps Found</span>
              </div>

              <div className="space-y-4">
                {requiredSkills.map((req) => {
                  const current = currentSkills.find((c) => c.name === req.name)
                  const hasGap = !current || current.level < req.level
                  const currentLevel = current?.level || 0
                  return (
                    <div key={req.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-text-primary">{req.name}</span>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-text-muted">{currentLevel}%</span>
                          <span className="text-text-muted">/</span>
                          <span className="font-semibold text-text-secondary">{req.level}%</span>
                          {hasGap && (
                            <span className="flex items-center gap-0.5 text-accent-rose font-semibold">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              Gap
                            </span>
                          )}
                          {!hasGap && (
                            <span className="flex items-center gap-0.5 text-accent-emerald font-semibold">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Met
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-gray-200"
                          style={{ width: `${req.level}%` }}
                        />
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
                            hasGap ? 'bg-gradient-to-r from-accent-amber to-accent-rose' : 'bg-gradient-to-r from-accent-emerald to-emerald-400'
                          }`}
                          style={{ width: `${currentLevel}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <p className="text-sm font-semibold text-brand-600 tracking-wider uppercase mb-3">Skill Gap Analysis</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
              See exactly <span className="text-brand-600">where to grow</span>
            </h2>
            <p className="mt-4 text-text-secondary leading-relaxed max-w-lg">
              Select your desired role and let Apex compare your current skills against the requirements. Instantly spot which skills need development and how far you need to go.
            </p>
            <div className="mt-6 space-y-3">
              {[
                'Side-by-side skill comparison',
                'Gap severity indicators',
                'Personalised improvement suggestions',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-emerald/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-accent-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SkillGapAnalysis
