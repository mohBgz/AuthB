import express from 'express';
import rateLimit from "express-rate-limit";


import { login, logout, signup, verifyEmail, resendOtp, forgotPassword, resetPassword, checkAuth} from '../controllers/auth.controller.js';
import {verifyToken} from '../middleware/verifyToken.js'
import { signupLimiter, loginLimiter, optLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();



router.post("/", (req, res)=>{
    res.status(200).send(req.body)
});

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup",signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/verify-email", optLimiter, verifyEmail);

router.post("/resend-otp", resendOtp);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);




export default router;