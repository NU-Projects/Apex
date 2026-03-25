const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getRoadmapByEmail = async (email, options = {}) => {
  const query = new URLSearchParams({ email }).toString();
  const res = await fetch(`${API_URL}/roadmap?${query}`, {
    method: 'GET',
    signal: options.signal
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || 'Failed to fetch roadmap');
  }

  return data;
};

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
