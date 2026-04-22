/**
 * UploadPanel.jsx — Drag-and-drop + file picker image uploader.
 *
 * Features:
 *   - Drag-and-drop zone (react-dropzone)
 *   - Multiple file selection
 *   - Thumbnail preview grid before processing
 *   - "Process" button to trigger batch analysis
 */

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Zap, ImagePlus } from "lucide-react";

const MAX_FILES = 10;
const ACCEPTED_TYPES = { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] };

export default function UploadPanel({ onProcess, processing }) {
  const [stagedFiles, setStagedFiles] = useState([]);

  // Handle dropped / selected files
  const onDrop = useCallback((accepted) => {
    const combined = [...stagedFiles, ...accepted].slice(0, MAX_FILES);
    setStagedFiles(combined);
  }, [stagedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: MAX_FILES,
    multiple: true,
    disabled: processing,
  });

  const removeFile = (idx) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleProcess = () => {
    if (stagedFiles.length === 0 || processing) return;
    onProcess(stagedFiles);
    setStagedFiles([]);
  };

  return (
    <div className="card p-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
          <ImagePlus size={18} className="text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Upload Images</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Drop up to {MAX_FILES} images — JPG, PNG, WebP supported
          </p>
        </div>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl
                    cursor-pointer transition-all duration-200 py-12 px-6 text-center
                    border-slate-200 dark:border-slate-700 hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-950/20
                    ${isDragActive ? "dropzone-active" : ""}
                    ${processing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />

        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-200
                         bg-brand-50 dark:bg-brand-950 ${isDragActive ? "scale-110" : ""}`}>
          <UploadCloud size={30} className={`text-brand-500 ${isDragActive ? "animate-bounce" : ""}`} />
        </div>

        {isDragActive ? (
          <p className="text-brand-600 dark:text-brand-400 font-semibold text-sm">
            Drop your images here!
          </p>
        ) : (
          <>
            <p className="text-slate-600 dark:text-slate-300 font-semibold text-sm">
              Drag & drop images here
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              or <span className="text-brand-500 font-semibold underline underline-offset-2">browse files</span>
            </p>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {stagedFiles.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">
            Queued ({stagedFiles.length})
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {stagedFiles.map((file, idx) => (
              <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                {/* Overlay with filename */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                  <p className="text-white text-[9px] leading-tight truncate w-full">{file.name}</p>
                </div>
                {/* Remove button */}
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <X size={10} className="text-white" />
                </button>
              </div>
            ))}
          </div>

          {/* Process button */}
          <button
            onClick={handleProcess}
            disabled={processing}
            className="btn-primary w-full mt-4 justify-center py-3"
          >
            <Zap size={16} />
            {processing
              ? "Processing…"
              : `Analyze ${stagedFiles.length} image${stagedFiles.length > 1 ? "s" : ""} with AI`}
          </button>
        </div>
      )}

    </div>
  );
}
