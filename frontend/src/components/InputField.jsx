import { useState } from 'react'

function InputField({ label, id, type = 'text', placeholder, value, onChange, icon, showReset = false, onReset }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-text-primary">
            {label}
          </label>
        )}
        {showReset && onReset && (
          <button 
            type="button" 
            onClick={onReset}
            className="text-xs font-bold text-text-muted hover:text-brand-600 transition-colors uppercase tracking-tight"
          >
            Forgot password?
          </button>
        )}
      </div>
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted group-focus-within:text-brand-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-text-primary placeholder-text-muted
            focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all duration-200
            hover:border-border-default ${icon ? 'pl-11' : ''} ${isPassword ? 'pr-20' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[11px] font-black text-text-muted hover:text-brand-600 uppercase tracking-widest transition-colors"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
    </div>
  )
}

export default InputField
