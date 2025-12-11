import React from "react";
import { Home, Bookmark, Tag, Search, Settings, LogOut, Heart, Archive } from "lucide-react";
import { NavLink } from "react-router-dom"; // Assuming react-router-dom is used for navigation

export default function Sidebar() {
  const menuItems = [
    { icon: Home, label: "Home", href: "/api/dashboard" },
    { icon: Bookmark, label: "All Links", href: "/api/bookmarks" },
    { icon: Heart, label: "Favourites", href: "/api/favourites" },
    { icon: Archive, label: "Archived", href: "/api/archived" },
    { icon: Tag, label: "Tags", href: "/api/tags" },
    { icon: Search, label: "Search", href: "/api/search" },
  ];

  // Placeholder function for logout
  const handleLogout = () => {
    // In a real app, this would dispatch a logout action
    alert("Logged Out (Backend not added yet)"); 
  };

  const baseLinkClasses = "flex items-center gap-4 px-4 py-3 rounded-lg mb-2 transition-all duration-200 group";
  // Active link uses the bright accent color, text is dark
  const activeLinkClasses = "bg-[#4CCCE6] text-slate-900 shadow-lg font-semibold"; 
  const inactiveLinkClasses = "hover:bg-white/10 text-white/90"; // Inactive links are white on dark teal

  return (
    // Sidebar background uses the dark teal colors
    <aside className="w-full bg-[#1999b3] dark:bg-[#0d4c59] text-white min-h-screen flex flex-col">
      {/* Logo Top */}
      <div className="p-6 border-b border-white/10 dark:border-white/5">
        <h2 className="text-2xl font-bold"></h2>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        {menuItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.href}
            end={item.href === "/"} // Only apply 'end' for the exact home path
            className={({ isActive }) => 
              `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Settings & Logout */}
      <div className="p-4 border-t border-white/10 dark:border-white/5">
        <NavLink
            to="/settings"
            className={({ isActive }) => 
              `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
            }
        >
            <Settings className="w-5 h-5 shrink-0" />
            <span className="font-medium">Settings</span>
        </NavLink>
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