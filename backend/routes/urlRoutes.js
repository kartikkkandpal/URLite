// URL SHORTENING ROUTES

import express from "express";
import Url from "../models/Url.js";
import generateShortCode from "../utils/generateShortCode.js";

const router = express.Router();

// POST /api/shorten - Create a shortened URL
router.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    // Validate that URL is provided
    if (!originalUrl) {
      return res.status(400).json({ error: "Original URL is required" });
    }

    // Basic URL validation (check if it starts with http:// or https://)
    const urlPattern = /^(https?:\/\/)/;
    if (!urlPattern.test(originalUrl)) {
      return res
        .status(400)
        .json({
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

    // Create new URL document
    const newUrl = new Url({
      originalUrl,
      shortCode,
    });

    // Save to database
    await newUrl.save();

    // Return the shortened URL details
    res.status(201).json({
      success: true,
      data: {
        originalUrl: newUrl.originalUrl,
        shortCode: newUrl.shortCode,
        shortUrl: `${process.env.BASE_URL}/${newUrl.shortCode}`,
        createdAt: newUrl.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /:shortCode - Redirect to original URL
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