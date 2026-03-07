const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const fetchGithubSkills = async (username) => {
    if (!username) return []
    try {
        const res = await fetch(`${API_URL}/skills/github-skills`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        })
        if (!res.ok) return []
        return await res.json()
    } catch {
        return []
    }
}

export const fetchLinkedinSkills = async (username) => {
    if (!username) return []
    try {
        const res = await fetch(`${API_URL}/skills/linkedin-skills`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        })
        if (!res.ok) return []
        return await res.json()
    } catch {
        return []
    }
}

export const saveUserSkills = async (email, skills) => {
    try {
        const res = await fetch(`${API_URL}/skills/save-skills`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, skills })
        })
        return res.ok
    } catch {
        return false
    }
}
