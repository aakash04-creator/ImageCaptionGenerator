/**
 * Navbar.jsx — Top navigation bar with dark mode toggle and page links.
 */

import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Sparkles, Images } from "lucide-react";

export default function Navbar({ darkMode, onToggleDark }) {
  const location = useLocation();

  const navLink = (to, label, Icon) => (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150
        ${location.pathname === to
          ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
    >
      <Icon size={15} />
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight gradient-text">AI Caption</p>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 leading-tight">Generator</p>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navLink("/", "Upload", Sparkles)}
          {navLink("/gallery", "Gallery", Images)}
        </nav>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400
                     hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

      </div>
    </header>
  );
}
