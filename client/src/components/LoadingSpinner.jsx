/**
 * LoadingSpinner.jsx — Animated loading overlay for batch processing.
 */

import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ current = 0, total = 0 }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16 animate-fade-in">

      {/* Spinning ring */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-brand-100 dark:border-brand-950" />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500"
          style={{ animation: "spin 0.8s linear infinite" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 size={22} className="text-brand-500 animate-spin-slow" />
        </div>
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Analyzing images with AI…
        </p>
        {total > 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Processing {current} of {total}
          </p>
        )}
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="w-56 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

    </div>
  );
}
