import { useEffect, useState } from "react";
import { Moon, Sun, Paperclip, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  );

  // ✅ Temporary login state (replace later with real auth)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // ✅ Temporary logout function
  const handleLogout = () => {
    alert("Logged Out (Backend not added yet)");
    setIsLoggedIn(false);
  };

  return (
    <nav className="w-full shadow-lg transition-colors duration-300 h-16 px-6
      bg-white/90 backdrop-blur-sm dark:bg-slate-900/90 dark:border-b dark:border-slate-700
      flex items-center justify-between sticky top-0 z-50">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#48CAE4] to-cyan-300 flex items-center justify-center
          text-slate-900 shadow-md shadow-[#48CAE4]/20"
        >
          <Paperclip size={20} strokeWidth={2.5} className="transform -rotate-45" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          ClipMark
        </span>
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Navigation Links */}
        <div className="hidden sm:flex items-center gap-6 font-medium">
          
          {/* ❌ Show when NOT LOGGED IN */}
          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="text-slate-600 dark:text-slate-300 hover:text-[#48CAE4] transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-1.5 rounded-full bg-[#48CAE4] text-slate-900 font-bold hover:bg-cyan-400 transition shadow-md"
              >
                Signup
              </Link>
            </>
          )}

          {/* ✅ Show only AFTER LOGIN */}
          {isLoggedIn && (
            <>
              <Link
                to="/api/favourites"
                className="text-slate-600 dark:text-slate-300 hover:text-[#48CAE4] transition"
              >
                Favourites
              </Link>

              <Link
                to="/api/archived"
                className="text-slate-600 dark:text-slate-300 hover:text-[#48CAE4] transition"
              >
                Archived
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#48CAE4] transition"
              >
                <User size={16}/> Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:underline transition"
              >
                <LogOut size={16}/> Logout
              </button>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-500" />
          )}
        </button>

        {/* TEMP BUTTON: Click to simulate login while backend not added */}
        {!isLoggedIn && (
          <button
            onClick={() => {
              alert("Logged In (Simulated)");
              setIsLoggedIn(true);
            }}
            className="text-xs px-3 py-1 rounded-full bg-[var(--color-sky-aqua-500)] text-black"
          >
            Simulate Login
          </button>
        )}

      </div>
    </nav>
  );
}
