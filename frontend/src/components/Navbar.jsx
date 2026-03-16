import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { logoutUser } from '../services/authService'

function Navbar() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)

  // Extract initials for avatar
  const getInitials = () => {
    if (!user) return 'AU'
    if (user.fullName) {
      return user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return user.email?.slice(0, 2).toUpperCase() || 'AU'
  }

  const handleLogout = async () => {
    await logoutUser()
    navigate('/')
  }

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Skills', path: '/skills' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Roadmap', path: '/roadmap' },
  ]

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border-light shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-10">
          <Link to="/dashboard" className="text-2xl font-black text-text-primary hover:text-brand-600 tracking-tighter transition-colors">
            APEX
          </Link>

          <nav className="hidden md:flex items-center gap-8 mt-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[15px] font-semibold transition-colors pb-5 -mb-5 border-b-2 ${location.pathname === link.path
                    ? 'text-brand-600 border-brand-600'
                    : 'text-text-secondary border-transparent hover:text-text-primary hover:border-border-default'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-5">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-text-muted hover:text-text-secondary hover:bg-surface transition-colors" title="Notifications">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full border-2 border-white" />
          </button>

          {/* Profile Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-full border border-border-light hover:border-brand-300 hover:shadow-sm transition-all focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold">
                {getInitials()}
              </div>
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-border-light rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-2 z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-border-light mb-1">
                  <p className="text-sm font-semibold text-text-primary truncate">{user?.fullName || user?.email || 'User'}</p>
                  <p className="text-xs text-text-muted truncate">Free Plan</p>
                </div>

                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-brand-600 hover:bg-brand-50 transition-colors"
                  onClick={() => setProfileOpen(false)}
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Edit Profile
                </Link>
                <div className="h-px bg-border-light my-1 mx-2" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
