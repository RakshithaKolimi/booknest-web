import { AuthService, getErrorMessage } from '@booknest/services'
import { Header } from '@booknest/ui'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import '../common/index.css'

import { usePageTitle } from '../../PageTitleProvider'

type VerificationState = 'pending' | 'success' | 'error'

export default function VerifyEmail(): React.ReactElement {
  usePageTitle('Verify Email')

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')?.trim() || ''
  const [status, setStatus] = useState<VerificationState>('pending')
  const [message, setMessage] = useState('Verifying your email...')
  const [resending, setResending] = useState(false)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setMessage('The verification link is missing a token.')
      return
    }

    let active = true

    AuthService.verifyEmail(token)
      .then(() => {
        if (!active) return
        setStatus('success')
        setMessage('Your email has been verified. Redirecting to login...')
        window.setTimeout(() => {
          navigate('/login')
        }, 1800)
      })
      .catch((error: unknown) => {
        if (!active) return
        setStatus('error')
        setMessage(
          getErrorMessage(error, 'Email verification failed. Please try again.')
        )
      })

    return () => {
      active = false
    }
  }, [navigate, searchParams])

  const handleResend = async () => {
    if (!email) {
      setMessage('The email address is missing from this verification link.')
      return
    }

    try {
      setResending(true)
      await AuthService.resendEmailVerification(email)
      setMessage('A new verification link has been sent to your email.')
    } catch (error: unknown) {
      setMessage(getErrorMessage(error, 'Unable to resend verification email.'))
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="form">
      <div className="form-container">
        <div className="form">
          <Header className="login-logo" />
          <h3 className="log-in-text">Email Verification</h3>
          <p className="mt-4 text-center text-sm leading-6 text-zinc-600">
            {message}
          </p>

          {status === 'success' && (
            <Link to="/login" className="btn-login mt-6 text-center">
              Go to Login
            </Link>
          )}

          {status === 'error' && (
            <div className="mt-6 space-y-3">
              <Link to="/login" className="btn-login block text-center">
                Back to Login
              </Link>
              {email ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="btn-login"
                >
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>
              ) : (
                <p className="text-center text-xs text-zinc-500">
                  This link does not include an email address for resending.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
