function QuizResult({ score, total, onTryAgain, onMarkDone, onAnswerKey, onBackToRoadmap, isMarkingDone }) {
    const passed = score >= 6;

    return (
        <section className="min-h-[calc(100vh-220px)] flex items-center justify-center animate-fade-in">
            <div className="w-full max-w-lg rounded-3xl border border-border-light bg-white p-8 md:p-10 shadow-xl text-center relative overflow-hidden">
                {/* Decorative gradient blob */}
                <div className={`pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full blur-3xl ${passed ? 'bg-emerald-200/50' : 'bg-rose-200/50'
                    }`} />

                <div className="relative z-10">
                    {/* Icon */}
                    <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${passed ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-rose-50 border-2 border-rose-200'
                        }`}>
                        {passed ? (
                            <svg className="w-10 h-10 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-10 h-10 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>

                    {/* Status */}
                    <div className={`mt-5 inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wider ${passed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                        {passed ? 'Passed' : 'Failed'}
                    </div>

                    {/* Score */}
                    <h2 className="mt-4 text-5xl font-black text-text-primary">
                        {score}<span className="text-2xl text-text-muted font-semibold">/{total}</span>
                    </h2>
                    <p className="mt-2 text-text-secondary text-sm">
                        {passed
                            ? 'Great job! You\'ve demonstrated your knowledge.'
                            : 'Don\'t worry, review the material and try again.'}
                    </p>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col gap-3">
                        {passed ? (
                            <button
                                type="button"
                                onClick={onMarkDone}
                                disabled={isMarkingDone}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                {isMarkingDone ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Marking…
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.415 0l-3.2-3.2a1 1 0 111.414-1.414l2.493 2.493 6.493-6.493a1 1 0 011.415 0z" clipRule="evenodd" />
                                        </svg>
                                        Mark as Done
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={onTryAgain}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-sm"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311V15.5a.75.75 0 01-1.5 0v-4a.75.75 0 01.75-.75h4a.75.75 0 010 1.5H7.136l.15.15a4 4 0 006.703-1.8.75.75 0 011.323.824zM4.688 8.576a5.5 5.5 0 019.201-2.466l.312.311V4.5a.75.75 0 011.5 0v4a.75.75 0 01-.75.75h-4a.75.75 0 010-1.5h1.913l-.15-.15a4 4 0 00-6.703 1.8.75.75 0 01-1.323-.824z" clipRule="evenodd" />
                                </svg>
                                Try Again
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={onAnswerKey}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold border border-border-default bg-white text-text-primary hover:bg-slate-50 hover:border-slate-300 transition-all"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                <path d="M6 3.75h8A2.25 2.25 0 0116.25 6v8A2.25 2.25 0 0114 16.25H6A2.25 2.25 0 013.75 14V6A2.25 2.25 0 016 3.75z" />
                                <path d="M7.5 8h5M7.5 10.5h5M7.5 13h3" strokeLinecap="round" />
                            </svg>
                            Answer Key
                        </button>

                        <button
                            type="button"
                            onClick={onBackToRoadmap}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-surface transition-all"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Back to Roadmap
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default QuizResult;
