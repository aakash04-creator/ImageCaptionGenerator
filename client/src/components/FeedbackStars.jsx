/**
 * FeedbackStars.jsx — 1–5 star rating component for caption feedback.
 *
 * Features:
 *   - Hover preview of star selection
 *   - Submit rating on click
 *   - Show average rating (from server) after rating
 */

import { useState } from "react";
import { Star } from "lucide-react";

export default function FeedbackStars({ imageId, captionStyle, average = null, onRate }) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = async (rating) => {
    setSelected(rating);
    setSubmitted(true);
    if (onRate) {
      await onRate(imageId, captionStyle, rating);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {/* Stars row */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= (hovered || selected || Math.round(average || 0));
          return (
            <button
              key={n}
              onMouseEnter={() => !submitted && setHovered(n)}
              onMouseLeave={() => !submitted && setHovered(0)}
              onClick={() => !submitted && handleRate(n)}
              disabled={submitted}
              className={`transition-all duration-100 ${submitted ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
            >
              <Star
                size={15}
                className={filled
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300 dark:text-slate-600"}
              />
            </button>
          );
        })}

        {/* Average label */}
        {average !== null && (
          <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">
            {average.toFixed(1)} avg
          </span>
        )}
      </div>

      {/* Feedback confirmation */}
      {submitted && (
        <p className="text-xs text-green-600 dark:text-green-400 font-medium animate-fade-in">
          ✓ Thanks for your feedback!
        </p>
      )}
    </div>
  );
}
