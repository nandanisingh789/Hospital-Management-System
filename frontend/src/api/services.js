import api from './axios'

// ---------- Auth ----------
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
}

// ---------- Patients ----------
export const patientApi = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
}

// ---------- Doctors ----------
export const doctorApi = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
}

// ---------- Appointments ----------
export const appointmentApi = {
  getAll: () => api.get('/appointments'),
  getByPatient: (patientId) => api.get(`/appointments/patient/${patientId}`),
  getByDoctor: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
  book: (patientId, doctorId, data) =>
    api.post(`/appointments/book?patientId=${patientId}&doctorId=${doctorId}`, data),
  updateStatus: (id, status, notes) =>
    api.put(`/appointments/${id}/status`, { status, notes }),
  cancel: (id) => api.delete(`/appointments/${id}`),
}

// ---------- Billing / Razorpay ----------
export const billingApi = {
  getByPatient: (patientId) => api.get(`/payments/patient/${patientId}`),
  createOrder: (data) => api.post('/payments/create-order', data),
  verify: (data) => api.post('/payments/verify', data),
}

// ---------- ML Risk Prediction ----------
export const mlApi = {
  predictRisk: (data) => api.post('/ml/predict-risk', data),
  history: (patientId) => api.get(`/ml/history/${patientId}`),
}
