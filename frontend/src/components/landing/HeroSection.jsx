import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <section className="bg-surface relative overflow-hidden pt-8 pb-24 px-6 border-b border-border-light min-h-[85vh] flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
        
        {/* Top-left APEX Logo */}
        <div className="absolute top-8 left-8">
          <span className="text-3xl font-black text-text-primary tracking-tighter">APEX</span>
        </div>

        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto mt-20">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-text-primary tracking-tighter mb-8 leading-[1.1] animate-fade-up">
            Your skills deserve the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-indigo">perfect career.</span>
          </h1>
          
          <div className="text-xl sm:text-2xl text-text-secondary font-medium leading-relaxed mb-12 animate-fade-up flex flex-col gap-2" style={{animationDelay: '100ms'}}>
            <p>The all-in-one AI career intelligence platform.</p>
            <p>Extract skills, bridge knowledge gaps, and land your dream job seamlessly.</p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up mb-24" style={{animationDelay: '200ms'}}>
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

        {/* Clean Statistics Layout */}
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-border-light animate-fade-up" style={{animationDelay: '300ms'}}>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black text-brand-600 mb-2">10k+</span>
            <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">skills extracted</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center md:border-l md:border-border-light">
            <span className="text-4xl font-black text-brand-600 mb-2">98%</span>
            <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Match accuracy</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center md:border-l md:border-border-light">
            <span className="text-4xl font-black text-brand-600 mb-2">5K+</span>
            <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Jobs matched</span>
          </div>
        </div>

      </div>
    </section>
  )
}

export default HeroSection
