import jwt from "jsonwebtoken";
import crypto from "crypto";
export const generateDashboardAccessToken = (userId) => {
	const accessToken = jwt.sign(
		{ userId },
		process.env.DASHBOARD_ACCESS_JWT_SECRET,
		{
			expiresIn: "15m",
		},
	);

	return accessToken;
};

export const generateDashboardRefreshToken = () => {
	return crypto.randomBytes(40).toString("hex");
};

export const setDashboardAuthCookies = (res, accessToken, refreshToken) => {
	// Access token — short-lived
	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "Strict",
		maxAge: 15 * 60 * 1000, // 15 minutes
	});

	// Refresh token — long-lived
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "Strict",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
};

export const hashToken = (token) => {
	return crypto.createHash("sha256").update(token).digest("hex");
};
