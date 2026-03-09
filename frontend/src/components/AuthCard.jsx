function AuthCard({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile hero image — shown above form on small screens */}
      <div className="block lg:hidden w-full h-48 relative">
        <img
          src="/apex-illustration.png"
          alt="Apex platform illustration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-950/50" />
        <div className="absolute bottom-4 left-6 right-6">
          <span className="text-2xl font-black text-white tracking-tighter">APEX</span>
        </div>
      </div>

      {/* Left side — Form (45%) */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-10 bg-white">
        <div className="w-full max-w-sm mx-auto">
          {/* Text Logo — hidden on mobile since it's in the hero */}
          <div className="mb-10 hidden lg:block">
            <span className="text-3xl font-black text-brand-600 tracking-tighter">APEX</span>
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

      {/* Right side — Hero image (55%) */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <img
          src="/apex-illustration.png"
          alt="Apex platform illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-950/40" />


      </div>
    </div>
  )
}

export default AuthCard
