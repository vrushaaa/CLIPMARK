import React, { useState } from "react";
import BookmarkCard from "../components/BookmarkCard";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/NavBar";
import { Menu } from "lucide-react";

export default function Archived() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Temporary mock archived bookmarks
  const bookmarks = [
    {
      id: 1,
      title: "Old Project Docs",
      url: "https://example.com/docs",
      notes: "Archived old documentation",
      tags: ["docs", "archive"],
      is_favourite: false,
      is_archived: true,
      created_at: "2023-09-15T10:00:00",
    },
    {
      id: 2,
      title: "MDN Web Docs",
      url: "https://developer.mozilla.org",
      notes: "Reference for HTML, CSS, JS",
      tags: ["javascript", "css", "web"],
      is_favourite: true,
      is_archived: true,
      created_at: "2024-02-20T13:45:00",
    },
    {
      id: 3,
      title: "Tailwind Cheatsheet",
      url: "https://tailwindcomponents.com/cheatsheet/",
      notes: "Handy for styling",
      tags: ["tailwind", "css"],
      is_favourite: false,
      is_archived: true,
      created_at: "2024-05-10T09:15:00",
    },
  ];

  return (
    <>
    <NavBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
    <div className="flex min-h-screen bg-[var(--color-sky-aqua-50)] dark:bg-slate-900 transition-colors">

      {/* ---------- Mobile Sidebar Toggle Button ---------- */}
      <button
        onClick={toggleSidebar}
        className="fixed top-3 left-3 lg:hidden z-50 p-2 rounded-full bg-[#4CCCE6] text-slate-900 shadow-md hover:opacity-90"
        aria-label="Toggle Sidebar"
      >
        <Menu size={24} />
      </button>

      {/* ---------- Sidebar ---------- */}
      <div
        className={`fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${
            isSidebarOpen
              ? "w-64 translate-x-0"
              : "w-64 -translate-x-full lg:w-0"
          } overflow-y-auto shrink-0`}
      >
        <Sidebar />
      </div>

      {/* ---------- Mobile Overlay ---------- */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* ---------- MAIN CONTENT AREA ---------- */}
      <div className="flex-1 flex flex-col">

        

        <main className="flex-1 p-4 md:p-8">

          {/* Page Header */}
          <header className="mb-6 md:mb-8">
            <h1 className="text-3xl font-extrabold text-[var(--color-sky-aqua-900)] dark:text-white">
              Archived Bookmarks
            </h1>
            <p className="text-sm text-[var(--color-sky-aqua-700)] dark:text-slate-300 mt-1">
              Old bookmarks kept safely out of your main list.
            </p>
          </header>

          {/* Bookmarks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                id={bookmark.id}
                title={bookmark.title}
                url={bookmark.url}
                notes={bookmark.notes}
                tags={bookmark.tags}
                isFavourite={bookmark.is_favourite}
                isArchived={bookmark.is_archived}
                createdAt={bookmark.created_at}
                onToggleFavourite={() => alert("Backend not integrated yet")}
                onToggleArchive={() => alert("Backend not integrated yet")}
              />
            ))}
          </div>

        </main>
      </div>
    </div>
    </>
    
  );
}
