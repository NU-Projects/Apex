import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'
import { updateProfile } from '../services/userService'

function ProfilePage() {
  const { user, refresh } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    github: '',
    linkedin: '',
  })

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.full_name || user.fullName || '',
        github: user.github_username || user.gitHubUserName || user.githubUserName || user.github || '',
        linkedin: user.linkedin_username || user.linkedInUserName || user.linkedinUserName || user.linkedin || '',
      }))
    }
  }, [user])

  useEffect(() => {
    let interval;
    if (user?.is_syncing) {
      interval = setInterval(() => {
        refresh();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [user?.is_syncing, refresh]);

  const [editingFields, setEditingFields] = useState({
    fullName: false,
    password: false,
    github: false,
    linkedin: false,
  })

  const formatSocial = (name, value) => {
    if (!value) return ''
    let val = value.trim()
    if (name === 'github') {
      val = val.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')
      val = val.split('/')[0]
    } else if (name === 'linkedin') {
      val = val.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '')
      val = val.split('/')[0]
    }
    return val
  }

  const toggleEdit = (field) => {
    setEditingFields(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setSuccess('')
    setError('')
  }

  const handleBlur = (field) => {
    if (field === 'github' || field === 'linkedin') {
      const formatted = formatSocial(field, formData[field])
      setFormData(prev => ({ ...prev, [field]: formatted }))
    }
    setEditingFields(prev => ({ ...prev, [field]: false }))
  }

  const handleSave = async () => {
    if (!user?.email) return

    setLoading(true)
    setSuccess('')
    setError('')

    try {
      const { data, error: updateError } = await updateProfile(user.email, formData)

      if (updateError) {
        setError(updateError.message || 'Failed to update profile')
        return
      }

      setSuccess(data.message || 'Profile updated successfully!')
      setFormData(prev => ({ ...prev, password: '' }))

      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const FieldWrapper = ({ label, name, value, type = "text", placeholder, isPassword = false }) => {
    const isEditing = editingFields[name]
    const [showLocalPassword, setShowLocalPassword] = useState(false)
    const displayValue = isPassword ? "••••••••" : (value || <span className="text-text-muted italic">Not set</span>)
    const inputType = isPassword ? (showLocalPassword ? 'text' : 'password') : type

    return (
      <div className="group relative">
        <label className="block text-sm font-semibold text-text-primary mb-2">{label}</label>
        {isEditing ? (
          <div className="flex items-center w-full rounded-xl border border-brand-500 bg-white shadow-md focus-within:ring-2 focus-within:ring-brand-500/20 overflow-hidden relative">
            <input
              autoFocus
              type={inputType}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              onBlur={() => !showLocalPassword && handleBlur(name)}
              onKeyDown={(e) => e.key === 'Enter' && handleBlur(name)}
              className={`flex-1 px-4 py-3 bg-transparent text-text-primary focus:outline-none ${isPassword ? 'pr-16' : ''}`}
            />
            {isPassword && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowLocalPassword(!showLocalPassword)}
                className="absolute right-4 text-[10px] font-black text-text-muted hover:text-brand-600 uppercase tracking-widest"
              >
                {showLocalPassword ? 'Hide' : 'Show'}
              </button>
            )}
          </div>
        ) : (
          <div
            onClick={() => toggleEdit(name)}
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-border-default bg-surface hover:bg-white hover:border-brand-300 cursor-pointer min-h-[50px]"
          >
            <div className="flex items-center text-text-secondary truncate">
              {displayValue}
            </div>
            <button className="text-text-muted group-hover:text-brand-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
          </div>
        )}
      </div>
    )
  }

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

            <FieldWrapper
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              placeholder="Ex. John Doe"
            />

            <FieldWrapper
              label="New Password"
              name="password"
              value={formData.password}
              type="password"
              placeholder="••••••••"
              isPassword
            />

            <FieldWrapper
              label="GitHub Username or URL"
              name="github"
              value={formData.github}
              placeholder="Username or profile URL"
            />

            <FieldWrapper
              label="LinkedIn Username or URL"
              name="linkedin"
              value={formData.linkedin}
              placeholder="Username or profile URL"
            />

            <div className="p-6 bg-brand-50 rounded-2xl border border-brand-100 mt-2">
              <label className="block text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">Target Role Focus</label>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <p className="text-xl font-black text-text-primary">{user?.role || 'Not Selected'}</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-brand-600 font-bold hover:text-brand-700 flex items-center gap-1 group"
                >
                  Go to Dashboard to update role <span className="">&rarr;</span>
                </button>
              </div>
            </div>

            {(error || success) && (
              <div className={`p-4 rounded-xl border font-bold text-sm ${error ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-600'}`}>
                {error || success}
              </div>
            )}

            {user?.is_syncing && (
              <div className="p-4 bg-brand-50 rounded-2xl border border-brand-200 flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-5 h-5 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
                </div>
                <div>
                  <p className="text-brand-700 font-bold text-sm">AI is processing your profile updates...</p>
                  <p className="text-brand-500 text-xs mt-0.5">Skills and gap analysis are being updated in the background. Check the Skills page for live progress.</p>
                </div>
              </div>
            )}

            <div className="pt-8 flex justify-end">
              <button
                disabled={loading}
                className="px-12 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-black shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage
