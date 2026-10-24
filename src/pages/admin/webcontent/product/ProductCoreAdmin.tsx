// src/pages/admin/webcontent/product/ProductCoreAdmin.tsx
import { useState } from "react";
import {
  Plus, Save, CheckCircle2, Trash2, AlertCircle, Radio,
} from "lucide-react";
import {
  getAllProducts, getActiveProductId, createProduct, updateProduct,
  activateProduct, deleteProduct,
} from "../../../../api/admin/productAdminApi";
import type { AdminProduct, AdminProductPayload } from "../../../../api/admin/productAdminApi";
import { uploadMedia, isAllowedFileType } from "../../../../api/admin/uploadApi";
import { ImageField } from "../../../../components/admin/shared/FormPrimitives";
import ConfirmModal from "../../../../components/admin/ConfirmModal";
import { useMountLoad } from "../../../../hooks/useMountLoad";

const ACCENT = "#00E5FF";
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

const EMPTY: AdminProductPayload = {
  name: "", tagline: "", description: "",
  heroTitle: "", heroSubtitle: "", coverImageUrl: undefined, videoUrl: "",
  ctaTitle: "", ctaButtonText: "",
};

const inputCls = "w-full bg-white/[0.035] border border-white/[0.09] rounded-sm px-4 py-3 text-white text-sm placeholder:text-drift/70 focus:outline-none focus:border-[#00E5FF]/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,229,255,0.12)] transition-all duration-200";
const labelCls = "block text-fog text-xs font-semibold uppercase tracking-wide mb-2";

function FieldCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-4 sm:p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] mb-5">
      <div className="flex items-center gap-3 mb-5">
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
          style={{ backgroundColor: `${ACCENT}1F`, color: ACCENT }}
        >
          {step}
        </span>
        <h3 className="text-white font-heading font-semibold text-sm">{title}</h3>
      </div>
      <div className="space-y-4 pl-0 sm:pl-9">{children}</div>
    </div>
  );
}

function isYouTubeUrl(url: string) {
  return /(?:youtube\.com|youtu\.be)/i.test(url);
}

function toYouTubeEmbedUrl(url: string) {
  // Handles both youtube.com/watch?v=ID and youtu.be/ID formats
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  const id = watchMatch?.[1] || shortMatch?.[1] || "";
  return `https://www.youtube.com/embed/${id}`;
}

// Video field: supports either uploading a file to Cloudinary, or pasting a YouTube link.
// Both are stored in the same videoUrl field — the display side detects which kind it is.
function VideoField({
  value, onUpload, onClear, onSetUrl,
}: {
  value?: string;
  onUpload: (file: File) => void;
  onClear: () => void;
  onSetUrl: (url: string) => void;
}) {
  const [mode, setMode] = useState<"upload" | "youtube">(
    value && isYouTubeUrl(value) ? "youtube" : "upload"
  );
  const [youtubeInput, setYoutubeInput] = useState(value && isYouTubeUrl(value) ? value : "");

  const hasVideo = !!value;
  const currentIsYouTube = !!value && isYouTubeUrl(value);

  return (
    <div>
      <label className={labelCls}>Product video</label>

      {/* Mode tabs — only shown when there's no video saved yet, to keep things simple */}
      {!hasVideo && (
        <div className="flex gap-1.5 mb-3">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className="text-xs font-semibold px-3 py-1.5 rounded-sm transition-colors"
            style={mode === "upload"
              ? { backgroundColor: `${ACCENT}1F`, color: ACCENT }
              : { color: "#64748B" }}
          >
            Upload file
          </button>
          <button
            type="button"
            onClick={() => setMode("youtube")}
            className="text-xs font-semibold px-3 py-1.5 rounded-sm transition-colors"
            style={mode === "youtube"
              ? { backgroundColor: `${ACCENT}1F`, color: ACCENT }
              : { color: "#64748B" }}
          >
            YouTube link
          </button>
        </div>
      )}

      {hasVideo ? (
        <div className="rounded-sm overflow-hidden border border-white/[0.09] bg-black/20">
          {currentIsYouTube ? (
            <div className="aspect-video bg-black">
              <iframe
                src={toYouTubeEmbedUrl(value!)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <video src={value} controls className="w-full max-h-64 bg-black" />
          )}
          <div className="flex items-center justify-between px-3 py-2 bg-white/[0.02]">
            <label className="text-xs font-semibold cursor-pointer transition-colors" style={{ color: ACCENT }}>
              Replace video
              <input
                type="file"
                accept={ALLOWED_VIDEO_TYPES.join(",")}
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }}
              />
            </label>
            <button type="button" onClick={() => { onClear(); setYoutubeInput(""); }}
              className="text-xs text-drift hover:text-red-400 transition-colors">
              Remove
            </button>
          </div>
        </div>
      ) : mode === "youtube" ? (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeInput}
            onChange={(e) => setYoutubeInput(e.target.value)}
            className={inputCls}
          />
          <button
            type="button"
            disabled={!youtubeInput.trim() || !isYouTubeUrl(youtubeInput)}
            onClick={() => onSetUrl(youtubeInput.trim())}
            className="text-xs font-semibold px-4 py-2 rounded-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: `${ACCENT}1F`, color: ACCENT }}
          >
            Use this link
          </button>
          {youtubeInput.trim() && !isYouTubeUrl(youtubeInput) && (
            <p className="text-xs text-red-400">That doesn't look like a YouTube link.</p>
          )}
        </div>
      ) : (
        <label
          className="flex flex-col items-center justify-center gap-2 rounded-sm border border-dashed bg-white/[0.02] px-4 py-8 cursor-pointer transition-colors hover:bg-white/[0.04]"
          style={{ borderColor: `${ACCENT}33` }}
        >
          <span className="text-sm text-fog">Click to upload a video</span>
          <span className="text-xs text-drift/70">MP4, WebM, or MOV</span>
          <input
            type="file"
            accept={ALLOWED_VIDEO_TYPES.join(",")}
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }}
          />
        </label>
      )}
    </div>
  );
}

