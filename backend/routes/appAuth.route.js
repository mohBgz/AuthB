import express from "express";
import { optLimiter } from "../middleware/rateLimiters.js";
import { verifyApiKey } from "../middleware/verifyApiKey.js";
import {
	
    verifyAppJwt,
	registerUser,
	loginUser,
	appVerifyEmail,
	appResendOtp,
	getMe,
	logoutUser,
    appForgotPassword,
    appResetPassword,
    refreshAccessToken,
} from "../controllers/appAuth.controller.js";

const router = express.Router();

// Every request MUST come from a real app
router.use(verifyApiKey); // Protected all routes below this line + puts app info in req.app

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/verify-email", appVerifyEmail);
router.post("/resend-otp", appResendOtp);

router.post("/forgot-password", appForgotPassword);
router.post("/reset-password/:token", appResetPassword);

router.get("/refresh-token", refreshAccessToken);
// Protected (user logged in)
router.get("/me", verifyAppJwt, getMe);
router.get("/logout", verifyAppJwt, logoutUser);

export default router;
