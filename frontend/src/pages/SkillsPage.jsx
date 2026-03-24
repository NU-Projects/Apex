import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'
import { useSkills } from '../hooks/useSkills'

function SkillsPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { skills, missingSkills, loading: skillsLoading } = useSkills()

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
        <div className="mb-10">
          <h1 className="text-4xl font-black text-text-primary mb-2 tracking-tight">Your Skills</h1>
          <p className="text-text-secondary text-lg font-medium">The foundation of your career intelligence.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Inventory Box */}
          <div className="bg-white rounded-3xl shadow-sm border border-border-light p-8">
            <div className="flex flex-col mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-1">Current Inventory</h2>
              <p className="text-sm text-text-secondary font-medium">Extracted and verified skills from your profile.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {Array.isArray(skills) && skills.map((skill) => (
                <span key={skill} className="px-5 py-3 bg-brand-50 text-brand-700 rounded-2xl text-base font-bold border border-brand-100 hover:border-brand-300 shadow-sm">
                  {skill}
                </span>
              ))}
              {(!skills || skills.length === 0) && (
                <div className="w-full py-16 px-6 text-center bg-surface rounded-3xl border border-dashed border-border-default mt-4">
                  <p className="text-text-muted text-base font-bold mb-6">No skills mapped to your profile yet.</p>
                  <button onClick={() => navigate('/profile')} className="px-6 py-3 bg-white border-2 border-border-light rounded-xl font-bold text-text-primary hover:border-brand-500 hover:text-brand-600">
                    Start AI Skill Discovery
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Missing Skills Box */}
          <div className="bg-white rounded-3xl shadow-sm border border-border-light p-8">
            <div className="flex flex-col mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-1">Skill Gaps</h2>
              <p className="text-sm text-text-secondary font-medium">
                High-priority missing skills for {user.role || 'your targeted role'}.
              </p>
              <button 
                onClick={() => navigate('/roadmap')}
                className="text-left text-brand-600 text-sm font-bold mt-2 hover:underline inline-block w-fit"
              >
                Use roadmap to fill these gaps &rarr;
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {Array.isArray(missingSkills) && missingSkills.length > 0 ? (
                missingSkills.map((skill) => (
                  <span key={skill} className="px-5 py-3 bg-red-50 text-red-700 rounded-2xl text-base font-bold border border-red-100 hover:border-red-300 shadow-sm">
                    {skill}
                  </span>
                ))
              ) : (
                <div className="w-full py-16 px-6 text-center bg-surface rounded-3xl border border-dashed border-border-default mt-4">
                  <p className="text-text-muted text-base font-bold mb-6">No skill gaps identified yet.</p>
                  <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-white border-2 border-border-light rounded-xl font-bold text-text-primary hover:border-brand-500 hover:text-brand-600">
                    Update Target Role
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SkillsPage
