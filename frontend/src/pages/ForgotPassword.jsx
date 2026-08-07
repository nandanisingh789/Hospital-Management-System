import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../api/services.js'
import AuthLayout from '../components/AuthLayout.jsx'

export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const requestReset = async (e) => {
    e.preventDefault()
    setError(''); setMessage(''); setLoading(true)
    try {
      const res = await authApi.forgotPassword({ email })
      // Demo-only: token is shown directly since no SMTP server is wired up.
      // In production this would be emailed instead of displayed.
      setToken(res.data.resetToken)
      setMessage('Reset token generated below (would normally be emailed to you).')
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.error || 'Could not find that email')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (e) => {
    e.preventDefault()
    setError(''); setMessage(''); setLoading(true)
    try {
      await authApi.resetPassword({ token, newPassword })
      setMessage('Password reset successful! You can now sign in.')
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset your password" subtitle="We'll help you get back in">
      {error && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 14 }}>{error}</div>}
      {message && <div style={{ color: '#0f766e', fontSize: 13, marginBottom: 14 }}>{message}</div>}

      {step === 1 && (
        <form onSubmit={requestReset}>
          <label className="label">Email</label>
          <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ marginBottom: 18 }} />
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Token'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={resetPassword}>
          <label className="label">Reset Token</label>
          <input className="input" value={token} onChange={(e) => setToken(e.target.value)} required style={{ marginBottom: 14 }} />
          <label className="label">New Password</label>
          <input type="password" className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={{ marginBottom: 18 }} />
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      {step === 3 && (
        <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          Go to Login
        </Link>
      )}

      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13.5 }}>
        <Link to="/login" style={{ color: '#0f766e' }}>Back to login</Link>
      </div>
    </AuthLayout>
  )
}
