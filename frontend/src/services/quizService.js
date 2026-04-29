const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const generateQuiz = async (title, options = {}) => {
    const res = await fetch(`${API_URL}/quiz/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
        signal: options.signal
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || 'Failed to generate quiz');
    }

    return data;
};

export const markQuizPassed = async (email, title, options = {}) => {
    const res = await fetch(`${API_URL}/quiz/pass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, title }),
        signal: options.signal
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || 'Failed to mark quiz as passed');
    }

    return data;
};
