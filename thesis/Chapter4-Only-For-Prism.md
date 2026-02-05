# Chapter 4 — Implementation and Validation of the Modular Authentication API (AuthB)

This chapter presents the implementation of the AuthB system described in Chapter 3. The emphasis is on the technology choices, architecture, and detailed implementation of the backend and frontend; validation is addressed briefly as manual verification of the main flows, with placeholders for future testing work. Section 4.1 describes the technology stack, the system architecture, security implementation, the data layer, and the frontend in detail. Section 4.2 summarises the current validation approach without focusing on extensive testing. Section 4.3 discusses limitations and future work, and Section 4.4 concludes the chapter. Throughout, placeholders are provided for screenshots of the project code and of the user interface so that the thesis can be illustrated with concrete examples from the codebase and the running application.

---

## 4.1 Implementation

### 4.1.1 Technology Stack

The solution is implemented as a full-stack web application. The backend exposes a REST API; the frontend provides a developer dashboard and a demonstration interface for the authentication flows (signup, login, email verification, password reset) so that the behaviour of the API can be observed and documented.

**Backend.** The server is built with Node.js and Express [1] using ECMAScript modules. MongoDB serves as the primary data store, with Mongoose [2] used for schema definition, validation, and indexing. Authentication relies on JSON Web Tokens (JWT) [3] for short-lived access tokens and the Node.js `crypto` module for generating and hashing refresh tokens and API keys. Password hashing is performed with bcrypt [4] (or bcryptjs for compatibility), using a cost factor of 10 to balance security and performance [5]. Rate limiting is implemented with express-rate-limit [6] to mitigate brute-force and abuse. Email delivery for verification and password reset uses Amazon Simple Email Service (SES) via the AWS SDK [7]. Environment configuration is managed with dotenv; CORS and cookie-parser are used for cross-origin and cookie handling. No dedicated request validation library (e.g. Joi or express-validator) is used; validation is performed inline in controllers.

**Frontend.** The dashboard and demo UI are built with React [8] and Vite [9]. Routing is handled by React Router; state management uses Zustand [10]. Styling is done with Tailwind CSS [11] and animations with Framer Motion [12]. HTTP requests are sent with Axios with credentials enabled for cookie-based sessions. Google reCAPTCHA [13] is integrated on the signup page to reduce automated account creation; enforcement can be made mandatory via configuration. User feedback is provided through react-hot-toast.

