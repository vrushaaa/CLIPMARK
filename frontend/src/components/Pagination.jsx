import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const leftEdge = 1;
    const rightEdge = totalPages;
    const leftCurrent = currentPage - 2;
    const rightCurrent = currentPage + 2;

    for (let p = leftEdge; p <= rightEdge; p++) {
      if (
        p === 1 ||
        p === totalPages ||
        (p >= leftCurrent && p <= rightCurrent)
      ) {
        pages.push(p);
      } else if (pages[pages.length - 1] !== "…") {
        pages.push("…");
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-3 mt-10 text-lg">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-[#48CAE4] disabled:opacity-20"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Pages */}
      {getPages().map((p, idx) =>
        p === "…" ? (
          <span key={idx} className="px-3 py-1 text-slate-400">
            …
          </span>
        ) : p === currentPage ? (
          <span
            key={p}
            className="px-3 py-1 bg-[#48CAE4] text-slate-900 font-semibold rounded-lg shadow-md"
          >
            {p}
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className="px-3 py-1 border border-[#48CAE4]/40 rounded-lg 
                       text-[#48CAE4] hover:bg-[#48CAE4]/10 transition"
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-[#48CAE4] disabled:opacity-20"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
}
