import React, { useEffect, useState } from "react";
import BookmarkCard from "../components/BookmarkCard";
import NavBar from "../components/NavBar";

// import {
//   fetchFavouriteBookmarks,
//   updateBookmark,
// } from "../services/bookmarkService";

function Favourites() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load favourites on mount
//   useEffect(() => {
//     async function load() {
//       try {
//         setLoading(true);
//         setError("");
//         const data = await fetchFavouriteBookmarks();
//         setBookmarks(data);
//       } catch (err) {
//         console.error(err);
//         setError(err.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, []);

  // Toggle favourite flag
  const handleToggleFavourite = async (id, newValue) => {
    try {
      await updateBookmark(id, { is_favourite: newValue });
      setBookmarks((prev) =>
        prev.filter((b) => (newValue ? true : b.id !== id)) // if unfavourite, remove from list
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update favourite status");
    }
  };

  // Toggle archive flag
  const handleToggleArchive = async (id, newValue) => {
    try {
      await updateBookmark(id, { is_archived: newValue });
      // If user archives from favourites page, we may want to hide it from favourites list
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to update archive status");
    }
  };

  return (
    <div
      className="
        min-h-screen
        dark:bg-slate-900
        bg-[var(--color-sky-aqua-50)]
        text-[var(--color-sky-aqua-900)]
      "
    >
      <NavBar/>
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <header className="mb-6 md:mb-8 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-sky-aqua-900)] dark:text-[var(--color-sky-aqua-50)]">
              Favourite Bookmarks
            </h1>
            <p className="text-sm text-[var(--color-sky-aqua-700)] dark:text-[var(--color-sky-aqua-50)] mt-1">
              Your most important links, saved in one place.
            </p>
          </div>
        </header>

        {/* Loading / Error / Empty */}
        {loading && (
          <p className="text-sm text-[var(--color-sky-aqua-700)] dark:text-[var(--color-sky-aqua-50)]">
            Loading favourites...
          </p>
        )}

        {error && !loading && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
            {error}
          </p>
        )}

        {!loading && !error && bookmarks.length === 0 && (
          <div
            className="
              mt-6 p-4 rounded-xl
              bg-[var(--color-sky-aqua-100)]
              text-[var(--color-sky-aqua-800)]
              text-sm
            "
          >
            You don&apos;t have any favourite bookmarks yet. Mark a bookmark as
            &quot;Favourite&quot; from your main bookmarks list.
          </div>
        )}

        {/* Grid */}
        {/* <div className="mt-6 grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              id={bookmark.id}
              title={bookmark.title}
              url={bookmark.url}
              notes={bookmark.notes}
              tags={bookmark.tags || []}
              isFavourite={bookmark.is_favourite}
              isArchived={bookmark.is_archived}
              createdAt={bookmark.created_at}
              onToggleFavourite={handleToggleFavourite}
              onToggleArchive={handleToggleArchive}
            />
          ))}
        </div> */}

        <div className="mt-6 grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        {[
            {
            id: 1,
            title: "React Docs",
            url: "https://react.dev",
            notes: "Official React documentation for reference.",
            tags: ["react", "frontend", "learning"],
            is_favourite: true,
            is_archived: false,
            created_at: "2025-11-25T10:30:00",
            },
            {
            id: 2,
            title: "MDN Web Docs",
            url: "https://developer.mozilla.org",
            notes: "Best resource for JS, CSS, and Web APIs.",
            tags: ["javascript", "css", "web"],
            is_favourite: false,
            is_archived: true,
            created_at: "2025-10-18T16:15:00",
            },
            {
            id: 3,
            title: "Tailwind Cheatsheet",
            url: "https://tailwindcomponents.com/cheatsheet/",
            notes: "Useful classes at one place.",
            tags: ["tailwind", "css"],
            is_favourite: true,
            is_archived: true,
            created_at: "2025-09-12T09:00:00",
            }
        ].map((bookmark) => (
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
            onToggleFavourite={() => alert("Backend not integrated yet!")}
            onToggleArchive={() => alert("Backend not integrated yet!")}
            />
        ))}
        </div>

      </div>
    </div>
  );
}

export default Favourites;
