import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { appointmentApi, patientApi, doctorApi } from '../api/services.js'

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ patientId: '', doctorId: '', appointmentDate: '', reason: '' })

  const load = async () => {
    setLoading(true)
    const [apptRes, patientsRes, doctorsRes] = await Promise.all([
      appointmentApi.getAll(), patientApi.getAll(), doctorApi.getAll(),
    ])
    setAppointments(apptRes.data)
    setPatients(patientsRes.data)
    setDoctors(doctorsRes.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleBook = async (e) => {
    e.preventDefault()
    await appointmentApi.book(form.patientId, form.doctorId, {
      appointmentDate: form.appointmentDate,
      reason: form.reason,
    })
    setShowForm(false)
    setForm({ patientId: '', doctorId: '', appointmentDate: '', reason: '' })
    load()
  }

  const updateStatus = async (id, status) => {
    await appointmentApi.updateStatus(id, status)
    load()
  }

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24 }}>Appointments</h1>
          <p style={{ color: '#5b7570', margin: 0 }}>Book and track patient-doctor appointments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Book Appointment</button>
      </div>

      <div className="card">
        {loading ? <p>Loading...</p> : appointments.length === 0 ? (
          <p style={{ color: '#5b7570' }}>No appointments booked yet.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Reason</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.patient?.name}</td>
                  <td>{a.doctor?.name}</td>
                  <td>{new Date(a.appointmentDate).toLocaleString()}</td>
                  <td>{a.reason || '—'}</td>
                  <td><span className={`badge badge-${a.status?.toLowerCase()}`}>{a.status}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    {a.status === 'SCHEDULED' && (
                      <>
                        <button className="btn btn-outline btn-sm" onClick={() => updateStatus(a.id, 'COMPLETED')} style={{ marginRight: 6 }}>Complete</button>
                        <button className="btn btn-danger btn-sm" onClick={() => updateStatus(a.id, 'CANCELLED')}>Cancel</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div style={overlayStyle} onClick={() => setShowForm(false)}>
          <div className="card" style={{ width: 420 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 16 }}>Book Appointment</h3>
            <form onSubmit={handleBook}>
              <label className="label">Patient</label>
              <select className="input" required value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} style={{ marginBottom: 12 }}>
                <option value="">Select patient</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <label className="label">Doctor</label>
              <select className="input" required value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} style={{ marginBottom: 12 }}>
                <option value="">Select doctor</option>
                {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}
              </select>
              <label className="label">Date & Time</label>
              <input type="datetime-local" className="input" required value={form.appointmentDate} onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })} style={{ marginBottom: 12 }} />
              <label className="label">Reason for Visit</label>
              <textarea className="input" rows={2} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} style={{ marginBottom: 18 }} />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Book</button>
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
