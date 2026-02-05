# AuthB

**AuthB** is a **modular authentication API** built on the **MERN stack**. It enables **third-party client applications** to integrate secure authentication flows, including signup, login, password reset, and email-based two-factor authentication (2FA).

---

## Features

### **Developer Dashboard**
- Register as a developer (`DevUser`)
- Create, list, delete, and manage client applications
- Obtain **API keys** for integrating AuthB into your applications

### **Client App Authentication**
- End-user registration and login, **scoped per client app** (`appId`)
- Email-based **Two-Factor Authentication (2FA)**
- Password reset flows
- **JWT-based session management**
- **reCAPTCHA** support on the frontend

### **Security**
- Password hashing via **bcrypt** (optional **argon2**)
- **JWTs** with short-lived access tokens and refresh token rotation
- API keys hashed with **SHA-256**
- Rate limiting on critical endpoints

---

## Project Status

🚧 **Work in Progress**

- **Fully functional** for developer and end-user authentication flows
- Dashboard (`DevUser`) and Client App (`User`) APIs implemented
- Email-based features (2FA, password reset) work with **verified addresses only** due to **AWS SES sandbox restrictions**
- **Local testing** supported; deployment pending
- Rate limiters are defined, but only the **OTP limiter is applied**; global/signup/login limiters are not yet active

---

## Demo Videos

### Sign Up
https://github.com/user-attachments/assets/d646c4fd-c95b-4411-9c66-481f8367b127

### Login
https://github.com/user-attachments/assets/6d035e47-329b-48b3-a804-4af65e03a7b9

### Password Reset
https://github.com/user-attachments/assets/170144c7-1e49-4a52-8e84-8cef4c39512b

### Dashboard
https://github.com/user-attachments/assets/bf054def-68d2-4910-803f-a99821ebe600

---

## Security Notice

- Emails are restricted to **verified addresses** (AWS SES sandbox)
- **Rate limiting** on OTP verification prevents abuse
- **Passwords** are securely hashed
- **JWT tokens** are transmitted over HTTPS with short expiration
- **reCAPTCHA** protects against automated login attempts
- **No secrets or credentials** are stored in the repository

---

## Tech Stack

### **Frontend**
- **React** – UI library
- **Tailwind CSS** – Styling
- **Vite** – Dev server and build tool
- **React Router DOM** – Client-side routing
- **Zustand** – State management
- **Axios** – API requests with credentials
- **react-google-recaptcha** – Optional bot protection

### **Backend**
- **Node.js & Express** – Server runtime & framework
- **MongoDB + Mongoose** – Database
- **JWT (jsonwebtoken)** – Token-based authentication
- **bcrypt / argon2** – Password hashing
- **AWS SES / Nodemailer** – Email delivery for 2FA & password reset

### **Security & Authentication**
- **Developer JWTs**: `accessToken` + `refreshToken`, `httpOnly` cookies
- **End-user JWTs**: Scoped by `appId`
- **API Key Verification**: SHA-256 hash, `x-api-key` header
- **Verification OTP**: 6-digit code with 10-minute expiry
- **Password Reset Tokens**: 15-minute expiry, crypto-generated

---

## Project Structure

```
AuthB/
├─ backend/
│  ├─ controllers/        # DevUser & User auth logic
│  ├─ db/connectDB.js     # MongoDB connection
│  ├─ mail/               # SES & email templates
│  ├─ middleware/         # Verify tokens, rate limiters
│  ├─ models/             # DevUser, ClientApp, User schemas
│  ├─ routes/             # /api/dashboard, /api/dashboard/apps, /api/apps/auth
│  ├─ utils/              # JWT helpers, OTP generator
│  └─ index.js
├─ frontend/
│  ├─ src/
│  │  ├─ pages/           # Login, Signup, Dashboard, ResetPassword, VerifyEmail
│  │  ├─ components/      # Input, LoadingSpinner, PasswordStrengthMeter, AppCard
│  │  └─ store/           # auth-store.js, app-store.js
│  └─ vite.config.js
└─ README.md
```

---

## API Routes Overview

### **Developer Dashboard (`/api/dashboard`)**
- `POST /signup` – DevUser signup
- `POST /login` – DevUser login
- `POST /logout` – DevUser logout
- `POST /verify-email` – OTP verification (rate-limited)
- `POST /resend-otp` – Resend OTP
- `POST /forgot-password` – Forgot password
- `POST /reset-password/:token` – Reset password
- `GET /refresh-token` – Refresh JWT
- `GET /check-auth` – Session check (JWT required)

### **Client App Management (`/api/dashboard/apps`)**
- `POST /create-app` – Create client app
- `GET /` – List apps
- `DELETE /:appId` – Delete app
- `PATCH /:appId` – Regenerate API key

### **End-User Authentication (`/api/apps/auth`, `x-api-key` required)**
- `POST /register` – End-user signup
- `POST /login` – End-user login
- `POST /verify-email` – OTP verification (rate-limited)
- `POST /resend-otp` – Resend OTP
- `POST /forgot-password` – Forgot password
- `POST /reset-password/:token` – Reset password
- `GET /refresh-token` – Refresh JWT
- `GET /me` – Current user info (JWT cookie required)
- `GET /logout` – Logout user

> **Note:** Only OTP verification uses the limiter; signup/login/global limiters are defined but not yet applied.

---

## Environment Variables

- `MONGO_URI` – MongoDB connection
- `PORT` – Server port
- `DASHBOARD_ACCESS_JWT_SECRET` – DevUser JWT secret
- `USER_ACCESS_JWT_SECRET` – End-user JWT secret
- `CLIENT_URL` – Frontend URL for email links
- AWS SES credentials & region

---

## License

This project is open source and available under the MIT License.
