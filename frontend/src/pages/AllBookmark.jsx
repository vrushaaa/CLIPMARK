import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/NavBar";
import BookmarkCard from "../components/BookmarkCard";
import Button from "../components/Button";
import {
  Menu,
  Plus,
  QrCode,
  Trash2,
  Edit2,
  Archive,
  ArchiveRestore,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import QRModal from '../components/modals/QRModal';
import DeleteModal from "../components/modals/DeleteModal";
import AddBookmarkModal from "../components/modals/AddBookmarkModal";
import EditBookmarkModal from "../components/modals/EditBookmarkModal";


export default function AllBookmark() {

  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  
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


// const handleDelete = (id) => {
//   setBookmarkIdToDelete(id);
//   setDeleteModalOpen(true);
// };


const handleEdit = (id) => {
  setCurrentEditId(id);
  setEditModalOpen(true);
};

// const [addModalOpen, setAddModalOpen] = useState(false);
// const handleAddNew = () => {
//   setAddModalOpen(true);
// };

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
        <button
          onClick={toggleSidebar}
          className="fixed top-3 left-3 lg:hidden z-50 p-2 rounded-full bg-[#4CCCE6] text-slate-900 shadow-md hover:opacity-90"
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>

        {/* Sidebar Container: Responsible for responsive visibility */}
        <div
          className={`fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${
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
              aria-hidden="true"
            />
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <main className="p-4 md:p-8 flex-1">
            {/* Header and Add Button */}
            <div className="flex justify-between items-center mb-8 pt-4 lg:pt-0">
              <h1 className="text-3xl font-extrabold text-[var(--color-sky-aqua-900)] dark:text-[var(--color-sky-aqua-50)]">
                All Links
              </h1>
              <Button
                className="flex items-center gap-2"
                onClick={handleAddNew}
              >
                <Plus size={20} /> Add New Link
              </Button>
            </div>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="max-w-xl w-full mx-auto mb-8"
            >
              <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-xl gap-3">
                <Search className="text-[#1999b3] dark:text-[#4CCCE6]" />
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  className="flex-1 bg-transparent outline-none text-slate-900 dark:text-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </form>

            {/* Bookmark Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.length > 0 ? (
                bookmarks.map((bm) => (
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
                ))
              ) : (
                <p className="text-slate-600 dark:text-slate-400">
                  You haven't saved any links yet. Start by clicking "Add New
                  Link"!
                </p>
              )}
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
          console.log("Deleting bookmark:", bookmarkIdToDelete);
          // later call API
          setDeleteModalOpen(false);
        }}
      />

      {/* Edit Modal */}
      <EditBookmarkModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        bookmarkId={currentEditId}
      />

      <AddBookmarkModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddBookmark}
      />
    </>
  );
}
