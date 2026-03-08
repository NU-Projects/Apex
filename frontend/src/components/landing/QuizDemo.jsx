function QuizDemo() {
  return (
    <section className="py-24 px-6 bg-white border-t border-border-light">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Left side: Text */}
        <div className="flex-1 text-center lg:text-left">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Smart Quizzes</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Apex generates quizzes based on your learning roadmap to test your understanding.
          </h2>
          <p className="mt-4 text-text-secondary leading-relaxed max-w-lg lg:mx-0 mx-auto">
            Instead of generic tests, you get contextual AI-generated questions mapped directly to the skills you&apos;re currently practicing.
          </p>
        </div>

        {/* Right side: Static UI Preview Illustration */}
        <div className="flex-1 w-full max-w-lg mx-auto">
          {/* Outer container */}
          <div className="rounded-2xl border border-border-light bg-surface shadow-lg overflow-hidden flex flex-col">
            
            {/* Header / Progress Indicator */}
            <div className="px-6 py-4 bg-white border-b border-border-light">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Module: React Hooks</span>
                <span className="text-xs font-mono font-medium text-text-muted">Question 2 / 5</span>
              </div>
              <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full w-2/5" />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-6 bg-white flex-1 border-b border-border-light pb-8">
              <h3 className="text-sm font-semibold text-text-primary mb-6 leading-relaxed">
                Which hook is primarily used for executing side effects in a functional component?
              </h3>

              {/* Static Answer Choices */}
              <div className="space-y-3">
                <div className="w-full flex items-center px-4 py-3 rounded-xl border border-border-light bg-surface text-sm font-medium text-text-secondary opacity-60">
                  <span className="w-6 h-6 rounded-md bg-white border border-border-light flex items-center justify-center mr-3 text-xs">A</span>
                  useState
                </div>
                {/* Simulated correct choice */}
                <div className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-accent-emerald bg-emerald-50 text-sm font-bold text-accent-emerald shadow-sm">
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-md bg-white border border-accent-emerald flex items-center justify-center mr-3 text-xs">B</span>
                    useEffect
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="w-full flex items-center px-4 py-3 rounded-xl border border-border-light bg-surface text-sm font-medium text-text-secondary opacity-60">
                  <span className="w-6 h-6 rounded-md bg-white border border-border-light flex items-center justify-center mr-3 text-xs">C</span>
                  useMemo
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-4 bg-surface flex justify-end">
              <div className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-lg shadow-sm">
                Next Question
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default QuizDemo
