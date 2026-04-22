/**
 * Gallery.jsx — Gallery page with search, tag filters, and category filters.
 *
 * Features:
 *   - Loads all processed images from localStorage
 *   - Search by caption text
 *   - Filter by tag (object)
 *   - Filter by category
 *   - Export all as CSV or TXT
 *   - Delete individual results
 *   - Clear all results
 */

import { useState, useMemo, useCallback } from "react";
import { Images, Tag, Layers, Trash2, FileDown, FileText, RefreshCw, X } from "lucide-react";
import ResultCard from "../components/ResultCard";
import SearchBar from "../components/SearchBar";
import { loadResults, deleteResult, clearAllResults } from "../services/storage";
import { exportAsCSV, exportAsTXT } from "../utils/export";

const CATEGORIES = ["All", "academic", "social", "work", "outdoor"];

export default function Gallery() {
  const [results, setResults] = useState(() => loadResults());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Collect all unique tags across results
  const allTags = useMemo(() => {
    const tagSet = new Set();
    results.forEach((r) => (r.objects || []).forEach((o) => tagSet.add(o)));
    return [...tagSet].sort();
  }, [results]);

  // Filtered results
  const filtered = useMemo(() => {
    let list = results;

    // Category filter
    if (activeCategory !== "All") {
      list = list.filter((r) => r.category === activeCategory);
    }

    // Tag filter
    if (activeTag) {
      list = list.filter((r) => (r.objects || []).includes(activeTag));
    }

    // Search filter — searches all caption styles
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) => {
        const caps = Object.values(r.captions || {}).join(" ").toLowerCase();
        const tags = (r.objects || []).join(" ").toLowerCase();
        return caps.includes(q) || tags.includes(q) || r.fileName?.toLowerCase().includes(q);
      });
    }

    return list;
  }, [results, searchQuery, activeTag, activeCategory]);

  // Tag click handler
  const handleTagClick = useCallback((tag) => {
    setActiveTag((prev) => (prev === tag ? "" : tag));
  }, []);

  // Delete one result
  const handleDelete = (id) => {
    deleteResult(id);
    setResults(loadResults());
  };

  // Clear all
  const handleClearAll = () => {
    if (!window.confirm("Delete all saved results? This cannot be undone.")) return;
    clearAllResults();
    setResults([]);
  };

  // Refresh from storage
  const handleRefresh = () => setResults(loadResults());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Images size={22} className="text-brand-500" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Caption Gallery
            </h1>
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {results.length} image{results.length !== 1 ? "s" : ""} processed · {filtered.length} shown
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <button onClick={handleRefresh} className="btn-secondary text-xs py-2 px-3">
            <RefreshCw size={13} />
            Refresh
          </button>
          <button onClick={() => exportAsCSV(results)} disabled={results.length === 0}
                  className="btn-secondary text-xs py-2 px-3 disabled:opacity-40">
            <FileDown size={13} />
            CSV
          </button>
          <button onClick={() => exportAsTXT(results)} disabled={results.length === 0}
                  className="btn-secondary text-xs py-2 px-3 disabled:opacity-40">
            <FileText size={13} />
            TXT
          </button>
          {results.length > 0 && (
            <button onClick={handleClearAll}
                    className="btn-secondary text-xs py-2 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
              <Trash2 size={13} />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filters bar */}
      <div className="card p-4 space-y-4">

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search captions, tags, or filenames…"
        />

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Layers size={13} />
            Category:
          </div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`caption-tab ${activeCategory === cat ? "caption-tab-active" : ""}`}
            >
              {cat === "All" ? "🗂️ All" :
               cat === "academic" ? "🎓 Academic" :
               cat === "social"   ? "🎉 Social" :
               cat === "work"     ? "💼 Work" : "🌿 Outdoor"}
            </button>
          ))}
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Tag size={13} />
              Tags:
            </div>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`tag ${activeTag === tag ? "tag-active" : ""}`}
              >
                {tag}
              </button>
            ))}
            {activeTag && (
              <button
                onClick={() => setActiveTag("")}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={12} />
                Clear tag
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((r) => (
            <div key={r.id} className="relative group">
              <ResultCard
                result={r}
                onTagClick={handleTagClick}
                activeTag={activeTag}
              />
              {/* Delete button overlay */}
              <button
                onClick={() => handleDelete(r.id)}
                className="absolute top-3 left-3 w-7 h-7 rounded-lg bg-red-500 hover:bg-red-600
                           text-white flex items-center justify-center shadow-md
                           opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10"
                title="Delete this result"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card flex flex-col items-center justify-center py-20 gap-4 text-center px-6 animate-fade-in">
          <Images size={40} className="text-slate-300 dark:text-slate-600" />
          <div>
            <p className="font-semibold text-slate-500 dark:text-slate-400">No results found</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              {results.length === 0
                ? "Process some images on the Home page first."
                : "Try adjusting your search or filters."}
            </p>
          </div>
          {(searchQuery || activeTag || activeCategory !== "All") && (
            <button
              onClick={() => { setSearchQuery(""); setActiveTag(""); setActiveCategory("All"); }}
              className="btn-secondary text-xs"
            >
              <X size={13} />
              Clear filters
            </button>
          )}
        </div>
      )}

    </div>
  );
}
