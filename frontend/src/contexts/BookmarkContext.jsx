import { createContext, useContext, useState, useCallback } from "react";
import bookmarkService from "../services/bookmarkService";

const BookmarkContext = createContext(null);

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [favouriteBookmarks, setFavouriteBookmarks] = useState([]);
  const [archivedBookmarks, setArchivedBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favouriteTotal, setFavouriteTotal] = useState(0);

  // Fetch dashboard bookmarks (non-archived)
  const fetchBookmarks = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookmarkService.getDashboardBookmarks();
      setBookmarks(data.bookmarks || []);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch bookmarks");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch archived bookmarks
  const fetchArchivedBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookmarkService.getArchivedBookmarks();
      setArchivedBookmarks(data.bookmarks || []);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch archived bookmarks");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all bookmarks with filters
  const fetchAllBookmarks = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookmarkService.getAllBookmarks(params);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch bookmarks");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all bookmarks with favourite= true
  const fetchFavouriteBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bookmarkService.getAllBookmarks({
        favourite: "true",
      });
      setFavouriteBookmarks(data.bookmarks || []);
      setFavouriteTotal(data.total || 0);  
      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single bookmark
  const getBookmark = useCallback(async (id) => {
    try {
      setError(null);
      const data = await bookmarkService.getBookmark(id);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch bookmark");
      throw err;
    }
  }, []);

  // Create bookmark
  const createBookmark = useCallback(async (bookmarkData) => {
    try {
      setError(null);
      const newBookmark = await bookmarkService.createBookmark(bookmarkData);

      // Add to appropriate list
      if (newBookmark.archived) {
        setArchivedBookmarks((prev) => [newBookmark, ...prev]);
      } else {
        setBookmarks((prev) => [newBookmark, ...prev]);
      }

      return newBookmark;
    } catch (err) {
      setError(err.message || "Failed to create bookmark");
      throw err;
    }
  }, []);

  // Update bookmark
  const updateBookmark = useCallback(async (id, bookmarkData) => {
    try {
      setError(null);
      const updatedBookmark = await bookmarkService.updateBookmark(
        id,
        bookmarkData
      );

      // Update in appropriate list
      setBookmarks((prev) =>
        prev.map((b) => (b.id === id ? updatedBookmark : b))
      );
      setArchivedBookmarks((prev) =>
        prev.map((b) => (b.id === id ? updatedBookmark : b))
      );

      return updatedBookmark;
    } catch (err) {
      setError(err.message || "Failed to update bookmark");
      throw err;
    }
  }, []);

  // Delete bookmark
  const deleteBookmark = useCallback(async (id) => {
    try {
      setError(null);
      await bookmarkService.deleteBookmark(id);

      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      setArchivedBookmarks((prev) => prev.filter((b) => b.id !== id));

      return { success: true };
    } catch (err) {
      setError(err.message || "Failed to delete bookmark");
      throw err;
    }
  }, []);

  // Toggle archive status
  const toggleArchive = useCallback(async (id) => {
    try {
      setError(null);
      const updatedBookmark = await bookmarkService.toggleArchive(id);

      // Move between lists
      if (updatedBookmark.archived) {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
        setArchivedBookmarks((prev) => [updatedBookmark, ...prev]);
      } else {
        setArchivedBookmarks((prev) => prev.filter((b) => b.id !== id));
        setBookmarks((prev) => [updatedBookmark, ...prev]);
      }

      return updatedBookmark;
    } catch (err) {
      setError(err.message || "Failed to toggle archive");
      throw err;
    }
  }, []);

  // Get QR code
  const getQRCode = useCallback(async (id) => {
    try {
      setError(null);
      const data = await bookmarkService.getQRCode(id);
      return data;
    } catch (err) {
      setError(err.message || "Failed to get QR code");
      throw err;
    }
  }, []);

  const toggleFavourite = useCallback(
    async (id) => {
      try {
        const updated = await bookmarkService.toggleFavourite(id);

        // Update main bookmarks list
        setBookmarks((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, isFavourite: updated.is_favourite } : b
          )
        );

        // Update favourite list
        setFavouriteBookmarks((prev) => {
          if (updated.is_favourite) {
            const full = bookmarks.find((b) => b.id === id);
            return full ? [...prev, { ...full, isFavourite: true }] : prev;
          } else {
            return prev.filter((b) => b.id !== id);
          }
        });

        return updated;
      } catch (err) {
        throw err;
      }
    },
    [bookmarks]
  );

  // Export bookmarks
  const exportBookmarks = useCallback(async () => {
    try {
      setError(null);
      const result = await bookmarkService.exportBookmarks();
      return result;
    } catch (err) {
      setError(err.message || "Failed to export bookmarks");
      throw err;
    }
  }, []);

  const value = {
    bookmarks,
    archivedBookmarks,
    loading,
    error,
    favouriteBookmarks,
    favouriteTotal,
    fetchFavouriteBookmarks,
    toggleFavourite,
    fetchBookmarks,
    fetchArchivedBookmarks,
    fetchAllBookmarks,
    getBookmark,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    toggleArchive,
    getQRCode,
    exportBookmarks,
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
};
