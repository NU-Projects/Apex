const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      return { error: { message: data.message || 'Login failed' } }
    }

    const { accessToken, user } = data.data

    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    }
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken)
    }

    return { data: { session: { access_token: accessToken }, user } }
  } catch (error) {
    return { error: { message: error.message || 'Network error' } }
  }
}

export const registerUser = async (email, password, metadata) => {
  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        fullName: metadata.fullName,
        gitHubUserName: metadata.github,
        linkedInUserName: metadata.linkedin
      })
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      return { error: { message: data.message || 'Signup failed' } }
    }
    return { data }
  } catch (error) {
    return { error: { message: error.message || 'Network error' } }
  }
}

export const verifyOtpUser = async (email, token) => {
  try {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: token })
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      return { error: { message: data.message || 'OTP Verification failed' } }
    }
    localStorage.setItem('user', JSON.stringify({ email }))
    return { data: { session: { access_token: `token_${email}` } } }
  } catch (error) {
    return { error: { message: error.message || 'Network error' } }
  }
}

export const logoutUser = async () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
  return { error: null }
}

export const forgotPassword = async (email) => {
  try {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      return { error: { message: data.message || 'Failed to send OTP' } }
    }
    return { data }
  } catch (error) {
    return { error: { message: error.message || 'Network error' } }
  }
}

export const verifyResetOtp = async (email, otp) => {
  try {
    const res = await fetch(`${API_URL}/auth/verify-reset-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      return { error: { message: data.message || 'Invalid OTP' } }
    }
    return { data }
  } catch (error) {
    return { error: { message: error.message || 'Network error' } }
  }
}

export const changePassword = async (email, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      return { error: { message: data.message || 'Failed to change password' } }
    }
    return { data }
  } catch (error) {
    return { error: { message: error.message || 'Network error' } }
  }
}
