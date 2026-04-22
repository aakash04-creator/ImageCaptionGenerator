/**
 * export.js — Utilities for exporting caption data.
 * Supports CSV and plain-text download.
 */

/**
 * Convert results array to CSV string.
 * @param {Array} results
 * @returns {string}
 */
function resultsToCSV(results) {
  const headers = [
    "ID",
    "File Name",
    "Timestamp",
    "Category",
    "Scene",
    "Tags",
    "Descriptive Caption",
    "Creative Caption",
    "Accessibility Caption",
    "Priority Caption Style",
    "Rule Reason",
  ];

  const rows = results.map((r) => [
    r.id,
    r.fileName,
    r.timestamp,
    r.category,
    r.scene,
    (r.objects || []).join("; "),
    `"${(r.captions?.descriptive || "").replace(/"/g, '""')}"`,
    `"${(r.captions?.creative || "").replace(/"/g, '""')}"`,
    `"${(r.captions?.accessibility || "").replace(/"/g, '""')}"`,
    r.captionPriority,
    `"${(r.ruleReason || "").replace(/"/g, '""')}"`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

/**
 * Trigger a browser file download.
 * @param {string} content  - File content
 * @param {string} filename - Download filename
 * @param {string} type     - MIME type
 */
function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export all results as a CSV file.
 * @param {Array} results
 */
export function exportAsCSV(results) {
  const csv = resultsToCSV(results);
  downloadFile(csv, "ai_captions.csv", "text/csv");
}

/**
 * Export all results as a plain-text file.
 * @param {Array} results
 */
export function exportAsTXT(results) {
  const lines = results.flatMap((r, i) => [
    `=== Image ${i + 1}: ${r.fileName} ===`,
    `Timestamp   : ${r.timestamp}`,
    `Category    : ${r.category}  |  Scene: ${r.scene}`,
    `Tags        : ${(r.objects || []).join(", ")}`,
    ``,
    `[Descriptive Caption]`,
    r.captions?.descriptive || "",
    ``,
    `[Creative Caption]`,
    r.captions?.creative || "",
    ``,
    `[Accessibility Caption]`,
    r.captions?.accessibility || "",
    ``,
    `Priority: ${r.captionPriority}  —  Rule: ${r.ruleReason}`,
    ``,
    `─`.repeat(60),
    ``,
  ]);
  downloadFile(lines.join("\n"), "ai_captions.txt", "text/plain");
}

/**
 * Copy text to clipboard with fallback.
 * @param {string} text
 * @returns {Promise<boolean>} success
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}
