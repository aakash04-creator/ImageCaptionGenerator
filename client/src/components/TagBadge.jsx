/**
 * TagBadge.jsx — Clickable object detection tag.
 * Highlights when active (used for gallery filtering).
 */

import { Tag } from "lucide-react";

export default function TagBadge({ label, active = false, onClick }) {
  return (
    <button
      onClick={() => onClick?.(label)}
      className={`tag ${active ? "tag-active" : ""}`}
      title={`Filter by "${label}"`}
    >
      <Tag size={10} />
      {label}
    </button>
  );
}
