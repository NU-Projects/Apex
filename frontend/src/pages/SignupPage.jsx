import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import InputField from '../components/InputField'
import Button from '../components/Button'
import StepIndicator from '../components/StepIndicator'
import { mockSignup } from '../services/authService'

const stepLabels = ['Basic Info', 'Security', 'Profile']

function SignupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    linkedin: '',
    github: '',
  })

  const update = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    setError('')
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.username || !formData.email) {
        setError('Please fill in all fields.')
        return
      }
    }
    if (step === 2) {
      if (!formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields.')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.')
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }
    }
    setError('')
    setStep((s) => s + 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await mockSignup(formData)
      navigate('/dashboard')
    } catch {
      setError('Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const subtitles = {
    1: 'Let\'s get started with your basics',
    2: 'Set up a secure password',
    3: 'Complete your profile',
  }

  return (
    <AuthCard title="Create your account" subtitle={subtitles[step]}>
      <StepIndicator currentStep={step} totalSteps={3} labels={stepLabels} />

      <div className="space-y-4 animate-slide-in" key={step}>
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 animate-fade-in">
            {error}
          </div>
        )}

        {step === 1 && (
          <>
            <InputField
              label="Username"
              id="signup-username"
              placeholder="Username"
              value={formData.username}
              onChange={update('username')}
            />
            <InputField
              label="Email Address"
              id="signup-email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={update('email')}
            />
          </>
        )}

        {step === 2 && (
          <>
            <InputField
              label="Password"
              id="signup-password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={update('password')}
            />
            <InputField
              label="Confirm Password"
              id="signup-confirm-password"
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={update('confirmPassword')}
            />
          </>
        )}

        {step === 3 && (
          <>
            <InputField
              label="LinkedIn URL"
              id="signup-linkedin"
              placeholder="LinkedIn URL"
              value={formData.linkedin}
              onChange={update('linkedin')}
            />
            <InputField
              label="GitHub URL"
              id="signup-github"
              placeholder="GitHub URL"
              value={formData.github}
              onChange={update('github')}
            />
          </>
        )}

        <div className="flex gap-3 pt-1">
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep((s) => s - 1)} fullWidth={false}>
              Back
            </Button>
          )}
          <div className="flex-1">
            {step < 3 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} loading={loading}>
                Create Account
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-text-secondary pt-1">
          Already have an account?{' '}
          <Link
            to="/"
            className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  )
}

export default SignupPage
