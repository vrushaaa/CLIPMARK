import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/NavBar";
import BookmarkCard from "../components/BookmarkCard";
import { Menu } from "lucide-react";
import tagService from "../services/tagService";

export default function TagBookmarks() {
  const { tagName } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // ---------------- FETCH BOOKMARKS FOR THIS TAG ----------------
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const data = await tagService.getBookmarksByTag(tagName);
        setBookmarks(data.bookmarks);
      } catch (error) {
        console.error("Failed to load tag-specific bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBookmarks();
  }, [tagName]);

  return (
    <>
      <NavBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex min-h-screen bg-[var(--color-sky-aqua-50)] dark:bg-slate-900 transition-colors">
        {/* ---------------- MOBILE SIDEBAR BUTTON ---------------- */}
        <button
          onClick={toggleSidebar}
          className="fixed top-3 left-3 lg:hidden z-50 p-2 rounded-full bg-[#4CCCE6] text-black shadow-md hover:opacity-90"
        >
          <Menu size={24} />
        </button>

        {/* ---------------- SIDEBAR ---------------- */}
        <div
          className={`fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0 
          transition-transform duration-300 ease-in-out 
          ${
            isSidebarOpen
              ? "w-64 translate-x-0"
              : "w-64 -translate-x-full lg:w-0"
          } 
          overflow-y-auto`}
        >
          <Sidebar />
        </div>

        {isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          />
        )}

        {/* ---------------- MAIN CONTENT ---------------- */}
        <div className="flex-1 p-4 md:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[var(--color-sky-aqua-900)] dark:text-white">
              #{tagName}
            </h1>

            <p className="text-sm text-[var(--color-sky-aqua-700)] dark:text-slate-300 mt-1">
              Bookmarks tagged with{" "}
              <span className="font-bold">"{tagName}"</span>
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <p className="text-slate-700 dark:text-slate-300">
              Loading bookmarks...
            </p>
          ) : bookmarks.length === 0 ? (
            // ---------------- EMPTY STATE ----------------
            <div
              className="
              p-6 rounded-xl shadow-md 
              bg-white dark:bg-slate-800 
              border border-[var(--color-sky-aqua-200)] dark:border-slate-700
              transition-all duration-300
            "
            >
              <p className="text-[var(--color-sky-aqua-900)] dark:text-white font-semibold">
                No bookmarks found for #{tagName}
              </p>
              <p className="text-sm text-[var(--color-sky-aqua-700)] dark:text-slate-400 mt-1">
                Add this tag to a bookmark from your dashboard.
              </p>
            </div>
          ) : (
            // ---------------- BOOKMARK GRID ----------------
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="
                    transition-all duration-300 ease-in-out
                    hover:scale-[1.02] hover:shadow-xl
                  "
                >
                  <BookmarkCard
                    {...bm}
                    onToggleFavourite={() =>
                      alert("Backend integration pending")
                    }
                    onToggleArchive={() => alert("Backend integration pending")}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
