import { AuthService } from '@booknest/services'
import '../common/index.css'

import { Button, Header } from '@booknest/ui'
import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { safeLocalStorage } from '@booknest/utils'

export default function Login(): React.ReactElement {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  /**
   * Runs an effect to set the page title
   */
  useEffect(() => {
    document.title = 'Login'
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)

      const response = await AuthService.login({
        email: formData.email.trim(),
        password: formData.password,
        
      })
      safeLocalStorage.set('token', response.data.token)

      toast.success('Logged in successfully!')
      navigate('/')
    } catch (err: any) {
      toast.error('Login failed. Please try again.')
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
          <h3 className="log-in-text">Log in</h3>
          <p className="sign-up-text">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="sign-up-link">
              Sign up
            </Link>
          </p>
          <input
            name="email"
            type="email"
            placeholder="Email address"
            className="log-in-input"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="log-in-input"
            value={formData.password}
            onChange={handleChange}
          />
          <Link className="forgot-password-text" to="/forgot-password">
            Forgot Password?
          </Link>
          <Button
            label={loading ? 'Logging in' : 'Login'}
            className="btn-login"
            disabled={loading}
          />
          <Toaster />
        </form>
      </div>
    </div>
  )
}
