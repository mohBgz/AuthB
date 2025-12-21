import { ClientApp } from "../models/clientApp.model.js";

import bcrypt from "bcrypt";
import crypto from "crypto";

export const createApp = async (req, res) => {
	try {
		const ownerId = req.userID;
		const { name } = req.body;
		if (!name) {
			return res.status(400).json({
				success: false,
				message: "App name is required",
			});
		}

		// Generate API key to show ONCE to the user
		const apiKey = crypto.randomBytes(32).toString("hex");

		// Hash the API key before saving to DB
		const hashedKey = await bcrypt.hash(apiKey, 10);

		// Create new app
		console.log("api key:", apiKey);
		const newApp = await ClientApp.create({
			name,
			apiKeyHash: hashedKey,
			ownerId,
		});

		return res.status(201).json({
			success: true,
			message: "App created successfully",
			app: {
				id: newApp._id,
				name: newApp.name,
				apiKey, // show plaintext ONCE to the user
			},
		});
	} catch (error) {
		console.error("Create App Error:", error);

		if (error.code === 11000) {
			return res.status(400).json({
				success: false,
				message:
					"An app with this name already exists.",
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
	const ownerId = req.userID;

	try {
		const apps = await ClientApp.find({ ownerId });
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
