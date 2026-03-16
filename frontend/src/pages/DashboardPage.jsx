import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import JobHeatmap from '../components/JobHeatmap'
import { useAuth } from '../hooks/useAuth'
import { useSkills } from '../hooks/useSkills'

function DashboardPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { skills, loading: skillsLoading } = useSkills()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/')
    }
  }, [user, authLoading, navigate])

  if (authLoading || skillsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 rounded-full border-t-2 border-b-2 border-brand-600 animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const name = user.fullName || user.user_metadata?.username || user.email
  const userRole = user.role || 'Software Engineer' // Default if not set

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-text-primary mb-2 tracking-tight">Hello, {name}</h1>
          <p className="text-text-secondary text-lg font-medium">Your career intelligence overview is ready.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Role Focus & Quick Stats */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-border-light p-8">
              <h2 className="text-xl font-bold text-text-primary mb-2">Profile Focus</h2>
              <p className="text-sm text-text-secondary mb-6">Market trends are currently adjusted for <strong>{userRole}</strong>.</p>

              <div className="p-6 bg-brand-600 rounded-2xl text-white flex items-center justify-between overflow-hidden relative shadow-lg shadow-brand-500/20">
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Target Path</p>
                  <p className="text-xl font-black">{userRole}</p>
                </div>
                <div className="relative z-10 p-2 bg-white/20 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </div>
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl transition-colors" />
              </div>


            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-border-light p-8">
              <h2 className="text-xl font-bold text-text-primary mb-4">Quick Insights</h2>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-surface rounded-2xl border border-border-light">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary uppercase tracking-tighter">Market Growth</p>
                    <p className="text-sm text-text-secondary">High demand for Software Engineer roles.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Market Heatmap */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm border border-border-light p-8">
              <JobHeatmap userRole={userRole} userSkills={skills} />
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default DashboardPage
