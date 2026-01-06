import '../common/index.css'

import { AuthService } from '@booknest/services'
import { Button, Header } from '@booknest/ui'
import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

import Dialog from './Terms&Privacy/Terms&Privacy'

export default function Register(): React.ReactElement {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  })

  useEffect(() => {
    document.title = 'Register'
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match')
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)

      await AuthService.register({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      })

      toast.success('Account created successfully! Redirecting to login...')
      navigate('/login')
    } catch (err: any) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form">
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <Header className="login-logo" />
          <h3 className="log-in-text">Create Account</h3>
          <p className="sign-up-text">
            Already have an account?{' '}
            <Link to="/login" className="sign-up-link">
              Log in
            </Link>
          </p>

          <input
            name="first_name"
            type="text"
            placeholder="First name"
            value={formData.first_name}
            onChange={handleChange}
            className="log-in-input"
            required
          />
          <input
            name="last_name"
            type="text"
            placeholder="Last name"
            value={formData.last_name}
            onChange={handleChange}
            className="log-in-input"
          />
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="log-in-input"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="log-in-input"
            required
          />
          <input
            name="confirm_password"
            type="password"
            placeholder="Confirm password"
            value={formData.confirm_password}
            onChange={handleChange}
            className="log-in-input"
            required
          />

          <Button
            label={loading ? 'Signing Up...' : 'Sign Up'}
            className="btn-login"
            type="submit"
            disabled={loading}
          />

          <p className="caption-text">
            By signing up, you agree to our{' '}
            <span
              role="button"
              tabIndex={0}
              onClick={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setOpen(true)
              }}
              className="sign-up-link"
            >
              terms & privacy policy
            </span>
          </p>
        </form>

        <Dialog open={open} onClose={() => setOpen(false)} />
        <Toaster />
      </div>
    </div>
  )
}
