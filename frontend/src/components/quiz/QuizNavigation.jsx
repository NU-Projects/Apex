function QuizNavigation({ currentIndex, totalQuestions, onPrevious, onNext, onSubmit, hasAnswer }) {
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === totalQuestions - 1;

    return (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-light">
            {/* Previous */}
            <button
                type="button"
                onClick={onPrevious}
                disabled={isFirst}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold border border-border-default bg-white text-text-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Previous
            </button>

            {/* Next / Submit */}
            {isLast ? (
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={!hasAnswer}
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold bg-brand-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-700 transition-all shadow-sm"
                >
                    Submit Quiz
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.415 0l-3.2-3.2a1 1 0 111.414-1.414l2.493 2.493 6.493-6.493a1 1 0 011.415 0z" clipRule="evenodd" />
                    </svg>
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!hasAnswer}
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold bg-brand-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-700 transition-all shadow-sm"
                >
                    Next
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
        </div>
    );
}

export default QuizNavigation;
