/**
 * ResultCard.jsx — Displays the full AI analysis result for one image.
 *
 * Shows:
 *   - Image preview
 *   - Category badge + scene label
 *   - Detected object tags
 *   - Caption toggle (3 styles)
 *   - Feedback stars per caption style
 *   - Source badge (mock / api)
 */

import { useState } from "react";
import { MapPin, Cpu, Clock } from "lucide-react";
import TagBadge from "./TagBadge";
import CaptionToggle from "./CaptionToggle";
import FeedbackStars from "./FeedbackStars";
import { submitFeedback } from "../services/api";
import { updateFeedback } from "../services/storage";

// Category color map
const CATEGORY_COLORS = {
  academic:  "bg-blue-100  dark:bg-blue-950  text-blue-700  dark:text-blue-300  border-blue-200  dark:border-blue-800",
  social:    "bg-pink-100  dark:bg-pink-950  text-pink-700  dark:text-pink-300  border-pink-200  dark:border-pink-800",
  work:      "bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800",
  outdoor:   "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
};

const CATEGORY_EMOJI = {
  academic: "🎓",
  social:   "🎉",
  work:     "💼",
  outdoor:  "🌿",
};

export default function ResultCard({ result, onTagClick, activeTag }) {
  const [feedbackAverages, setFeedbackAverages] = useState(result.feedbackAverages || {});

  const catColor = CATEGORY_COLORS[result.category] || CATEGORY_COLORS.social;
  const catEmoji = CATEGORY_EMOJI[result.category] || "🖼️";

  // Format timestamp
  const time = result.timestamp
    ? new Date(result.timestamp).toLocaleString()
    : "";

  // Handle star feedback submission
  const handleRate = async (imageId, captionStyle, rating) => {
    try {
      const data = await submitFeedback(imageId, captionStyle, rating);
      setFeedbackAverages(data.averages || {});
      updateFeedback(imageId, data.averages || {});
    } catch (err) {
      console.warn("Feedback error:", err.message);
    }
  };

  return (
    <div className="card overflow-hidden animate-slide-up hover:shadow-xl transition-shadow duration-300">

      {/* Image + overlay badges */}
      <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={result.imageBase64}
          alt={result.fileName}
          className="w-full h-full object-cover"
        />

        {/* Top-right: source badge */}
        <span className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold
                         bg-black/60 text-white backdrop-blur-sm">
          <Cpu size={9} />
          {result.source === "mock" ? "Mock AI" : "Real API"}
        </span>

        {/* Bottom-left: category */}
        <span className={`absolute bottom-2.5 left-2.5 category-badge border ${catColor}`}>
          {catEmoji} {result.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">

        {/* Filename + meta */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[65%]">
            {result.fileName}
          </p>
          <div className="flex items-center gap-3 shrink-0 text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {result.scene}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {time}
            </span>
          </div>
        </div>

        {/* Object tags */}
        {result.objects?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {result.objects.map((obj) => (
              <TagBadge
                key={obj}
                label={obj}
                active={activeTag === obj}
                onClick={onTagClick}
              />
            ))}
          </div>
        )}

        {/* Caption toggle */}
        <CaptionToggle
          captions={result.captions}
          captionPriority={result.captionPriority}
          ruleReason={result.ruleReason}
        />

        {/* Feedback section */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
            Rate Captions
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {["descriptive", "creative", "accessibility"].map((style) => (
              <div key={style} className="flex flex-col gap-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{style}</span>
                <FeedbackStars
                  imageId={result.id}
                  captionStyle={style}
                  average={feedbackAverages[style] ?? null}
                  onRate={handleRate}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
