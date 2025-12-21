import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // window = 15 min
  max: 100, //Max 100 requests per window per IP
  message: "too many requets, please try again later.",
});

export const signupLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, // 1 hour
  max: 5, // 5 accounts per IP per hour
  message: "Too many signup attempts, please try again later.",
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 failed attempts
  skipSuccessfulRequests: true, // Only count failed logins
  message: "Account temporarily locked, please try again later.",
});

export const optLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts max
  message: {},
  handler: (req, res) => {
    console.log("Rate limit hit!");
    res
      .status(429)
      .json({ success: false, message: "Too many attempts. Try again later" });
  },
});
