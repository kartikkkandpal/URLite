// URL MODEL

import mongoose from "mongoose";

// URL Schema - defines structure for storing shortened URLs
const urlSchema = new mongoose.Schema({
  // Original long URL provided by user
  originalUrl: {
    type: String,
    required: true,
    trim: true,
  },

  // Generated short code (e.g., "abc123")
  shortCode: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate short codes
    trim: true,
  },

  // Track number of times this link was clicked
  clicks: {
    type: Number,
    default: 0,
  },

  // Timestamp when URL was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index on shortCode for faster lookups during redirects
urlSchema.index({ shortCode: 1 });

const Url = mongoose.model("Url", urlSchema);

export default Url;