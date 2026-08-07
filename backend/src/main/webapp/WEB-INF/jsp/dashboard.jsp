<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>Hospital Management System - Dashboard</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background:#f4f6f8; margin:0; }
        .navbar { background:#0f766e; color:#fff; padding:16px 30px; display:flex; justify-content:space-between; align-items:center; }
        .navbar a { color:#fff; text-decoration:none; background:rgba(255,255,255,0.15); padding:8px 14px; border-radius:6px; }
        .container { padding:30px; }
        .welcome { font-size:22px; margin-bottom:6px; }
        .role-badge { display:inline-block; background:#0f766e; color:#fff; padding:3px 10px; border-radius:12px; font-size:12px; }
        .grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:18px; margin-top:24px; }
        .card { background:#fff; border-radius:10px; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
        .card h3 { margin-top:0; color:#0f766e; }
        .card p { color:#666; font-size:14px; }
    </style>
</head>
<body>
<div class="navbar">
    <div>&#127973; Hospital Management System</div>
    <a href="${pageContext.request.contextPath}/legacy-login">Logout</a>
</div>
<div class="container">
    <div class="welcome">Welcome, <%= session.getAttribute("username") %>
        <span class="role-badge"><%= session.getAttribute("role") %></span>
    </div>
    <p>This is the legacy Servlet/JSP admin view. The full interactive dashboard
       (Patients, Doctors, Appointments, Billing, AI Risk Prediction) lives in the React app.</p>

    <div class="grid">
        <div class="card">
            <h3>Patients</h3>
            <p>Manage patient records, medical history, and registrations.</p>
        </div>
        <div class="card">
            <h3>Doctors</h3>
            <p>Manage doctor profiles, departments, and specializations.</p>
        </div>
        <div class="card">
            <h3>Appointments</h3>
            <p>Book, reschedule, or cancel patient-doctor appointments.</p>
        </div>
        <div class="card">
            <h3>Billing (Razorpay)</h3>
            <p>Generate bills and collect payments securely online.</p>
        </div>
        <div class="card">
            <h3>AI Risk Prediction</h3>
            <p>Scikit-learn model predicts patient health risk tier (Low/Medium/High).</p>
        </div>
    </div>
</div>
</body>
</html>
