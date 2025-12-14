import { useEffect, useState } from "react";
import { Moon, Sun, Paperclip, User, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import authService from "../services/authService";
import Button from "./Button";

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const isDashboard = location.pathname === "/dashboard";

  const goToDashboard = () => navigate("/dashboard");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/auth/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav
      className="w-full shadow-lg transition-colors duration-300 h-16 px-6
      bg-white/90 backdrop-blur-sm dark:bg-slate-900/90 dark:border-b dark:border-slate-700
      flex items-center justify-between sticky top-0 z-50"
    >
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => {
          if (isLoggedIn) {
            toggleSidebar(); // open/close sidebar
          } else {
            navigate("/"); // go home
          }
        }}
      >
        <div
          className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#48CAE4] to-cyan-300 flex items-center justify-center
          text-slate-900 shadow-md shadow-[#48CAE4]/20"
        >
          <Paperclip
            size={20}
            strokeWidth={2.5}
            className="transform -rotate-45"
          />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          ClipMark
        </span>
      </div>

      {/* </Link> */}

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Navigation Links */}
        <div className="hidden sm:flex items-center gap-6 font-medium">
          {!isLoggedIn && (
            <>
              <Link
                to="/auth/login"
                className="text-slate-600 dark:text-slate-300 hover:text-[#48CAE4] transition"
              >
                Login
              </Link>

              <Link
                to="/auth/signup"
                className="px-4 py-1.5 rounded-full bg-[#48CAE4] text-slate-900 font-bold hover:bg-cyan-400 transition shadow-md"
              >
                Signup
              </Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <Link
                to="/api/profile"
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#48CAE4] transition"
              >
                <User size={16} /> Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:underline transition"
              >
                <LogOut size={16} /> Logout
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
      </div>
    </nav>
  );
}
