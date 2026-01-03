import '../common/index.css'

import { Button, Header } from '@booknest/ui'
import { AuthService } from '@booknest/services'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, Toaster } from 'react-hot-toast'

export default function ForgotPassword(): React.ReactElement {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
  })
  const [loading, setLoading] = useState(false)

  /**
   * Runs an effect to set the page title
   */
  useEffect(() => {
    document.title = 'Forgot Password'
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)

      const response = await AuthService.forgotPassword({
        email: formData.email.trim(),
      })

      toast.success('Password Reset Link Sent!')
      navigate('/reset-successful')
    } catch (err: any) {
      toast.error('Forgot password failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Render components
   */
  return (
    <div className="form">
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <Header className="login-logo" />
          <h3 className="log-in-text">Forgot Password</h3>
          <p className="sign-up-text">
            Enter your registered email address and we will send you
            instructions to reset your password
          </p>
          <input
            name="email"
            type="email"
            placeholder="Email address"
            className="log-in-input"
            required
            onChange={handleChange}
          />

          <p className="sign-up-text">
            Remember your password?{' '}
            <Link to="/login" className="sign-up-link">
              Login
            </Link>
          </p>
          <Button label="Send Reset Link" className="btn-login" type="submit" />
        </form>
      </div>
      <Toaster />
    </div>
  )
}
