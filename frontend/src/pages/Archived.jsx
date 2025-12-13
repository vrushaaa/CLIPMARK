import React, { useEffect, useState } from "react";
import BookmarkCard from "../components/BookmarkCard";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/NavBar";
import { Menu } from "lucide-react";
import api from "../services/api";
import bookmarkService from "../services/bookmarkService";

import QRModal from "../components/modals/QRModal";
import DeleteModal from "../components/modals/DeleteModal";
import EditBookmarkModal from "../components/modals/EditBookmarkModal";
import AddBookmarkModal from "../components/modals/AddBookmarkModal";


export default function Archived() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // QR Modal
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrData, setQrData] = useState({ title: "", url: "", dataUri: "" });

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookmarkIdToDelete, setBookmarkIdToDelete] = useState(null);

  // Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);

  // Edit Fields
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editArchived, setEditArchived] = useState("true"); // archived page
  const [editLoading, setEditLoading] = useState(false);

  // Add Modal
  const [addModalOpen, setAddModalOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // ---------------- FETCH ARCHIVED BOOKMARKS ----------------
  useEffect(() => {
    const fetchArchived = async () => {
      try {
        // const res = await api.get("api/bookmarks?archived=true");
        const res = await bookmarkService.getArchivedBookmarks();
        // console.log(res)
        setBookmarks(res.data.bookmarks || []);
      } catch (error) {
        console.error("Failed to fetch archived bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArchived();
  }, []);

  // ---------------- TOGGLE ARCHIVE ----------------
  const handleToggleArchive = async (id, newValue) => {
    try {
      await api.patch(`/api/bookmarks/${id}/archive`, {
        is_archived: newValue,
      });

      if (!newValue) {
        // Remove from list if unarchived
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
      } else {
        setBookmarks((prev) =>
          prev.map((b) => (b.id === id ? { ...b, is_archived: newValue } : b))
        );
      }
    } catch (err) {
      console.error("Failed to toggle archive:", err);
    }
  };

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

  const handleDelete = (id) => {
    setBookmarkIdToDelete(id);
    setDeleteModalOpen(true);
  };

const handleDeleteConfirm = async () => {
  try {
    await api.delete(`/api/bookmarks/${bookmarkIdToDelete}`);

    setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkIdToDelete));

    setDeleteModalOpen(false);
    setBookmarkIdToDelete(null);
  } catch (err) {
    console.error(err);
    alert("Failed to delete bookmark");
  }
};
const handleEdit = (id) => {
  const bm = bookmarks.find((b) => b.id === id);
  if (!bm) return;

  setCurrentEditId(id);
  setEditTitle(bm.title);
  setEditNotes(bm.notes || "");
  setEditTags((bm.tags || []).join(", "));
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
  } catch (err) {
    console.error(err);
    alert("Failed to update bookmark");
  } finally {
    setEditLoading(false);
  }
};

const handleAddBookmark = async (data) => {
  const res = await bookmarkService.createBookmark(data);
  setBookmarks((prev) => [res.bookmark, ...prev]);
  setAddModalOpen(false);
};

  return (
    <>
      <NavBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex min-h-screen bg-[var(--color-sky-aqua-50)] dark:bg-slate-900 transition-colors">
        {/* Mobile toggle */}
        <button
          onClick={toggleSidebar}
          className="fixed top-3 left-3 lg:hidden z-50 p-2 rounded-full bg-[#4CCCE6] text-slate-900 shadow-md hover:opacity-90"
        >
          <Menu size={24} />
        </button>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0 transition-transform duration-300 
          ${
            isSidebarOpen
              ? "w-64 translate-x-0"
              : "w-64 -translate-x-full lg:w-0"
          } overflow-y-auto`}
        >
          <Sidebar />
        </div>

        {isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          />
        )}

        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 md:p-8">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-[var(--color-sky-aqua-900)] dark:text-white">
                Archived Bookmarks
              </h1>
              <p className="text-sm text-[var(--color-sky-aqua-700)] dark:text-slate-300">
                Old bookmarks kept safely out of your main list.
              </p>
            </header>

            {loading ? (
              <p className="text-white">Loading...</p>
            ) : bookmarks.length === 0 ? (
              <p className="text-slate-300">No archived bookmarks found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    {...bookmark}
                    onShowQR={() => showQR(bookmark.id)}
                    onEdit={() => handleEdit(bookmark.id)}
                    onDelete={() => handleDelete(bookmark.id)}
                    onToggleArchive={(value) =>
                      handleToggleArchive(bookmark.id, value)
                    }
                  />
                ))}
              </div>
            )}
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
        onConfirm={handleDeleteConfirm}
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