type ModalState =
  | { kind: "blocked-delete" }
  | { kind: "confirm-delete"; id: number }
  | { kind: "error"; message: string }
  | null;

export default function ProductCoreAdmin() {
  const [versions, setVersions] = useState<AdminProduct[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [selected, setSelected] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState<AdminProductPayload>(EMPTY);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activating, setActivating] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<ModalState>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [products, liveId] = await Promise.all([getAllProducts(), getActiveProductId()]);
      setVersions(products);
      setActiveId(liveId);
      const active = products.find((p) => p.id === liveId) || products[0] || null;
      if (active) {
        setSelected(active);
        const { id, createdAt, ...rest } = active;
        setForm(rest);
      }
      setIsNew(false);
    } catch { setError("Couldn't load products."); }
    finally { setLoading(false); }
  };

  useMountLoad(load);

  const toPayload = (p: AdminProduct): AdminProductPayload => {
    const { id, createdAt, ...rest } = p;
    return rest;
  };

  const selectVersion = (p: AdminProduct) => {
    setSelected(p);
    setForm(toPayload(p));
    setIsNew(false);
    setSaved(false);
    setError("");
  };

  const startNew = () => {
    setSelected(null);
    setForm(EMPTY);
    setIsNew(true);
    setSaved(false);
    setError("");
  };

  const set = (field: keyof AdminProductPayload, val: string) => {
    setForm((p) => ({ ...p, [field]: val }));
    setSaved(false);
  };

  const handleImageUpload = async (file: File) => {
    if (!isAllowedFileType(file)) { setError("Unsupported file type."); return; }
    try { set("coverImageUrl", await uploadMedia(file, "products")); }
    catch { setError("Image upload failed."); }
  };

  const handleVideoUpload = async (file: File) => {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      setError("Unsupported video type. Use MP4, WebM, or MOV.");
      return;
    }
    try { set("videoUrl", await uploadMedia(file, "products/video")); }
    catch { setError("Video upload failed."); }
  };

  const handleSave = async () => {
    setSaving(true); setError(""); setSaved(false);
    try {
      if (isNew) {
        const created = await createProduct(form);
        setVersions((p) => [...p, created]);
        setSelected(created);
        setIsNew(false);
      } else if (selected) {
        const updated = await updateProduct(selected.id, form);
        setVersions((p) => p.map((v) => (v.id === updated.id ? updated : v)));
        setSelected(updated);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { setError("Couldn't save changes."); }
    finally { setSaving(false); }
  };

  const handleActivate = async () => {
    if (!selected) return;
    setActivating(true); setError("");
    try {
      await activateProduct(selected.id);
      setActiveId(selected.id);
    } catch { setError("Couldn't publish this product."); }
    finally { setActivating(false); }
  };

  const requestDelete = (id: number) => {
    if (id === activeId) { setModal({ kind: "blocked-delete" }); return; }
    setModal({ kind: "confirm-delete", id });
  };

  const confirmDelete = async (id: number) => {
    setDeleting(id);
    try {
      await deleteProduct(id);
      const remaining = versions.filter((v) => v.id !== id);
      setVersions(remaining);
      if (selected?.id === id) {
        if (remaining.length > 0) selectVersion(remaining[0]);
        else { setSelected(null); setForm(EMPTY); setIsNew(true); }
      }
    } catch { setModal({ kind: "error", message: "Couldn't delete this product." }); }
    finally { setDeleting(null); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: ACCENT, borderTopColor: "transparent" }} />
    </div>
  );

  const isLive = !isNew && selected?.id === activeId;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5 md:gap-6 items-start">

      {/* Version sidebar */}
      <div className="rounded-sm border border-white/[0.07] bg-gradient-to-b from-white/[0.03] to-transparent overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] md:sticky md:top-4">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
          <span className="text-fog text-[11px] font-semibold uppercase tracking-wider">Products</span>
          <button onClick={startNew}
            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-sm transition-colors flex-shrink-0"
            style={{ color: ACCENT, backgroundColor: `${ACCENT}14` }}>
            <Plus size={12} /> New
          </button>
        </div>

        <div className="p-2 flex md:flex-col gap-1.5 md:gap-1 overflow-x-auto md:overflow-x-visible -mx-0.5 px-0.5 md:mx-0 md:px-2">
          {versions.map((v) => (
            <div key={v.id}
              onClick={() => selectVersion(v)}
              className={`group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-sm cursor-pointer transition-all flex-shrink-0 w-[180px] md:w-auto ${
                selected?.id === v.id && !isNew
                  ? "text-white"
                  : "hover:bg-white/[0.04] text-fog"
              }`}
              style={selected?.id === v.id && !isNew ? {
                background: `linear-gradient(135deg, ${ACCENT}1F, ${ACCENT}08)`,
                boxShadow: `0 0 0 1px ${ACCENT}33`,
              } : undefined}
            >
              {selected?.id === v.id && !isNew && (
                <span className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full"
                  style={{ backgroundColor: ACCENT }} />
              )}
              <div className="min-w-0">
                <div className="text-xs font-medium truncate">{v.name || `Product ${v.id}`}</div>
                {v.id === activeId && (
                  <span className="text-[10px] font-semibold flex items-center gap-1 mt-0.5"
                    style={{ color: ACCENT }}>
                    <Radio size={9} /> Live
                  </span>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); requestDelete(v.id); }}
                disabled={deleting === v.id}
                className="text-drift/70 hover:text-red-400 p-1 rounded flex-shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all disabled:opacity-30">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {isNew && (
            <div className="px-3 py-2.5 rounded-sm flex-shrink-0 w-[180px] md:w-auto"
              style={{ background: `linear-gradient(135deg, ${ACCENT}1F, ${ACCENT}08)`, boxShadow: `0 0 0 1px ${ACCENT}33` }}>
              <div className="text-white text-xs font-medium">New product</div>
              <div className="text-drift text-[10px]">Unsaved</div>
            </div>
          )}
          {versions.length === 0 && !isNew && (
            <p className="text-drift text-xs px-3 py-2">No products yet.</p>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="min-w-0">
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-sm px-4 py-3 mb-5">
            <AlertCircle size={16} className="flex-shrink-0" /> {error}
          </div>
        )}

        {/* Status banner */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-sm px-5 py-4 mb-6 border ${
          isLive
            ? "border-white/[0.08] bg-gradient-to-r from-white/[0.04] to-transparent"
            : "border-white/[0.06] bg-white/[0.02]"
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isLive ? "animate-pulse" : ""}`}
              style={{ backgroundColor: isLive ? ACCENT : "#475569", boxShadow: isLive ? `0 0 6px ${ACCENT}` : "none" }} />
            <span className={`text-sm font-medium ${isLive ? "text-white" : "text-fog"}`}>
              {isNew ? "New draft — save first, then publish"
                : isLive ? "This product is live on the website"
                : "Draft — not visible on the website yet"}
            </span>
          </div>
          {!isLive && !isNew && selected && (
            <button onClick={handleActivate} disabled={activating}
              className="inline-flex items-center justify-center gap-2 font-semibold text-xs px-4 py-2 rounded-sm transition-colors flex-shrink-0 w-full sm:w-auto"
              style={{ backgroundColor: ACCENT, color: "#060A0E" }}>
              {activating ? "Publishing..." : "Set as live"}
            </button>
          )}
        </div>

        <FieldCard step={1} title="Catalog basics">
          <div><label className={labelCls}>Product name</label>
            <input type="text" maxLength={100} value={form.name}
              onChange={(e) => set("name", e.target.value)} className={inputCls} />
          </div>
          <div><label className={labelCls}>Tagline</label>
            <input type="text" maxLength={200} value={form.tagline}
              onChange={(e) => set("tagline", e.target.value)} className={inputCls} />
          </div>
          <div><label className={labelCls}>Description</label>
            <textarea rows={4} value={form.description}
              onChange={(e) => set("description", e.target.value)} className={`${inputCls} resize-none`} />
          </div>
        </FieldCard>

        <FieldCard step={2} title="Hero section">
          <div><label className={labelCls}>Hero title</label>
            <input type="text" maxLength={150} value={form.heroTitle || ""}
              onChange={(e) => set("heroTitle", e.target.value)} className={inputCls} />
          </div>
          <div><label className={labelCls}>Hero subtitle</label>
            <input type="text" maxLength={250} value={form.heroSubtitle || ""}
              onChange={(e) => set("heroSubtitle", e.target.value)} className={inputCls} />
          </div>
          <ImageField label="Cover image" value={form.coverImageUrl}
            onUpload={handleImageUpload}
            onClear={() => set("coverImageUrl", "")}
            accent={ACCENT} />
          <VideoField
            value={form.videoUrl}
            onUpload={handleVideoUpload}
            onClear={() => set("videoUrl", "")}
            onSetUrl={(url) => set("videoUrl", url)}
          />
        </FieldCard>

        <FieldCard step={3} title="CTA section">
          <div><label className={labelCls}>CTA title</label>
            <input type="text" maxLength={150} value={form.ctaTitle || ""}
              onChange={(e) => set("ctaTitle", e.target.value)} className={inputCls} />
          </div>
          <div><label className={labelCls}>CTA button text</label>
            <input type="text" maxLength={50} value={form.ctaButtonText || ""}
              onChange={(e) => set("ctaButtonText", e.target.value)} className={inputCls} />
          </div>
        </FieldCard>

        {/* Sticky save bar */}
        <div className="sticky bottom-0 mt-2 pt-4 pb-2 bg-gradient-to-t from-[#060A0E] via-[#060A0E]/95 to-transparent">
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-2 disabled:opacity-50 font-semibold px-6 py-3 rounded-sm transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              style={{ backgroundColor: ACCENT, color: "#060A0E" }}>
              <Save size={16} />
              {saving ? "Saving..." : isNew ? "Save as draft" : "Save changes"}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm" style={{ color: ACCENT }}>
                <CheckCircle2 size={16} /> Saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        open={modal?.kind === "blocked-delete"}
        mode="alert" tone="info"
        title="Can't delete live product"
        message="This is the live product. Activate another version first, then delete this one."
        onClose={() => setModal(null)}
      />
      <ConfirmModal
        open={modal?.kind === "confirm-delete"}
        mode="confirm" tone="danger"
        title="Delete this product?"
        message="This product will be permanently deleted. This can't be undone."
        confirmLabel="Delete"
        onConfirm={() => { if (modal?.kind === "confirm-delete") confirmDelete(modal.id); }}
        onClose={() => setModal(null)}
      />
      <ConfirmModal
        open={modal?.kind === "error"}
        mode="alert" tone="danger"
        title="Something went wrong"
        message={modal?.kind === "error" ? modal.message : ""}
        onClose={() => setModal(null)}
      />
    </div>
  );
}