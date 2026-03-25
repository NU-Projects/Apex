const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const generateRoadmap = async (email, options = {}) => {
  const res = await fetch(`${API_URL}/roadmap/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    signal: options.signal
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || 'Failed to generate roadmap');
  }

  return data;
};
