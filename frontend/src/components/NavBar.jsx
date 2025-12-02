import { useEffect, useState } from "react";
import { Moon, Sun, User } from "lucide-react";
import logo from "../assets/images/logo2.png";

export default function Navbar() {
  const [theme, setTheme] = useState("light");

  // Apply theme to <html> tag
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="w-full bg-[#20BFDF] dark:bg-[#137386] dark:text-red-600 text-white shadow  flex items-center justify-between transition-colors duration-300 h-16 px-6">
      {/* Logo */}
      <img src={logo} className="w-24" alt="Logo" />

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full border-[1px] border-gray-400 dark:border-gray-200 transition"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-gray-800" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
        </button>

        {/* Profile Icon */}
        <div className="w-10 h-10 rounded-ful flex items-center justify-center">
          <User className="w-6 h-6 text-gray-800 dark:text-white" />
        </div>
      </div>
    </nav>
  );
}
