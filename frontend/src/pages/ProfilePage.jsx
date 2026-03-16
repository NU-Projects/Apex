import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'

function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-brand-600 font-bold mb-6 transition-colors group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-border-light p-8 animate-fade-in max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Edit Profile</h1>
          <p className="text-text-secondary text-lg mb-8">Manage your personal information and application preferences.</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Email Address</label>
              <input 
                type="email" 
                disabled 
                value={user?.email || ''}
                className="w-full px-4 py-3 rounded-xl border border-border-light bg-surface text-text-secondary focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Full Name</label>
              <input 
                type="text" 
                placeholder="Ex. John Doe"
                defaultValue={user?.fullName || user?.user_metadata?.username || ''}
                className="w-full px-4 py-3 rounded-xl border border-border-default bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors" 
              />
            </div>
            <div className="pt-4">
              <button disabled className="px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold opacity-50 cursor-not-allowed">
                Save Changes (Upcoming)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage
