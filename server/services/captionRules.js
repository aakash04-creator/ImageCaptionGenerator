/**
 * captionRules.js — Rule-based caption prioritization engine.
 *
 * Rules:
 *   - Academic images  → descriptive caption first (factual context preferred)
 *   - Social images    → creative caption first (engagement preferred)
 *   - Work images      → descriptive caption first (professional context)
 *   - Outdoor images   → creative caption first (aesthetic appeal)
 */

const RULES = {
  academic: {
    priority: "descriptive",
    reason: "Academic content benefits from clear, factual descriptions.",
  },
  social: {
    priority: "creative",
    reason: "Social scenes are more engaging with a creative, expressive caption.",
  },
  work: {
    priority: "descriptive",
    reason: "Professional settings call for structured, informative descriptions.",
  },
  outdoor: {
    priority: "creative",
    reason: "Outdoor and nature scenes shine with vibrant, evocative language.",
  },
};

/**
 * Apply caption rules to determine priority caption style.
 * @param {string} category - Image category (academic, social, work, outdoor)
 * @returns {{ priority: string, reason: string }}
 */
function applyCaptionRule(category) {
  return RULES[category] || { priority: "descriptive", reason: "Default rule: descriptive captions are universally suitable." };
}

module.exports = { applyCaptionRule };
