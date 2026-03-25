const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const JOB_API_URL = 'http://localhost:5004/jobs';

// Global cache to persist records across route navigations
const GLOBAL_CACHE = {
  distinctRoles: null,
  jobsByRole: {},
  jobCounts: {},
  roleInsights: {},
  locationCounts: {},
  popularRoleCounts: null, // New: track full grid data
};

export const fetchDistinctRoles = async () => {
  if (GLOBAL_CACHE.distinctRoles) return GLOBAL_CACHE.distinctRoles;
  try {
    const res = await fetch(`${API_URL}/jobs/roles`);
    if (!res.ok) return [];
    const data = await res.json();
    GLOBAL_CACHE.distinctRoles = data.roles || [];
    return GLOBAL_CACHE.distinctRoles;
  } catch {
    return [];
  }
};

export const fetchJobsByRole = async (jobRole) => {
  if (GLOBAL_CACHE.jobsByRole[jobRole]) return GLOBAL_CACHE.jobsByRole[jobRole];
  try {
    const res = await fetch(`${API_URL}/jobs/by-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobRole }),
    });

    if (!res.ok) return [];

    const data = await res.json();
    GLOBAL_CACHE.jobsByRole[jobRole] = data.jobs || [];
    return GLOBAL_CACHE.jobsByRole[jobRole];
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
  if (GLOBAL_CACHE.jobCounts[role]) return GLOBAL_CACHE.jobCounts[role];
  try {
    const res = await fetch(`${JOB_API_URL}/count?role=${encodeURIComponent(role)}`);
    const data = await res.json();
    GLOBAL_CACHE.jobCounts[role] = data;
    return data;
  } catch (error) {
    console.error('Error fetching job count:', error);
    return { count: 0 };
  }
};

export const getRoleInsights = async (currentRole, selectedRole, skills = [], signal = null) => {
  const cacheKey = `${currentRole}-${selectedRole}-${skills.sort().join(',')}`;
  if (GLOBAL_CACHE.roleInsights[cacheKey]) return GLOBAL_CACHE.roleInsights[cacheKey];

  try {
    const res = await fetch(`${JOB_API_URL}/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentRole, selectedRole, skills }),
      signal
    });
    const data = await res.json();
    if (data && !data.error) {
      GLOBAL_CACHE.roleInsights[cacheKey] = data;
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted');
      return null;
    }
    console.error('Error fetching role insights:', error);
    return { error: 'Failed to fetch insights' };
  }
};

export const getLocationCounts = async (country) => {
  if (GLOBAL_CACHE.locationCounts[country]) return GLOBAL_CACHE.locationCounts[country];
  try {
    const res = await fetch(`${JOB_API_URL}/locations?country=${encodeURIComponent(country)}`);
    const data = await res.json();
    GLOBAL_CACHE.locationCounts[country] = data;
    return data;
  } catch (error) {
    console.error('Error fetching location counts:', error);
    return [];
  }
};

export const getCachedLocationCounts = (country) => GLOBAL_CACHE.locationCounts[country];
export const getCachedPopularRoles = () => GLOBAL_CACHE.popularRoleCounts;
export const setCachedPopularRoles = (data) => { GLOBAL_CACHE.popularRoleCounts = data; };
