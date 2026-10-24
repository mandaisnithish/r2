// src/pages/admin/BlogAdminPage.tsx
import { isAxiosError } from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RefreshCw, FileText, CheckCircle2, FileEdit } from "lucide-react";
import {
  getAllBlogsForAdmin,
  togglePublish,
  deleteBlog,
} from "../../api/admin/blogAdminApi";
import type { Blog } from "../../types/blog";
import BlogList from "../../components/admin/BlogList";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { useMountLoad } from "../../hooks/useMountLoad";

const ACCENT = "#00E5FF";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// shape of whatever modal is currently being shown — null means none
type ModalState =
  | { kind: "blocked-delete" } // post is published, can't delete directly
  | { kind: "confirm-delete"; blog: Blog } // ask "are you sure?"
  | { kind: "error"; message: string } // generic failure
  | null;

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalState>(null);

  const loadBlogs = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllBlogsForAdmin();
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setBlogs(sorted);
    } catch (err) {
      console.error("Failed to load blogs", err);
      setError("Couldn't load blog posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useMountLoad(loadBlogs);

  const handleTogglePublish = async (blog: Blog) => {
    setBusyId(blog.id);
    try {
      const updated = await togglePublish(blog.id);
      setBlogs((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    } catch (err) {
      console.error("Failed to toggle publish", err);
      setModal({ kind: "error", message: "Couldn't update publish status. Please try again." });
    } finally {
      setBusyId(null);
    }
  };

  // Step 1: user clicks delete — decide which modal to show
  const requestDelete = (blog: Blog) => {
    if (blog.published) {
      setModal({ kind: "blocked-delete" });
      return;
    }
    setModal({ kind: "confirm-delete", blog });
  };

  // Step 2: user confirmed in the modal — actually delete
  const confirmDelete = async (blog: Blog) => {
    setBusyId(blog.id);
    try {
      await deleteBlog(blog.id);
      setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
    } catch (err) {
      console.error("Failed to delete blog", err);
      const serverMsg = isAxiosError<{ message?: string }>(err) ? err.response?.data?.message : undefined;
      setModal({
        kind: "error",
        message:
          serverMsg ||
          "Couldn't delete this post. If it's published, unpublish it first.",
      });
    } finally {
      setBusyId(null);
    }
  };

  const publishedCount = blogs.filter((b) => b.published).length;
  const draftCount = blogs.length - publishedCount;

  return (
    <div className="relative min-h-full p-8 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 right-0 w-96 h-96 rounded-full bg-[#00E5FF]/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-[#00E5FF]/[0.04] blur-3xl" />

      <div className="relative z-10 flex items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Blog
          </h1>
          <p className="text-drift text-sm mt-1">
            Write, edit, and publish updates for your site.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={loadBlogs}
            className="inline-flex items-center gap-2 text-fog hover:text-white text-sm border border-white/[0.08] hover:border-white/20 rounded-sm px-4 py-2.5 transition-colors"
          >
            <RefreshCw size={14} /> Refresh
          </button>

          <Link
            to="/admin/dashboard/blog/new"
            className="inline-flex items-center gap-2 font-semibold text-sm px-4 py-2.5 rounded-sm transition-all duration-200 no-underline border hover:-translate-y-0.5"
            style={{ backgroundColor: `${ACCENT}1A`, color: ACCENT, borderColor: `${ACCENT}40` }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 8px 20px -8px ${ACCENT}80`; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 0px ${ACCENT}00`; }}
          >
            <Plus size={16} /> New post
          </Link>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-sm border border-white/[0.06] bg-white/[0.03] transition-all duration-200 hover:bg-white/[0.05] hover:border-white/[0.1]">
          <FileText size={13} className="text-drift" />
          <span className="text-white font-semibold text-sm">{blogs.length}</span>
          <span className="text-drift text-xs">Total</span>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-sm border border-white/[0.06] bg-white/[0.03] transition-all duration-200 hover:bg-white/[0.05] hover:border-white/[0.1]">
          <CheckCircle2 size={13} style={{ color: "#00E5FF" }} />
          <span className="text-white font-semibold text-sm">{publishedCount}</span>
          <span className="text-drift text-xs">Published</span>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-sm border border-white/[0.06] bg-white/[0.03] transition-all duration-200 hover:bg-white/[0.05] hover:border-white/[0.1]">
          <FileEdit size={13} className="text-drift" />
          <span className="text-white font-semibold text-sm">{draftCount}</span>
          <span className="text-drift text-xs">Drafts</span>
        </div>
      </div>

      {error && (
        <div className="relative z-10 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-sm px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="relative z-10 flex justify-center py-20">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: ACCENT, borderTopColor: "transparent" }}
          />
        </div>
      ) : (
        <div className="relative z-10">
          <BlogList
            blogs={blogs}
            busyId={busyId}
            onTogglePublish={handleTogglePublish}
            onDelete={requestDelete}
            formatDate={formatDate}
          />
        </div>
      )}

      {/* Blocked delete — post is live */}
      <ConfirmModal
        open={modal?.kind === "blocked-delete"}
        mode="alert"
        tone="info"
        title="This post is live"
        message="This post is published and can't be deleted directly. Unpublish it first, then delete."
        onClose={() => setModal(null)}
      />

      {/* Confirm delete — draft post */}
      <ConfirmModal
        open={modal?.kind === "confirm-delete"}
        mode="confirm"
        tone="danger"
        title="Delete this post?"
        message={
          modal?.kind === "confirm-delete"
            ? `"${modal.blog.title}" will be permanently deleted. This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={() => {
          if (modal?.kind === "confirm-delete") confirmDelete(modal.blog);
        }}
        onClose={() => setModal(null)}
      />

      {/* Generic error */}
      <ConfirmModal
        open={modal?.kind === "error"}
        mode="alert"
        tone="danger"
        title="Something went wrong"
        message={modal?.kind === "error" ? modal.message : ""}
        onClose={() => setModal(null)}
      />
    </div>
  );
}