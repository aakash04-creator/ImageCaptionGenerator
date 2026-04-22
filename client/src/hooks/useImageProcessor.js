/**
 * useImageProcessor.js — Custom hook for batch image upload and processing.
 *
 * Manages:
 *   - File-to-base64 conversion
 *   - Sequential API calls per image
 *   - Progress tracking
 *   - Result persistence via localStorage
 */

import { useState, useCallback } from "react";
import { analyzeImage } from "../services/api";
import { saveResult } from "../services/storage";

/**
 * Convert a File object to a base64 data URI string.
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useImageProcessor() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState([]);

  /**
   * Process an array of File objects.
   * Results are appended to the results state and saved to localStorage.
   */
  const processImages = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    setProcessing(true);
    setErrors([]);
    setProgress({ current: 0, total: files.length });

    const newResults = [];
    const newErrors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProgress({ current: i + 1, total: files.length });

      try {
        // Convert to base64
        const base64 = await fileToBase64(file);

        // Call backend (mock AI)
        const result = await analyzeImage(base64, file.name);

        // Persist to localStorage
        saveResult(result);

        newResults.push(result);
      } catch (err) {
        newErrors.push({ fileName: file.name, error: err.message });
      }
    }

    // Prepend new results (newest first)
    setResults((prev) => [...newResults, ...prev]);
    setErrors(newErrors);
    setProcessing(false);
    setProgress({ current: 0, total: 0 });
  }, []);

  /**
   * Clear the current session results (does NOT clear localStorage).
   */
  const clearResults = useCallback(() => {
    setResults([]);
    setErrors([]);
  }, []);

  return { processing, progress, results, errors, processImages, clearResults };
}
