// src/pages/admin/BlogEditorPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, AlertCircle, FileEdit, FilePlus2 } from "lucide-react";
import api from "../../api/axiosInstance";
import { createBlog, updateBlog } from "../../api/admin/blogAdminApi";
import RichTextEditor from "../../components/admin/RichTextEditor";
import CoverImageUpload from "../../components/admin/CoverImageUpload";
import type { Blog, BlogPayload } from "../../types/blog";

const ACCENT = "#A855F7";

const EMPTY: BlogPayload = {
  title: "",
  excerpt: "",
  content: "",
  coverImageUrl: undefined,
  category: "",
  tags: "",
  author: "",
  readTime: undefined,
};

// shared input styling, kept as a string so every field stays visually identical
const inputClass =
  "w-full bg-white/[0.035] border border-white/[0.09] rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#A855F7]/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all duration-200";
const labelClass = "block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2";

function FieldGroup({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-3 mb-5">
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
          style={{ backgroundColor: "#A855F71F", color: ACCENT }}
        >
          {step}
        </span>
        <h2 className="text-white font-heading font-semibold text-sm">
          {title}
        </h2>
      </div>
      <div className="space-y-5 pl-9">{children}</div>
    </div>
  );
}

export default function BlogEditorPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState<BlogPayload>(EMPTY);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    const loadBlog = async () => {
      try {
        const res = await api.get<Blog[]>("/api/v1/blogs/all");
        const found = res.data.find((b) => b.id === Number(id));
        if (!found) {
          setError("Post not found.");
          return;
        }
        setForm({
          title: found.title,
          excerpt: found.excerpt,
          content: found.content,
          coverImageUrl: found.coverImageUrl,
          category: found.category,
          tags: found.tags,
          authorId: found.authorId,
          author: found.author,
          readTime: found.readTime,
        });
      } catch (err) {
        console.error("Failed to load post", err);
        setError("Couldn't load this post.");
      } finally {
        setLoading(false);
      }
    };
    loadBlog();
  }, [id, isEditing]);

  const handleChange = (
    field: keyof BlogPayload,
    val: string | number | undefined
  ) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async () => {
    if (!form.title?.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.content?.trim()) {
      setError("Content can't be empty.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (isEditing) {
        await updateBlog(Number(id), form);
      } else {
        await createBlog(form);
      }
      navigate("/admin/dashboard/blog");
    } catch (err) {
      console.error("Failed to save post", err);
      setError("Couldn't save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: ACCENT, borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-full p-8 overflow-hidden">
      {/* ambient glow, matching the rest of the dashboard */}
      <div className="pointer-events-none absolute -top-32 right-0 w-96 h-96 rounded-full bg-[#A855F7]/[0.09] blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-[#00B4D8]/[0.05] blur-3xl" />

      <div className="relative z-10 max-w-3xl">
        <button
          onClick={() => navigate("/admin/dashboard/blog")}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to posts
        </button>

        <div className="flex items-center gap-3.5 mb-8">
          <div className="relative w-11 h-11 flex-shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-[#A855F7]/30 blur-md" />
            <div
              className="relative w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${ACCENT}26`, color: ACCENT, border: `1px solid ${ACCENT}40` }}
            >
              {isEditing ? <FileEdit size={19} /> : <FilePlus2 size={19} />}
            </div>
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl text-white tracking-tight">
              {isEditing ? "Edit post" : "New post"}
            </h1>
            <p className="text-slate-500 text-xs">
              {isEditing
                ? "Update the content below and save your changes."
                : "Fill in the details, then save as a draft."}
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Basics */}
          <FieldGroup step={1} title="Basics">
            <div>
              <label className={labelClass}>Title</label>
              <input
                type="text"
                maxLength={200}
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Post title"
                className={inputClass}
              />
            </div>

            <CoverImageUpload
              value={form.coverImageUrl}
              onChange={(url) => handleChange("coverImageUrl", url)}
            />
          </FieldGroup>

          {/* Metadata */}
          <FieldGroup step={2} title="Metadata">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Category</label>
                <input
                  type="text"
                  maxLength={50}
                  value={form.category || ""}
                  onChange={(e) => handleChange("category", e.target.value)}
                  placeholder="Research, Updates, News..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Read time (minutes)</label>
                <input
                  type="number"
                  min={1}
                  value={form.readTime ?? ""}
                  onChange={(e) =>
                    handleChange(
                      "readTime",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  placeholder="5"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Tags (comma separated)</label>
              <input
                type="text"
                maxLength={200}
                value={form.tags || ""}
                onChange={(e) => handleChange("tags", e.target.value)}
                placeholder="water,robot,AI"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Author (guest writer, optional)</label>
              <input
                type="text"
                maxLength={100}
                value={form.author || ""}
                onChange={(e) => handleChange("author", e.target.value)}
                placeholder="Leave blank if linking to a team member by ID"
                className={inputClass}
              />
            </div>
          </FieldGroup>

          {/* Content */}
          <FieldGroup step={3} title="Content">
            <div>
              <label className={labelClass}>Excerpt</label>
              <textarea
                maxLength={500}
                rows={2}
                value={form.excerpt || ""}
                onChange={(e) => handleChange("excerpt", e.target.value)}
                placeholder="Short preview shown on the blog grid card"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className={labelClass}>Body</label>
              <RichTextEditor
                value={form.content || ""}
                onChange={(html) => handleChange("content", html)}
              />
            </div>
          </FieldGroup>
        </div>

        {/* sticky save bar so the action is always reachable, even with a long post */}
        <div className="sticky bottom-0 mt-6 pt-4 pb-2 bg-gradient-to-t from-[#070B14] via-[#070B14]/95 to-transparent">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 disabled:opacity-50 font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ backgroundColor: ACCENT, color: "#0A0F1E" }}
            >
              <Save size={16} />
              {saving ? "Saving..." : isEditing ? "Save changes" : "Save as draft"}
            </button>
            <p className="text-slate-500 text-xs">
              {isEditing
                ? "Changes are saved immediately."
                : "New posts always save as a draft. Publish from the posts list once you're ready."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}