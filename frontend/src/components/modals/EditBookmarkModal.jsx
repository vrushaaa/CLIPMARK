import React from "react";
import { X } from "lucide-react";
import Button from "../Button";

export default function EditBookmarkModal({
  open,
  onClose,
  onSubmit,
  title,
  setTitle,
  notes,
  setNotes,
  tags,
  setTags,
  archived,
  setArchived,
  loading,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-lg border border-slate-300 dark:border-slate-700 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold dark:text-white">Edit Bookmark</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700  dark:text-white text-black"
          />

          <textarea
            rows="4"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 dark:text-white text-black"
          />

          <input
            type="text"
            placeholder="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 dark:text-white text-black"
          />

          <select
            value={archived}
            onChange={(e) => setArchived(e.target.value)}
            className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 dark:text-white text-black"
          >
            <option value="false">Active</option>
            <option value="true">Archived</option>
          </select>

          <div className="flex justify-end gap-4 mt-5">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
