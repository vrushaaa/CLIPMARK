import React, { useState } from "react";
import BookmarkCard from "../components/BookmarkCard";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

export default function Favourites() {
 
  const [bookmarks, setBookmarks] = useState([
    {
      id: 1,
      title: "React Docs",
      url: "https://react.dev",
      notes: "Official documentation for React.js.",
      tags: ["react", "frontend"],
      isFavourite: true,
      archived: false,
      createdAt: "2024-11-01",
    },
    {
      id: 2,
      title: "Tailwind CSS",
      url: "https://tailwindcss.com",
      notes: "Utility-first CSS framework.",
      tags: ["css", "design"],
      isFavourite: false,
      archived: false,
      createdAt: "2024-11-05",
    },
  ]);

  // Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // QR Modal
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrData, setQrData] = useState({ title: "", url: "", dataUri: "" });

  const showQR = (id) => {
    const bm = bookmarks.find((b) => b.id === id);
    if (!bm) return;

    // Fake QR Data
    setQrData({
      title: bm.title,
      url: bm.url,
      dataUri:
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
        bm.url,
    });

    setQrModalOpen(true);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // for now just print or filter locally
    console.log("Searching for:", searchQuery);
  };

  const clearSearch = () => setSearchQuery("");

  const toggleArchive = (id, newStatus) => {
    setBookmarks((prev) =>
      prev.map((bm) => (bm.id === id ? { ...bm, archived: newStatus } : bm))
    );
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookmarkIdToDelete, setBookmarkIdToDelete] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const handleDelete = (id) => {
    setBookmarkIdToDelete(id);
    setDeleteModalOpen(true);
  };
  const handleEdit = (id) => {
    setCurrentEditId(id);
    setEditModalOpen(true);
  };

  const [addModalOpen, setAddModalOpen] = useState(false);
  const handleAddNew = () => {
    setAddModalOpen(true);
  };

  const handleAddBookmark = (data) => {
    const newBookmark = {
      id: Date.now(),
      title: data.title,
      url: data.url,
      notes: data.notes,
      tags: data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isFavourite: false,
      archived: false,
      createdAt: new Date().toISOString(),
    };

    setBookmarks((prev) => [newBookmark, ...prev]);
    setAddModalOpen(false);
  };



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
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            aria-hidden="true"
          />
        )}

        {/* ---------- MAIN CONTENT AREA ---------- */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 md:p-8">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-[var(--color-sky-aqua-900)] dark:text-[var(--color-sky-aqua-50)]">
                Favourite Bookmarks
              </h1>
              <p className="text-sm text-[var(--color-sky-aqua-700)] dark:text-slate-300 mt-1">
                Your most important links saved in one place.
              </p>
            </div>

            {/* Bookmarks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bm) => (
                <BookmarkCard
                  key={bm.id}
                  id={bm.id}
                  title={bm.title}
                  url={bm.url}
                  notes={bm.notes}
                  tags={bm.tags}
                  isFavourite={bm.isFavourite}
                  isArchived={bm.isArchived}
                  createdAt={bm.createdAt}
                  onShowQR={showQR}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleFavourite={() => console.log("fav")}
                  onToggleArchive={() => toggleArchive(bm.id, !bm.archived)}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
