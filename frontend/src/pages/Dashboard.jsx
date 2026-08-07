import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { patientApi, doctorApi, appointmentApi, billingApi } from '../api/services.js'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, revenue: 0 })
  const [recentAppointments, setRecentAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [patientsRes, doctorsRes, apptRes] = await Promise.all([
          patientApi.getAll(),
          doctorApi.getAll(),
          appointmentApi.getAll(),
        ])
        setStats((s) => ({
          ...s,
          patients: patientsRes.data.length,
          doctors: doctorsRes.data.length,
          appointments: apptRes.data.length,
        }))
        setRecentAppointments(apptRes.data.slice(-5).reverse())
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const statCards = [
    { label: 'Total Patients', value: stats.patients, icon: '🧑‍🤝‍🧑', color: '#0f766e' },
    { label: 'Total Doctors', value: stats.doctors, icon: '🩺', color: '#0369a1' },
    { label: 'Appointments', value: stats.appointments, icon: '📅', color: '#b45309' },
  ]

  return (
    <Layout>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Welcome, {user?.username} 👋</h1>
      <p style={{ color: '#5b7570', marginTop: 0 }}>
        Here's what's happening across the hospital today.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18, marginTop: 24 }}>
        {statCards.map((s) => (
          <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: `${s.color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{loading ? '—' : s.value}</div>
              <div style={{ fontSize: 13, color: '#5b7570' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 14 }}>Recent Appointments</h3>
        {recentAppointments.length === 0 ? (
          <p style={{ color: '#5b7570', fontSize: 14 }}>No appointments yet.</p>
        ) : (
          <table>
            <thead>
              <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recentAppointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.patient?.name}</td>
                  <td>{a.doctor?.name}</td>
                  <td>{new Date(a.appointmentDate).toLocaleString()}</td>
                  <td><span className={`badge badge-${a.status?.toLowerCase()}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}
