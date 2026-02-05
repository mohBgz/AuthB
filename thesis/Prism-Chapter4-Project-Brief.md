# Prism Brief: Project Details for Chapter 4 (AuthB Thesis)

Use this document together with **Chapter4-Only-For-Prism.md** so Prism has everything needed to establish, review, or extend Chapter 4 of the thesis.

---

## 1. What AuthB Is

- **AuthB** = modular authentication API for **third-party client applications**, not for end users directly.
- **Developers** sign up on AuthB’s dashboard, create “client apps,” and get an **API key** to integrate AuthB into their own apps.
- **End users** are users of those client apps; they sign up / log in **per app** (scoped by `appId`). Same email can exist in different apps as different accounts.
- **Two auth domains:** (1) **Dashboard** = developer identity (DevUser). (2) **App auth** = end-user identity (User) scoped to a ClientApp.

---

## 2. Project Structure

```
MERN-Auth-App/
├── backend/
│   ├── index.js                 # Entry: dotenv, CORS, cookie-parser, connectDB, mount routes
│   ├── db/connectDB.js          # MongoDB connection; process.exit(1) on failure
│   ├── routes/
│   │   ├── auth.route.js        # /api/dashboard — developer auth
│   │   ├── app.route.js         # /api/dashboard/apps — app CRUD (create, list, delete, regenerate key)
│   │   └── appAuth.route.js     # /api/apps/auth — end-user auth (all require x-api-key)
│   ├── middleware/
│   │   ├── verifyDashboardAccessToken.js   # JWT from cookie "accessToken", req.userId
│   │   ├── verifyApiKey.js                # x-api-key → SHA-256 hash → ClientApp lookup, req.app
│   │   └── rateLimiters.js                # globalLimiter, signupLimiter, loginLimiter, optLimiter
│   ├── controllers/
│   │   ├── auth.controller.js   # DevUser: signup, login, verify-email, resend-otp, forgot/reset password, logout, check-auth, refresh
│   │   ├── app.controller.js    # createApp, getApps, deleteApp, regenerateKey (all use req.userId)
│   │   └── appAuth.controller.js# User: register, login, verify-email, resend-otp, forgot/reset password, me, logout, refresh (all use req.app)
│   ├── models/
│   │   ├── devUser.model.js     # DevUser schema
│   │   ├── clientApp.model.js   # ClientApp schema (name, apiKeyHash, ownerId, status)
│   │   └── user.model.js        # User schema (appId, email, ...); index (appId, email) unique
│   ├── utils/
│   │   ├── dashboardAuth.js     # JWT access 15m, refresh 40-byte hex, cookies, hashToken SHA-256
│   │   ├── appAuth.js           # Same for user tokens; payload { userId, appId }
│   │   └── generateVerificationToken.js  # 6-digit crypto.randomInt(100000, 999999)
│   └── mail/                    # SES, verification/welcome/reset email templates
├── frontend/                     # React, Vite, Zustand, Tailwind, Axios (withCredentials)
│   └── src/
│       ├── pages/               # Login, Signup, Dashboard, VerifyEmail, ForgotPassword, ResetPassword, etc.
│       ├── store/auth-store.js  # API baseUrl dashboard; signup, login, checkAuth, apps
│       └── components/          # Input, LoadingSpinner, PasswordStrengthMeter, etc.
└── thesis/
    ├── Chapter4-Only-For-Prism.md    # Full Chapter 4 text (use this + this brief for Prism)
    └── Prism-Chapter4-Project-Brief.md  # This file
```

---

## 3. API Surface (Exact Routes)

