const roadmapTasks = [
  { id: 1, title: 'Learn React Fundamentals', category: 'Frontend', progress: 100, status: 'completed' },
  { id: 2, title: 'Practice API Integration', category: 'Backend', progress: 75, status: 'in-progress' },
  { id: 3, title: 'Build Backend Project', category: 'Backend', progress: 30, status: 'in-progress' },
  { id: 4, title: 'Attempt Knowledge Quiz', category: 'Assessment', progress: 0, status: 'pending' },
  { id: 5, title: 'Learn Docker Basics', category: 'DevOps', progress: 0, status: 'pending' },
  { id: 6, title: 'Deploy to Cloud', category: 'DevOps', progress: 0, status: 'locked' },
]

const statusConfig = {
  completed: { label: 'Completed', dot: 'bg-accent-emerald', text: 'text-accent-emerald', bar: 'bg-accent-emerald' },
  'in-progress': { label: 'In Progress', dot: 'bg-brand-500', text: 'text-brand-600', bar: 'bg-brand-500' },
  pending: { label: 'Pending', dot: 'bg-gray-300', text: 'text-gray-400', bar: 'bg-gray-300' },
  locked: { label: 'Locked', dot: 'bg-gray-200', text: 'text-gray-300', bar: 'bg-gray-200' },
}

function HowItWorksRoadmap() {
  const completedCount = roadmapTasks.filter((t) => t.status === 'completed').length
  const overall = Math.round((completedCount / roadmapTasks.length) * 100)

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Learning Roadmap</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Your personalised <span className="text-accent-emerald">learning path</span>
          </h2>
          <p className="mt-4 text-text-secondary max-w-lg mx-auto">
            Apex generates a step-by-step roadmap tailored to your skill gaps, with progress tracking for every task.
          </p>
        </div>

        {/* Dashboard card */}
        <div className="rounded-2xl border border-border-light bg-white shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-light bg-surface">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Target: Senior Full-Stack Engineer</h3>
              <p className="text-xs text-text-muted mt-0.5">{completedCount} of {roadmapTasks.length} tasks completed</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-text-muted">Overall</span>
                <p className="text-lg font-bold text-brand-600">{overall}%</p>
              </div>
              <div className="w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${(overall / 100) * 125.7} 125.7`} />
                </svg>
              </div>
            </div>
          </div>

          {/* Task list */}
          <div className="divide-y divide-border-light">
            {roadmapTasks.map((task) => {
              const cfg = statusConfig[task.status]
              return (
                <div key={task.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-surface/50 transition-colors ${task.status === 'locked' ? 'opacity-40' : ''}`}>
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted bg-surface px-2 py-0.5 rounded">{task.category}</span>
                      <span className={`text-[10px] font-semibold ${cfg.text}`}>{cfg.label}</span>
                    </div>
                  </div>
                  <div className="w-28 flex-shrink-0 hidden sm:block">
                    <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${cfg.bar} transition-all duration-500`} style={{ width: `${task.progress}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-text-muted w-10 text-right flex-shrink-0">{task.progress}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksRoadmap
