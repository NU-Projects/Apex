function QuizLoading() {
    return (
        <section className="min-h-[calc(100vh-220px)] flex items-center justify-center animate-fade-in">
            <div className="flex flex-col items-center gap-5">
                <div className="relative">
                    <div className="w-14 h-14 rounded-full border-[3px] border-brand-100 border-t-brand-600 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-5 h-5 text-brand-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path d="M7.25 4.75h5.5" strokeLinecap="round" />
                            <path d="M8 4.75l.25 2m3.5-2l-.25 2" strokeLinecap="round" />
                            <path d="M6.5 8.5h7l-.8 6.2a2 2 0 01-1.98 1.75H9.28a2 2 0 01-1.98-1.75L6.5 8.5z" />
                            <path d="M9.2 11.1h1.6m-1.6 2.2h1.6" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold text-text-primary">Generating Quiz</p>
                    <p className="mt-1 text-sm text-text-muted">Preparing your questions…</p>
                </div>
            </div>
        </section>
    );
}

export default QuizLoading;