**Deployment and environment.** The backend listens on a configurable port (default 3000) and sets `trust proxy` to 1 for correct client IP detection behind a reverse proxy. CORS is restricted to the frontend origin (e.g. http://localhost:5173 in development). Sensitive configuration (database URI, JWT secrets, SES credentials) is loaded from environment variables and is not committed to the repository.

[**Figure 4.1** – Technology stack diagram: Backend (Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, SES) and Frontend (React, Vite, Zustand, Tailwind).]

[**Screenshot 4.1 (Code)** – Placeholder: Backend package.json showing dependencies (express, mongoose, jsonwebtoken, bcryptjs, express-rate-limit, dotenv, cookie-parser, cors, @aws-sdk/client-ses).]

[**Screenshot 4.2 (Code)** – Placeholder: Frontend package.json showing dependencies (react, vite, react-router-dom, zustand, axios, tailwindcss, framer-motion, react-hot-toast).]

---

### 4.1.2 System Architecture and Project Structure

The backend is organised into a layered structure: a single entry point, route modules, middleware, controllers, models, and utility modules. The entry file (`index.js`) loads environment variables via dotenv, establishes the MongoDB connection at startup, and mounts global middleware in order: CORS (with a single allowed origin and credentials enabled), JSON body parser, and cookie parser. No route handler runs before these middlewares, so every request is parsed and can send or receive cookies. Three route namespaces are then mounted under distinct path prefixes so that dashboard operations, app management, and end-user authentication are clearly separated.

The first namespace is **dashboard authentication** at `/api/dashboard`. It provides signup, login, logout, email verification (verify-email and resend-otp), forgot password, reset password (with a token in the path), session check (check-auth), and token refresh (refresh-token). These endpoints are used only by the AuthB dashboard and operate on the DevUser entity. The second namespace is **dashboard app management** at `/api/dashboard/apps`. It provides create-app (POST), list apps (GET), delete app (DELETE by appId), and regenerate API key (PATCH by appId). All of these require a valid dashboard session (i.e. a valid JWT in the accessToken cookie) and operate on the ClientApp entity. The third namespace is **app authentication** at `/api/apps/auth`. It provides register, login, verify-email, resend-otp, forgot-password, reset-password (with token in path), refresh-token, get current user (me), and logout for end users of client applications. Every request to this namespace must include the client app’s API key in the `x-api-key` header; the verifyApiKey middleware runs first and attaches the resolved ClientApp to the request. Protected endpoints (me, logout) additionally require a valid end-user JWT delivered via the userAccessToken cookie.

The frontend is structured by feature: pages (Login, Signup, Dashboard, Verify Email, Forgot Password, Reset Password, etc.), shared components (Input, LoadingSpinner, PasswordStrengthMeter, Header, AppCard), and stores (auth-store, app-store). The auth store holds the current developer user and authentication state and centralises HTTP calls to the dashboard auth and app-management endpoints. The app store is used for app list and create/delete operations. Axios is configured with a base URL pointing to the backend and `withCredentials: true` so that cookies set by the API (accessToken, refreshToken for dashboard; userAccessToken, userRefreshToken for app auth) are sent automatically on subsequent requests. Error handling relies on HTTP status codes and JSON error messages (e.g. success, message) to drive toasts and redirects—for example, a 403 response with an unverified-email condition redirects the user to the verify-email page.

[**Figure 4.2** – Backend architecture: request flow from HTTP → CORS / cookies / JSON → route → middleware (verify token or API key) → controller → model → response.]

[**Screenshot 4.3 (Code)** – Placeholder: Backend index.js showing dotenv.config(), express app creation, trust proxy, connectDB(), app.use(cors), app.use(express.json), app.use(cookieParser), and the three app.use("/api/dashboard", ...), app.use("/api/dashboard/apps", ...), app.use("/api/apps/auth", ...) route mounts.]

[**Screenshot 4.4 (UI)** – Placeholder: Dashboard home after login—list of registered applications (cards or list), “Create new app” button, and navigation/header showing the logged-in developer.]

---

### 4.1.3 Backend Routes and Middleware in Detail

The dashboard auth routes are defined in a single router. Public endpoints (signup, login, forgot-password, reset-password, refresh-token) do not require a token; check-auth and the app routes require the verifyDashboardAccessToken middleware, which reads the accessToken cookie, verifies the JWT with the dashboard secret, and attaches the developer’s user ID to the request. The verify-email and resend-otp endpoints are protected by the OTP rate limiter (e.g. five attempts per 15 minutes per IP) to prevent abuse. Signup and login rate limiters are defined in the rate-limit module but are not applied in the current route definitions; only the OTP limiter is active on the verify-email route for the dashboard. The dashboard logout endpoint reads the refreshToken cookie, invalidates it in the database (by clearing the hashed refresh token and expiry on the DevUser), and clears both access and refresh cookies in the response.

The app-management router mounts only protected routes: every route uses verifyDashboardAccessToken first. Create-app expects a JSON body with a name; the controller generates a new API key (32-byte random hex), hashes it with SHA-256, creates a ClientApp document with that hash and the current developer’s ID, and returns the new app document plus the plain API key in the response (the key is shown only once). List apps returns all ClientApps whose ownerId matches the current developer. Delete app and regenerate key both check that the appId in the path belongs to the current developer before performing the operation.

The app-auth router applies verifyApiKey to all routes so that every request must present a valid x-api-key. The middleware hashes the key, looks up the ClientApp by apiKeyHash, and attaches the app document to req.app; missing or invalid keys result in 401 or 403. Public app-auth endpoints (register, login, verify-email, resend-otp, forgot-password, reset-password, refresh-token) then run without further auth middleware; the me and logout endpoints use an additional middleware (e.g. verifyAppJwt) that reads the userAccessToken cookie, verifies the JWT with the user secret, and attaches userId and appId to the request so that the controller can fetch the current user or clear the session in a scoped way.

[**Screenshot 4.5 (Code)** – Placeholder: auth.route.js showing router definition, middleware imports (verifyDashboardAccessToken, signupLimiter, loginLimiter, optLimiter), and route definitions (POST signup, login, logout, verify-email with optLimiter, resend-otp, forgot-password, reset-password, GET check-auth with verifyDashboardAccessToken, GET refresh-token).]

[**Screenshot 4.6 (Code)** – Placeholder: appAuth.route.js showing router.use(verifyApiKey), then POST register, login, verify-email, resend-otp, forgot-password, reset-password, GET refresh-token, and GET me and GET logout with verifyAppJwt.]

[**Screenshot 4.7 (UI)** – Placeholder: Login page—email and password fields, “Login” button, link to signup and forgot password.]

[**Screenshot 4.8 (UI)** – Placeholder: Signup page—name, email, password fields, password strength indicator, optional reCAPTCHA, “Sign up” button.]

---

### 4.1.4 Security-Related Implementation

Security measures are implemented at several layers so that credentials are never stored in plain form and sessions are bound to the correct identity and application scope.

**Passwords.** User and developer passwords are hashed before storage using bcrypt (or bcryptjs) with a cost factor of 10. Plain-text passwords are never stored or logged. Comparison is performed with the library’s compare function to avoid timing side channels [5]. The same cost factor is used in both dashboard and app-auth controllers for consistency.

**Tokens.** Access tokens are JWTs signed with HMAC (e.g. HS256), with a 15-minute lifetime. Separate secrets are used for the dashboard (`DASHBOARD_ACCESS_JWT_SECRET`) and for end-user sessions (`USER_ACCESS_JWT_SECRET`) so that compromise of one domain does not affect the other. The payload of the dashboard token contains only the developer’s user ID (userId). The end-user token contains both the user ID and the client app ID (userId, appId) so that every protected request can enforce scoping to the correct application. Refresh tokens are 40-byte random values (hex-encoded) generated with the Node.js crypto module. They are hashed with SHA-256 before storage and have a 7-day expiry; on each refresh, a new refresh token is issued and the previous one is invalidated (rotation) [14]. Verification codes for email verification are 6-digit numeric values generated with `crypto.randomInt(100000, 999999)` and expire after 10 minutes. Password-reset tokens are 20-byte random hex strings with a 15-minute validity period; they are stored in plain form in the user document for lookup but are single-use and time-limited.

**Cookies.** Access and refresh tokens are delivered via HTTP-only, SameSite=Strict cookies so that client-side JavaScript cannot read them and they are not sent on cross-site requests. The `secure` flag is set when the application runs in production so that cookies are only sent over HTTPS. Cookie names differ between the dashboard (`accessToken`, `refreshToken`) and the app-auth domain (`userAccessToken`, `userRefreshToken`) to avoid collisions when the same browser is used for both the dashboard and a client app’s auth flow.

**API key.** The client app’s API key is sent in the `x-api-key` request header. The server hashes the key with SHA-256 and looks up the corresponding ClientApp by hashed value. Only the hash is stored in the database; the plain key is shown once at creation in the API response. Missing or invalid keys result in 401 or 403 responses so that unauthenticated or unauthorised clients cannot access end-user auth endpoints. The middleware does not log the raw key.

**Rate limiting.** Four limiters are defined in a dedicated module: a global cap (e.g. 100 requests per 15 minutes per IP), signup (e.g. 5 per hour per IP), login (e.g. 10 failed attempts per 15 minutes per IP, with successful logins excluded), and OTP (e.g. 5 attempts per 15 minutes per IP). The OTP limiter is applied to the verify-email (and optionally resend-otp) routes in both dashboard and app-auth namespaces. Applying the signup, login, and global limiters to the corresponding routes is recommended for production and can be documented as a configuration choice [15].

**Timing.** In the dashboard forgot-password flow, a random delay is applied when the requested email is not found, to reduce the possibility of enumerating valid addresses via response time [16].

[**Table 4.1** – Security implementation summary.]

| Concern              | Implementation choice                           | Location / note                             |
| -------------------- | ----------------------------------------------- | ------------------------------------------- |
| Password storage     | bcrypt/bcryptjs, cost 10                        | Auth and app-auth controllers               |
| Access token         | JWT, 15 min, separate secrets per domain        | dashboardAuth.js, appAuth.js                |
| Refresh token        | 40-byte random, SHA-256 stored, 7-day, rotation | Same; controller refresh logic              |
| API key              | SHA-256 hash only; lookup by hash               | verifyApiKey middleware; app create         |
| Cookies              | httpOnly, sameSite=Strict, secure in production | setDashboardAuthCookies, setUserAuthCookies |
| Verification OTP     | 6-digit crypto.randomInt, 10 min                | generateVerificationToken; controllers      |
| Password reset token | 20-byte hex, 15 min                             | auth.controller, appAuth.controller         |
| Rate limiting        | Per-route and global limiters defined           | rateLimiters.js; OTP applied                |

[**Screenshot 4.9 (Code)** – Placeholder: dashboardAuth.js showing generateDashboardAccessToken (JWT sign with userId, 15m), generateDashboardRefreshToken (crypto.randomBytes(40)), setDashboardAuthCookies (httpOnly, sameSite, maxAge), hashToken (SHA-256).]

[**Screenshot 4.10 (Code)** – Placeholder: appAuth.js showing generateUserAccessToken (payload userId, appId), setUserAuthCookies (userAccessToken, userRefreshToken), hashToken.]

[**Screenshot 4.11 (Code)** – Placeholder: verifyApiKey middleware—reading x-api-key, hashing with crypto.createHash("sha256"), ClientApp.findOne({ apiKeyHash }), req.app = app, next().]

---

### 4.1.5 Data Layer and Persistence

MongoDB is used as the sole persistent store. A single connection is established at startup in a dedicated module (e.g. connectDB.js); connection failure causes the process to exit so that the server does not run without a database. Three main collections are used, each mapped by a Mongoose schema.

**DevUser** holds developer accounts. Fields include email (required, unique), password (required, stored hashed), name (required), lastLogin (Date), isVerified (Boolean, default false), resetPasswordToken, resetPasswordExpiresAt, verificationToken, verificationTokenExpiresAt, refreshToken (hashed), and refreshTokenExpiresAt. Timestamps are enabled so that createdAt and updatedAt are maintained automatically. Email uniqueness is enforced at the schema level so that duplicate developer registration is rejected by the database as well as by the controller.

**ClientApp** holds registered client applications. Fields include name (required, unique), apiKeyHash (required, unique), ownerId (ObjectId reference to DevUser, required), and status (enum Active/Inactive, default Active). Timestamps are enabled. The app name and API key hash are unique so that each application is uniquely identified and the same key cannot be reused for another app.

**User** holds end-user accounts scoped to a client application. Fields include appId (ObjectId reference to ClientApp, required, indexed), email (required), password (required, stored hashed), name (required), lastLogin (Date), isVerified (Boolean, default false), resetPasswordToken, resetPasswordExpiresAt, verificationToken, verificationTokenExpiresAt, refreshToken (hashed), and refreshTokenExpiresAt. A compound unique index on (appId, email) ensures one account per email per application and allows the same email to exist in different applications. An index on appId alone supports efficient queries such as listing users by application or checking existence by appId and email during login.

Schema definitions enforce required fields and, where applicable, enumerations (e.g. client app status). No connection pooling parameters are explicitly set in the application code; the driver’s defaults apply.

[**Figure 4.3** – Entity-relationship sketch: DevUser 1—* ClientApp, ClientApp 1—* User; key attributes as in text.]

[**Screenshot 4.12 (Code)** – Placeholder: devUser.model.js—schema with email, password, name, lastLogin, isVerified, resetPasswordToken, resetPasswordExpiresAt, verificationToken, verificationTokenExpiresAt, refreshToken, refreshTokenExpiresAt, timestamps.]

[**Screenshot 4.13 (Code)** – Placeholder: clientApp.model.js—schema with name, apiKeyHash, ownerId (ref DevUser), status (enum Active/Inactive).]

[**Screenshot 4.14 (Code)** – Placeholder: user.model.js—schema with appId (ref ClientApp, index), email, password, name, lastLogin, isVerified, token fields, and compound unique index (appId, email).]

---

### 4.1.6 Controller Logic and Request Flow

The dashboard signup controller receives email, password, and name from the request body. It checks that all required fields are present and validates the email format with a regular expression. It then checks for an existing DevUser with the same email; if found, it returns a conflict response. The password is hashed with bcrypt (cost 10), a 6-digit verification code is generated, and an expiry is set (e.g. 10 minutes). A new DevUser document is created and saved; a verification email is sent via the mail module with the code. The response returns success and a sanitised user object (no password or tokens). The verify-email controller receives the code, finds a DevUser with matching verificationToken and non-expired verificationTokenExpiresAt, sets isVerified to true, clears the verification token fields, and sends a welcome email. The login controller finds the user by email, compares the password with bcrypt.compare, rejects if unverified, updates lastLogin, generates access and refresh tokens, stores the hashed refresh token and its expiry on the user, sets the dashboard cookies, and returns a success response with user details. Forgot-password finds the user by email, generates a reset token and expiry, saves them on the user, and sends the reset link by email; if the user is not found, a random delay is applied before responding. Reset-password receives the token from the path and the new password from the body, finds the user by reset token and valid expiry, hashes the new password, clears the reset token fields, saves, and sends a confirmation email.

The app-auth register controller uses req.app.\_id as appId. It validates required fields and email format, checks for an existing User with the same (appId, email), and if none exists hashes the password, generates a verification code and expiry, creates a new User document with appId, and sends the verification email. The app-auth login controller finds the user by (appId, email), compares the password, rejects if unverified, updates lastLogin, generates user access and refresh tokens (with userId and appId in the JWT), stores the hashed refresh token and expiry, sets the user cookies (userAccessToken, userRefreshToken), and returns the user payload. Verify-email, resend-otp, forgot-password, and reset-password in app-auth mirror the dashboard logic but are scoped by req.app.\_id (and for reset, by the token in the path). The me endpoint uses req.userId (and optionally req.appId) from the JWT middleware to load the current user and return a sanitised profile. Logout clears the refresh token from the user document and clears the user cookies. Refresh-token reads the user refresh cookie, hashes it, finds the user with matching hashed token and valid expiry, generates new access and refresh tokens, rotates the stored refresh token, and sets the new cookies.

[**Screenshot 4.15 (Code)** – Placeholder: auth.controller.js—excerpt showing dashboardSignup: validation, bcrypt.hash, generateVerificationToken, DevUser creation, sendVerificationEmail, response.]

[**Screenshot 4.16 (Code)** – Placeholder: appAuth.controller.js—excerpt showing registerUser: appId from req.app, User.findOne({ appId, email }), User creation with appId, sendVerificationEmail.]

[**Screenshot 4.17 (UI)** – Placeholder: Email verification (OTP) page—six digit input boxes or single field for OTP, “Verify” button, “Resend code” link.]

[**Screenshot 4.18 (UI)** – Placeholder: Forgot password page—email field, “Send reset link” button.]

[**Screenshot 4.19 (UI)** – Placeholder: Reset password page (with token in URL)—new password and confirm password fields, “Reset password” button.]

---

### 4.1.7 Frontend Implementation in Relation to the API

The frontend acts as both the first-party dashboard and a reference consumer of the API. Dashboard flows (signup, login, verify email, forgot/reset password) call `/api/dashboard` endpoints; cookie-based sessions are used and the auth store reflects the current developer and authentication state. App listing and creation use `/api/dashboard/apps` with the same session so that the dashboard can display the developer’s apps and allow creating new ones (with the API key shown once in the UI). The same codebase can call `/api/apps/auth` with an API key when demonstrating or testing end-user flows; in that case, the backend sets userAccessToken and userRefreshToken cookies, which are sent automatically on subsequent requests. Error handling relies on HTTP status codes and JSON error messages to drive toasts and redirects—for example, 403 with unverified email redirecting to the verify-email page, or 409 for duplicate email. Input validation on the client (e.g. email format, password strength indicator) complements server-side checks but does not replace them; all critical checks are performed on the backend.

Key frontend components include a reusable Input component for form fields, a LoadingSpinner for async operations, and a PasswordStrengthMeter that gives visual feedback on password requirements (length, uppercase, lowercase, number, special character). The auth store exposes methods such as signup, login, checkAuth, logout, and app-related methods (e.g. createApp, getApps) that call the corresponding API endpoints and update local state. Protected routes check authentication state and redirect to login when the user is not authenticated. The verify-email page can use a multi-digit OTP input (e.g. six boxes) for better usability and to match the 6-digit code sent by email.

[**Screenshot 4.20 (UI)** – Placeholder: Dashboard “Create app” modal or form—app name field, “Create” button; after creation, modal or banner showing “API key (copy now, shown only once)” and the key value.]

[**Screenshot 4.21 (Code)** – Placeholder: auth-store.js (Zustand)—state (user, isAuthenticated, apps), signup, login, checkAuth, logout, createApp, getApps, and axios base URL with withCredentials: true.]

[**Screenshot 4.22 (Code)** – Placeholder: LoginPage.jsx or SignupPage.jsx—form fields, submit handler calling auth store method, error display, navigation to verify-email or dashboard.]

[**Screenshot 4.23 (UI)** – Placeholder: App card or list item on dashboard—app name, created date, “Delete” or “Regenerate key” actions.]

---

### 4.1.8 Email and Utility Modules

The mail module is responsible for sending verification, welcome, and password-reset emails. It uses the AWS SDK for SES: the sender address and region are configured via environment variables, and each email type uses a dedicated HTML template (e.g. verification code, welcome message, reset link, reset success). The templates can include placeholders for the user’s name and the dynamic content (code or link). Errors in sending (e.g. SES rejection or network failure) are caught and either rethrown so that the controller can return an appropriate error response or logged for debugging.

The generateVerificationToken utility uses `crypto.randomInt(100000, 999999)` to produce a 6-digit numeric code. This is used for both dashboard and app-auth email verification. The dashboard and app-auth utility modules (dashboardAuth.js and appAuth.js) centralise token generation and cookie setting so that controllers remain focused on business logic and do not duplicate JWT or cookie configuration.

[**Screenshot 4.24 (Code)** – Placeholder: generateVerificationToken.js—crypto.randomInt(100000, 999999).toString().]

[**Screenshot 4.25 (Code)** – Placeholder: email.js or emailTemplate.js—sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, template with placeholders.]

---

## 4.2 Validation

Validation of the implementation was carried out manually during development. The main flows—developer signup, email verification, login, app creation, end-user registration, end-user email verification, end-user login, token refresh, password reset, and logout—were exercised by running the application and using the dashboard and, where applicable, the app-auth endpoints with a test API key. Responses (status codes and JSON bodies) and database state were inspected to confirm that registration, login, scoping by appId, and token behaviour matched the design. No automated test suite (e.g. unit or integration tests) was implemented for this thesis; the system is suitable for demonstration and for use as a reference implementation, and future work could add automated tests and more formal validation (e.g. security checklist, load testing) as described in Section 4.3.

[**Table 4.2** – Validation summary.]

| Aspect      | Approach                       | Note                                  |
| ----------- | ------------------------------ | ------------------------------------- |
| Correctness | Manual flow testing            | All main auth and app flows exercised |
| Security    | Code review; measures in place | Passwords/tokens/API key as in §4.1.4 |
| Performance | Index design; rate limiters    | No load testing in scope              |

---

## 4.3 Discussion and Limitations

**Limitations.** The implementation does not include an automated test suite, so regressions must be caught by manual re-testing. The signup and login rate limiters are defined but not applied to the corresponding routes in the provided code; enabling them would strengthen abuse prevention. reCAPTCHA is integrated on the frontend but can be left optional; making it mandatory would further reduce automated signups. The argon2 dependency is present but not used in the main auth flows; a future revision could standardise on argon2 for password hashing in line with current recommendations [22]. CORS and the default port are set for a single development environment; production would require configurable origins and possibly a reverse proxy.

**Future work.** Priorities for future work include: (1) introducing a test framework (e.g. Jest) and Supertest for integration tests covering the flows described in this chapter; (2) applying signup, login, and global rate limiters to the appropriate routes and documenting their configuration; (3) running npm audit and addressing critical or high-severity advisories; (4) conducting load tests and recording latency and throughput for inclusion in the thesis or appendix; (5) optionally adding a schema-based request validation layer (e.g. express-validator or Joi) to centralise and document input constraints.

---

## 4.4 Summary

This chapter described the implementation of AuthB. The system is implemented with a Node.js and Express backend using MongoDB and Mongoose, JWT and cookie-based sessions for both dashboard and app-auth, and bcrypt for password hashing. Security measures include hashed storage of refresh tokens and API keys, separate JWT secrets for dashboard and app-auth, httpOnly and SameSite cookies, and rate limiting (with OTP limits applied). The data layer uses three main collections (DevUser, ClientApp, User) with appropriate indexes and compound uniqueness for application-scoped users. The frontend provides a developer dashboard and demo flows that consume the API with credentials enabled. Validation was performed manually; the chapter included placeholders for screenshots of the project code and of the user interface so that the thesis can be illustrated with concrete examples. Limitations and future work were outlined, including the introduction of automated tests and full application of rate limiters.

---

## References

[1] Express.js. _Express - Node.js web application framework_. https://expressjs.com/ (accessed as of thesis date).

[2] Mongoose. _Mongoose v8 documentation_. https://mongoosejs.com/ (accessed as of thesis date).

[3] M. Jones, J. Bradley, and N. Sakimura, "JSON Web Token (JWT)," RFC 7519, May 2015. https://datatracker.ietf.org/doc/html/rfc7519

[4] N. Provos and D. Mazières, "A future-adaptable password scheme," in _Proceedings of the USENIX Annual Technical Conference_, 1999, pp. 81–91.

[5] OWASP. _Password Storage Cheat Sheet_. https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html (accessed as of thesis date).

[6] express-rate-limit. _npm_. https://www.npmjs.com/package/express-rate-limit (accessed as of thesis date).

[7] Amazon Web Services. _Amazon Simple Email Service (SES)_. https://aws.amazon.com/ses/ (accessed as of thesis date).

[8] React. _React – A JavaScript library for building user interfaces_. https://react.dev/ (accessed as of thesis date).

[9] Vite. _Vite – Next Generation Frontend Tooling_. https://vitejs.dev/ (accessed as of thesis date).

[10] Zustand. _Zustand – Bear necessity for state management_. https://zustand-demo.pmnd.rs/ (accessed as of thesis date).

[11] Tailwind CSS. _Tailwind CSS – Rapidly build modern websites_. https://tailwindcss.com/ (accessed as of thesis date).

[12] Framer. _Motion for React_. https://www.framer.com/motion/ (accessed as of thesis date).

[13] Google. _reCAPTCHA_. https://www.google.com/recaptcha/about/ (accessed as of thesis date).

[14] OAuth 2.0 Security Best Current Practice. _IETF draft_ (or OWASP Authentication Cheat Sheet). Refer to current refresh token rotation guidance.

[15] OWASP. _Rate Limiting_. https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html (or similar; accessed as of thesis date).

[16] OWASP. _Authentication Cheat Sheet_. https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html (accessed as of thesis date).

[17] Supertest. _Supertest – HTTP assertions_. https://github.com/ladjs/supertest (accessed as of thesis date).

[18] npm. _npm audit_. https://docs.npmjs.com/cli/v8/commands/npm-audit (accessed as of thesis date).

[19] OWASP. _Dependency Check_. https://owasp.org/www-project-dependency-check/ (or npm audit; accessed as of thesis date).

[20] k6. _k6 – Developer-centric load testing_. https://k6.io/ (accessed as of thesis date).

[21] Artillery. _Artillery – Load testing toolkit_. https://www.artillery.io/ (accessed as of thesis date).

[22] PHC. _Password Hashing Competition_. https://www.password-hashing.net/ (argon2; accessed as of thesis date).

---

## List of Figures and Tables

**Figures**  
Figure 4.1 – Technology stack diagram.  
Figure 4.2 – Backend request flow (architecture).  
Figure 4.3 – Entity-relationship diagram (DevUser, ClientApp, User).

**Screenshots (Code)**  
Screenshot 4.1 (Code) – Backend package.json.  
Screenshot 4.2 (Code) – Frontend package.json.  
Screenshot 4.3 (Code) – Backend index.js (route mounts).  
Screenshot 4.5 (Code) – auth.route.js.  
Screenshot 4.6 (Code) – appAuth.route.js.  
Screenshot 4.9 (Code) – dashboardAuth.js.  
Screenshot 4.10 (Code) – appAuth.js.  
Screenshot 4.11 (Code) – verifyApiKey middleware.  
Screenshot 4.12 (Code) – devUser.model.js.  
Screenshot 4.13 (Code) – clientApp.model.js.  
Screenshot 4.14 (Code) – user.model.js.  
Screenshot 4.15 (Code) – auth.controller.js (signup excerpt).  
Screenshot 4.16 (Code) – appAuth.controller.js (register excerpt).  
Screenshot 4.21 (Code) – auth-store.js.  
Screenshot 4.22 (Code) – LoginPage.jsx or SignupPage.jsx.  
Screenshot 4.24 (Code) – generateVerificationToken.js.  
Screenshot 4.25 (Code) – email.js or emailTemplate.js.

**Screenshots (UI)**  
Screenshot 4.4 (UI) – Dashboard home after login.  
Screenshot 4.7 (UI) – Login page.  
Screenshot 4.8 (UI) – Signup page.  
Screenshot 4.17 (UI) – Email verification (OTP) page.  
Screenshot 4.18 (UI) – Forgot password page.  
Screenshot 4.19 (UI) – Reset password page.  
Screenshot 4.20 (UI) – Create app modal/form and API key display.  
Screenshot 4.23 (UI) – App card or list item on dashboard.

**Tables**  
Table 4.1 – Security implementation summary.  
Table 4.2 – Validation summary.
