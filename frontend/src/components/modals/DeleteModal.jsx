import React from "react";
import { Trash2, X } from "lucide-react";
import Button from "../Button";

export default function DeleteModal({ open, onClose, onConfirm, loading }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center gap-3">
          <Trash2 size={40} className="text-red-500" />

          <h2 className="font-bold text-xl dark:text-white">Delete Bookmark?</h2>
          <p className="text-slate-500">This action cannot be undone.</p>

          <div className="flex gap-4 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
