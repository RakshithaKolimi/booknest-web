import '../common/index.css'

import { AuthService } from '@booknest/services'
import { Button, Header } from '@booknest/ui'
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast, Toaster } from 'react-hot-toast'

export default function ResetPassword(): React.ReactElement {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = useMemo(() => searchParams.get('token')?.trim() || '', [searchParams])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: '',
  })

  useEffect(() => {
    document.title = 'Reset Password'
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast.error('Reset token is missing. Request a new reset link.')
      return
    }

    if (formData.new_password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (formData.new_password !== formData.confirm_password) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      await AuthService.resetPasswordWithToken(token, formData.new_password)
      toast.success('Password reset successful. Please log in.')
      navigate('/login')
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Password reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form">
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <Header className="login-logo" />
          <h3 className="log-in-text">Reset Password</h3>
          <p className="sign-up-text">
            Enter a new password for your account.
          </p>
          <input
            name="new_password"
            type="password"
            placeholder="New password"
            className="log-in-input"
            value={formData.new_password}
            onChange={handleChange}
            required
          />
          <input
            name="confirm_password"
            type="password"
            placeholder="Confirm new password"
            className="log-in-input"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />

          <p className="sign-up-text">
            Back to{' '}
            <Link to="/login" className="sign-up-link">
              Login
            </Link>
          </p>

          <Button
            label={loading ? 'Resetting...' : 'Reset Password'}
            className="btn-login"
            type="submit"
            disabled={loading}
          />
        </form>
      </div>
      <Toaster />
    </div>
  )
}
