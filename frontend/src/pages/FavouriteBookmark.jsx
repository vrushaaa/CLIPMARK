import React, { useEffect, useState } from "react";
import { useBookmarks } from "../contexts/BookmarkContext";
import Sidebar from "../components/Sidebar";
import NavBar from "../components/NavBar";
import BookmarkCard from "../components/BookmarkCard";
import { Menu } from "lucide-react";
import QRModal from "../components/modals/QRModal";
import DeleteModal from "../components/modals/DeleteModal";
import EditBookmarkModal from "../components/modals/EditBookmarkModal";
import AddBookmarkModal from "../components/modals/AddBookmarkModal";
import Pagination from "../components/Pagination";

export default function Favourites() {
  const {
    favouriteBookmarks = [],
    loading,
    error,
    fetchFavouriteBookmarks,
    toggleFavourite,
    toggleArchive,
    deleteBookmark,
    updateBookmark,
    getQRCode,
  } = useBookmarks();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // QR Modal
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrData, setQrData] = useState({ title: "", url: "", dataUri: "" });

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookmarkIdToDelete, setBookmarkIdToDelete] = useState(null);

  // Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editArchived, setEditArchived] = useState("false");
  const [editLoading, setEditLoading] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const handleAddNew = () => setAddModalOpen(true);

  // FETCH FAVOURITES ON MOUNT
  useEffect(() => {
    fetchFavouriteBookmarks();
  }, [fetchFavouriteBookmarks]);

  // QR: Use real backend QR
  const showQR = async (id) => {
    try {
      const data = await getQRCode(id);
      setQrData({
        title: data.title,
        url: data.url,
        dataUri: data.qr_data_uri,
      });
      setQrModalOpen(true);
    } catch {
      alert("Failed to load QR code");
    }
  };

  // DELETE
  const handleDelete = (id) => {
    setBookmarkIdToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteBookmark(bookmarkIdToDelete);
      setDeleteModalOpen(false);
    } catch {
      alert("Failed to delete");
    }
  };

  // EDIT
  const handleEdit = (id) => {
    const bm = favouriteBookmarks.find((b) => b.id === id);
    if (!bm) return;
    setCurrentEditId(id);
    setEditTitle(bm.title);
    setEditNotes(bm.notes || "");
    setEditTags((bm.tags || []).join(", "));
    setEditArchived(bm.archived ? "true" : "false");
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
      await updateBookmark(currentEditId, updated);
      setEditModalOpen(false);
    } catch {
      alert("Failed to update");
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddBookmark = async (data) => {
    setAddModalOpen(false);
  };

  // pagination
  // pagination
  const ITEMS_PER_PAGE = 9;
  const [currentPage, setCurrentPage] = useState(1);

  const favouriteOnly = favouriteBookmarks.filter(
    (b) => b.is_favourite === true
  );

  const totalPages = Math.ceil(favouriteOnly.length / ITEMS_PER_PAGE);

  const paginatedBookmarks = favouriteOnly.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [favouriteOnly.length]);

  return (
    <>
      <NavBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex min-h-screen bg-[var(--color-sky-aqua-50)] dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="fixed top-3 left-3 z-50 p-2 rounded-full bg-[#4CCCE6] text-slate-900 shadow-md lg:hidden transition hover:opacity-90"
        >
          <Menu size={24} />
        </button>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40
    lg:relative lg:inset-y-0 lg:translate-x-0
    transition-transform duration-300 ease-in-out
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    w-64
    min-h-screen
    overflow-y-auto
    shrink-0
  `}
        >
          <Sidebar />
          {isSidebarOpen && (
            <div
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            />
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            <div className="mb-10 mt-10">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-sky-aqua-900)] dark:text-[var(--color-sky-aqua-50)]">
                Favourite Bookmarks
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Your most important links saved in one place.
              </p>
            </div>

            {/* Loading / Error / Empty States */}
            {loading ? (
              <p>Loading favourites...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : favouriteOnly.length === 0 ? (
              <p className="text-slate-600 dark:text-slate-400">
                No favourite bookmarks yet. Star some from your main list!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                {paginatedBookmarks.map((bm) => (
                  <BookmarkCard
                    key={bm.id}
                    id={bm.id}
                    title={bm.title}
                    url={bm.url}
                    notes={bm.notes}
                    tags={bm.tags || []}
                    isFavourite={bm.is_favourite}
                    isArchived={bm.archived}
                    createdAt={bm.created_at}
                    onShowQR={() => showQR(bm.id)}
                    onEdit={() => handleEdit(bm.id)}
                    onDelete={() => handleDelete(bm.id)}
                    onToggleArchive={() => toggleArchive(bm.id)}
                    onToggleFavourite={() => toggleFavourite(bm.id)}
                  />
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </main>
        </div>
      </div>

      {/* Modals */}
      <QRModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        data={qrData}
      />
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
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
        onAdd={handleAddBookmark}
      />
    </>
  );
}
