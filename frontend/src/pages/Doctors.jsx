import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { doctorApi } from '../api/services.js'

const emptyForm = { name: '', specialization: '', department: '', email: '', contact: '', experienceYears: '', consultationFee: '' }

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    setLoading(true)
    const res = await doctorApi.getAll()
    setDoctors(res.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true) }
  const openEdit = (d) => {
    setForm({
      name: d.name, specialization: d.specialization, department: d.department,
      email: d.email || '', contact: d.contact || '',
      experienceYears: d.experienceYears || '', consultationFee: d.consultationFee || '',
    })
    setEditingId(d.id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      experienceYears: form.experienceYears ? Number(form.experienceYears) : null,
      consultationFee: form.consultationFee ? Number(form.consultationFee) : null,
    }
    if (editingId) await doctorApi.update(editingId, payload)
    else await doctorApi.create(payload)
    setShowForm(false)
    load()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this doctor?')) return
    await doctorApi.delete(id)
    load()
  }

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24 }}>Doctors</h1>
          <p style={{ color: '#5b7570', margin: 0 }}>Manage doctor profiles and departments</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ Add Doctor</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
        {loading ? <p>Loading...</p> : doctors.map((d) => (
          <div key={d.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', background: '#0f766e18',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>🩺</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(d)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)}>×</button>
              </div>
            </div>
            <h3 style={{ marginTop: 12, fontSize: 17 }}>{d.name}</h3>
            <p style={{ color: '#0f766e', fontSize: 13, fontWeight: 600, margin: '2px 0' }}>{d.specialization}</p>
            <p style={{ color: '#5b7570', fontSize: 13, margin: '2px 0' }}>{d.department}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12.5, color: '#5b7570' }}>
              <span>{d.experienceYears || 0} yrs exp</span>
              <span>₹{d.consultationFee || 0} / visit</span>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={overlayStyle} onClick={() => setShowForm(false)}>
          <div className="card" style={{ width: 440 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 16 }}>{editingId ? 'Edit Doctor' : 'Add Doctor'}</h3>
            <form onSubmit={handleSubmit}>
              <label className="label">Full Name</label>
              <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ marginBottom: 12 }} />
              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <label className="label">Specialization</label>
                  <input className="input" required value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Department</label>
                  <input className="input" required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                </div>
              </div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ marginBottom: 12 }} />
              <label className="label">Contact</label>
              <input className="input" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} style={{ marginBottom: 12 }} />
              <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
                <div style={{ flex: 1 }}>
                  <label className="label">Experience (yrs)</label>
                  <input type="number" className="input" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Fee (₹)</label>
                  <input type="number" className="input" value={form.consultationFee} onChange={(e) => setForm({ ...form, consultationFee: e.target.value })} />
                </div>
              </div>
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
