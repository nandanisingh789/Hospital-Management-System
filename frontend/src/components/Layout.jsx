import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/patients', label: 'Patients', icon: '🧑‍🤝‍🧑' },
  { to: '/doctors', label: 'Doctors', icon: '🩺' },
  { to: '/appointments', label: 'Appointments', icon: '📅' },
  { to: '/billing', label: 'Billing', icon: '💳' },
  { to: '/risk-prediction', label: 'AI Risk Check', icon: '🧠' },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <span style={{ fontSize: 22 }}>🏥</span>
          <div>
            <div style={styles.brandTitle}>HMS</div>
            <div style={styles.brandSub}>Hospital Mgmt</div>
          </div>
        </div>

        <nav style={{ marginTop: 30, flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              <span>{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={styles.userBox}>
          <div style={styles.avatar}>{user?.username?.[0]?.toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.userName}>{user?.username}</div>
            <div style={styles.userRole}>{user?.role}</div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleLogout} title="Logout">⏻</button>
        </div>
      </aside>

      <main style={styles.main}>{children}</main>
    </div>
  )
}

const styles = {
  shell: { display: 'flex', minHeight: '100vh' },
  sidebar: {
    width: 230,
    background: 'linear-gradient(180deg,#0f766e,#0b5750)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: '22px 16px',
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10, padding: '0 6px' },
  brandTitle: { fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 17 },
  brandSub: { fontSize: 11, opacity: 0.75 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '11px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
    color: 'rgba(255,255,255,0.85)', marginBottom: 4,
  },
  navItemActive: { background: 'rgba(255,255,255,0.16)', color: '#fff' },
  userBox: {
    display: 'flex', alignItems: 'center', gap: 10,
    borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 14, marginTop: 10,
  },
  avatar: {
    width: 34, height: 34, borderRadius: '50%', background: '#14b8a6',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0,
  },
  userName: { fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userRole: { fontSize: 11, opacity: 0.7 },
  main: { flex: 1, padding: '28px 34px', maxWidth: 1200 },
}
