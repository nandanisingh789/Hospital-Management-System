import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/services.js'
import { useAuth } from '../context/AuthContext.jsx'
import AuthLayout from '../components/AuthLayout.jsx'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authApi.login(form)
      login(res.data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage patients, doctors & appointments">
      {error && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 14 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <label className="label">Username</label>
        <input
          className="input"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          style={{ marginBottom: 16 }}
        />
        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          style={{ marginBottom: 20 }}
        />
        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13.5 }}>
        <Link to="/forgot-password" style={{ color: '#0f766e' }}>Forgot password?</Link>
      </div>
      <div style={{ textAlign: 'center', marginTop: 8, fontSize: 13.5, color: '#5b7570' }}>
        New here? <Link to="/register" style={{ color: '#0f766e', fontWeight: 600 }}>Create an account</Link>
      </div>
    </AuthLayout>
  )
}
