import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import DashboardCard from '../components/DashboardCard'

const cards = [
  {
    title: 'Skill Analysis',
    description: 'Extract and validate your technical skills from GitHub, LinkedIn, and resumes with AI-powered analysis.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    title: 'Learning Roadmap',
    description: 'Get a personalized, dependency-aware learning path tailored to your career goals and skill gaps.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    title: 'Job Matches',
    description: 'Discover relevant job opportunities matched to your skills with compatibility scoring and insights.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
  },
  {
    title: 'Market Insights',
    description: 'Visualize real-time market demand with heatmaps and trend analysis for data-driven career decisions.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
]

function DashboardPage() {
  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Welcome header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                Welcome to Apex
              </h1>
              <p className="mt-1 text-text-secondary text-sm">
                Your intelligent career assistant. Explore your skills, roadmap, and opportunities.
              </p>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Skills Tracked', value: '\u2014' },
                { label: 'Roadmap Progress', value: '\u2014' },
                { label: 'Job Matches', value: '\u2014' },
                { label: 'Market Score', value: '\u2014' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-border-light p-4">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1 text-brand-600">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {cards.map((card) => (
                <DashboardCard key={card.title} {...card} />
              ))}
            </div>

            {/* CTA banner */}
            <div className="bg-brand-600 rounded-xl p-6 text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold">Ready to get started?</h3>
                  <p className="text-sm text-brand-100 mt-1">
                    Connect your GitHub and LinkedIn to begin your skill analysis.
                  </p>
                </div>
                <button className="px-5 py-2.5 bg-white text-brand-700 rounded-lg text-sm font-semibold hover:bg-brand-50 transition-colors">
                  Connect Profiles
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
