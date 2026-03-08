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

    return { user, loading, logout }
}