export const verifyApiKey = async (req, res, next) => {
	try {
		const apiKey = req.headers["x-api-key"];

		if (!apiKey) {
			return res.status(401).json({
				success: false,
				message: "API key is required",
			});
		}

		const apiKeyHash = crypto.createHash("sha256").update(apiKey).digest("hex");

		console.log("api key hash:", apiKeyHash);
		const app = await ClientApp.findOne({ apiKeyHash });
		if (!app) {
			return res.status(403).json({
				success: false,
				message: "Invalid API key",
			});
		}

		req.app = app; 
		next(); 
	} catch (error) {
		console.error("API key verification error:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
