import { useState } from 'react'

export function useSkills() {
    const [skills] = useState(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            try {
                const userObj = JSON.parse(storedUser)
                return userObj.skills || []
            } catch {
                return []
            }
        }
        return []
    })

    return { skills, loading: false }
}
