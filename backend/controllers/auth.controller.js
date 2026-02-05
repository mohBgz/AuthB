import { DevUser } from "../models/devUser.model.js";

import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import {
	setDashboardAuthCookies,
	hashToken,
	generateDashboardAccessToken,
	generateDashboardRefreshToken,
} from "../utils/dashboardAuth.js";
import {
	sendVerificationEmail,
	sendWelcomeEmail,
	sendPasswordResetEmail,
	sendResetSuccessfulEmail,
} from "../mail/email.js";

export const dashboardSignup = async (req, res) => {
	const { email, password, name } = req.body; // req.body is a JS object  {email: "....", pasword: "....", name : "...."}
	if (![email, password, name].every(Boolean)) {
		//check wether all filed are equal to true ( not empty)
		// All input fields re required

		return res
			.status(400)
			.json({ success: false, message: "All Fields are Required" });
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		return res.status(400).json({
			success: false,
			message: "Invalid email address",
		});
	}

	try {
		const userAlreadyExists = await DevUser.findOne({ email: email }); // verfiry wether the user already exists
		if (userAlreadyExists) {
			return res.status(409).json({
				success: false,
				message: "A user with this email already exists.",
			});
		}

		const hashedPassword = await bcryptjs.hash(password, 10); // hash its password
		const verificationToken = generateVerificationToken(); // generate a verification code
		const verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000; //  verification code expires in 2 min
		//const verificationTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //  verification code expires in 1 hour

		const user = new DevUser({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt,
		});
		await user.save();
		//send Verification Email
		await sendVerificationEmail(user.name, user.email, verificationToken);

		res.status(201).json({
			success: true,
			message: "Verification email sent",
			user: {
				id: user._id,
				email: user.email,
				name: user.name,
				isVerified: false,
			},
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({
			success: false,
			message:
				"We couldn't complete your request right now. Please try again later.",
		});
	}
};
export const loginDashboard = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await DevUser.findOne({ email: email });
		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "Email or password incorrect" });
		}

		const passwordIsCorrect = await bcryptjs.compare(password, user.password);
		if (!passwordIsCorrect) {
			return res
				.status(400)
				.json({ success: false, message: "Email or password incorrect" });
		}

		if (!user.isVerified) {
			return res.status(403).json({
				success: false,
				message: "Email not verified",
				user: {
					id: user._id,
					email: user.email,
					name: user.name,
					isVerified: user.isVerified,
				},
			});
		}

		user.lastLogin = Date.now();

		// generate access & refresh tokens
		const accessToken = generateDashboardAccessToken(user._id);
		const refreshToken = generateDashboardRefreshToken();

		// store hashed refresh token and expiration
		user.refreshToken = hashToken(refreshToken);
		user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
		await user.save();

		// set cookies
		setDashboardAuthCookies(res, accessToken, refreshToken);

		return res.status(201).json({
			success: true,
			message: "User loged in successfully",
			user: {
				id: user._id,
				email: user.email,
				name: user.name,
				isVerified: user.isVerified,
			},
		});
	} catch (error) {
		console.error("Login error:", error.message);
		res.status(500).json({ success: false, message: "Login Failed" });
	}
};
export const dashboardVerifyEmail = async (req, res) => {
	// code => OTP (verification code)

	const { code } = req.body; // It extracts the code  property from req.body and assigns it to the code variable.
	try {
		const user = await DevUser.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "Invalid or expiered verification code",
			});
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;

		await user.save();

		await sendWelcomeEmail(user.email, user.name);

		return res.status(200).json({
			success: true,
			message: "User has been verified successfully",
			user: { ...user._doc, password: undefined },
		});
	} catch (error) {
		console.log(error.message);
		return res
			.status(500)
			.json({ message: `Failed verifying the user ${error}` });
	}
};

