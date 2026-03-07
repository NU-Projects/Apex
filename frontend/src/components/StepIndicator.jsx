function StepIndicator({ currentStep, totalSteps, labels }) {
  return (
    <div className="mb-8">
      {/* Step label */}
      <div className="text-center mb-4">
        <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1
          const isCompleted = step < currentStep
          const isActive = step === currentStep

          return (
            <div key={step} className="flex-1">
              <div className="h-1.5 rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-400 ease-out ${
                    isCompleted
                      ? 'w-full bg-brand-600'
                      : isActive
                      ? 'w-1/2 bg-brand-500'
                      : 'w-0'
                  }`}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Labels */}
      {labels && (
        <div className="flex justify-between mt-2">
          {labels.map((label, i) => (
            <span
              key={label}
              className={`text-xs font-medium transition-colors duration-150 ${
                i + 1 <= currentStep ? 'text-brand-600' : 'text-text-muted'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default StepIndicator
