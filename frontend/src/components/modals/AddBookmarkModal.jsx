import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "../Button";

export default function AddBookmarkModal({
  open,
  onClose,
  onSubmit,
  url,
  setUrl,
  title,
  setTitle,
  notes,
  setNotes,
  tags,
  setTags,
  loading,
}) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-white dark:bg-slate-800
          border border-slate-300 dark:border-slate-700
          rounded-xl p-6 w-full max-w-lg shadow-xl
          ${open ? "modal-enter" : "modal-exit"}
        `}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">Add Bookmark</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="url"
            required
            placeholder="URL *"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-black dark:text-white"
          />

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-black dark:text-white"
          />

          <textarea
            rows="3"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-black dark:text-white"
          />

          <input
            type="text"
            placeholder="Tags (comma separated, e.g. python, web)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 dark:text-white text-black"
          />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
