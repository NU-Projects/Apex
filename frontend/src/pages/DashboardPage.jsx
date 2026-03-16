import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
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
    <div className="min-h-screen flex flex-col bg-surface font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
        <div className="bg-white rounded-2xl shadow-sm border border-border-light p-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Hello, {name}</h1>
          <p className="text-text-secondary mb-8 text-lg">Welcome back to your dashboard.</p>
          
          <h2 className="text-xl font-semibold text-text-primary mb-5">Your Current Skills</h2>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill) => (
              <span key={skill} className="px-3.5 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-sm font-semibold border border-brand-100 shadow-sm">
                {skill}
              </span>
            ))}
          </div>
          {skills.length === 0 && (
            <p className="text-text-muted text-sm bg-surface p-4 rounded-lg inline-block">No skills found. Begin an analysis to populate your profile.</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
