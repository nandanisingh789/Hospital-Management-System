-- ============================================================
-- Hospital Management System - MySQL Schema
-- Normalized relational design with 5+ tables, foreign keys,
-- and indexed joins (mirrors the Student Management System's
-- CRUD + normalized schema approach).
-- ============================================================

CREATE DATABASE IF NOT EXISTS hospital_management_db;
USE hospital_management_db;

-- ---------------------------------------------------------------
-- 1. users  -> authentication + role-based access (Admin/Doctor/Patient)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,       -- BCrypt hash (used by Spring Boot REST auth)
    role ENUM('ADMIN','DOCTOR','PATIENT') NOT NULL,
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    -- optional demo-only column used by the legacy Servlet/JDBC login page
    password_plain_demo VARCHAR(255)
);

-- ---------------------------------------------------------------
-- 2. patients
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS patients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender VARCHAR(20),
    contact VARCHAR(20),
    address VARCHAR(255),
    blood_group VARCHAR(5),
    medical_history TEXT,
    user_id BIGINT UNIQUE,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------
-- 3. doctors
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    contact VARCHAR(20),
    experience_years INT,
    consultation_fee DOUBLE,
    user_id BIGINT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ---------------------------------------------------------------
-- 4. appointments  -> JOIN between patients and doctors
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_date DATETIME NOT NULL,
    reason VARCHAR(500),
    status ENUM('SCHEDULED','COMPLETED','CANCELLED') DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    INDEX idx_appt_patient (patient_id),
    INDEX idx_appt_doctor (doctor_id)
);

-- ---------------------------------------------------------------
-- 5. bills  -> Razorpay payment integration
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    appointment_id BIGINT,
    amount DOUBLE NOT NULL,
    description VARCHAR(500),
    status ENUM('PENDING','PAID','FAILED') DEFAULT 'PENDING',
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    paid_at DATETIME,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    INDEX idx_bill_patient (patient_id)
);

-- ---------------------------------------------------------------
-- 6. risk_predictions  -> AI/ML enrollment-style prediction, hospital domain
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS risk_predictions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    age INT,
    bmi DOUBLE,
    blood_pressure INT,
    glucose_level INT,
    heart_rate INT,
    risk_level VARCHAR(20) NOT NULL,   -- LOW / MEDIUM / HIGH (from Python Scikit-learn model)
    confidence DOUBLE,
    predicted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- ============================================================
-- Sample seed data
-- ============================================================

-- Admin user (password: Admin@123 -> BCrypt hash generated at runtime by the
-- app when you register via /api/auth/register; the row below is illustrative)
INSERT INTO users (username, email, password, role, password_plain_demo)
VALUES ('admin', 'admin@hms.com', '$2a$10$replace_with_real_bcrypt_hash', 'ADMIN', 'Admin@123')
ON DUPLICATE KEY UPDATE username = username;

INSERT INTO doctors (name, specialization, department, email, contact, experience_years, consultation_fee)
VALUES
 ('Dr. Ramesh Gupta', 'Cardiologist', 'Cardiology', 'ramesh.gupta@hms.com', '9812345678', 12, 800.0),
 ('Dr. Priya Sharma', 'Neurologist', 'Neurology', 'priya.sharma@hms.com', '9812345679', 8, 900.0),
 ('Dr. Arjun Mehta', 'Orthopedic Surgeon', 'Orthopedics', 'arjun.mehta@hms.com', '9812345680', 15, 1000.0),
 ('Dr. Sneha Rao', 'General Physician', 'General Medicine', 'sneha.rao@hms.com', '9812345681', 6, 500.0)
ON DUPLICATE KEY UPDATE name = name;

INSERT INTO patients (name, age, gender, contact, address, blood_group, medical_history)
VALUES
 ('Rohit Verma', 34, 'Male', '9911223344', 'Delhi, India', 'B+', 'No major history'),
 ('Anjali Singh', 28, 'Female', '9911223355', 'Ghaziabad, UP', 'O+', 'Mild asthma')
ON DUPLICATE KEY UPDATE name = name;
