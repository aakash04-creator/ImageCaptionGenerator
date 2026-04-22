/**
 * CaptionToggle.jsx — Switch between descriptive, creative, and accessibility captions.
 *
 * Shows:
 *   - 3 toggle pill buttons
 *   - Active caption text
 *   - Copy-to-clipboard button
 *   - Rule badge indicating which caption is prioritized and why
 */

import { useState } from "react";
import { Copy, Check, Lightbulb } from "lucide-react";
import { copyToClipboard } from "../utils/export";

const STYLES = [
  { key: "descriptive",   label: "Descriptive",   emoji: "📋" },
  { key: "creative",      label: "Creative",       emoji: "✨" },
  { key: "accessibility", label: "Accessibility",  emoji: "♿" },
];

export default function CaptionToggle({ captions = {}, captionPriority, ruleReason }) {
  const [active, setActive] = useState(captionPriority || "descriptive");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = captions[active] || "";
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mt-4 space-y-3">

      {/* Toggle pills */}
      <div className="flex flex-wrap gap-2">
        {STYLES.map(({ key, label, emoji }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`caption-tab relative ${active === key ? "caption-tab-active" : ""}`}
          >
            {emoji} {label}
            {/* Priority indicator */}
            {key === captionPriority && (
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-white dark:border-slate-900"
                    title="AI-recommended style" />
            )}
          </button>
        ))}
      </div>

      {/* Caption text box */}
      <div className="relative bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700 group">
        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed pr-8">
          {captions[active] || "No caption available."}
        </p>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center
                     bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600
                     text-slate-500 dark:text-slate-400 hover:text-brand-500 transition-colors shadow-sm"
          title="Copy caption"
        >
          {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
        </button>
      </div>

      {/* Rule reason badge */}
      {ruleReason && (
        <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/50">
          <Lightbulb size={13} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            <span className="font-semibold">AI Rule Applied:</span> {ruleReason}
          </p>
        </div>
      )}

    </div>
  );
}
