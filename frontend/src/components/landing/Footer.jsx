import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div className="bg-white flex flex-col">
      {/* Pre-Footer CTA Section */}
      <section className="py-24 px-6 border-t border-b border-border-light bg-surface relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-50/50 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-primary tracking-tight mb-6">
            Ready to unlock your <span className="text-brand-600">career potential</span>
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary font-medium mb-10 max-w-2xl mx-auto">
            Join thousands of professionals using Apex to bridge skill gaps and land better jobs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-10 py-4 text-base font-bold text-white rounded-xl bg-brand-600 shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all duration-300 hover:-translate-y-1"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-10 py-4 text-base font-bold text-text-primary rounded-xl border-2 border-border-light bg-white hover:border-border-default hover:bg-surface transition-all duration-300 shadow-sm"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Actual Footer */}
      <footer className="py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-2xl font-black text-text-primary tracking-tighter">APEX</span>
            <p className="text-sm text-text-secondary mt-2 text-center md:text-left">
              Your end-to-end career growth engine.
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="text-text-secondary hover:text-brand-600 transition-colors">About</Link>
            <Link to="/" className="text-text-secondary hover:text-brand-600 transition-colors">Features</Link>
            <Link to="/" className="text-text-secondary hover:text-brand-600 transition-colors">Privacy</Link>
            <Link to="/" className="text-text-secondary hover:text-brand-600 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
