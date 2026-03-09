import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function LandingNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isVisible
        ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-border-light translate-y-0 opacity-100'
        : '-translate-y-full opacity-0 pointer-events-none'
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black text-text-primary tracking-tighter group-hover:text-brand-600 transition-colors">
            APEX
          </span>
        </Link>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-text-secondary hover:text-brand-600 px-4 py-2 rounded-lg transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-surface transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-border-light animate-fade-in">
          <div className="px-6 py-4 space-y-3">
            <div className="flex gap-3">
              <Link to="/login" className="flex-1 text-center text-sm font-semibold text-brand-600 border border-brand-200 px-4 py-2.5 rounded-lg hover:bg-brand-50 transition-colors">
                Log in
              </Link>
              <Link to="/signup" className="flex-1 text-center text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2.5 rounded-lg transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default LandingNav
