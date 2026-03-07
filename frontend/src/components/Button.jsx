function Button({ children, onClick, type = 'button', variant = 'primary', fullWidth = true, disabled = false, loading = false }) {
  const base = `relative inline-flex items-center justify-center font-semibold text-sm rounded-lg px-5 py-2.5
    transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`

  const variants = {
    primary: `bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500`,
    secondary: `bg-white text-text-primary border border-border-light hover:bg-surface focus:ring-brand-400`,
    ghost: `bg-transparent text-brand-600 hover:bg-brand-50 focus:ring-brand-400`,
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

export default Button
