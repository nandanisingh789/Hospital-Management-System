import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { billingApi, patientApi } from '../api/services.js'

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function Billing() {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [bills, setBills] = useState([])
  const [form, setForm] = useState({ amount: '', description: '' })
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    patientApi.getAll().then((res) => setPatients(res.data))
  }, [])

  useEffect(() => {
    if (selectedPatient) {
      billingApi.getByPatient(selectedPatient).then((res) => setBills(res.data))
    } else {
      setBills([])
    }
  }, [selectedPatient])

  const handlePay = async (e) => {
    e.preventDefault()
    setMessage('')
    if (!selectedPatient) { setMessage('Select a patient first'); return }
    setProcessing(true)

    try {
      const scriptOk = await loadRazorpayScript()
      if (!scriptOk) {
        setMessage('Failed to load Razorpay checkout script.')
        setProcessing(false)
        return
      }

      const orderRes = await billingApi.createOrder({
        patientId: selectedPatient,
        amount: Number(form.amount),
        description: form.description,
      })
      const { razorpayOrderId, razorpayKeyId, amount } = orderRes.data

      const options = {
        key: razorpayKeyId,
        amount: Math.round(amount * 100),
        currency: 'INR',
        name: 'Hospital Management System',
        description: form.description || 'Hospital Bill Payment',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            await billingApi.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            setMessage('Payment successful ✅')
            billingApi.getByPatient(selectedPatient).then((res) => setBills(res.data))
          } catch (err) {
            setMessage('Payment verification failed')
          }
        },
        theme: { color: '#0f766e' },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      setMessage(err.response?.data?.error || 'Could not initiate payment')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Layout>
      <h1 style={{ fontSize: 24 }}>Billing & Payments</h1>
      <p style={{ color: '#5b7570', marginTop: 0, marginBottom: 20 }}>
        Generate bills and collect payments securely via Razorpay.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, alignItems: 'flex-start' }}>
        <div className="card">
          <label className="label">Patient</label>
          <select className="input" value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} style={{ marginBottom: 14 }}>
            <option value="">Select patient</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <form onSubmit={handlePay}>
            <label className="label">Amount (₹)</label>
            <input type="number" min="1" className="input" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} style={{ marginBottom: 14 }} />
            <label className="label">Description</label>
            <input className="input" placeholder="Consultation fee, lab test, etc." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ marginBottom: 18 }} />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={processing}>
              {processing ? 'Processing...' : 'Pay with Razorpay'}
            </button>
          </form>
          {message && <p style={{ marginTop: 12, fontSize: 13.5, color: message.includes('successful') ? '#16a34a' : '#dc2626' }}>{message}</p>}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 14 }}>Bill History</h3>
          {!selectedPatient ? (
            <p style={{ color: '#5b7570' }}>Select a patient to view their bills.</p>
          ) : bills.length === 0 ? (
            <p style={{ color: '#5b7570' }}>No bills for this patient yet.</p>
          ) : (
            <table>
              <thead><tr><th>Description</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {bills.map((b) => (
                  <tr key={b.id}>
                    <td>{b.description || '—'}</td>
                    <td>₹{b.amount}</td>
                    <td><span className={`badge badge-${b.status?.toLowerCase()}`}>{b.status}</span></td>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  )
}
