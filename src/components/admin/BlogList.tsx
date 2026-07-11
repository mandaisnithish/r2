// src/components/admin/BlogList.tsx
import { Link } from "react-router-dom";
import { FileText, FilePlus2 } from "lucide-react";
import type { Blog } from "../../types/blog";
import BlogRow from "./BlogRow";

interface Props {
  blogs: Blog[];
  busyId: number | null;
  onTogglePublish: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
  formatDate: (iso?: string) => string;
}

export default function BlogList({
  blogs,
  busyId,
  onTogglePublish,
  onDelete,
  formatDate,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.035] to-transparent overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]">
      {/* panel header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.06] bg-white/[0.015]">
        <div className="w-6 h-6 rounded-md bg-[#A855F7]/15 flex items-center justify-center">
          <FileText size={12} className="text-[#A855F7]" />
        </div>
        <span className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
          All Posts
        </span>
        <span className="ml-auto text-slate-600 text-xs bg-white/[0.04] px-2 py-0.5 rounded-full">
          {blogs.length}
        </span>
      </div>

      {blogs.length === 0 ? (
        <div className="p-12 text-center">
          <FilePlus2 size={28} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm mb-4">No posts yet.</p>
          <Link
            to="/admin/dashboard/blog/new"
            className="text-[#A855F7] text-sm font-medium hover:underline no-underline"
          >
            Write your first post
          </Link>
        </div>
      ) : (
        blogs.map((blog) => (
          <BlogRow
            key={blog.id}
            blog={blog}
            busy={busyId === blog.id}
            onTogglePublish={onTogglePublish}
            onDelete={onDelete}
            formatDate={formatDate}
          />
        ))
      )}
    </div>
  );
}