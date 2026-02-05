import jwt from "jsonwebtoken";

export const verifyDashboardAccessToken = (req, res, next) => {
  const token = req.cookies.accessToken; // access token cookie

  console.log("Access Token from cookie:", token);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed: no access token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.DASHBOARD_ACCESS_JWT_SECRET);
    req.userId = decoded.userId; // attach user ID to request
    console.log("userId from token:", req.userId);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};
