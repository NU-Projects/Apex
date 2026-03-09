import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <section className="bg-white relative overflow-hidden pt-8 pb-24 px-6 border-b border-border-light min-h-[85vh] flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center">

        {/* Top-left APEX Logo */}
        <Link to="/" className="absolute top-8 left-8">
          <span className="text-3xl font-black text-text-primary tracking-tighter hover:text-brand-600 transition-colors">APEX</span>
        </Link>

        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto mt-32">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-text-primary tracking-tighter mb-8 leading-[1.1] animate-fade-up">
            Your skills deserve the <span className="text-brand-600">perfect career.</span>
          </h1>

          <div className="text-xl sm:text-2xl text-text-secondary font-medium leading-relaxed mb-12 animate-fade-up flex flex-col gap-2" style={{ animationDelay: '100ms' }}>
            <p>The all-in-one AI career intelligence platform.</p>
            <p>Extract skills, bridge knowledge gaps, and land your dream job seamlessly.</p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up mb-24" style={{ animationDelay: '200ms' }}>
            <Link
              to="/signup"
              className="px-8 py-3.5 text-base font-bold text-white rounded-xl bg-brand-600 shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all duration-300"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 text-base font-bold text-text-primary rounded-xl border-2 border-border-light bg-white hover:border-border-default hover:bg-surface transition-all duration-300 shadow-sm"
            >
              Login
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}

export default HeroSection
