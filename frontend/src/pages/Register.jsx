import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/services.js'
import { useAuth } from '../context/AuthContext.jsx'
import AuthLayout from '../components/AuthLayout.jsx'

export default function Register() {
  const [form, setForm] = useState({
    fullName: '', username: '', email: '', password: '', role: 'PATIENT', age: '', gender: '', contact: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = { ...form, age: form.age ? Number(form.age) : null }
      const res = await authApi.register(payload)
      login(res.data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Register as a patient, doctor, or admin">
      {error && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 14 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <label className="label">Full Name</label>
        <input className="input" value={form.fullName} onChange={update('fullName')} required style={{ marginBottom: 14 }} />

        <label className="label">Username</label>
        <input className="input" value={form.username} onChange={update('username')} required style={{ marginBottom: 14 }} />

        <label className="label">Email</label>
        <input type="email" className="input" value={form.email} onChange={update('email')} required style={{ marginBottom: 14 }} />

        <label className="label">Password</label>
        <input type="password" className="input" value={form.password} onChange={update('password')} required style={{ marginBottom: 14 }} />

        <label className="label">Role</label>
        <select className="input" value={form.role} onChange={update('role')} style={{ marginBottom: 14 }}>
          <option value="PATIENT">Patient</option>
          <option value="DOCTOR">Doctor</option>
          <option value="ADMIN">Admin</option>
        </select>

        {form.role === 'PATIENT' && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label className="label">Age</label>
              <input type="number" className="input" value={form.age} onChange={update('age')} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="label">Gender</label>
              <select className="input" value={form.gender} onChange={update('gender')}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        )}

        <label className="label">Contact Number</label>
        <input className="input" value={form.contact} onChange={update('contact')} style={{ marginBottom: 20 }} />

        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13.5, color: '#5b7570' }}>
        Already have an account? <Link to="/login" style={{ color: '#0f766e', fontWeight: 600 }}>Sign in</Link>
      </div>
    </AuthLayout>
  )
}
