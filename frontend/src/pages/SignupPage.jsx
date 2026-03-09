import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import InputField from '../components/InputField'
import Button from '../components/Button'
import StepIndicator from '../components/StepIndicator'
import { registerUser, verifyOtpUser } from '../services/authService'
import { fetchGithubSkills, fetchLinkedinSkills, saveUserSkills } from '../services/skillsService'

const stepLabels = ['Basic Info', 'Security', 'Profile']

function SignupPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => {
      setTimer((t) => t - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }
  const [formData, setFormData] = useState({
    fullName: '',
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
      if (!formData.fullName || !formData.email) {
        setError('Please fill in all fields.')
        return
      }
      if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
        setError('Only @gmail.com emails are allowed.')
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
    if (!formData.linkedin || !formData.github) {
      setError('Please fill in all fields.')
      return
    }

    // Extract usernames safely
    const extractUsername = (url) => {
      if (!url) return null;
      try {
        const cleaned = url.trim().replace(/\/$/, '').split('?')[0];
        return cleaned.split('/').pop();
      } catch {
        return null; // fallback
      }
    }

    const ghUser = extractUsername(formData.github)
    const liUser = extractUsername(formData.linkedin)

    setLoading(true)
    try {
      const { error: authError } = await registerUser(formData.email, formData.password, {
        fullName: formData.fullName,
        linkedin: liUser,
        github: ghUser,
      })

      if (authError) {
        setError(authError.message || 'Signup failed. Please try again.')
        return
      }

      setTimer(300)
      setStep(4) // Move to OTP verification
    } catch {
      setError('Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP.')
      return
    }

    setLoading(true)
    try {
      const { data, error: otpError } = await verifyOtpUser(formData.email, otp)

      if (otpError) {
        setError(otpError.message || 'OTP Verification failed.')
        return
      }

      if (data?.session?.access_token) {
        localStorage.setItem('accessToken', data.session.access_token)
      }

      // Extract usernames safely
      const extractUsername = (url) => {
        if (!url) return null;
        try {
          const cleaned = url.trim().replace(/\/$/, '').split('?')[0];
          return cleaned.split('/').pop();
        } catch {
          return null;
        }
      }

      const ghUser = extractUsername(formData.github)
      const liUser = extractUsername(formData.linkedin)

      // Fetch skills from both concurrently
      const [ghSkills, liSkills] = await Promise.all([
        fetchGithubSkills(ghUser),
        fetchLinkedinSkills(liUser)
      ])

      const allSkills = Array.from(new Set([...(ghSkills || []), ...(liSkills || [])]))

      await saveUserSkills(formData.email, allSkills)

      const currentUserStr = localStorage.getItem('user')
      if (currentUserStr) {
        try {
          const u = JSON.parse(currentUserStr)
          u.skills = allSkills
          localStorage.setItem('user', JSON.stringify(u))
        } catch {
          // Ignore parse errors
        }
      }

      navigate('/dashboard')
    } catch {
      setError('An error occurred during verification.')
    } finally {
      setLoading(false)
    }
  }

  const subtitles = {
    1: 'Let\'s get started with your basics',
    2: 'Set up a secure password',
    3: 'Complete your profile',
    4: 'Verify your email address',
  }

  return (
    <AuthCard title={step === 4 ? "Verify Email" : "Create your account"} subtitle={subtitles[step]}>
      {step < 4 && <StepIndicator currentStep={step} totalSteps={3} labels={stepLabels} />}

      <div className="space-y-4 animate-slide-in" key={step}>
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 animate-fade-in">
            {error}
          </div>
        )}

        {step === 1 && (
          <>
            <InputField
              label="Full Name"
              id="signup-fullname"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={update('fullName')}
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
              label="LinkedIn Username or URL"
              id="signup-linkedin"
              placeholder="LinkedIn Username or URL"
              value={formData.linkedin}
              onChange={update('linkedin')}
            />
            <InputField
              label="GitHub Username or URL"
              id="signup-github"
              placeholder="GitHub Username or URL"
              value={formData.github}
              onChange={update('github')}
            />
          </>
        )}

        {step === 4 && (
          <>
            <div className="text-sm text-text-secondary mb-4">
              We've sent a 6-digit verification code to <span className="font-semibold text-text-primary">{formData.email}</span>.
            </div>
            <InputField
              label="Verification Code (OTP)"
              id="signup-otp"
              placeholder="XXXXXX"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value)
                setError('')
              }}
            />
            {step === 4 && (
              <div className="text-center mt-2">
                {timer > 0 ? (
                  <p className="text-sm text-text-secondary">
                    Code expires in{' '}
                    <span className="font-semibold text-brand-600">{formatTime(timer)}</span>
                  </p>
                ) : (
                  <p className="text-sm text-text-secondary">
                    Didn&apos;t receive the code?{' '}
                    <button
                      onClick={handleSubmit} // Re-run signup to resend OTP
                      className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                    >
                      Resend
                    </button>
                  </p>
                )}
              </div>
            )}
          </>
        )}

        <div className="flex gap-3 pt-1">
          {step > 1 && step < 4 && (
            <Button variant="secondary" onClick={() => setStep((s) => s - 1)} fullWidth={false}>
              Back
            </Button>
          )}
          <div className="flex-1">
            {step < 3 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : step === 3 ? (
              <Button onClick={handleSubmit} loading={loading}>
                Create Account
              </Button>
            ) : (
              <Button onClick={handleVerifyOtp} loading={loading}>
                Verify & Activate
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-text-secondary pt-1">
          Already have an account?{' '}
          <Link
            to="/login"
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
