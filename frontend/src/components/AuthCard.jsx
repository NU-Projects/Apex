function AuthCard({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex">
      {/* Left side — Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-10 bg-white">
        <div className="w-full max-w-sm mx-auto">
          {/* Text Logo */}
          <div className="mb-10">
            <span className="text-2xl font-bold text-brand-600 tracking-tight">Apex</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            {title && (
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">{title}</h1>
            )}
            {subtitle && (
              <p className="mt-1.5 text-sm text-text-secondary">{subtitle}</p>
            )}
          </div>

          {children}

          {/* Footer */}
          <p className="text-xs text-text-muted mt-10 text-center">
            &copy; 2026 Apex. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side — Illustration */}
      <div
        className="hidden lg:block lg:w-[55%] relative bg-brand-950"
      >
        <img
          src="/apex-illustration.png"
          alt="Apex platform illustration"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-brand-950/30" />

        {/* Overlay text */}
        <div className="absolute bottom-12 left-12 right-12">
          <h2 className="text-2xl font-bold text-white mb-2">
            Your intelligent career assistant
          </h2>
          <p className="text-sm text-white/70 leading-relaxed max-w-md">
            Extract skills from GitHub and LinkedIn, discover skill gaps, and get matched with the right opportunities.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthCard
