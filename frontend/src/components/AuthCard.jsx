function AuthCard({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex">
      {/* Left side — Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-10 bg-white">
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
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-white">
        <img
          src="/apex-illustration.png"
          alt="Apex platform illustration"
          className="absolute inset-0 w-full h-full object-contain object-right"
        />
      </div>
    </div>
  )
}

export default AuthCard
