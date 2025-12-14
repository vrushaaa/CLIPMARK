import React from "react";
import { X } from "lucide-react";

export default function QRModal({ open, onClose, data }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-center items-center "
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-6 w-full max-w-xs shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold text-lg text-white">QR Code</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="font-bold text-xl text-white">{data.title}</p>

          {data.dataUri && (
            <div className="bg-white p-3 rounded-xl shadow">
              <img src={data.dataUri} alt="qr" />
            </div>
          )}

          <p className="text-xs text-slate-500 break-all">{data.url}</p>
        </div>
      </div>
    </div>
  );
}
