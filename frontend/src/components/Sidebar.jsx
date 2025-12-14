import {
  Home,
  Bookmark,
  Tag,
  Search,
  Settings,
  LogOut,
  Heart,
  Archive,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useState } from "react";

const menuItems = [
  { icon: Home, label: "Home", href: "/api/dashboard" },
  { icon: Bookmark, label: "All Links", href: "/api/bookmarks" },
  { icon: Heart, label: "Favourites", href: "/api/favourites" },
  { icon: Archive, label: "Archived", href: "/api/archived" },
  { icon: Tag, label: "Tags", href: "/api/tags" },
];

const baseLinkClasses =
  "flex items-center gap-4 px-4 py-3 rounded-lg mb-2 transition-all duration-200 group";
const activeLinkClasses = "bg-[#4CCCE6] text-slate-900 shadow-lg font-semibold";
const inactiveLinkClasses = "hover:bg-white/10 text-white/90";

function NavItem({ to, icon: Icon, label, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${baseLinkClasses} ${
          isActive ? activeLinkClasses : inactiveLinkClasses
        }`
      }
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="font-medium"> {label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();

  const [, setIsLoggedIn] = useState(Boolean(localStorage.getItem("token")));

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
    <aside className="w-full h-full min-h-screen bg-[#1999b3] dark:bg-[#0d4c59] text-white flex flex-col">
      {/* Menu */}
      <nav className="flex-1 p-4 mt-10 space-y-5">
        {menuItems.map((item) => (
          <NavItem
            key={item.href}
            to={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>

      {/* Settings & Logout */}
      <div className="p-4 border-t border-white/10 dark:border-white/5">
        <button
          onClick={handleLogout}
          className={`${baseLinkClasses} text-red-300 hover:bg-red-900/10 hover:text-red-100 w-full`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
