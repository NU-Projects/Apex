import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-border-light">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Text Logo */}
        <span className="text-xl font-bold text-brand-600 tracking-tight">Apex</span>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button className="relative p-2 rounded-lg text-text-muted hover:text-text-secondary hover:bg-surface transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
          </button>

          {/* Avatar */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-surface transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-semibold">
              AU
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-text-primary">Apex User</p>
              <p className="text-xs text-text-muted">Free Plan</p>
            </div>
            <svg className="hidden sm:block w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
