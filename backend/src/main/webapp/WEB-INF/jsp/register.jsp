<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>Hospital Management System - Register</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg,#0f766e,#134e4a); height:100vh; margin:0; display:flex; align-items:center; justify-content:center; }
        .card { background:#fff; padding:40px; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.25); width:360px; }
        h2 { text-align:center; color:#0f766e; margin-bottom:5px; }
        p.sub { text-align:center; color:#777; font-size:13px; margin-top:0; margin-bottom:20px;}
        label { font-size:13px; color:#333; }
        input, select { width:100%; padding:10px; margin:6px 0 16px 0; border:1px solid #ccc; border-radius:6px; box-sizing:border-box; }
        button { width:100%; padding:11px; background:#0f766e; color:#fff; border:none; border-radius:6px; font-size:15px; cursor:pointer; }
        button:hover { background:#0d5c56; }
        .note { font-size:12px; color:#888; text-align:center; margin-top:14px; }
        .footer { text-align:center; margin-top:16px; font-size:13px; }
        .footer a { color:#0f766e; text-decoration:none; }
    </style>
</head>
<body>
<div class="card">
    <h2>&#127973; Create Account</h2>
    <p class="sub">Register as Patient / Doctor / Admin</p>

    <!-- Registration is handled by the REST API (/api/auth/register) so the
         React SPA and this JSP page share the same backend logic. -->
    <form id="registerForm">
        <label>Full Name</label>
        <input type="text" name="fullName" required />
        <label>Username</label>
        <input type="text" name="username" required />
        <label>Email</label>
        <input type="email" name="email" required />
        <label>Password</label>
        <input type="password" name="password" required />
        <label>Role</label>
        <select name="role">
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
            <option value="ADMIN">Admin</option>
        </select>
        <button type="submit">Register</button>
    </form>
    <p class="note" id="statusMsg"></p>
    <div class="footer">
        Already have an account? <a href="${pageContext.request.contextPath}/legacy-login">Login</a>
    </div>
</div>

<script>
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = e.target;
    const payload = {
        fullName: form.fullName.value,
        username: form.username.value,
        email: form.email.value,
        password: form.password.value,
        role: form.role.value
    };
    const statusEl = document.getElementById('statusMsg');
    try {
        const res = await fetch('${pageContext.request.contextPath}/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            statusEl.style.color = '#0f766e';
            statusEl.textContent = 'Registered successfully! Redirecting to login...';
            setTimeout(() => window.location.href = '${pageContext.request.contextPath}/legacy-login', 1200);
        } else {
            statusEl.style.color = '#dc2626';
            statusEl.textContent = data.error || 'Registration failed';
        }
    } catch (err) {
        statusEl.style.color = '#dc2626';
        statusEl.textContent = 'Network error: ' + err.message;
    }
});
</script>
</body>
</html>
