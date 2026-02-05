import { ClientApp } from "../models/clientApp.model.js";

import bcrypt from "bcrypt";
import crypto from "crypto";

export const createApp = async (req, res) => {
	try {
		const ownerId = req.userId;
		const { name } = req.body;
		if (!name) {
			return res.status(400).json({
				success: false,
				message: "App name is required",
			});
		}
		// Generate API key to show ONCE to the user

		const apiKey = crypto.randomBytes(32).toString("hex");
		// Deterministic hash ✅
		const apiKeyHash = crypto.createHash("sha256").update(apiKey).digest("hex");

		// Create new app
		console.log("api key:", apiKey);
		const newApp = await ClientApp.create({
			name,
			apiKeyHash,
			ownerId,
		});

		return res.status(201).json({
			success: true,
			message: "App created successfully",
			app: newApp,
			apiKey,
		});
	} catch (error) {
		console.error("Create App Error:", error);

		if (error.code === 11000) {
			return res.status(400).json({
				success: false,
				message: "An app with this name already exists.",
			});
		} else {
			return res.status(500).json({
				success: false,
				message: "Internal server error",
			});
		}
	}
};

export const getApps = async (req, res) => {
	const ownerId = req.userId;

	try {
		const apps = await ClientApp.find({ ownerId }).sort({ createdAt: -1 });
		res.status(200).json({
			success: true,
			message: "Apps has been found",
			apps,
		});
	} catch (error) {
		console.error("Finding Apps Error:", error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const deleteApp = async (req, res) => {
	const ownerId = req.userId;
	const { appId } = req.params;
	console.log(req.headers);

	try {
		const result = await ClientApp.deleteOne({
			_id: appId,
			ownerId,
		});

		if (result.deletedCount === 0) {
			return res.status(404).json({
				success: false,
				message: "App not found or not authorized",
			});
		}

		res.status(200).json({
			success: true,
			message: "App deleted",
		});
	} catch (error) {
		console.error("Delete Error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const regenerateKey = async (req, res) => {
	try {
	} catch (error) {}
};
