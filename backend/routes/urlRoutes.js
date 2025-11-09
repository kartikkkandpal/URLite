// URL SHORTENING ROUTES

import express from "express";
import Url from "../models/Url.js";
import Analytics from "../models/Analytics.js";
import generateShortCode from "../utils/generateShortCode.js";
import protect from "../middleware/auth.js";
import {
  parseUserAgent,
  getGeoLocation,
  parseReferrer,
  getClientIp,
} from "../utils/analyticsHelper.js";

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

// Validate custom alias format
const validateAlias = (alias) => {
  // Only alphanumeric, hyphens, and underscores allowed
  // Length between 3-30 characters
  const aliasPattern = /^[a-zA-Z0-9_-]{3,30}$/;
  return aliasPattern.test(alias);
};

// POST /api/shorten - Create a shortened URL (supports both authenticated and anonymous users)
router.post("/shorten", optionalAuth, async (req, res) => {
  try {
    const { originalUrl, customAlias, title } = req.body;

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

    let shortCode;
    let isCustom = false;

    // Handle custom alias if provided
    if (customAlias) {
      // Only authenticated users can use custom aliases
      if (!req.user) {
        return res.status(401).json({
          error: "Please login to use custom aliases",
        });
      }

      // Validate custom alias format
      if (!validateAlias(customAlias)) {
        return res.status(400).json({
          error:
            "Invalid alias format. Use 3-30 characters (letters, numbers, hyphens, underscores only)",
        });
      }

      // Check if custom alias already exists
      const existingAlias = await Url.findOne({ shortCode: customAlias });
      if (existingAlias) {
        return res.status(400).json({
          error: "This custom alias is already taken. Please choose another.",
        });
      }

      shortCode = customAlias;
      isCustom = true;
    } else {
      // Generate unique short code
      shortCode = generateShortCode();

      // Check if short code already exists (rare collision)
      let existingUrl = await Url.findOne({ shortCode });

      // Regenerate if collision occurs
      while (existingUrl) {
        shortCode = generateShortCode();
        existingUrl = await Url.findOne({ shortCode });
      }
    }

    // Create new URL document
    const newUrl = new Url({
      originalUrl,
      shortCode,
      userId: req.user ? req.user._id : null,
      title: title || null,
      customAlias: customAlias || null,
      isCustom,
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
        title: newUrl.title,
        customAlias: newUrl.customAlias,
        isCustom: newUrl.isCustom,
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
        title: url.title,
        customAlias: url.customAlias,
        isCustom: url.isCustom,
        clicks: url.clicks,
        createdAt: url.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/urls/:id - Update URL title (Protected)
router.put("/urls/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

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
        .json({ error: "Not authorized to update this URL" });
    }

    // Update title
    url.title = title || null;
    await url.save();

    res.json({
      success: true,
      data: {
        id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
        title: url.title,
        customAlias: url.customAlias,
        isCustom: url.isCustom,
        clicks: url.clicks,
        createdAt: url.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating URL:", error);
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

    // Delete associated analytics data
    await Analytics.deleteMany({ urlId: id });

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

    // Track analytics asynchronously (don't block redirect)
    // This runs in background and doesn't delay the redirect
    setImmediate(async () => {
      try {
        // Get client information
        const userAgentString = req.headers["user-agent"];
        const referrerUrl = req.headers["referer"] || req.headers["referrer"];
        const ipAddress = getClientIp(req);

        // Parse user agent
        const { device, browser, os } = parseUserAgent(userAgentString);

        // Parse referrer
        const referrer = parseReferrer(referrerUrl);

        // Get geolocation (async - might be slow)
        const { country, city } = await getGeoLocation(ipAddress);

        // Create analytics entry
        const analyticsData = new Analytics({
          urlId: url._id,
          referrer,
          ipAddress,
          country,
          city,
          device,
          browser,
          os,
          userAgent: userAgentString,
        });

        await analyticsData.save();
      } catch (analyticsError) {
        // Don't fail redirect if analytics fails
        console.error("Analytics tracking error:", analyticsError);
      }
    });

    // Redirect to original URL immediately
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;