| Namespace           | Method | Path                   | Middleware                 | Purpose                                            |
| ------------------- | ------ | ---------------------- | -------------------------- | -------------------------------------------------- |
| /api/dashboard      | GET    | /check-auth            | verifyDashboardAccessToken | Session check                                      |
| /api/dashboard      | POST   | /signup                | —                          | Developer signup                                   |
| /api/dashboard      | POST   | /login                 | —                          | Developer login                                    |
| /api/dashboard      | POST   | /logout                | —                          | Developer logout                                   |
| /api/dashboard      | POST   | /verify-email          | optLimiter                 | Verify OTP                                         |
| /api/dashboard      | POST   | /resend-otp            | —                          | Resend OTP                                         |
| /api/dashboard      | POST   | /forgot-password       | —                          | Forgot password                                    |
| /api/dashboard      | POST   | /reset-password/:token | —                          | Reset password                                     |
| /api/dashboard      | GET    | /refresh-token         | —                          | Refresh access token                               |
| /api/dashboard/apps | POST   | /create-app            | verifyDashboardAccessToken | Create client app (returns apiKey once)            |
| /api/dashboard/apps | GET    | /                      | verifyDashboardAccessToken | List apps                                          |
| /api/dashboard/apps | DELETE | /:appId                | verifyDashboardAccessToken | Delete app                                         |
| /api/dashboard/apps | PATCH  | /:appId                | verifyDashboardAccessToken | Regenerate key (body: regenerateKey)               |
| /api/apps/auth      | \*     | (all)                  | verifyApiKey               | Every request needs x-api-key; then route-specific |
| /api/apps/auth      | POST   | /register              | —                          | End-user register                                  |
| /api/apps/auth      | POST   | /login                 | —                          | End-user login                                     |
| /api/apps/auth      | POST   | /verify-email          | optLimiter                 | Verify OTP                                         |
| /api/apps/auth      | POST   | /resend-otp            | —                          | Resend OTP                                         |
| /api/apps/auth      | POST   | /forgot-password       | —                          | Forgot password                                    |
| /api/apps/auth      | POST   | /reset-password/:token | —                          | Reset password                                     |
| /api/apps/auth      | GET    | /refresh-token         | —                          | Refresh user token                                 |
| /api/apps/auth      | GET    | /me                    | verifyAppJwt               | Current user (userAccessToken cookie)              |
| /api/apps/auth      | GET    | /logout                | verifyAppJwt               | Logout user                                        |

**Note:** signupLimiter and loginLimiter are **imported** in auth.route.js but **not applied** to any route. Only optLimiter is used (dashboard verify-email; appAuth verify-email). globalLimiter is commented out in index.js.

---

## 4. Models (Exact Fields)

**DevUser**  
email (required, unique), password (required), name (required), lastLogin (Date), isVerified (Boolean, default false), resetPasswordToken, resetPasswordExpiresAt, verificationToken, verificationTokenExpiresAt, refreshToken (String), refreshTokenExpiresAt (Date). timestamps: true.

**ClientApp**  
name (required, unique), apiKeyHash (required, unique), ownerId (ObjectId ref DevUser, required), status (enum ["Active","Inactive"], default "Active"). timestamps: true.

**User**  
appId (ObjectId ref ClientApp, required, index: true), email (required), password (required), name (required), lastLogin (Date), isVerified (Boolean, default false), resetPasswordToken, resetPasswordExpiresAt, verificationToken, verificationTokenExpiresAt, refreshToken (String), refreshTokenExpiresAt (Date). timestamps: true. **Compound unique index:** (appId, email).

---

## 5. Security Implementation (Matches Chapter 4)

- **Passwords:** bcryptjs (auth, appAuth controllers) / bcrypt (app.controller for N/A); cost 10. Never stored in plain text.
- **Dashboard JWT:** payload { userId }; secret DASHBOARD_ACCESS_JWT_SECRET; expiresIn "15m". Cookie: accessToken (15 min), refreshToken (7 days).
- **User JWT:** payload { userId, appId }; secret USER_ACCESS_JWT_SECRET; expiresIn "15m". Cookies: userAccessToken (15 min), userRefreshToken (7 days).
- **Refresh tokens:** 40-byte crypto.randomBytes(40).toString("hex"); stored as SHA-256 hash; 7-day expiry; rotation on refresh (new token issued, old invalidated).
- **API key:** crypto.randomBytes(32).toString("hex") at creation; stored as crypto.createHash("sha256").update(apiKey).digest("hex"). Verified in middleware by hashing incoming x-api-key and findOne({ apiKeyHash }).
- **Cookies:** httpOnly: true, sameSite: "Strict", secure: process.env.NODE_ENV === "production", maxAge as above.
- **Verification OTP:** generateVerificationToken() → 6-digit number; expiry 10 min (e.g. Date.now() + 10*60*1000) in controllers.
- **Password reset token:** crypto.randomBytes(20).toString("hex"); 15 min expiry.
- **Timing:** In auth.controller forgotPassword, random delay (170–800 ms) when user not found to reduce enumeration.
- **verifyApiKey.js:** Uses `crypto` and `ClientApp`; in Node, `crypto` is built-in; `ClientApp` must be imported from "../models/clientApp.model.js" (if missing in repo, add it).

