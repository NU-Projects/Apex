import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-border-light'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-text-primary tracking-tight group-hover:text-brand-600 transition-colors">
            Apex
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'How It Works', 'Jobs', 'Market'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium text-text-secondary hover:text-brand-600 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

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
            {['Features', 'How It Works', 'Jobs', 'Market'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-text-secondary hover:text-brand-600 py-2 transition-colors"
              >
                {item}
              </a>
            ))}
            <div className="flex gap-3 pt-3 border-t border-border-light">
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
