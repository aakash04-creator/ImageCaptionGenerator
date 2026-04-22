/**
 * feedback.js — POST /api/feedback
 * Receives rating for a specific caption style and stores it in-memory.
 * In production, replace the in-memory store with a database (Firebase/Supabase).
 */

const express = require("express");
const router = express.Router();

// In-memory feedback store: { [imageId]: { descriptive: [], creative: [], accessibility: [] } }
const feedbackStore = {};

router.post("/", (req, res) => {
  const { imageId, captionStyle, rating } = req.body;

  if (!imageId || !captionStyle || rating === undefined) {
    return res.status(400).json({ error: "imageId, captionStyle, and rating are required." });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5." });
  }

  if (!feedbackStore[imageId]) {
    feedbackStore[imageId] = { descriptive: [], creative: [], accessibility: [] };
  }

  if (!feedbackStore[imageId][captionStyle]) {
    return res.status(400).json({ error: "Invalid captionStyle. Use descriptive, creative, or accessibility." });
  }

  feedbackStore[imageId][captionStyle].push(rating);

  // Compute average ratings
  const averages = {};
  for (const style of ["descriptive", "creative", "accessibility"]) {
    const ratings = feedbackStore[imageId][style];
    averages[style] = ratings.length
      ? parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
      : null;
  }

  res.json({ success: true, averages });
});

// GET /api/feedback/:imageId — retrieve stored feedback averages
router.get("/:imageId", (req, res) => {
  const { imageId } = req.params;
  const data = feedbackStore[imageId];
  if (!data) {
    return res.json({ averages: { descriptive: null, creative: null, accessibility: null } });
  }
  const averages = {};
  for (const style of ["descriptive", "creative", "accessibility"]) {
    const ratings = data[style];
    averages[style] = ratings.length
      ? parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
      : null;
  }
  res.json({ averages });
});

module.exports = router;
