import React, { useState } from "react";
import BookmarkCard from "../components/BookmarkCard";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

import QRModal from "../components/modals/QRModal";
import DeleteModal from "../components/modals/DeleteModal";
import EditBookmarkModal from "../components/modals/EditBookmarkModal";
import AddBookmarkModal from "../components/modals/AddBookmarkModal";


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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // QR Modal
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrData, setQrData] = useState({ title: "", url: "", dataUri: "" });

  // DELETE MODAL STATE
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookmarkIdToDelete, setBookmarkIdToDelete] = useState(null);

  // EDIT MODAL STATE
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  // EDIT FIELDS
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editArchived, setEditArchived] = useState("false");

  const [editLoading, setEditLoading] = useState(false);


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

  const toggleArchive = (id, newStatus) => {
    setBookmarks((prev) =>
      prev.map((bm) => (bm.id === id ? { ...bm, archived: newStatus } : bm))
    );
  };

  const [searchQuery, setSearchQuery] = useState("");
  const clearSearch = () => setSearchQuery("");


  const handleSearch = (e) => {
    e.preventDefault();
    // for now just print or filter locally
    console.log("Searching for:", searchQuery);
  };

  const handleDelete = (id) => {
    setBookmarkIdToDelete(id);
    setDeleteModalOpen(true);
  };


  const handleEdit = (id) => {
    const bm = bookmarks.find((b) => b.id === id);
    if (!bm) return;

    setCurrentEditId(id);
    setEditTitle(bm.title);
    setEditNotes(bm.notes);
    setEditTags(bm.tags.join(", "));
    setEditArchived(bm.archived ? "true" : "false");

    setEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const updated = {
      title: editTitle,
      notes: editNotes,
      tags: editTags.split(",").map((t) => t.trim()),
      archived: editArchived === "true",
    };

    setBookmarks((prev) =>
      prev.map((b) => (b.id === currentEditId ? { ...b, ...updated } : b))
    );

    setEditModalOpen(false);
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

      <div className="flex min-h-screen bg-[var(--color-sky-aqua-50)] dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
        {/* ---------- Mobile Sidebar Toggle Button ---------- */}
        <button
          onClick={toggleSidebar}
          className="fixed top-3 left-3 z-50 p-2 rounded-full bg-[#4CCCE6] text-slate-900 shadow-md lg:hidden transition hover:opacity-90"
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

          {/* ---------- Mobile Overlay ---------- */}
          {isSidebarOpen && (
            <div
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              aria-hidden="true"
            />
          )}
        </div>

        {/* ---------- MAIN CONTENT AREA ---------- */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            {/* Page Header */}
            <div className="mb-10 mt-10">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-sky-aqua-900)] dark:text-[var(--color-sky-aqua-50)]">
                Favourite Bookmarks
              </h1>

              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Your most important links saved in one place.
              </p>
            </div>

            {/* Bookmarks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {bookmarks.map((bm) => (
                <BookmarkCard
                  key={bm.id}
                  id={bm.id}
                  title={bm.title}
                  url={bm.url}
                  notes={bm.notes}
                  tags={bm.tags}
                  isFavourite={bm.isFavourite}
                  isArchived={bm.archived}
                  createdAt={bm.createdAt}
                  onShowQR={() => showQR(bm.id)}
                  onEdit={() => handleEdit(bm.id)}
                  onDelete={() => handleDelete(bm.id)}
                  onToggleArchive={() => toggleArchive(bm.id, !bm.archived)}
                />
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* QR Modal */}
      <QRModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        data={qrData}
      />

      {/* Delete Modal */}
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          setBookmarks((prev) =>
            prev.filter((b) => b.id !== bookmarkIdToDelete)
          );
          setDeleteModalOpen(false);
        }}
      />

      {/* Edit Modal */}
      <EditBookmarkModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        title={editTitle}
        setTitle={setEditTitle}
        notes={editNotes}
        setNotes={setEditNotes}
        tags={editTags}
        setTags={setEditTags}
        archived={editArchived}
        setArchived={setEditArchived}
        loading={editLoading}
      />

      {/* Add Modal */}
      <AddBookmarkModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddBookmark}
      />
    </>
  );
}
