import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
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

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto w-full p-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-border-light p-6">
            <h1 className="text-2xl font-bold text-text-primary mb-6">Hello, {name}</h1>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Your Current Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm font-medium border border-brand-100">
                  {skill}
                </span>
              ))}
            </div>
            {skills.length === 0 && (
              <p className="text-text-muted text-sm">No skills found.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardPage
