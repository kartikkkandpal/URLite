// URLite BACKEND SERVER MAIN ENTRY POINT

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import urlRoutes from "./routes/urlRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use("/api", urlRoutes); // API routes for /api/shorten
app.use("/", urlRoutes); // Root routes for /:shortCode redirect

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "URLite Server is running" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`URLite Server running on port ${PORT}`);
});