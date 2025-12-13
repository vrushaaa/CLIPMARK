import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/NavBar";
import BookmarkCard from "../components/BookmarkCard";
import Button from "../components/Button";
import { Menu, Plus } from "lucide-react";

import bookmarkService from "../services/bookmarkService";

import QRModal from "../components/modals/QRModal";
import DeleteModal from "../components/modals/DeleteModal";
import AddBookmarkModal from "../components/modals/AddBookmarkModal";
import EditBookmarkModal from "../components/modals/EditBookmarkModal";

export default function Dashboard() {
  // Layout State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Data
  const [bookmarks, setBookmarks] = useState([]);
  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modals
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrData, setQrData] = useState({ title: "", url: "", dataUri: "" });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookmarkIdToDelete, setBookmarkIdToDelete] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  const [addModalOpen, setAddModalOpen] = useState(false);

  // Edit bookmark fields
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editArchived, setEditArchived] = useState("false");
  const [editLoading, setEditLoading] = useState(false);

  // ---------------------
  // FETCH BOOKMARKS
  // ---------------------
  const fetchBookmarks = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await bookmarkService.getAllBookmarks({ archived: false });
      setBookmarks(res.bookmarks || []);
    } catch (err) {
      setError(err.error || err.message || "Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await bookmarkService.getDashboardSummary();
      setSummary(res);
    } catch {
      /* ignore summary errors */
    }
  };

  useEffect(() => {
    fetchBookmarks();
    fetchSummary();
  }, []);

  // ---------------------
  // QR SHOW
  // ---------------------
  const showQR = (id) => {
    const bm = bookmarks.find((b) => b.id === id);
    if (!bm) return;

    setQrData({
      title: bm.title,
      url: bm.url,
      dataUri:
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
        bm.url,
    });

    setQrModalOpen(true);
  };

  // ---------------------
  // ARCHIVE
  // ---------------------
  const handleToggleArchive = async (id) => {
    try {
      await bookmarkService.toggleArchive(id);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } catch {
      alert("Failed to archive/unarchive bookmark");
    }
  };

  // ---------------------
  // TOGGLE FAVOURITE
  // ---------------------
  const handleToggleFavourite = async (id) => {
    try {
      const response = await bookmarkService.toggleFavourite(id);
      
      // Update local state optimistically
      setBookmarks((prev) =>
        prev.map((bm) =>
          bm.id === id ? { ...bm, is_favourite: response.is_favourite } : bm
        )
      );
    } catch (err) {
      alert("Failed to toggle favourite");
    }
  };

  // ---------------------
  // DELETE
  // ---------------------
  const handleDelete = (id) => {
    setBookmarkIdToDelete(id);
    setDeleteModalOpen(true);
  };

  // ---------------------
  // ADD LINK
  // ---------------------
  const handleAddLink = () => {
    setAddModalOpen(true);

    const msg = document.getElementById("add-link-message");
    if (msg) {
      msg.textContent = "Modal for adding a new link should appear here!";
      setTimeout(() => (msg.textContent = ""), 3000);
    }
  };

  // ---------------------
  // EDIT
  // ---------------------
  const handleEdit = (id) => {
    const bm = bookmarks.find((b) => b.id === id);
    if (!bm) return;

    setCurrentEditId(id);
    setEditTitle(bm.title);
    setEditNotes(bm.notes || "");
    setEditTags(bm.tags?.join(", ") || "");
    setEditArchived(bm.is_archived ? "true" : "false");

    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      const updated = {
        title: editTitle,
        notes: editNotes,
        tags: editTags.split(",").map((t) => t.trim()),
        archived: editArchived === "true",
      };

      const res = await bookmarkService.updateBookmark(currentEditId, updated);

      setBookmarks((prev) =>
        prev.map((b) => (b.id === currentEditId ? res.bookmark : b))
      );

      setEditModalOpen(false);
    } catch {
      alert("Failed to save bookmark");
    } finally {
      setEditLoading(false);
    }
  };

  // new bookmark
  // ADD BOOKMARK FIELDS
  const [addUrl, setAddUrl] = useState("");
  const [addTitle, setAddTitle] = useState("");
  const [addNotes, setAddNotes] = useState("");
  const [addTags, setAddTags] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);

    try {
      const payload = {
        url: addUrl,
        title: addTitle,
        notes: addNotes,
        tags: addTags.split(",").map((t) => t.trim()),
      };

      const res = await bookmarkService.createBookmark(payload);

      // Add new bookmark to UI
      setBookmarks((prev) => [res.bookmark, ...prev]);

      // Close modal
      setAddModalOpen(false);

      // Clear form
      setAddUrl("");
      setAddTitle("");
      setAddNotes("");
      setAddTags("");
    } catch (err) {
      alert("Failed to add bookmark");
    } finally {
      setAddLoading(false);
    }
  };


  return (
    <>
      {/* NAVIGATION */}
      <NavBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* MAIN WRAPPER */}
      <div className="flex min-h-screen bg-[#e9f9fc] dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="fixed top-3 left-3 z-50 p-2 rounded-full bg-[#4CCCE6] text-slate-900 shadow-md lg:hidden hover:opacity-90"
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>

        {/* SIDEBAR */}
        <div
          className={`fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out 
            ${
              isSidebarOpen
                ? "w-64 translate-x-0"
                : "w-64 -translate-x-full lg:w-0"
            } 
            overflow-y-auto shrink-0`}
        >
          <Sidebar />

          {isSidebarOpen && (
            <div
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            />
          )}
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col">
          <main className="p-4 md:p-8 flex-1 max-w-7xl mx-auto w-full">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-10 mt-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#1999b3] dark:text-[#4CCCE6]">
                  All Links
                </h1>

                {summary && (
                  <p className="text-slate-600 dark:text-slate-300">
                    {summary.username} — {summary.total_bookmarks || 0}{" "}
                    bookmarks
                  </p>
                )}
              </div>

              <Button
                onClick={handleAddLink}
                className="flex items-center gap-2"
              >
                <Plus size={20} /> Add New Link
              </Button>
            </div>

            <p
              id="add-link-message"
              className="text-center text-green-500 dark:text-green-400 mb-4 h-6"
            />

            {/* BOOKMARK GRID */}
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : bookmarks.length === 0 ? (
              <p className="text-slate-600 dark:text-slate-400">
                You haven't saved any links yet. Start by clicking "Add New
                Link"!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-20">
                {bookmarks.map((bm) => (
                  <BookmarkCard
                    key={bm.id}
                    id={bm.id}
                    title={bm.title}
                    url={bm.url}
                    notes={bm.notes}
                    tags={bm.tags || []}
                    isFavourite={bm.is_favourite}           
                    isArchived={bm.is_archived}
                    createdAt={bm.createdAt}
                    onShowQR={showQR}
                    onToggleArchive={() => handleToggleArchive(bm.id)}
                    onDelete={() => handleDelete(bm.id)}
                    onEdit={() => handleEdit(bm.id)}
                    onToggleFavourite={() => handleToggleFavourite(bm.id)}  
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MODALS */}
      <QRModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        data={qrData}
      />

      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={async () => {
          try {
            await bookmarkService.deleteBookmark(bookmarkIdToDelete);
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== bookmarkIdToDelete)
            );
            setDeleteModalOpen(false);
            setBookmarkIdToDelete(null);
          } catch {
            alert("Failed to delete bookmark");
          }
        }}
      />

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

      <AddBookmarkModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        url={addUrl}
        setUrl={setAddUrl}
        title={addTitle}
        setTitle={setAddTitle}
        notes={addNotes}
        setNotes={setAddNotes}
        tags={addTags}
        setTags={setAddTags}
        loading={addLoading}
      />
    </>
  );
}
