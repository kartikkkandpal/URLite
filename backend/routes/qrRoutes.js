// QR CODE GENERATION AND HANDLING ROUTES

import express from "express";
import QRCode from "qrcode";
import Url from "../models/Url.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// GET /api/qr/:urlId - Generate QR code for a URL
router.get("/:urlId", protect, async (req, res) => {
  try {
    const { urlId } = req.params;

    // Find URL by ID
    const url = await Url.findById(urlId);

    // Check if URL exists
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Check if user owns this URL (allow if no userId for backward compatibility)
    if (url.userId && url.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to access this URL" });
    }

    // Generate QR code as data URL
    const shortUrl = `${process.env.BASE_URL}/${url.shortCode}`;
    const qrCodeDataURL = await QRCode.toDataURL(shortUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    res.json({
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        shortUrl,
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

export default router;