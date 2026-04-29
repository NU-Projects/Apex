const optionLabels = ['A', 'B', 'C', 'D'];
const optionKeys = ['a', 'b', 'c', 'd'];

function QuizAnswerKey({ quizData, selectedAnswers, onBack }) {
    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Answer Key</h2>
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold border border-border-default bg-white text-text-primary hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Results
                </button>
            </div>

            <div className="space-y-4">
                {quizData.map((q, qIndex) => {
                    const userAnswer = selectedAnswers[qIndex];
                    const isCorrect = userAnswer === q.correctOption;

                    return (
                        <div
                            key={qIndex}
                            className={`rounded-2xl border-2 p-5 transition-colors ${isCorrect
                                    ? 'border-emerald-200 bg-emerald-50/50'
                                    : 'border-rose-200 bg-rose-50/50'
                                }`}
                        >
                            {/* Question header */}
                            <div className="flex items-start gap-3 mb-4">
                                <span className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${isCorrect
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-rose-100 text-rose-700'
                                    }`}>
                                    {qIndex + 1}
                                </span>
                                <p className="text-base font-semibold text-text-primary leading-relaxed">{q.statement}</p>
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-10">
                                {optionKeys.map((key, i) => {
                                    const isCorrectOption = key === q.correctOption;
                                    const isUserSelection = key === userAnswer;

                                    let optionStyle = 'border-border-light bg-white text-text-secondary';
                                    let iconEl = null;

                                    if (isCorrectOption) {
                                        optionStyle = 'border-emerald-300 bg-emerald-50 text-emerald-800';
                                        iconEl = (
                                            <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-auto" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.415 0l-3.2-3.2a1 1 0 111.414-1.414l2.493 2.493 6.493-6.493a1 1 0 011.415 0z" clipRule="evenodd" />
                                            </svg>
                                        );
                                    } else if (isUserSelection && !isCorrectOption) {
                                        optionStyle = 'border-rose-300 bg-rose-50 text-rose-800';
                                        iconEl = (
                                            <svg className="w-4 h-4 text-rose-600 flex-shrink-0 ml-auto" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        );
                                    }

                                    return (
                                        <div
                                            key={key}
                                            className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm font-medium ${optionStyle}`}
                                        >
                                            <span className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${isCorrectOption
                                                    ? 'bg-emerald-200 text-emerald-800'
                                                    : isUserSelection
                                                        ? 'bg-rose-200 text-rose-800'
                                                        : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {optionLabels[i]}
                                            </span>
                                            <span className="flex-1">{q.options[key]}</span>
                                            {iconEl}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Result badge */}
                            <div className="mt-3 pl-10">
                                {isCorrect ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.415 0l-3.2-3.2a1 1 0 111.414-1.414l2.493 2.493 6.493-6.493a1 1 0 011.415 0z" clipRule="evenodd" />
                                        </svg>
                                        Correct
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700">
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Incorrect — Correct answer: {optionLabels[optionKeys.indexOf(q.correctOption)]}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default QuizAnswerKey;