---

## 6. Rate Limiters (Exact Values)

- **globalLimiter:** windowMs 15 min, max 100 per IP. Not applied (commented out in index.js).
- **signupLimiter:** windowMs 1 hour, max 5 per IP. Defined but not applied.
- **loginLimiter:** windowMs 15 min, max 10, skipSuccessfulRequests: true. Defined but not applied.
- **optLimiter:** windowMs 15 min, max 5. Applied: auth.route.js verify-email; appAuth.route.js verify-email (and resend-otp if desired).

---

## 7. Backend Dependencies (package.json)

express, dotenv, cookie-parser, cors, mongoose, jsonwebtoken, bcrypt, bcryptjs, express-rate-limit, @aws-sdk/client-ses, nodemailer, argon2 (present but not used in auth flows). type: "module". No test framework in scripts.

---

## 8. Frontend (Relevant to Chapter 4)

- React 19, Vite 6, React Router DOM 7, Zustand, Tailwind CSS, Axios (withCredentials: true), react-google-recaptcha (signup page; can be optional), react-hot-toast. auth-store.js: API base URL for dashboard (e.g. http://localhost:5000/api/dashboard); signup, login, checkAuth, logout, apps CRUD. No automated tests.

---

## 9. Environment Variables (Expected)

MONGO_URI, PORT, DASHBOARD_ACCESS_JWT_SECRET, USER_ACCESS_JWT_SECRET, CLIENT_URL (for reset links), NODE_ENV, SES/email config (e.g. AWS region, from address). All sensitive; not in repo.

---

## 10. How This Maps to Chapter 4

- **§4.1.1 Technology stack** → backend/frontend package.json, index.js, this brief §7–8.
- **§4.1.2 Architecture** → index.js route mount, §2 structure, §3 route table.
- **§4.1.3 Security** → §5 (and §6 for rate limiting).
- **§4.1.4 Data layer** → §4 models, connectDB.js.
- **§4.1.5 Frontend** → frontend structure, auth-store, §8.
- **§4.2 Validation** → No test files; manual testing only. Chapter 4’s “recommended” tests and checklist align with this codebase.
- **§4.3 Limitations** → signup/login limiters not applied, globalLimiter off, no test suite, reCAPTCHA optional, argon2 unused — all match code.

---

## 11. Prompt to Give Prism

Copy this when you open **Chapter4-Only-For-Prism.md** and this brief in Prism:

```
I am working on Chapter 4 of my thesis: "Implementation and Validation of the Modular Authentication API (AuthB)."

I am giving you two things:
1. **Chapter4-Only-For-Prism.md** — the full Chapter 4 text (implementation, validation, discussion, summary, references, list of figures/tables).
2. **Prism-Chapter4-Project-Brief.md** — project details: what AuthB is, full project structure, exact API routes and middleware, model schemas and indexes, security implementation (tokens, cookies, hashing, rate limiters), backend/frontend dependencies, env vars, and how each section of Chapter 4 maps to the codebase.

Use both documents as the single source of truth. When I ask you to establish, review, or extend Chapter 4, use the chapter for wording and structure and the project brief for technical accuracy (routes, file names, middleware, models, security choices). Do not contradict the technical facts in the project brief when suggesting edits to the chapter. If you suggest code or config changes (e.g. applying signup/login limiters), align them with the existing file paths and route names in this brief.
```

---

## 12. One-Line Summary for Prism

**AuthB** is a modular auth API for third-party apps: developers use the dashboard (DevUser + JWT cookies) and create client apps (API key); end users register/login per app (User, scoped by appId) via `/api/apps/auth` with `x-api-key`. Backend: Node/Express/MongoDB; JWT + bcrypt + SHA-256 for keys/refresh; rate limiters defined, OTP limiter applied. Chapter 4 describes this implementation and its validation (correctness, security, performance) with references and figure/table placeholders.
