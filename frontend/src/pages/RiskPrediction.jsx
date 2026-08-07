import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout.jsx'
import { mlApi, patientApi } from '../api/services.js'

export default function RiskPrediction() {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [form, setForm] = useState({ age: '', bmi: '', bloodPressure: '', glucoseLevel: '', heartRate: '' })
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    patientApi.getAll().then((res) => setPatients(res.data))
  }, [])

  useEffect(() => {
    if (selectedPatient) {
      mlApi.history(selectedPatient).then((res) => setHistory(res.data)).catch(() => setHistory([]))
    } else {
      setHistory([])
    }
  }, [selectedPatient])

  const handlePredict = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    if (!selectedPatient) { setError('Select a patient first'); return }
    setLoading(true)
    try {
      const res = await mlApi.predictRisk({
        patientId: selectedPatient,
        age: Number(form.age),
        bmi: Number(form.bmi),
        bloodPressure: Number(form.bloodPressure),
        glucoseLevel: Number(form.glucoseLevel),
        heartRate: Number(form.heartRate),
      })
      setResult(res.data)
      mlApi.history(selectedPatient).then((r) => setHistory(r.data))
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed. Is the Python ML service running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <h1 style={{ fontSize: 24 }}>🧠 AI Patient Risk Prediction</h1>
      <p style={{ color: '#5b7570', marginTop: 0, marginBottom: 20 }}>
        A Scikit-learn RandomForest model classifies patient risk tier (Low / Medium / High)
        from key vitals — served by a Python Flask microservice.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 20, alignItems: 'flex-start' }}>
        <div className="card">
          <label className="label">Patient</label>
          <select className="input" value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} style={{ marginBottom: 14 }}>
            <option value="">Select patient</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <form onSubmit={handlePredict}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label className="label">Age</label>
                <input type="number" className="input" required value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="label">BMI</label>
                <input type="number" step="0.1" className="input" required value={form.bmi} onChange={(e) => setForm({ ...form, bmi: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label className="label">Blood Pressure</label>
                <input type="number" className="input" required value={form.bloodPressure} onChange={(e) => setForm({ ...form, bloodPressure: e.target.value })} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="label">Glucose (mg/dL)</label>
                <input type="number" className="input" required value={form.glucoseLevel} onChange={(e) => setForm({ ...form, glucoseLevel: e.target.value })} />
              </div>
            </div>
            <label className="label">Heart Rate (bpm)</label>
            <input type="number" className="input" required value={form.heartRate} onChange={(e) => setForm({ ...form, heartRate: e.target.value })} style={{ marginBottom: 18 }} />

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Predicting...' : 'Predict Risk Level'}
            </button>
          </form>
          {error && <p style={{ marginTop: 12, fontSize: 13.5, color: '#dc2626' }}>{error}</p>}
        </div>

        <div>
          {result && (
            <div className="card" style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 34 }}>
                  {result.riskLevel === 'HIGH' ? '🔴' : result.riskLevel === 'MEDIUM' ? '🟡' : '🟢'}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#5b7570', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Predicted Risk Level</div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{result.riskLevel}</div>
                  {result.confidence != null && (
                    <div style={{ fontSize: 13, color: '#5b7570' }}>Confidence: {(result.confidence * 100).toFixed(1)}%</div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <h3 style={{ marginBottom: 14 }}>Prediction History</h3>
            {!selectedPatient ? (
              <p style={{ color: '#5b7570' }}>Select a patient to view past predictions.</p>
            ) : history.length === 0 ? (
              <p style={{ color: '#5b7570' }}>No predictions yet for this patient.</p>
            ) : (
              <table>
                <thead><tr><th>Date</th><th>Age</th><th>BMI</th><th>BP</th><th>Glucose</th><th>Risk</th></tr></thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id}>
                      <td>{new Date(h.predictedAt).toLocaleDateString()}</td>
                      <td>{h.age}</td>
                      <td>{h.bmi}</td>
                      <td>{h.bloodPressure}</td>
                      <td>{h.glucoseLevel}</td>
                      <td><span className={`badge badge-${h.riskLevel?.toLowerCase()}`}>{h.riskLevel}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