export const dashboardResendOtp = async (req, res) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({
			success: false,
			message: "Email is required",
		});
	}

	try {
		const user = await DevUser.findOne({ email });

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User does not exist",
			});
		}

		const verificationToken = generateVerificationToken();
		const verificationTokenExpiresAt = Date.now() + 60 * 60 * 1000;

		await DevUser.updateOne(
			{ email },
			{
				$set: {
					verificationToken,
					verificationTokenExpiresAt,
				},
			},
		);

		await sendVerificationEmail(user.name, email, verificationToken);

		return res.status(200).json({
			success: true,
			message: "OTP has been resent successfully",
		});
	} catch (error) {
		console.error("OTP resend error:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to resend OTP. Please try again later.",
		});
	}
};

export const forgotPassword = async (req, res) => {
	const delay = async (min = 170, max = 800) => {
		const ms = Math.floor(Math.random() * (max - min + 1)) + min;
		return new Promise((resolve) => setTimeout(resolve, ms));
	};

	const { email } = req.body;

	try {
		const user = await DevUser.findOne({ email: email });

		if (!user) {
			await delay(); // Delay for security (prevent timing attacks)
			return res.status(400).json({
				success: false,
				message: "Forget password: User not found",
			});
		}

		// Generate and save reset token
		const resetToken = crypto.randomBytes(20).toString("hex");

		//updating the user
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = Date.now() + 15 * 60 * 1000; //15min
		await user.save();

		// Send email first, THEN respond
		await sendPasswordResetEmail(
			user.email,
			`${process.env.CLIENT_URL}/reset-password/${resetToken}`,
		);

		//await delay(); // Add delay even in success case for consistency
		return res.status(200).json({
			success: true,
			message: "Reset Request Sent Successfully",
		});
	} catch (error) {
		console.log("Error in Forgot Password", error);
		await delay(); // Delay on error for consistency
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
export const resetPassword = async (req, res) => {
	const { token: resetToken } = req.params;
	const { password } = req.body;

	if (!password) {
		res.status(400).json({
			success: false,
			message: "password required",
		});
	}

	try {
		const user = await DevUser.findOne({
			resetPasswordToken: resetToken,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid or expired token" });
		}

		const newPassword = await bcryptjs.hash(password, 10);

		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;

		user.password = newPassword;

		await user.save();

		await sendResetSuccessfulEmail(user.email, user.name);
		return res.status(200).json({
			success: true,
			message: "Password Reset Successful",
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, message: error.message });
	}
};

export const dashboardLogout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		// If there’s a refresh token, remove it from DB
		if (refreshToken) {
			const hashedToken = hashToken(refreshToken);

			await DevUser.findOneAndUpdate(
				{ refreshToken: hashedToken },
				{ $unset: { refreshToken: "", refreshTokenExpiresAt: "" } },
			);
		}

		// Clear both cookies
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");

		return res.status(200).json({
			success: true,
			message: "User logged out successfully",
		});
	} catch (error) {
		console.error("Logout error:", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};

export const checkDashboardAuth = async (req, res) => {
	const userId = req.userId;

	try {
		const user = await DevUser.findById(userId).select(
			"-password -refreshToken",
		);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		return res.status(200).json({
			success: true,
			user, // user info without sensitive fields
		});
	} catch (error) {
		console.error("checkDashboardAuth error:", error);
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

export const refreshAccessToken = async (req, res) => {
	try {
		const { refreshToken } = req.cookies;

		if (!refreshToken) {
			return res
				.status(401)
				.json({ success: false, message: "No refresh token provided." });
		}

		const hashedToken = hashToken(refreshToken);

		// Find user with matching hashed token and valid expiration
		const user = await DevUser.findOne({
			refreshToken: hashedToken,
			refreshTokenExpiresAt: { $gt: new Date() },
		});

		if (!user) {
			return res
				.status(403)
				.json({ success: false, message: "Invalid or expired refresh token." });
		}

		const newAccessToken = generateDashboardAccessToken(user._id);

		
		const newRefreshToken = generateDashboardRefreshToken();
		user.refreshToken = hashToken(newRefreshToken);
		user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
		await user.save();

		
		setDashboardAuthCookies(res, newAccessToken, newRefreshToken);

		return res.status(200).json({
			success: true,
			message: "Access token refreshed",
		});
	} catch (error) {
		console.error("Refresh token error:", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};
