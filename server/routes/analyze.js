/**
 * analyze.js — POST /api/analyze
 * Accepts a base64 image, runs mock (or real) AI analysis,
 * applies caption rules, and returns the full result object.
 */

const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { analyzeImage } = require("../services/mockAI");
const { applyCaptionRule } = require("../services/captionRules");

router.post("/", async (req, res) => {
  try {
    const { imageBase64, fileName } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 is required." });
    }

    // --- AI Analysis (mock or real) ---
    // To switch to a real API, replace analyzeImage() in mockAI.js
    const analysis = analyzeImage(imageBase64);

    // --- Apply caption rule ---
    const rule = applyCaptionRule(analysis.category);

    // --- Build result object ---
    const result = {
      id: uuidv4(),
      fileName: fileName || "uploaded-image",
      timestamp: new Date().toISOString(),
      imageBase64,
      objects: analysis.objects,
      scene: analysis.scene,
      category: analysis.category,
      captions: analysis.captions,
      captionPriority: rule.priority,
      ruleReason: rule.reason,
      source: analysis.source, // "mock" or "api"
      feedback: {
        descriptive: null,
        creative: null,
        accessibility: null,
      },
    };

    res.json({ success: true, result });
  } catch (err) {
    console.error("Analysis error:", err);
    res.status(500).json({ error: "Failed to analyze image." });
  }
});

module.exports = router;
