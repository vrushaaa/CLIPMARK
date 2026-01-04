import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, ArrowLeft, Home } from "lucide-react";
import brokenLink from "../assets/images/brokenLink.png";

/* ---------------- Navbar with Theme Toggle ---------------- */
function NotFoundNavbar() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <Link
        to="/"
        className="text-xl font-extrabold text-[#1b98b1] dark:text-[#4ecbe4]"
      >
        ClipMark
      </Link>

      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:scale-105 transition"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-slate-700" />
        )}
      </button>
    </nav>
  );
}

/* ---------------- 404 Page ---------------- */
export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-[var(--color-sky-aqua-50)] dark:bg-slate-900 transition-colors">
      <NotFoundNavbar />

      <main className="flex-1 flex justify-center px-4 pt-8">
        <div className="text-center max-w-xl">
          {/* Image + 404 */}
          <div className="flex flex-col items-center">
            <img
              src={brokenLink}
              alt="Broken link"
              className="w-40 mb-2 select-none"
            />

            <h1 className="text-[96px] sm:text-[120px] font-extrabold leading-none text-[#21bede] dark:text-[#4ecbe4]">
              404
            </h1>
          </div>

          <h2 className="mt-2 text-3xl font-bold text-[#07262c] dark:text-white">
            Page not found
          </h2>

          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Oops! The page you’re looking for doesn’t exist or may have been
            moved.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#21bede] text-white hover:bg-[#1b98b1] shadow-lg shadow-cyan-400/30 transition"
            >
              <Home size={18} />
              Go to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
