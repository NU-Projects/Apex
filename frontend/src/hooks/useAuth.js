import { useState, useEffect, useCallback } from 'react'

function getUserFromStorage() {
    const token = localStorage.getItem('accessToken')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
        try {
            return JSON.parse(storedUser)
        } catch {
            return null
        }
    }
    return null
}

export function useAuth() {
    const [user, setUser] = useState(getUserFromStorage)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setUser(getUserFromStorage())
        setLoading(false)

        const handleStorageChange = () => {
            setUser(getUserFromStorage())
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        setUser(null)
    }, [])

    const refresh = useCallback(async () => {
        try {
            const token = localStorage.getItem('accessToken')
            if (!token || !user?.email) return

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
            const res = await fetch(`${API_URL}/user/profile?email=${user.email}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            if (res.ok && data.user) {
                localStorage.setItem('user', JSON.stringify(data.user))
                window.dispatchEvent(new Event('storage'))
                setUser(data.user)
                return data.user
            }
        } catch (err) {
            console.error('Auth refresh failed:', err)
        }
    }, [user?.email])

    return { user, loading, logout, refresh }
}