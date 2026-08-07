import React from 'react'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.logo}>🏥 Hospital Management System</div>
        <h1 style={styles.headline}>Care, coordinated.</h1>
        <p style={styles.tagline}>
          Patients, doctors, appointments, billing and AI-driven risk
          insights — all in one place.
        </p>
        <ul style={styles.featureList}>
          <li>✔ Role-based access for Admins, Doctors & Patients</li>
          <li>✔ Secure Razorpay-powered billing</li>
          <li>✔ Scikit-learn patient risk prediction</li>
        </ul>
      </div>
      <div style={styles.right}>
        <div className="card" style={styles.card}>
          <h2 style={{ fontSize: 22, marginBottom: 4 }}>{title}</h2>
          <p style={{ color: '#5b7570', fontSize: 13.5, marginTop: 0, marginBottom: 22 }}>{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  left: {
    flex: 1,
    background: 'linear-gradient(135deg,#0f766e,#0b5750)',
    color: '#fff',
    padding: '60px 50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logo: { fontSize: 15, fontWeight: 600, opacity: 0.85, marginBottom: 30 },
  headline: { fontFamily: 'Poppins, sans-serif', fontSize: 40, marginBottom: 14, maxWidth: 420 },
  tagline: { fontSize: 15, opacity: 0.9, maxWidth: 380, lineHeight: 1.6 },
  featureList: { listStyle: 'none', padding: 0, marginTop: 28, fontSize: 14, lineHeight: 2.1, opacity: 0.95 },
  right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30 },
  card: { width: 380, maxWidth: '100%' },
}
