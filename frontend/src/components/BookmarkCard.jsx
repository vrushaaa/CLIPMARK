import React from "react";
import {
  QrCode,
  Trash2,
  Edit2,
} from "lucide-react";

function BookmarkCard({
  id,
  title,
  url,
  notes,
  tags = [],
  isFavourite = false,  
  isArchived = false,
  createdAt,
  onToggleFavourite,   
  onToggleArchive,
  onShowQR,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className="
        rounded-2xl p-4 md:p-5 shadow-md border
        bg-[var(--color-sky-aqua-00)]
        dark:bg-[var(--color-sky-aqua-900)]
        border-[var(--color-sky-aqua-700)]
        hover:border-[var(--color-sky-aqua-400)]
        transition
        flex flex-col gap-3
      "
    >
      {/* Title + URL */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="
              text-lg font-semibold
              text-[var(--color-sky-aqua-600)]
              dark:text-[var(--color-sky-aqua-300)]
              hover:text-[var(--color-sky-aqua-300)]
              break-words
            "
          >
            {title || url}
          </a>

          <div className="flex items-center gap-2">

            {onShowQR && (
              <button
                onClick={() => onShowQR(id)}
                className="
                  p-2 rounded-lg
                  bg-[var(--color-sky-aqua-800)]
                  border border-[var(--color-sky-aqua-600)]
                  text-[var(--color-sky-aqua-100)]
                  hover:bg-[var(--color-sky-aqua-400)]
                  hover:text-[var(--color-sky-aqua-950)]
                "
              >
                <QrCode size={16} />
              </button>
            )}

            {onEdit && (
              <button
                onClick={() => onEdit(id)}
                className="
                  p-2 rounded-lg
                  bg-[var(--color-sky-aqua-800)]
                  border border-[var(--color-sky-aqua-600)]
                  text-[var(--color-sky-aqua-100)]
                  hover:bg-yellow-400 hover:text-black
                "
              >
                <Edit2 size={16} />
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="
                  p-2 rounded-lg
                  bg-[var(--color-sky-aqua-800)]
                  border border-[var(--color-sky-aqua-600)]
                  text-[var(--color-sky-aqua-100)]
                  hover:bg-red-500 hover:text-white
                "
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-[var(--color-sky-aqua-600)] dark:text-[var(--color-sky-aqua-300)] mt-1 break-all">
          {url}
        </p>
      </div>

      {/* Notes */}
      {notes && (
        <p className="text-sm text-[var(--color-sky-aqua-600)] dark:text-[var(--color-sky-aqua-100)] line-clamp-3">
          {notes}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="
                px-2 py-1 text-xs rounded-full
                bg-[var(--color-sky-aqua-800)]
                text-[var(--color-sky-aqua-100)]
                border border-[var(--color-sky-aqua-600)]
              "
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between gap-2">
        {createdAt && (
          <p className="text-[10px] dark:text-[var(--color-sky-aqua-300)]">
            Saved on{" "}
            {new Date(createdAt).toLocaleDateString(undefined, {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}

        <div className="flex gap-2 ml-auto">

          {/* Favourite toggle */}
          {onToggleFavourite && (
            <button
              type="button"
              onClick={() => onToggleFavourite(id)}
              className={`
                px-3 py-1 text-xs rounded-full flex items-center gap-1
                border transition-colors
                ${isFavourite
                  ? "bg-yellow-400 text-black border-yellow-500"
                  : "bg-[var(--color-sky-aqua-800)] border-[var(--color-sky-aqua-600)] text-[var(--color-sky-aqua-50)]"
                }
                hover:bg-yellow-400 hover:text-black
              `}
            >
              <span>⭐</span>
              <span>{isFavourite ? "Unfavourite" : "Favourite"}</span>
            </button>
          )}

          {/* Archive toggle */}
          {onToggleArchive && (
            <button
              type="button"
              onClick={() => onToggleArchive(id, !isArchived)}
              className={`
                px-3 py-1 text-xs rounded-full flex items-center gap-1
                border
                ${
                  isArchived
                    ? "bg-[var(--color-sky-aqua-700)] border-[var(--color-sky-aqua-400)] text-[var(--color-sky-aqua-50)]"
                    : "bg-[var(--color-sky-aqua-800)] border-[var(--color-sky-aqua-600)] text-[var(--color-sky-aqua-50)]"
                }
                hover:bg-[var(--color-sky-aqua-400)]
                hover:text-[var(--color-sky-aqua-950)]
              `}
            >
              <span>🗄️</span>
              <span>{isArchived ? "Unarchive" : "Archive"}</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

export default BookmarkCard;
