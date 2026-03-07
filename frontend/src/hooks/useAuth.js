import { useState } from 'react'

export function useAuth() {
    const [user] = useState(() => {
        const token = localStorage.getItem('accessToken')
        const storedUser = localStorage.getItem('user')

        if (token) {
            try {
                return storedUser ? JSON.parse(storedUser) : { email: token.replace('token_', '') }
            } catch {
                return { email: token.replace('token_', '') }
            }
        }
        return null
    })

    return { user, loading: false }
}
