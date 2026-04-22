/**
 * Home.jsx — Main upload + results page.
 *
 * Layout:
 *   Left column  → UploadPanel
 *   Right column → Processing spinner / result cards
 */

import { useEffect } from "react";
import UploadPanel from "../components/UploadPanel";
import ResultCard from "../components/ResultCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useImageProcessor } from "../hooks/useImageProcessor";
import { loadResults } from "../services/storage";
import { exportAsCSV, exportAsTXT } from "../utils/export";
import { Sparkles, FileDown, FileText, Trash2, AlertCircle } from "lucide-react";

export default function Home() {
  const { processing, progress, results, errors, processImages } = useImageProcessor();

  // On mount, pre-load results from localStorage so returning users see their history
  // (The hook's results state only tracks current session; Gallery page shows full history)

  const allStoredResults = loadResults(); // For export

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* Hero banner */}
      <div className="text-center space-y-3 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 text-xs font-semibold">
          <Sparkles size={13} />
          Powered by Mock AI · Real API Ready
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight gradient-text">
          AI Image Caption Generator
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base max-w-xl mx-auto">
          Upload images and instantly get AI-powered object detection, scene classification,
          and 3 styles of captions — descriptive, creative, and accessible.
        </p>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        {/* Upload panel — sticky on desktop */}
        <div className="lg:col-span-2 lg:sticky lg:top-24">
          <UploadPanel onProcess={processImages} processing={processing} />

          {/* Export buttons */}
          {allStoredResults.length > 0 && (
            <div className="card p-4 mt-4 space-y-2">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Export All Captions ({allStoredResults.length})
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => exportAsCSV(allStoredResults)}
                  className="btn-secondary text-xs py-2 px-3 flex-1 justify-center"
                >
                  <FileDown size={13} />
                  CSV
                </button>
                <button
                  onClick={() => exportAsTXT(allStoredResults)}
                  className="btn-secondary text-xs py-2 px-3 flex-1 justify-center"
                >
                  <FileText size={13} />
                  TXT
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results panel */}
        <div className="lg:col-span-3 space-y-4">

          {/* Loading spinner */}
          {processing && (
            <div className="card">
              <LoadingSpinner current={progress.current} total={progress.total} />
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="card p-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 animate-fade-in">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                <AlertCircle size={15} />
                <p className="text-sm font-semibold">
                  {errors.length} file{errors.length > 1 ? "s" : ""} failed to process
                </p>
              </div>
              {errors.map((e, i) => (
                <p key={i} className="text-xs text-red-500 dark:text-red-400">
                  {e.fileName}: {e.error}
                </p>
              ))}
            </div>
          )}

          {/* Result cards */}
          {results.length > 0 && (
            <div className="space-y-4">
              {results.map((r) => (
                <ResultCard key={r.id} result={r} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!processing && results.length === 0 && errors.length === 0 && (
            <div className="card flex flex-col items-center justify-center py-20 gap-4 animate-fade-in text-center px-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 flex items-center justify-center">
                <Sparkles size={34} className="text-brand-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-600 dark:text-slate-300">
                  No images processed yet
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  Upload images on the left to see AI captions appear here
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
