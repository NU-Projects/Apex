const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const fetchDistinctRoles = async () => {
    try {
        const res = await fetch(`${API_URL}/jobs/roles`)
        if (!res.ok) return []
        const data = await res.json()
        return data.roles || []
    } catch {
        return []
    }
}

export const fetchJobsByRole = async (jobRole) => {
    try {
        const res = await fetch(`${API_URL}/jobs/by-role`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobRole }),
        })

        if (!res.ok) return []

        const data = await res.json()
        return data.jobs || []
    } catch {
        return []
    }
}

export const getCompatibilityScore = async ({ skills, jobTitle, jobDescription }) => {
    const res = await fetch(`${API_URL}/jobs/compatibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            skills,
            job_title: jobTitle,
            job_description: jobDescription,
        }),
    })

    if (!res.ok) {
        throw new Error('Failed to fetch compatibility score')
    }

    return res.json()
}
