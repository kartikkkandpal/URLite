// ANALYTICS ROUTES

import express from "express";
import Analytics from "../models/Analytics.js";
import Url from "../models/Url.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// GET /api/analytics/:urlId/summary - Get summary analytics for a URL
router.get("/:urlId/summary", protect, async (req, res) => {
  try {
    const { urlId } = req.params;

    // Check if URL exists and belongs to user
    const url = await Url.findById(urlId);
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    if (url.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Get total clicks
    const totalClicks = await Analytics.countDocuments({ urlId });

    // Get unique visitors (unique IP addresses)
    const uniqueVisitors = await Analytics.distinct("ipAddress", { urlId });
    const uniqueCount = uniqueVisitors.filter((ip) => ip !== null).length;

    // Get clicks today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clicksToday = await Analytics.countDocuments({
      urlId,
      timestamp: { $gte: today },
    });

    // Get clicks this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const clicksThisWeek = await Analytics.countDocuments({
      urlId,
      timestamp: { $gte: weekAgo },
    });

    res.json({
      success: true,
      data: {
        totalClicks,
        uniqueVisitors: uniqueCount,
        clicksToday,
        clicksThisWeek,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/analytics/:urlId/timeline - Get click timeline data
router.get("/:urlId/timeline", protect, async (req, res) => {
  try {
    const { urlId } = req.params;
    const { days = 7 } = req.query; // Default to last 7 days

    // Check if URL exists and belongs to user
    const url = await Url.findById(urlId);
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    if (url.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Get date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    // Aggregate clicks by date
    const timeline = await Analytics.aggregate([
      {
        $match: {
          urlId: url._id,
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          clicks: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          clicks: 1,
        },
      },
    ]);

    // Fill in missing dates with 0 clicks
    const filledTimeline = [];
    const currentDate = new Date(startDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const existing = timeline.find((t) => t.date === dateStr);

      filledTimeline.push({
        date: dateStr,
        clicks: existing ? existing.clicks : 0,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      success: true,
      data: filledTimeline,
    });
  } catch (error) {
    console.error("Error fetching timeline:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/analytics/:urlId/referrers - Get top referrers
router.get("/:urlId/referrers", protect, async (req, res) => {
  try {
    const { urlId } = req.params;

    // Check if URL exists and belongs to user
    const url = await Url.findById(urlId);
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    if (url.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Aggregate by referrer
    const referrers = await Analytics.aggregate([
      {
        $match: { urlId: url._id },
      },
      {
        $group: {
          _id: "$referrer",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 0,
          referrer: "$_id",
          count: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: referrers,
    });
  } catch (error) {
    console.error("Error fetching referrers:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/analytics/:urlId/devices - Get device breakdown
router.get("/:urlId/devices", protect, async (req, res) => {
  try {
    const { urlId } = req.params;

    // Check if URL exists and belongs to user
    const url = await Url.findById(urlId);
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    if (url.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Aggregate by device type
    const devices = await Analytics.aggregate([
      {
        $match: { urlId: url._id },
      },
      {
        $group: {
          _id: "$device",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          device: "$_id",
          count: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: devices,
    });
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/analytics/:urlId/locations - Get geographic data
router.get("/:urlId/locations", protect, async (req, res) => {
  try {
    const { urlId } = req.params;

    // Check if URL exists and belongs to user
    const url = await Url.findById(urlId);
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    if (url.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Aggregate by country
    const locations = await Analytics.aggregate([
      {
        $match: { urlId: url._id },
      },
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 0,
          country: "$_id",
          count: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/analytics/:urlId/browsers - Get browser breakdown
router.get("/:urlId/browsers", protect, async (req, res) => {
  try {
    const { urlId } = req.params;

    // Check if URL exists and belongs to user
    const url = await Url.findById(urlId);
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    if (url.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Aggregate by browser
    const browsers = await Analytics.aggregate([
      {
        $match: { urlId: url._id },
      },
      {
        $group: {
          _id: "$browser",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 0,
          browser: "$_id",
          count: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: browsers,
    });
  } catch (error) {
    console.error("Error fetching browsers:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;