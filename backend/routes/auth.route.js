import express from "express";
import rateLimit from "express-rate-limit";
import { verifyDashboardAccessToken } from "../middleware/verifyDashboardAccessToken.js";
import {
	dashboardSignup,
	loginDashboard,
	dashboardLogout,
	dashboardVerifyEmail,
	dashboardResendOtp,
	forgotPassword,
	resetPassword,
	
	checkDashboardAuth,
	refreshAccessToken,
} from "../controllers/auth.controller.js";
import {
	signupLimiter,
	loginLimiter,
	optLimiter,
} from "../middleware/rateLimiters.js";

const router = express.Router();

router.post("/", (req, res) => {
	res.status(200).send(req.body);
});

// /api/dashboard
router.get("/check-auth", verifyDashboardAccessToken, checkDashboardAuth);

router.post("/signup", dashboardSignup);

router.post("/login", loginDashboard);

router.post("/logout", dashboardLogout);

router.post("/verify-email", optLimiter, dashboardVerifyEmail);

router.post("/resend-otp", dashboardResendOtp);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

router.get("/refresh-token", refreshAccessToken);

export default router;
