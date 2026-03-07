import { useRef } from 'react'

function OTPInput({ length = 6, value, onChange }) {
  const inputRefs = useRef([])

  const handleChange = (index, e) => {
    const val = e.target.value
    if (val && !/^\d$/.test(val)) return

    const newOTP = value.split('')
    newOTP[index] = val
    onChange(newOTP.join(''))

    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pastedData.padEnd(length, ''))
    const focusIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-lg font-semibold text-text-primary
            rounded-lg border border-border-light bg-white
            focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500
            hover:border-border-default transition-colors duration-150"
        />
      ))}
    </div>
  )
}

export default OTPInput
