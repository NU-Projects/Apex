import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import InputField from '../components/InputField'
import Button from '../components/Button'
import { forgotPassword, verifyResetOtp } from '../services/authService'

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => {
      setTimer((t) => t - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])

  const formatTime = useCallback((seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }, [])

  const handleSendOTP = async () => {
    if (!email) {
      setError('Please enter your email address.')
      return
    }
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Only @gmail.com emails are allowed.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { error: sendError } = await forgotPassword(email)
      if (sendError) {
        setError(sendError.message)
        return
      }
      setStep(2)
      setTimer(300)
      setSuccess('OTP sent successfully!')
    } catch {
      setError('Failed to send OTP. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp) {
      setError('Please enter the OTP.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const { error: verifyError } = await verifyResetOtp(email, otp)
      if (verifyError) {
        setError(verifyError.message)
        return
      }
      setSuccess('OTP verified successfully!')
      setTimeout(() => navigate('/'), 2000)
    } catch {
      setError('Verification failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (timer > 0) return
    setLoading(true)
    setError('')
    try {
      const { error: resendError } = await forgotPassword(email)
      if (resendError) {
        setError(resendError.message)
        return
      }
      setTimer(300)
      setOtp('')
      setSuccess('OTP resent successfully!')
    } catch {
      setError('Failed to resend OTP.')
    } finally {
      setLoading(false)
    }
  }

  const subtitles = {
    1: 'Enter your email to receive a verification code',
    2: 'Verify your email address',
  }

  return (
    <AuthCard
      title={step === 1 ? 'Reset password' : 'Verify Email'}
      subtitle={subtitles[step]}
    >
      <div className="space-y-4 animate-slide-in" key={step}>
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 animate-fade-in">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-brand-700 animate-fade-in">
            {success}
          </div>
        )}

        {step === 1 && (
          <InputField
            label="Email Address"
            id="forgot-email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
          />
        )}

        {step === 2 && (
          <>
            <div className="text-sm text-text-secondary mb-4">
              We've sent a 6-digit verification code to <span className="font-semibold text-text-primary">{email}</span>.
            </div>
            <InputField
              label="Verification Code (OTP)"
              id="forgot-otp"
              placeholder="XXXXXX"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value)
                setError('')
              }}
            />
            <div className="text-center">
              {timer > 0 ? (
                <p className="text-sm text-text-secondary">
                  Code expires in{' '}
                  <span className="font-semibold text-brand-600">{formatTime(timer)}</span>
                </p>
              ) : (
                <p className="text-sm text-text-secondary">
                  Didn&apos;t receive the code?{' '}
                  <button
                    onClick={handleResendOTP}
                    className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    Resend
                  </button>
                </p>
              )}
            </div>
          </>
        )}

        <div className="flex gap-3 pt-1">
          {step === 2 && (
            <Button variant="secondary" onClick={() => { setStep(1); setOtp(''); setError(''); setSuccess('') }} fullWidth={false}>
              Back
            </Button>
          )}
          <div className="flex-1">
            {step === 1 ? (
              <Button onClick={handleSendOTP} loading={loading}>
                Send OTP
              </Button>
            ) : (
              <Button onClick={handleVerifyOTP} loading={loading}>
                Verify & Activate
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-text-secondary pt-1">
          Remember your password?{' '}
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

export default ForgotPasswordPage
