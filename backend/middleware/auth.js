// AUTHENTICATION MIDDLEWARE

import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes - verifies JWT token
const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verify token and decode payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      // Check if user exists
      if (!req.user) {
        return res.status(401).json({ error: "User not found" });
      }

      next(); // Proceed to next middleware/route handler
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  // No token provided
  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }
};

export default protect;