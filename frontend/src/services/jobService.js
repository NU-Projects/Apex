const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const JOB_API_URL = 'http://localhost:5004/jobs';

export const fetchDistinctRoles = async () => {
  try {
    const res = await fetch(`${API_URL}/jobs/roles`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.roles || [];
  } catch {
    return [];
  }
};

export const fetchJobsByRole = async (jobRole) => {
  try {
    const res = await fetch(`${API_URL}/jobs/by-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobRole }),
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.jobs || [];
  } catch {
    return [];
  }
};

export const getCompatibilityScore = async ({ skills, jobTitle, jobDescription }) => {
  const res = await fetch(`${API_URL}/jobs/compatibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      skills,
      job_title: jobTitle,
      job_description: jobDescription,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch compatibility score');
  }

  return res.json();
};

export const getJobCount = async (role) => {
  try {
    const res = await fetch(`${JOB_API_URL}/count?role=${encodeURIComponent(role)}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching job count:', error);
    return { count: 0 };
  }
};

export const getRoleInsights = async (currentRole, selectedRole, skills = []) => {
  try {
    const res = await fetch(`${JOB_API_URL}/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentRole, selectedRole, skills })
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching role insights:', error);
    return { error: 'Failed to fetch insights' };
  }
};

export const getLocationCounts = async (country) => {
  try {
    const res = await fetch(`${JOB_API_URL}/locations?country=${encodeURIComponent(country)}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching location counts:', error);
    return [];
  }
};
