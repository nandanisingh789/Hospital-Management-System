import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { patientApi } from '../api/services.js'

const emptyForm = { name: '', age: '', gender: '', contact: '', address: '', bloodGroup: '', medicalHistory: '' }

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await patientApi.getAll()
      setPatients(res.data)
    } catch (e) {
      setError('Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true) }
  const openEdit = (p) => {
    setForm({ name: p.name, age: p.age || '', gender: p.gender || '', contact: p.contact || '', address: p.address || '', bloodGroup: p.bloodGroup || '', medicalHistory: p.medicalHistory || '' })
    setEditingId(p.id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, age: form.age ? Number(form.age) : null }
    try {
      if (editingId) {
        await patientApi.update(editingId, payload)
      } else {
        await patientApi.create(payload)
      }
      setShowForm(false)
      load()
    } catch (e) {
      setError('Save failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient record?')) return
    await patientApi.delete(id)
    load()
  }

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24 }}>Patients</h1>
          <p style={{ color: '#5b7570', margin: 0 }}>Manage patient records and medical history</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Add Patient</button>
      </div>

      {error && <div style={{ color: '#dc2626', marginBottom: 12 }}>{error}</div>}

      <div className="card">
        {loading ? <p>Loading...</p> : patients.length === 0 ? (
          <p style={{ color: '#5b7570' }}>No patients registered yet.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Name</th><th>Age</th><th>Gender</th><th>Contact</th><th>Blood Group</th><th></th></tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.age || '—'}</td>
                  <td>{p.gender || '—'}</td>
                  <td>{p.contact || '—'}</td>
                  <td>{p.bloodGroup || '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)} style={{ marginRight: 6 }}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div style={overlayStyle} onClick={() => setShowForm(false)}>
          <div className="card" style={{ width: 440 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 16 }}>{editingId ? 'Edit Patient' : 'Add Patient'}</h3>
            <form onSubmit={handleSubmit}>
              <label className="label">Full Name</label>
              <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ marginBottom: 12 }} />
              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <label className="label">Age</label>
                  <input type="number" className="input" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Gender</label>
                  <select className="input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <option value="">Select</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Blood Group</label>
                  <input className="input" value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} placeholder="O+" />
                </div>
              </div>
              <label className="label">Contact</label>
              <input className="input" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} style={{ marginBottom: 12 }} />
              <label className="label">Address</label>
              <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ marginBottom: 12 }} />
              <label className="label">Medical History</label>
              <textarea className="input" rows={3} value={form.medicalHistory} onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })} style={{ marginBottom: 18 }} />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}

const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(15,49,45,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
}
