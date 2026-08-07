package com.hms.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 * Classic Servlet + JSP + raw JDBC login page - kept alongside the Spring
 * Boot REST API to demonstrate the plain MVC (Model-View-Controller) style
 * used during the internship: Servlet controller -> JDBC model -> JSP view.
 *
 * NOTE: passwords here are compared in plain text purely to keep this demo
 * servlet self-contained; the production auth flow (used by the React app)
 * is AuthController, which uses BCrypt-hashed passwords via Spring Security.
 */
@WebServlet("/legacy-login")
public class LegacyLoginServlet extends HttpServlet {

    private static final String DB_URL = System.getenv().getOrDefault(
            "JDBC_URL", "jdbc:mysql://localhost:3306/hospital_management_db");
    private static final String DB_USER = System.getenv().getOrDefault("JDBC_USER", "root");
    private static final String DB_PASSWORD = System.getenv().getOrDefault("JDBC_PASSWORD", "");

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        req.getRequestDispatcher("/WEB-INF/jsp/login.jsp").forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String username = req.getParameter("username");
        String password = req.getParameter("password");

        String sql = "SELECT id, username, role FROM users WHERE username = ? AND password_plain_demo = ?";

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, username);
            stmt.setString(2, password);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    HttpSession session = req.getSession();
                    session.setAttribute("username", rs.getString("username"));
                    session.setAttribute("role", rs.getString("role"));
                    resp.sendRedirect(req.getContextPath() + "/dashboard");
                } else {
                    req.setAttribute("error", "Invalid username or password");
                    req.getRequestDispatcher("/WEB-INF/jsp/login.jsp").forward(req, resp);
                }
            }
        } catch (Exception e) {
            req.setAttribute("error", "Database error: " + e.getMessage()
                    + " (Tip: use the React app / REST API for the full login flow - "
                    + "this legacy servlet needs the optional password_plain_demo demo column.)");
            req.getRequestDispatcher("/WEB-INF/jsp/login.jsp").forward(req, resp);
        }
    }
}
