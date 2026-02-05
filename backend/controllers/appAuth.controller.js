import bcryptjs from "bcryptjs";
import crypto from "crypto";
import {
	sendVerificationEmail,
	sendPasswordResetEmail,
	sendResetSuccessfulEmail,
} from "../mail/email.js";

import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ClientApp } from "../models/clientApp.model.js";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import {
	hashToken,
	setUserAuthCookies,
	generateUserAccessToken,
	generateUserRefreshToken,
} from "../utils/appAuth.js";



// export const verifyApiKey = async (req, res, next) => {
// 	try {
// 		const apiKey = req.headers["x-api-key"];

// 		if (!apiKey) {
// 			return res.status(401).json({
// 				success: false,
// 				message: "API key is required",
// 			});
// 		}

// 		const apiKeyHash = crypto.createHash("sha256").update(apiKey).digest("hex");

// 		console.log("api key hash:", apiKeyHash);
// 		const app = await ClientApp.findOne({ apiKeyHash });
// 		if (!app) {
// 			return res.status(403).json({
// 				success: false,
// 				message: "Invalid API key",
// 			});
// 		}

// 		req.app = app; // app identity is now trusted
// 		next(); // allow request to reach /auth/login etc
// 	} catch (error) {
// 		console.error("API key verification error:", error);
// 		res.status(500).json({
// 			success: false,
// 			message: "Internal server error",
// 		});
// 	}
// };

// REGISTER
export const registerUser = async (req, res) => {
	console.log(req);
	const appId = req.app._id;
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
		const userAlreadyExists = await User.findOne({ email, appId }); // verfiry wether the user already exists
		console.log(email, appId);
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

		const user = new User({
			appId,
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt,
		});

		//send Verification Email
		await sendVerificationEmail(user.name, user.email, verificationToken);

		// Save user after sending email
		await user.save();
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

// LOGIN
export const loginUser = async (req, res) => {
	const appId = req.app._id;
	const { email, password } = req.body;

	const user = await User.findOne({ email, appId });
	if (!user) return res.status(400).json({ message: "Invalid credentials" });

	const ok = await bcryptjs.compare(password, user.password);
	if (!ok) return res.status(400).json({ message: "Invalid credentials" });

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
	user.lastLogin = new Date();

	const userAccessToken = generateUserAccessToken(user._id, appId);
	const userRefreshToken = generateUserRefreshToken();
	user.refreshToken = hashToken(userRefreshToken);
	user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	await user.save();

	setUserAuthCookies(res, userAccessToken, userRefreshToken);

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
};

// VERIFY EMAIL
export const appVerifyEmail = async (req, res) => {
	const { code } = req.body;

	const user = await User.findOne({
		verificationToken: code,
		verificationTokenExpiresAt: { $gt: Date.now() },
		appId: req.app._id,
	});

	if (!user) {
		return res.status(400).json({
			success: false,
			message: "Invalid or expired code",
		});
	}

	user.isVerified = true;
	user.verificationToken = undefined;
	user.verificationTokenExpiresAt = undefined;

	await user.save();

	return res
		.status(200)
		.json({ success: true, message: "Email verified successfully" });
};

export const appResendOtp = async (req, res) => {
	const appId = req.app._id;
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({
			success: false,
			message: "Email is required",
		});
	}

	try {
		const user = await User.findOne({ email, appId });

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User does not exist",
			});
		}

		const verificationToken = generateVerificationToken();
		const verificationTokenExpiresAt = Date.now() + 60 * 60 * 1000;

		await User.updateOne(
			{ email, appId },
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

// FORGOT PASSWORD
export const appForgotPassword = async (req, res) => {
	const { email } = req.body;
	const appId = req.app._id;

	if (!email)
		return res.status(400).json({ success: false, message: "Email required" });

	try {
		const user = await User.findOne({ email, appId });

		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "User not found" });
		}

		const resetToken = crypto.randomBytes(20).toString("hex");

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = Date.now() + 15 * 60 * 1000; // 15 min
		await user.save();

		await sendPasswordResetEmail(
			user.email,
			`${process.env.CLIENT_URL}/reset-password/${resetToken}`,
		);

		return res
			.status(200)
			.json({ success: true, message: "Reset request sent successfully" });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

// RESET PASSWORD
export const appResetPassword = async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;
	const appId = req.app._id;

	if (!password)
		return res
			.status(400)
			.json({ success: false, message: "Password required" });

	try {
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
			appId,
		});

		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid or expired token" });
		}

		user.password = await bcryptjs.hash(password, 10);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;

		await user.save();
		await sendResetSuccessfulEmail(user.email, user.name);

		return res
			.status(200)
			.json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ success: false, message: "Internal server error" });
	}
};

export const verifyAppJwt = (req, res, next) => {
	const token = req.cookies["userAccessToken"]; // your access token cookie
	const decoded = jwt.decode(token, { complete: true });
	console.log("decoded : ", decoded); // check payload and exp

	if (!token) {
		return res
			.status(401)
			.json({ success: false, message: "No access token, please log in." });
	}

	try {
		const payload = jwt.verify(token, process.env.USER_ACCESS_JWT_SECRET);

		req.userId = payload.userId;
		req.appId = payload.appId;
		next();
	} catch (err) {
		return res
			.status(401)
			.json({ success: false, message: "Invalid or expired access token." });
	}
};

// GET CURRENT USER
export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		res.status(200).json({
			success: true,
			message: "User authenticated",
			user,
		});
	} catch (error) {
		console.error("Error in getMe:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch user",
		});
	}
};

// LOGOUT
export const logoutUser = async (req, res) => {
	try {
		const refreshToken = req.cookies.userRefreshToken;

		// If there’s a refresh token, remove it from DB
		if (refreshToken) {
			const hashedToken = hashToken(refreshToken);

			await User.findOneAndUpdate(
				{ refreshToken: hashedToken },
				{ $unset: { refreshToken: "", refreshTokenExpiresAt: "" } },
			);
		}

		// Clear both cookies
		res.clearCookie("userAccessToken");
		res.clearCookie("userRefreshToken");

		return res.status(200).json({
			success: true,
			message: "User logged out successfully",
		});
	} catch (error) {
		console.error("Logout error:", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};

export const refreshAccessToken = async (req, res) => {
	try {
		const refreshToken = req.cookies["userRefreshToken"];
		if (!refreshToken) {
			return res
				.status(401)
				.json({ success: false, message: "No refresh token provided." });
		}

		const hashedToken = hashToken(refreshToken);

		// Find user with matching hashed refresh token and valid expiration
		const user = await User.findOne({
			refreshToken: hashedToken,
			refreshTokenExpiresAt: { $gt: new Date() },
		});

		if (!user) {
			return res
				.status(403)
				.json({ success: false, message: "Invalid or expired refresh token." });
		}

		// Generate new access and refresh tokens
		const newAccessToken = generateUserAccessToken(user._id, user.appId);
		const newRefreshToken = generateUserRefreshToken();

		// Store the new hashed refresh token and expiration
		user.refreshToken = hashToken(newRefreshToken);
		user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
		await user.save();
		setUserAuthCookies(res, newAccessToken, newRefreshToken);

		return res.status(200).json({
			success: true,
			message: "Access token refreshed",
		});
	} catch (error) {
		console.error("User refresh token error:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};
