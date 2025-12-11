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
  // const USER_ID = 1;

  // const [bookmark, setBookmarks] = useState([]);
  // const [page, setPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  // const [searchQuery, setSearchQuery] = useState("");

  // // Sidebar
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // // Modals
  // const [qrModalOpen, setQrModalOpen] = useState(false);
  // const [qrData, setQrData] = useState({ title: "", url: "", dataUri: "" });

  // const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // const [bookmarkIdToDelete, setBookmarkIdToDelete] = useState(null);
  // const [deleting, setDeleting] = useState(false);

  // const [addModalOpen, setAddModalOpen] = useState(false);
  // const [addUrl, setAddUrl] = useState("");
  // const [addTitle, setAddTitle] = useState("");
  // const [addNotes, setAddNotes] = useState("");
  // const [addTags, setAddTags] = useState("");
  // const [adding, setAdding] = useState(false);

  // const [editModalOpen, setEditModalOpen] = useState(false);
  // const [currentEditId, setCurrentEditId] = useState(null);
  // const [editTitle, setEditTitle] = useState("");
  // const [editNotes, setEditNotes] = useState("");
  // const [editTags, setEditTags] = useState("");
  // const [editArchived, setEditArchived] = useState("false");
  // const [savingEdit, setSavingEdit] = useState(false);

  // const fetchBookmarks = useCallback(async () => {
  //   try {
  //     const params = {
  //       user_id: USER_ID,
  //       page,
  //       q: searchQuery || undefined,
  //     };

  //     const res = await axios.get("/api/bookmarks", { params });

  //     setBookmarks(res.data.bookmarks || []);
  //     setPage(res.data.page || 1);
  //     setTotalPages(res.data.total_pages || 1);
  //   } catch (err) {
  //     console.error("Error fetching bookmarks:", err);
  //   }
  // }, [USER_ID, page, searchQuery]);

  // useEffect(() => {
  //   fetchBookmarks();
  // }, [fetchBookmarks]);

  // // QR Modal
  // const showQR = async (id) => {
  //   try {
  //     const res = await axios.get(`/api/bookmarks/${id}/qr`);
  //     setQrData({
  //       title: res.data.qr_title,
  //       url: res.data.qr_url,
  //       dataUri: res.data.qr_data_uri,
  //     });
  //     setQrModalOpen(true);
  //   } catch (err) {
  //     alert("Failed to load QR code");
  //   }
  // };

  // // Delete
  // const openDeleteModal = (id) => {
  //   setBookmarkIdToDelete(id);
  //   setDeleteModalOpen(true);
  // };
  // const confirmDelete = async () => {
  //   setDeleting(true);
  //   try {
  //     await axios.delete(`/api/bookmarks/${bookmarkIdToDelete}`, {
  //       params: { user_id: USER_ID },
  //     });

  //     setDeleteModalOpen(false);
  //     fetchBookmarks();
  //   } catch (err) {
  //     alert("Failed to delete bookmark");
  //   } finally {
  //     setDeleting(false);
  //   }
  // };

  // // Add Bookmark
  // const handleAddBookmark = async (e) => {
  //   e.preventDefault();
  //   setAdding(true);

  //   const tags = addTags
  //     .split(",")
  //     .map((t) => t.trim())
  //     .filter(Boolean);

  //   try {
  //     await axios.post("/api/bookmarks", {
  //       user_id: USER_ID,
  //       url: addUrl,
  //       title: addTitle || null,
  //       notes: addNotes,
  //       tags,
  //       archived: false,
  //     });

  //     setAddModalOpen(false);
  //     setAddUrl("");
  //     setAddTitle("");
  //     setAddNotes("");
  //     setAddTags("");
  //     fetchBookmarks();
  //   } catch (err) {
  //     alert("Failed to add bookmark");
  //   } finally {
  //     setAdding(false);
  //   }
  // };

  // // Edit Bookmark
  // const openEditModal = async (id) => {
  //   setCurrentEditId(id);
  //   setEditModalOpen(true);

  //   try {
  //     const res = await axios.get(`/api/bookmarks/${id}`, {
  //       params: { user_id: USER_ID },
  //     });

  //     const b = res.data;
  //     setEditTitle(b.title || "");
  //     setEditNotes(b.notes || "");
  //     setEditTags(b.tags?.join(", ") || "");
  //     setEditArchived(b.archived ? "true" : "false");
  //   } catch (err) {
  //     alert("Failed to load bookmark");
  //   }
  // };

  // const saveEditBookmark = async (e) => {
  //   e.preventDefault();
  //   setSavingEdit(true);

  //   const tags = editTags
  //     .split(",")
  //     .map((t) => t.trim())
  //     .filter(Boolean);

  //   try {
  //     await axios.put(`/api/bookmarks/${currentEditId}`, {
  //       user_id: USER_ID,
  //       title: editTitle || null,
  //       notes: editNotes,
  //       tags,
  //       archived: editArchived === "true",
  //     });

  //     setEditModalOpen(false);
  //     fetchBookmarks();
  //   } catch (err) {
  //     alert("Failed to save bookmark");
  //   } finally {
  //     setSavingEdit(false);
  //   }
  // };

  // // Archive Toggle
  // const toggleArchive = async (id, newStatus) => {
  //   try {
  //     await axios.patch(
  //       `/api/bookmarks/${id}/archive`,
  //       { archived: newStatus },
  //       { params: { user_id: USER_ID } }
  //     );
  //     fetchBookmarks();
  //   } catch (err) {
  //     alert("Failed to update archive status");
  //   }
  // };

  // // Search
  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   setPage(1);
  //   fetchBookmarks();
  // };

  // const clearSearch = () => {
  //   setSearchQuery("");
  //   setPage(1);
  // };

  // // Pagination
  // const goToPage = (p) => {
  //   if (p >= 1 && p <= totalPages) setPage(p);
  // };

  // // Mock data adapted to fit the BookmarkCard props
  // const bookmarks = [
  //   {
  //     id: 1,
  //     title: "React Docs",
  //     url: "https://react.dev",
  //     notes: "Official documentation for React.js.",
  //     tags: ["react", "frontend"],
  //     isFavourite: true,
  //     isArchived: false,
  //     createdAt: "2 days ago",
  //   },
  //   {
  //     id: 2,
  //     title: "Tailwind CSS",
  //     url: "https://tailwindcss.com",
  //     notes: "Rapidly build modern websites with utility-first CSS.",
  //     tags: ["css", "design"],
  //     isFavourite: false,
  //     isArchived: false,
  //     createdAt: "1 week ago",
  //   },
  //   {
  //     id: 3,
  //     title: "Lucide Icons",
  //     url: "https://lucide.dev",
  //     notes: "A beautiful, community-driven icon library.",
  //     tags: ["icons", "ui"],
  //     isFavourite: true,
  //     isArchived: false,
  //     createdAt: "1 month ago",
  //   },
  //   {
  //     id: 4,
  //     title: "The Gemini API",
  //     url: "https://ai.google.dev/gemini-api/docs",
  //     notes: "Documentation for the Google Gemini API.",
  //     tags: ["ai", "backend"],
  //     isFavourite: false,
  //     isArchived: false,
  //     createdAt: "5 hours ago",
  //   },
  // ];

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

      <div className="flex min-h-screen bg-[#e9f9fc] dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
        <button
          onClick={toggleSidebar}
          className="fixed top-3 left-3 z-50 p-2 rounded-full bg-[#4CCCE6] text-slate-900 shadow-md lg:hidden transition hover:opacity-90"
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
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#1999b3] dark:text-[#4CCCE6]">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
