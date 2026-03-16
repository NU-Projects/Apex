import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import InputField from '../components/InputField'
import Button from '../components/Button'
import { loginUser } from '../services/authService'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Only @gmail.com emails are allowed.')
      return
    }

    setError('')
    setLoading(true)
    try {
      const { data, error: authError } = await loginUser(email, password)

      if (authError) {
        setError(authError.message || 'Login failed. Please try again.')
        return
      }

      if (data?.session?.access_token) {
        localStorage.setItem('accessToken', data.session.access_token)
      }

      navigate('/dashboard')
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your Apex account">
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <InputField
          label="Email Address"
          id="login-email"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          label="Password"
          id="login-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={loading}>
          Sign in
        </Button>

        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-light" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-text-muted">or</span>
          </div>
        </div>

        <p className="text-center text-sm text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}

export default LoginPage
