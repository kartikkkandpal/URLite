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

  // Reference to user who created this URL (if logged in)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // Null for anonymous users
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

// Index on userId for faster user-specific queries
urlSchema.index({ userId: 1 });

const Url = mongoose.model("Url", urlSchema);

export default Url;