import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/NavBar";
import Button from "../components/Button";
import { Menu, Bookmark, Tags } from "lucide-react";
import authService from "../services/authService";
import toast from "react-hot-toast";

export default function HomeDashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [username, setUsername] = useState("User");

  useEffect(() => {
    // Check authentication
    const user = authService.getCurrentUser();
    if (!user) {
      toast.error('Please login to continue');
      navigate('/auth/login');
      return;
    }
    setUsername(user.username || user.name || 'User');
  }, [navigate]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <>
      <NavBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex min-h-screen bg-[#e9f9fc] dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="fixed top-3 left-3 z-50 p-2 rounded-full bg-[#4CCCE6] text-slate-900 shadow-md lg:hidden transition hover:opacity-90"
        >
          <Menu size={24} />
        </button>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0 transition-transform duration-300 ${
            isSidebarOpen
              ? "w-64 translate-x-0"
              : "w-64 -translate-x-full lg:w-0"
          } overflow-y-auto shrink-0`}
        >
          <Sidebar />

          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            />
          )}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10 flex flex-col items-center text-center">
          {/* Hero Section */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#1999b3] dark:text-[#4CCCE6]">
            Hello, {username} 👋
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mb-10">
            Welcome back to{" "}
            <span className="font-semibold text-[#1999b3] dark:text-[#4CCCE6]">
              ClipMark
            </span>{" "}
            – your secure vault for managing bookmarks, tags, and saved
            resources.
          </p>

          {/* Feature Cards */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-10 w-full max-w-4xl">
            {/* Bookmarks Card */}
            <a
              href="/api/bookmarks"
              className="w-full md:w-1/2 p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-[#4CCCE6] hover:shadow-lg transition shadow-sm text-left"
            >
              <h3 className="text-2xl font-bold mb-3 text-[#1999b3] dark:text-[#4CCCE6] flex items-center gap-2">
                <Bookmark size={26} /> Your Bookmarks
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                View and manage all your saved links in one place.
              </p>
            </a>

            {/* Tags Card */}
            <a
              href="/api/tags"
              className="w-full md:w-1/2 p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-[#4CCCE6] hover:shadow-lg transition shadow-sm text-left"
            >
              <h3 className="text-2xl font-bold mb-3 text-[#1999b3] dark:text-[#4CCCE6] flex items-center gap-2">
                <Tags size={26} /> Tags
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Organize your bookmarks smarter using custom tags.
              </p>
            </a>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-[#1999b3] dark:text-[#4CCCE6] mb-4">
              Your ClipMark is ready!
            </h2>

            <p className="text-slate-600 dark:text-slate-300 mb-8">
              Start organizing your digital world more efficiently.
            </p>

            <a href="/api/bookmarks">
              <Button className="px-10 py-4 text-lg">Go to Bookmarks</Button>
            </a>
          </div>
        </main>
      </div>
    </>
  );
}