/* Author: Nithish Kaliannan Ananth */
// src/components/admin/BlogRow.tsx
import { Link } from "react-router-dom";
import { Eye, EyeOff, Trash2, Pencil } from "lucide-react";
import type { Blog } from "../../types/blog";

interface Props {
  blog: Blog;
  busy: boolean;
  onTogglePublish: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
  formatDate: (iso?: string) => string;
}

const ACCENT = "#00E5FF";
const PUBLISHED = "#00E5FF";

export default function BlogRow({
  blog,
  busy,
  onTogglePublish,
  onDelete,
  formatDate,
}: Props) {
  return (
    <div className="group relative flex items-center gap-4 px-5 py-5 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.035] transition-all duration-200">
      {/* hover accent bar on the left */}
      <span
        className="absolute left-0 top-0 bottom-0 w-[3px] scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center"
        style={{ backgroundColor: blog.published ? PUBLISHED : ACCENT }}
      />

      {/* status dot — pulses gently when published */}
      <div className="relative flex-shrink-0">
        {blog.published && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ backgroundColor: PUBLISHED, opacity: 0.4 }}
          />
        )}
        <div
          className="relative w-2 h-2 rounded-full"
          style={
            blog.published
              ? { backgroundColor: PUBLISHED, boxShadow: `0 0 6px ${PUBLISHED}` }
              : { backgroundColor: "#475569" }
          }
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-2">
          <h3 className="text-white text-sm font-medium truncate group-hover:text-white transition-colors">
            {blog.title}
          </h3>
          <span
            className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
            style={
              blog.published
                ? { color: PUBLISHED, backgroundColor: `${PUBLISHED}1A`, border: `1px solid ${PUBLISHED}33` }
                : { color: "#94A3B8", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }
            }
          >
            {blog.published ? "Published" : "Draft"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className="px-2 py-0.5 rounded-full font-medium"
            style={{ color: ACCENT, backgroundColor: `${ACCENT}14` }}
          >
            {blog.category || "Uncategorized"}
          </span>
          <span className="text-drift/70">·</span>
          <span className="text-drift">
            {blog.published
              ? `Published ${formatDate(blog.publishedAt)}`
              : `Updated ${formatDate(blog.updatedAt)}`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-0.5 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onTogglePublish(blog)}
          disabled={busy}
          title={blog.published ? "Unpublish" : "Publish"}
          className="p-2.5 rounded-sm text-fog hover:text-white hover:bg-white/[0.07] hover:scale-105 transition-all disabled:opacity-40"
        >
          {blog.published ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
        <Link
          to={`/admin/dashboard/blog/${blog.id}`}
          title="Edit"
          className="p-2.5 rounded-sm text-fog hover:text-white hover:bg-white/[0.07] hover:scale-105 transition-all"
        >
          <Pencil size={15} />
        </Link>
        <button
          onClick={() => onDelete(blog)}
          disabled={busy}
          title={blog.published ? "Unpublish before deleting" : "Delete"}
          className="p-2.5 rounded-sm text-fog hover:text-red-400 hover:bg-red-400/10 hover:scale-105 transition-all disabled:opacity-40"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}