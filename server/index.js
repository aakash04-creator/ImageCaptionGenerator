/**
 * index.js — Express server entry point
 * Starts the AI Caption Generator backend on port 5000.
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const analyzeRoute = require("./routes/analyze");
const feedbackRoute = require("./routes/feedback");

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
app.use(cors({ origin: "http://localhost:5173" })); // Vite dev server
app.use(express.json({ limit: "20mb" })); // Allow large base64 images

// --- Routes ---
app.use("/api/analyze", analyzeRoute);
app.use("/api/feedback", feedbackRoute);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "AI Caption Generator API is running." });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/analyze`);
  console.log(`   POST http://localhost:${PORT}/api/feedback`);
  console.log(`   GET  http://localhost:${PORT}/api/health\n`);
});
