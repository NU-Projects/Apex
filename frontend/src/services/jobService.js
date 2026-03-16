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
