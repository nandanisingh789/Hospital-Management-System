<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>
<head>
    <title>Hospital Management System - Login</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg,#0f766e,#134e4a); height:100vh; margin:0; display:flex; align-items:center; justify-content:center; }
        .card { background:#fff; padding:40px; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.25); width:340px; }
        h2 { text-align:center; color:#0f766e; margin-bottom:5px; }
        p.sub { text-align:center; color:#777; font-size:13px; margin-top:0; margin-bottom:20px;}
        label { font-size:13px; color:#333; }
        input { width:100%; padding:10px; margin:6px 0 16px 0; border:1px solid #ccc; border-radius:6px; box-sizing:border-box; }
        button { width:100%; padding:11px; background:#0f766e; color:#fff; border:none; border-radius:6px; font-size:15px; cursor:pointer; }
        button:hover { background:#0d5c56; }
        .error { color:#dc2626; font-size:13px; text-align:center; margin-bottom:10px; }
        .footer { text-align:center; margin-top:16px; font-size:13px; }
        .footer a { color:#0f766e; text-decoration:none; }
    </style>
</head>
<body>
<div class="card">
    <h2>&#127973; HMS Login</h2>
    <p class="sub">Legacy Servlet + JSP + JDBC admin panel</p>

    <% if (request.getAttribute("error") != null) { %>
        <div class="error"><%= request.getAttribute("error") %></div>
    <% } %>

    <form action="${pageContext.request.contextPath}/legacy-login" method="post">
        <label>Username</label>
        <input type="text" name="username" required />
        <label>Password</label>
        <input type="password" name="password" required />
        <button type="submit">Login</button>
    </form>
    <div class="footer">
        Don't have an account? <a href="${pageContext.request.contextPath}/register">Register</a>
    </div>
</div>
</body>
</html>
