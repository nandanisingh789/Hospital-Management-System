# 🏥 Hospital Management System — Full Stack Web Application

A complete full-stack Hospital Management System built with **Core Java, Spring Boot,
Hibernate ORM, Spring MVC, Servlets, JSP, JDBC, MySQL, React JS, Python (Scikit-learn),
and the Razorpay API.**

Built as a portfolio-ready project mirroring a production-grade Student Management
System architecture, adapted to the hospital domain.

---

## ✨ Features

- **MVC Architecture** — Java entity models, JSP/React views, Servlet/REST controllers
- **Core CRUD Modules** — Patients, Doctors, Appointments with normalized MySQL schema (6 tables, foreign keys, joins)
- **Authentication** — Register / Login / Forgot Password / Reset Password with JWT + BCrypt, role-based access (Admin / Doctor / Patient)
- **AI Risk Prediction** — Python Scikit-learn RandomForest model predicts patient health risk tier (Low/Medium/High) from vitals (age, BMI, blood pressure, glucose, heart rate), served via a Flask microservice
- **Razorpay Payment Integration** — Order creation, checkout, and signature verification for hospital bill payments
- **Legacy Servlet + JSP pages** — classic MVC login/register/dashboard pages alongside the React SPA (matches the Servlet/JSP/JDBC internship stack)
- **React JS Frontend** — clean dashboard UI for all modules

---

## 🧱 Tech Stack

| Layer          | Technology |
|----------------|------------|
| Backend        | Core Java 17, Spring Boot 3, Spring MVC, Servlets |
| ORM            | Hibernate (via Spring Data JPA) |
| Database       | MySQL, raw JDBC (legacy servlet) |
| Frontend       | React JS (Vite), React Router |
| AI/ML          | Python 3, Scikit-learn, Flask |
| Payments       | Razorpay API |
| Auth           | JWT, Spring Security, BCrypt |
| Deployment     | Docker, Render |

---

## 📁 Project Structure

```
hospital-management-system/
├── backend/                # Spring Boot (Maven, war packaging)
│   ├── src/main/java/com/hms/
│   │   ├── entity/          # Patient, Doctor, Appointment, Bill, User, RiskPrediction
│   │   ├── repository/      # Spring Data JPA (Hibernate) repositories
│   │   ├── service/         # Business logic
│   │   ├── controller/      # REST controllers + JSP page controller
│   │   ├── servlet/         # Legacy raw Servlet + JDBC login
│   │   ├── security/        # JWT auth filter
│   │   └── config/          # Security, Razorpay, MVC/JSP, RestTemplate config
│   └── src/main/webapp/WEB-INF/jsp/  # login.jsp, register.jsp, dashboard.jsp
├── frontend/                # React (Vite)
│   └── src/{pages,components,api,context}
├── ml-service/               # Python Flask + Scikit-learn microservice
│   ├── train_model.py        # generates synthetic dataset + trains model.pkl
│   └── app.py                 # /predict REST endpoint
├── database/schema.sql       # MySQL DDL + seed data
├── render.yaml                # One-click Render Blueprint deployment
└── README.md
```

---

## 🚀 Local Setup

### 1. Database
```bash
mysql -u root -p < database/schema.sql
```

### 2. Python ML microservice
```bash
cd ml-service
pip install -r requirements.txt
python train_model.py     # trains model.pkl (run once)
python app.py              # runs on http://localhost:5001
```

### 3. Spring Boot backend
Set your DB credentials and Razorpay test keys as environment variables
(or edit `backend/src/main/resources/application.properties` directly):

```bash
export JDBC_URL="jdbc:mysql://localhost:3306/hospital_management_db"
export JDBC_USER=root
export JDBC_PASSWORD=yourpassword
export RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
export RAZORPAY_KEY_SECRET=your_test_secret
export ML_SERVICE_URL=http://localhost:5001

cd backend
mvn spring-boot:run   # runs on http://localhost:8080
```
Get free Razorpay **test mode** API keys at https://dashboard.razorpay.com/app/keys.

- REST API base: `http://localhost:8080/api`
- Legacy JSP pages: `http://localhost:8080/legacy-login`, `/register`, `/dashboard`

### 4. React frontend
```bash
cd frontend
cp .env.example .env       # then edit VITE_API_BASE_URL if needed
npm install
npm run dev                 # runs on http://localhost:3000
```

---

## ☁️ Deploying (Render)

This repo includes a `render.yaml` Blueprint that deploys all three services
(backend, ml-service, frontend) plus a MySQL database in one go:

1. Push this project to a **new GitHub repository**.
2. In the Render dashboard: **New → Blueprint** → select your repo.
3. Render reads `render.yaml` and provisions all services automatically.
4. Fill in the marked environment variables (`JDBC_URL`, `RAZORPAY_KEY_ID`,
   `RAZORPAY_KEY_SECRET`, etc.) in the Render dashboard — these are left blank
   in the Blueprint for security.
5. Once deployed, update the frontend's `VITE_API_BASE_URL` to point at your
   live backend URL, and redeploy the frontend service.

You can also deploy each service manually as three separate Render Web
Services (Docker runtime for backend & ml-service, Static Site for frontend)
if you prefer not to use the Blueprint.

---

## 📤 Pushing to GitHub

```bash
cd hospital-management-system
git init
git add .
git commit -m "Initial commit: Hospital Management System - full stack"
git branch -M main
git remote add origin https://github.com/<your-username>/hospital-management-system.git
git push -u origin main
```

---

## 🔑 Default Roles

| Role    | Access |
|---------|--------|
| ADMIN   | Full access — manage patients, doctors, appointments, billing |
| DOCTOR  | View assigned appointments, patient details |
| PATIENT | Book appointments, view own bills & risk predictions |

Register a new account at `/register` (React) or `http://localhost:8080/register` (JSP) and choose a role.

---

## 📝 Notes

- `spring.jpa.hibernate.ddl-auto=update` will auto-create/update tables from
  the entity classes on first run — running `database/schema.sql` manually is
  optional but recommended for the seed data.
- The **Forgot Password** flow returns the reset token directly in the API
  response (instead of emailing it) since no SMTP server is configured by
  default — wire up `JavaMailSender` in `AuthService` for production use.
- The legacy `/legacy-login` Servlet uses an optional `password_plain_demo`
  column purely to keep that standalone JDBC demo self-contained; the real
  authentication flow (used by React) is BCrypt-hashed via `AuthController`.
