import { useState, useEffect } from 'react'

export function useSkills() {
    const getSkillsFromStorage = () => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            try {
                const userObj = JSON.parse(storedUser)
                return {
                    skills: userObj.skills || [],
                    missingSkills: userObj.missing_skills || []
                }
            } catch {
                return { skills: [], missingSkills: [] }
            }
        }
        return { skills: [], missingSkills: [] }
    }

    const [skillsData, setSkillsData] = useState(getSkillsFromStorage)

    useEffect(() => {
        const handleStorageChange = () => {
            setSkillsData(getSkillsFromStorage())
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    return { 
        skills: skillsData.skills, 
        missingSkills: skillsData.missingSkills, 
        loading: false 
    }
}
