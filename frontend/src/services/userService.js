const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const updateProfile = async (email, profileData) => {
  try {
    const token = localStorage.getItem('accessToken')
    const res = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        email,
        full_name: profileData.fullName,
        password: profileData.password,
        github_username: profileData.github,
        linkedin_username: profileData.linkedin
      })
    })
    
    const data = await res.json()
    if (!res.ok) {
      return { error: { message: data.error || 'Update failed' } }
    }
    
    // Update local storage if user was returned
    if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
    }
    
    return { data }
  } catch (error) {
    return { error: { message: error.message || 'Network error' } }
  }
}
