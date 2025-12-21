import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // token -> jwt
 
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Authentication failed: no token provided",
    });
  }

  try {
    const decodedJwt = jwt.verify(token, process.env.JWT_SECRET);
    // decodedJwt ==> object that represents the payload of the JWT — the data that was originally encoded by the server when it created the token.
    //If the token is invalid, expired, or tampered with, it throws an error (which you should catch).

    
    //extra safety check, but it's not really needed because jwt.verify will throw an error if the token is invalid or expired.
    if (!decodedJwt) {
      return res.status(401).json({
        success: false,
        message: "token invalid",
      });
    }

    req.userID = decodedJwt.userID;
    

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};
