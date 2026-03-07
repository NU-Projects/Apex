function InputField({ label, id, type = 'text', placeholder, value, onChange, icon }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg border border-border-light bg-white px-4 py-2.5 text-sm text-text-primary placeholder-text-muted
            focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-colors duration-150
            hover:border-border-default ${icon ? 'pl-11' : ''}`}
        />
      </div>
    </div>
  )
}

export default InputField
