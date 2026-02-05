import mongoose from "mongoose";

const devUserSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		name: { type: String, required: true },
		lastLogin: { type: Date, default: Date.now },
		isVerified: { type: Boolean, default: false },
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
		refreshToken: {
			type: String,
			default: null,
		},
		refreshTokenExpiresAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true },
);

export const DevUser = mongoose.model("DevUser", devUserSchema);
