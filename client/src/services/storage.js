/**
 * storage.js — LocalStorage helpers for persisting image results.
 * Mirrors what a Firebase/Supabase layer would look like.
 */

const STORAGE_KEY = "ai_caption_results";

/**
 * Load all stored results from LocalStorage.
 * @returns {Array} Array of result objects
 */
export function loadResults() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save a new result (or update if ID already exists).
 * @param {Object} result - The result object to save
 */
export function saveResult(result) {
  const results = loadResults();
  const idx = results.findIndex((r) => r.id === result.id);
  if (idx >= 0) {
    results[idx] = result;
  } else {
    results.unshift(result); // Newest first
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

/**
 * Update feedback averages for a stored result.
 * @param {string} imageId
 * @param {Object} averages - { descriptive, creative, accessibility }
 */
export function updateFeedback(imageId, averages) {
  const results = loadResults();
  const idx = results.findIndex((r) => r.id === imageId);
  if (idx >= 0) {
    results[idx].feedbackAverages = averages;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  }
}

/**
 * Delete a result by ID.
 * @param {string} imageId
 */
export function deleteResult(imageId) {
  const results = loadResults().filter((r) => r.id !== imageId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

/**
 * Clear all results.
 */
export function clearAllResults() {
  localStorage.removeItem(STORAGE_KEY);
}
