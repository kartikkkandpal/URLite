// ANALYTICS MODEL

import mongoose from "mongoose";

// Analytics Schema - stores detailed click tracking data
const analyticsSchema = new mongoose.Schema({
  // Reference to the URL being tracked
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Url",
    required: true,
    index: true,
  },

  // Timestamp of the click
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },

  // Referrer - where the click came from
  referrer: {
    type: String,
    default: "Direct", // Direct, Google, Facebook, etc.
    trim: true,
  },

  // User's IP address (for unique visitor tracking)
  ipAddress: {
    type: String,
    default: null,
  },

  // Geographic location data
  country: {
    type: String,
    default: "Unknown",
  },

  city: {
    type: String,
    default: "Unknown",
  },

  // Device information
  device: {
    type: String,
    enum: ["Mobile", "Desktop", "Tablet", "Unknown"],
    default: "Unknown",
  },

  // Browser information
  browser: {
    type: String,
    default: "Unknown",
  },

  // Operating System
  os: {
    type: String,
    default: "Unknown",
  },

  // Full user agent string
  userAgent: {
    type: String,
    default: null,
  },
});

// Compound index for efficient queries
analyticsSchema.index({ urlId: 1, timestamp: -1 });
analyticsSchema.index({ urlId: 1, ipAddress: 1 });

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;