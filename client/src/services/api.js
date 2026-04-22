/**
 * api.js — Frontend service layer for communicating with the Express backend.
 * All fetch calls go through here. Swap endpoints for production use.
 */

const BASE_URL = "/api"; // Proxied by Vite to http://localhost:5000

/**
 * Analyze a single image.
 * @param {string} imageBase64 - Base64 encoded image data (with data URI prefix)
 * @param {string} fileName    - Original filename
 * @returns {Promise<Object>}  - Analysis result from backend
 */
export async function analyzeImage(imageBase64, fileName) {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64, fileName }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to analyze image");
  }

  const data = await res.json();
  return data.result;
}

/**
 * Submit feedback (star rating) for a caption.
 * @param {string} imageId      - The unique image result ID
 * @param {string} captionStyle - "descriptive" | "creative" | "accessibility"
 * @param {number} rating       - 1–5
 * @returns {Promise<Object>}   - Updated averages
 */
export async function submitFeedback(imageId, captionStyle, rating) {
  const res = await fetch(`${BASE_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageId, captionStyle, rating }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to submit feedback");
  }

  return res.json();
}

/**
 * Get existing feedback averages for an image.
 * @param {string} imageId
 * @returns {Promise<Object>} - { averages: { descriptive, creative, accessibility } }
 */
export async function getFeedback(imageId) {
  const res = await fetch(`${BASE_URL}/feedback/${imageId}`);
  if (!res.ok) return { averages: {} };
  return res.json();
}
