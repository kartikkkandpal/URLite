// URL SHORTENING ROUTES

import express from "express";
import Url from "../models/Url.js";
import generateShortCode from "../utils/generateShortCode.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// Middleware to optionally authenticate user (doesn't block anonymous users)
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const jwt = await import("jsonwebtoken");
      const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
      const User = (await import("../models/User.js")).default;
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      // Token invalid, continue as anonymous user
      req.user = null;
    }
  }
  next();
};

// POST /api/shorten - Create a shortened URL (supports both authenticated and anonymous users)
router.post("/shorten", optionalAuth, async (req, res) => {
  try {
    const { originalUrl } = req.body;

    // Validate that URL is provided
    if (!originalUrl) {
      return res.status(400).json({ error: "Original URL is required" });
    }

    // Basic URL validation (check if it starts with http:// or https://)
    const urlPattern = /^(https?:\/\/)/;
    if (!urlPattern.test(originalUrl)) {
      return res.status(400).json({
        error: "Invalid URL format. Must start with http:// or https://",
      });
    }

    // Generate unique short code
    let shortCode = generateShortCode();

    // Check if short code already exists (rare collision)
    let existingUrl = await Url.findOne({ shortCode });

    // Regenerate if collision occurs
    while (existingUrl) {
      shortCode = generateShortCode();
      existingUrl = await Url.findOne({ shortCode });
    }

    // Create new URL document with optional userId
    const newUrl = new Url({
      originalUrl,
      shortCode,
      userId: req.user ? req.user._id : null, // Associate with user if logged in
    });

    // Save to database
    await newUrl.save();

    // Return the shortened URL details
    res.status(201).json({
      success: true,
      data: {
        id: newUrl._id,
        originalUrl: newUrl.originalUrl,
        shortCode: newUrl.shortCode,
        shortUrl: `${process.env.BASE_URL}/${newUrl.shortCode}`,
        clicks: newUrl.clicks,
        createdAt: newUrl.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/urls - Get all URLs for authenticated user (Protected)
router.get("/urls", protect, async (req, res) => {
  try {
    // Find all URLs created by this user, sorted by newest first
    const urls = await Url.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: urls.length,
      data: urls.map((url) => ({
        id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
        clicks: url.clicks,
        createdAt: url.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/urls/:id - Delete a URL (Protected)
router.delete("/urls/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    // Find URL by ID
    const url = await Url.findById(id);

    // Check if URL exists
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Check if user owns this URL
    if (url.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this URL" });
    }

    // Delete the URL
    await Url.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "URL deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /:shortCode - Redirect to original URL (Public - no auth required)
router.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find URL by short code
    const url = await Url.findOne({ shortCode });

    // If not found, return 404
    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    // Increment click count
    url.clicks += 1;
    await url.save();

    // Redirect to original URL
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;