# AuthB

AuthB is a secure authentication platform built on the **MERN stack**. It provides robust sign-in and login functionality with modern security features.

---

## Features

- **Two-Factor Authentication (2FA)**: Verification codes sent to the user's email.
- **JWT Token Management**: Securely manages user sessions.
- **Password Reset**: Allows users to reset their password with email notifications.
- **reCAPTCHA Integration**: Added on the frontend for enhanced security.

---

## Project Status

🚧 **Work in progress**  

- Auth B is currently being developed as a **modular authentication API**.  
- At this stage, the application is **fully functional for authentication flows only** (sign up, login, password reset, 2FA).  
- The project is **not deployed**; at the moment, **only the frontend can be tested locally**, while backend email-based features are limited to verified addresses.  
- Both backend services and UI components are actively evolving.

> **Note:**  
> Email-based features (2FA, password reset) are demonstrated using verified email addresses due to **AWS SES sandbox restrictions**.

---

## Demo Videos

### Sign Up
https://github.com/user-attachments/assets/d646c4fd-c95b-4411-9c66-481f8367b127

### Login
https://github.com/user-attachments/assets/6d035e47-329b-48b3-a804-4af65e03a7b9

### Password Reset
https://github.com/user-attachments/assets/170144c7-1e49-4a52-8e84-8cef4c39512b

### App Creation
https://github.com/user-attachments/assets/bf054def-68d2-4910-803f-a99821ebe600

---

## Security Notice

- **AWS SES sandbox mode** restricts email delivery to verified addresses.  
- **Rate-limiting** is enabled on login and password reset endpoints to prevent abuse.  
- **Passwords** are securely hashed using bcrypt or argon2.  
- **JWT tokens** are used for session management; they should be transmitted over HTTPS with short expiration times.  
- reCAPTCHA prevents automated login attempts.  
- No secrets or sensitive credentials are included in the repository.

---

## Tech Stack

### Frontend
- **React** – UI library for building dynamic interfaces.  
- **Tailwind CSS** – Utility-first CSS framework for styling.  
- **React Router DOM** – Client-side routing.  
- **Vite** – Fast development server and build tool.  

### Backend
- **Node.js & Express** – Server-side runtime and framework.  
- **MongoDB + Mongoose** – NoSQL database and ORM for managing data.  
- **JWT (jsonwebtoken)** – Token-based authentication.  
- **AWS SES (via Nodemailer)** – Email delivery for 2FA and password resets.  

### Security & Authentication
- **Two-Factor Authentication (2FA)** – Added email verification step.  
- **reCAPTCHA** – Prevents automated attacks.  
- **bcrypt / argon2** – Password hashing for secure storage.  

---

## License

This project is open source and available under the MIT License.

```

MERN-Auth-App
├─ backend
│  ├─ controllers
│  │  ├─ app.controller.js
│  │  ├─ appAuth.controller.js
│  │  └─ auth.controller.js
│  ├─ db
│  │  └─ connectDB.js
│  ├─ index.js
│  ├─ mail
│  │  ├─ email.config.js
│  │  ├─ email.js
│  │  └─ emailTemplate.js
│  ├─ middleware
│  │  ├─ rateLimiters.js
│  │  └─ verifyDashboardAccessToken.js
│  ├─ models
│  │  ├─ clientApp.model.js
│  │  ├─ devUser.model.js
│  │  └─ user.model.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ app.route.js
│  │  ├─ appAuth.route.js
│  │  └─ auth.route.js
│  └─ utils
│     ├─ appAuth.js
│     ├─ dashboardAuth.js
│     └─ generateVerificationToken.js
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ components
│  │  │  ├─ AppCard.jsx
│  │  │  ├─ FloatingShape.jsx
│  │  │  ├─ Header.jsx
│  │  │  ├─ Input.jsx
│  │  │  ├─ LoadingSpinner.jsx
│  │  │  └─ PasswordStrengthMeter.jsx
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ Dashboard.jsx
│  │  │  ├─ ForgotPassword.jsx
│  │  │  ├─ HomePage.jsx
│  │  │  ├─ LoginPage.jsx
│  │  │  ├─ NotFoundPage.jsx
│  │  │  ├─ PasswordResetConfirmation.jsx
│  │  │  ├─ ResetPassword.jsx
│  │  │  ├─ SignupPage.jsx
│  │  │  └─ VerifyEmail.jsx
│  │  ├─ store
│  │  │  ├─ app-sotre.js
│  │  │  └─ auth-store.js
│  │  └─ utils
│  │     ├─ date.js
│  │     ├─ formatKey.js
│  │     └─ motionVariants.js
│  └─ vite.config.js
└─ readme.md

```
```
MERN-Auth-App
├─ backend
│  ├─ controllers
│  │  ├─ app.controller.js
│  │  ├─ appAuth.controller.js
│  │  └─ auth.controller.js
│  ├─ db
│  │  └─ connectDB.js
│  ├─ index.js
│  ├─ mail
│  │  ├─ email.config.js
│  │  ├─ email.js
│  │  └─ emailTemplate.js
│  ├─ middleware
│  │  ├─ rateLimiters.js
│  │  ├─ verifyApiKey.js
│  │  └─ verifyDashboardAccessToken.js
│  ├─ models
│  │  ├─ clientApp.model.js
│  │  ├─ devUser.model.js
│  │  └─ user.model.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ app.route.js
│  │  ├─ appAuth.route.js
│  │  └─ auth.route.js
│  └─ utils
│     ├─ appAuth.js
│     ├─ dashboardAuth.js
│     └─ generateVerificationToken.js
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ components
│  │  │  ├─ AppCard.jsx
│  │  │  ├─ FloatingShape.jsx
│  │  │  ├─ Header.jsx
│  │  │  ├─ Input.jsx
│  │  │  ├─ LoadingSpinner.jsx
│  │  │  └─ PasswordStrengthMeter.jsx
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ Dashboard.jsx
│  │  │  ├─ ForgotPassword.jsx
│  │  │  ├─ HomePage.jsx
│  │  │  ├─ LoginPage.jsx
│  │  │  ├─ NotFoundPage.jsx
│  │  │  ├─ PasswordResetConfirmation.jsx
│  │  │  ├─ ResetPassword.jsx
│  │  │  ├─ SignupPage.jsx
│  │  │  └─ VerifyEmail.jsx
│  │  ├─ store
│  │  │  ├─ app-sotre.js
│  │  │  └─ auth-store.js
│  │  └─ utils
│  │     ├─ date.js
│  │     ├─ formatKey.js
│  │     └─ motionVariants.js
│  └─ vite.config.js
└─ readme.md

```