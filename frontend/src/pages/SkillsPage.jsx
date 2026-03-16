import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'
import { useSkills } from '../hooks/useSkills'

function SkillsPage() {
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

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-4xl font-black text-text-primary mb-2 tracking-tight">Your Skills</h1>
          <p className="text-text-secondary text-lg font-medium">The foundation of your career intelligence.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-border-light p-8 animate-fade-up">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Inventory</h2>
              <p className="text-sm text-text-muted">Extracted and verified skills from your profile.</p>
            </div>
        
          </div>
          
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span key={skill} className="px-5 py-3 bg-surface text-text-primary rounded-2xl text-base font-bold border border-border-light hover:border-brand-300 hover:bg-brand-50/50 transition-all shadow-sm">
                {skill}
              </span>
            ))}
            {skills.length === 0 && (
              <div className="w-full py-20 px-6 text-center bg-surface rounded-3xl border border-dashed border-border-default">
                <p className="text-text-muted text-lg mb-6">No skills mapped to your profile yet.</p>
                <button className="px-8 py-3 bg-white border-2 border-border-light rounded-xl font-bold text-text-primary hover:border-brand-500 hover:text-brand-600 transition-all">
                  Start AI Skill Discovery
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default SkillsPage
