const optionLabels = ['A', 'B', 'C', 'D'];
const optionKeys = ['a', 'b', 'c', 'd'];

function QuizQuestion({ question, questionIndex, totalQuestions, selectedAnswer, onSelect }) {
    return (
        <div className="animate-fade-in">
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-100 px-3 py-1 text-xs font-bold text-brand-700">
                    Question {questionIndex + 1} of {totalQuestions}
                </span>
                <div className="flex gap-1.5">
                    {Array.from({ length: totalQuestions }, (_, i) => (
                        <div
                            key={i}
                            className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${i === questionIndex
                                    ? 'bg-brand-600 scale-110'
                                    : i < questionIndex
                                        ? 'bg-brand-300'
                                        : 'bg-slate-200'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Question statement */}
            <h2 className="text-xl md:text-2xl font-bold text-text-primary leading-relaxed mb-8">
                {question.statement}
            </h2>

            {/* Options */}
            <div className="space-y-3">
                {optionKeys.map((key, i) => {
                    const isSelected = selectedAnswer === key;

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onSelect(key)}
                            className={`w-full flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200 group ${isSelected
                                    ? 'border-brand-500 bg-brand-50 shadow-md shadow-brand-100/50'
                                    : 'border-border-light bg-white hover:border-brand-200 hover:bg-brand-50/40 hover:shadow-sm'
                                }`}
                        >
                            {/* Option label circle */}
                            <span
                                className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-colors duration-200 ${isSelected
                                        ? 'bg-brand-600 text-white'
                                        : 'bg-slate-100 text-text-secondary group-hover:bg-brand-100 group-hover:text-brand-700'
                                    }`}
                            >
                                {optionLabels[i]}
                            </span>

                            {/* Option text */}
                            <span className={`text-[15px] font-medium ${isSelected ? 'text-brand-900' : 'text-text-primary'}`}>
                                {question.options[key]}
                            </span>

                            {/* Selected indicator */}
                            {isSelected && (
                                <span className="ml-auto flex-shrink-0">
                                    <svg className="w-5 h-5 text-brand-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.415 0l-3.2-3.2a1 1 0 111.414-1.414l2.493 2.493 6.493-6.493a1 1 0 011.415 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default QuizQuestion;
