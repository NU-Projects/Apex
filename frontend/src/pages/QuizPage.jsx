import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';
import { generateQuiz, markQuizPassed } from '../services/quizService';
import QuizLoading from '../components/quiz/QuizLoading';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizNavigation from '../components/quiz/QuizNavigation';
import QuizResult from '../components/quiz/QuizResult';
import QuizAnswerKey from '../components/quiz/QuizAnswerKey';
import SkillNotification from '../components/SkillNotification';

const transformApiQuiz = (apiQuiz) => {
    return apiQuiz.map((q, qIndex) => {
        const optionKeys = ['a', 'b', 'c', 'd'];
        const optionLabels = ['A', 'B', 'C', 'D'];
        const options = {};
        (q.options || []).forEach((text, i) => {
            options[optionKeys[i]] = text;
        });

        // Handle correct_option - could be:
        // 1. A letter like "A", "B", "C", "D" (uppercase or lowercase)
        // 2. The actual option text
        let correctOption = null;
        const correctRaw = (q.correct_option || '').trim();
        
        // Check if it's a letter (A, B, C, D)
        const upperCorrect = correctRaw.toUpperCase();
        if (optionLabels.includes(upperCorrect)) {
            const index = optionLabels.indexOf(upperCorrect);
            correctOption = optionKeys[index];
        } else {
            // It's the actual text - find which option matches (case-insensitive)
            const matchingIndex = q.options.findIndex(
                opt => String(opt).trim().toLowerCase() === correctRaw.toLowerCase()
            );
            if (matchingIndex !== -1) {
                correctOption = optionKeys[matchingIndex];
            } else {
                // Fallback: try first character if it's a letter
                const firstChar = correctRaw.charAt(0).toLowerCase();
                if (optionKeys.includes(firstChar)) {
                    correctOption = firstChar;
                } else {
                    // Last resort: default to 'a'
                    console.warn(`Question ${qIndex + 1}: Could not match correct_option "${correctRaw}". Defaulting to 'a'.`);
                    correctOption = 'a';
                }
            }
        }

        return {
            statement: q.statement || '',
            options,
            correctOption
        };
    });
};

function QuizPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const topic = searchParams.get('topic') || '';

    // Quiz state
    const [quizData, setQuizData] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [view, setView] = useState('loading'); // loading | quiz | result | answerKey | error
    const [error, setError] = useState('');
    const [isMarkingDone, setIsMarkingDone] = useState(false);
    const [notificationData, setNotificationData] = useState(null);

    const fetchQuiz = useCallback(async () => {
        setView('loading');
        setError('');
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setScore(0);
        setQuizData([]);

        try {
            const data = await generateQuiz(topic);
            const transformed = transformApiQuiz(Array.isArray(data?.quiz) ? data.quiz : []);

            if (transformed.length === 0) {
                setError('No questions received. Please try again.');
                setView('error');
                return;
            }

            setQuizData(transformed);
            setView('quiz');
        } catch (err) {
            setError(err?.message || 'Failed to load quiz. Please try again.');
            setView('error');
        }
    }, [topic]);

    // Fetch quiz on mount
    useEffect(() => {
        if (topic) {
            fetchQuiz();
        } else {
            setError('No quiz topic specified.');
            setView('error');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topic]); // Only re-run when topic changes, not when fetchQuiz changes

    const handleSelect = (optionKey) => {
        setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: optionKey }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const handleSubmit = () => {
        let correctCount = 0;
        quizData.forEach((q, i) => {
            if (selectedAnswers[i] === q.correctOption) {
                correctCount += 1;
            }
        });
        setScore(correctCount);
        setView('result');
    };

    const handleTryAgain = () => {
        fetchQuiz();
    };

    const handleMarkDone = async () => {
        if (!user?.email) return;

        setIsMarkingDone(true);
        try {
            const result = await markQuizPassed(user.email, topic);
            
            // Show notification with the result data
            setNotificationData(result);
            
            // Navigate after a delay to allow user to see the notification
            setTimeout(() => {
                navigate('/roadmap');
            }, 8500);
        } catch (err) {
            setError(err?.message || 'Failed to mark quiz as done.');
            // Stay on result page but show error briefly
            setIsMarkingDone(false);
        }
    };

    const handleAnswerKey = () => {
        setView('answerKey');
    };

    const handleBackToResult = () => {
        setView('result');
    };

    const handleBackToRoadmap = () => {
        navigate('/roadmap');
    };

    return (
        <div className="min-h-screen flex flex-col bg-surface font-sans relative overflow-hidden">
            <div className="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
            <div className="pointer-events-none absolute top-40 -right-24 h-72 w-72 rounded-full bg-accent-cyan/20 blur-3xl" />
            
            {/* Skill Notification Popup */}
            {notificationData && (
                <SkillNotification 
                    data={notificationData} 
                    onClose={() => setNotificationData(null)} 
                />
            )}
            
            <Navbar />
            <main className="flex-1 w-full max-w-4xl mx-auto p-6 md:p-10 relative z-10">
                {/* Quiz title header */}
                {topic && view !== 'loading' && view !== 'error' && (
                    <div className="mb-6 animate-fade-in">
                        <button
                            type="button"
                            onClick={handleBackToRoadmap}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-primary transition-colors mb-3"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Back to Roadmap
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 border border-brand-100">
                                <svg className="w-5 h-5 text-brand-600" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                    <path d="M7.25 4.75h5.5" strokeLinecap="round" />
                                    <path d="M8 4.75l.25 2m3.5-2l-.25 2" strokeLinecap="round" />
                                    <path d="M6.5 8.5h7l-.8 6.2a2 2 0 01-1.98 1.75H9.28a2 2 0 01-1.98-1.75L6.5 8.5z" />
                                    <path d="M9.2 11.1h1.6m-1.6 2.2h1.6" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.16em] text-text-muted font-semibold">Quiz</p>
                                <h1 className="text-xl font-bold text-text-primary">{topic}</h1>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading */}
                {view === 'loading' && <QuizLoading />}

                {/* Error */}
                {view === 'error' && (
                    <section className="rounded-2xl border border-rose-200 bg-rose-50 p-8 shadow-sm animate-fade-in">
                        <h2 className="text-xl font-bold text-rose-700">Unable to load quiz</h2>
                        <p className="mt-2 text-rose-600">{error}</p>
                        <div className="mt-5 flex gap-3">
                            <button
                                type="button"
                                onClick={fetchQuiz}
                                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
                            >
                                Retry
                            </button>
                            <button
                                type="button"
                                onClick={handleBackToRoadmap}
                                className="rounded-lg border border-border-default bg-white px-4 py-2 text-sm font-semibold text-text-primary hover:bg-slate-50 transition-colors"
                            >
                                Back to Roadmap
                            </button>
                        </div>
                    </section>
                )}

                {/* Quiz questions */}
                {view === 'quiz' && quizData.length > 0 && (
                    <div className="rounded-3xl border border-border-light bg-white p-6 md:p-8 shadow-sm">
                        <QuizQuestion
                            question={quizData[currentQuestionIndex]}
                            questionIndex={currentQuestionIndex}
                            totalQuestions={quizData.length}
                            selectedAnswer={selectedAnswers[currentQuestionIndex] || null}
                            onSelect={handleSelect}
                        />
                        <QuizNavigation
                            currentIndex={currentQuestionIndex}
                            totalQuestions={quizData.length}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                            onSubmit={handleSubmit}
                            hasAnswer={Boolean(selectedAnswers[currentQuestionIndex])}
                        />
                    </div>
                )}

                {/* Result */}
                {view === 'result' && (
                    <QuizResult
                        score={score}
                        total={quizData.length}
                        onTryAgain={handleTryAgain}
                        onMarkDone={handleMarkDone}
                        onAnswerKey={handleAnswerKey}
                        onBackToRoadmap={handleBackToRoadmap}
                        isMarkingDone={isMarkingDone}
                    />
                )}

                {/* Answer Key */}
                {view === 'answerKey' && (
                    <div className="rounded-3xl border border-border-light bg-white p-6 md:p-8 shadow-sm">
                        <QuizAnswerKey
                            quizData={quizData}
                            selectedAnswers={selectedAnswers}
                            onBack={handleBackToResult}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}

export default QuizPage;
