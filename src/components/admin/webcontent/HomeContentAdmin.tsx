// src/components/admin/webcontent/HomeContentAdmin.tsx
import { useEffect, useState } from "react";
import {
  Plus, Save, CheckCircle2, Trash2, AlertCircle, Radio,
} from "lucide-react";
import {
  getAllHomeContent, createHomeContent, updateHomeContent,
  activateHomeContent, deleteHomeContent,
} from "../../../api/admin/homeContentAdminApi";
import { uploadMedia, isAllowedFileType } from "../../../api/admin/uploadApi";
import type { HomeContent, HomeContentPayload } from "../../../types/homeContent";
import ConfirmModal from "../ConfirmModal";

const ACCENT = "#00B4D8";

const EMPTY: HomeContentPayload = {
  heroTitle: "", heroSubtitle: "", heroButtonText: "",
  problemTitle: "", problemText: "", problemImageUrl: undefined,
  solutionTitle: "", solutionText: "", solutionImageUrl: undefined,
  ctaTitle: "", ctaButtonText: "",
};

const inputCls = "w-full bg-white/[0.035] border border-white/[0.09] rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#00B4D8]/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,180,216,0.12)] transition-all duration-200";
const labelCls = "block text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2";

function FieldCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-4 sm:p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] mb-5">
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

function ImageField({ label, value, onUpload, onClear }: {
  label: string; value?: string;
  onUpload: (f: File) => void; onClear: () => void;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-white/[0.08] group w-full max-w-[220px] sm:w-44">
          <img src={value} alt={label} className="w-full h-28 object-cover" />
          <button type="button" onClick={onClear}
            className="absolute top-2 right-2 bg-[#0A0F1E]/80 hover:bg-red-500/80 text-white p-1.5 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Trash2 size={12} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full max-w-[220px] sm:w-44 h-28 border border-dashed border-white/[0.15] hover:border-[#00B4D8]/50 rounded-xl cursor-pointer transition-all text-slate-500 hover:text-[#00B4D8] text-xs gap-2 hover:bg-[#00B4D8]/[0.04]">
          <Plus size={18} />
          Upload image
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }} />
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

export default function HomeContentAdmin() {
  const [versions, setVersions] = useState<HomeContent[]>([]);
  const [selected, setSelected] = useState<HomeContent | null>(null);
  const [form, setForm] = useState<HomeContentPayload>(EMPTY);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activating, setActivating] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<ModalState>(null);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const content = await getAllHomeContent();
      setVersions(content);
      const active = content.find((c) => c.active) || content[0] || null;
      if (active) { setSelected(active); const { id, ...rest } = active; setForm(rest); }
      setIsNew(false);
    } catch { setError("Couldn't load content."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const selectVersion = (v: HomeContent) => {
    setSelected(v); const { id, ...rest } = v; setForm(rest);
    setIsNew(false); setSaved(false); setError("");
  };

  // "New" only resets the form locally — nothing is sent to the backend
  // until Save, since the backend rejects empty required fields (400).
  const startNew = () => {
    setSelected(null); setForm(EMPTY); setIsNew(true); setSaved(false); setError("");
  };

  const set = (field: keyof HomeContentPayload, val: string) => {
    setForm((p) => ({ ...p, [field]: val })); setSaved(false);
  };

  const handleImageUpload = async (field: "problemImageUrl" | "solutionImageUrl", file: File) => {
    if (!isAllowedFileType(file)) { setError("Unsupported file type."); return; }
    try { set(field, await uploadMedia(file, "home-content")); }
    catch { setError("Image upload failed."); }
  };

  const handleSave = async () => {
    setSaving(true); setError(""); setSaved(false);
    try {
      if (isNew) {
        const created = await createHomeContent(form);
        setVersions((p) => [...p, created]); setSelected(created); setIsNew(false);
      } else if (selected) {
        const updated = await updateHomeContent(selected.id, form);
        setVersions((p) => p.map((v) => (v.id === updated.id ? updated : v))); setSelected(updated);
      }
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch { setError("Couldn't save changes. Make sure required fields (titles) are filled in."); }
    finally { setSaving(false); }
  };

  const handleActivate = async () => {
    if (!selected) return;
    setActivating(true); setError("");
    try {
      await activateHomeContent(selected.id);
      setVersions((p) => p.map((v) => ({ ...v, active: v.id === selected.id })));
      setSelected((s) => s ? { ...s, active: true } : s);
    } catch { setError("Couldn't publish this version."); }
    finally { setActivating(false); }
  };

  const requestDelete = (v: HomeContent) => {
    if (v.active) { setModal({ kind: "blocked-delete" }); return; }
    setModal({ kind: "confirm-delete", id: v.id });
  };

  const confirmDelete = async (id: number) => {
    setDeleting(id);
    try {
      await deleteHomeContent(id);
      const remaining = versions.filter((v) => v.id !== id);
      setVersions(remaining);
      if (selected?.id === id) {
        if (remaining.length > 0) selectVersion(remaining[0]);
        else { setSelected(null); setForm(EMPTY); setIsNew(true); }
      }
    } catch { setModal({ kind: "error", message: "Couldn't delete this version." }); }
    finally { setDeleting(null); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: ACCENT, borderTopColor: "transparent" }} />
    </div>
  );

  const isLive = !isNew && selected?.active === true;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5 md:gap-6 items-start">
      {/* Version sidebar — horizontal scroll strip on mobile, vertical rail on desktop */}
      <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.03] to-transparent overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] md:sticky md:top-4">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
          <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">Versions</span>
          <button onClick={startNew}
            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors flex-shrink-0"
            style={{ color: ACCENT, backgroundColor: `${ACCENT}14` }}>
            <Plus size={12} /> New
          </button>
        </div>

        <div className="p-2 flex md:flex-col gap-1.5 md:gap-1 overflow-x-auto md:overflow-x-visible -mx-0.5 px-0.5 md:mx-0 md:px-2">
          {versions.map((v) => (
            <div key={v.id}
              onClick={() => selectVersion(v)}
              className={`group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all flex-shrink-0 w-[180px] md:w-auto ${
                selected?.id === v.id && !isNew
                  ? "text-white"
                  : "hover:bg-white/[0.04] text-slate-400"
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
                <div className="text-xs font-medium truncate">{v.heroTitle || `Version ${v.id}`}</div>
                {v.active && (
                  <span className="text-[10px] font-semibold flex items-center gap-1 mt-0.5"
                    style={{ color: ACCENT }}>
                    <Radio size={9} /> Live
                  </span>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); requestDelete(v); }}
                disabled={deleting === v.id}
                className="text-slate-600 hover:text-red-400 p-1 rounded flex-shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all disabled:opacity-30">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {isNew && (
            <div className="px-3 py-2.5 rounded-xl flex-shrink-0 w-[180px] md:w-auto"
              style={{ background: `linear-gradient(135deg, ${ACCENT}1F, ${ACCENT}08)`, boxShadow: `0 0 0 1px ${ACCENT}33` }}>
              <div className="text-white text-xs font-medium">New version</div>
              <div className="text-slate-500 text-[10px]">Unsaved</div>
            </div>
          )}
          {versions.length === 0 && !isNew && (
            <p className="text-slate-500 text-xs px-3 py-2">No versions yet.</p>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="min-w-0">
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 mb-5">
            <AlertCircle size={16} className="flex-shrink-0" /> {error}
          </div>
        )}

        {/* Status banner */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl px-5 py-4 mb-6 border ${
          isLive
            ? "border-white/[0.08] bg-gradient-to-r from-white/[0.04] to-transparent"
            : "border-white/[0.06] bg-white/[0.02]"
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isLive ? "animate-pulse" : ""}`}
              style={{ backgroundColor: isLive ? ACCENT : "#475569", boxShadow: isLive ? `0 0 6px ${ACCENT}` : "none" }} />
            <span className={`text-sm font-medium ${isLive ? "text-white" : "text-slate-400"}`}>
              {isNew ? "New draft — save first, then publish"
                : isLive ? "This version is live on the website"
                : "Draft — not visible on the website yet"}
            </span>
          </div>
          {!isLive && !isNew && selected && (
            <button onClick={handleActivate} disabled={activating}
              className="inline-flex items-center justify-center gap-2 font-semibold text-xs px-4 py-2 rounded-xl transition-colors flex-shrink-0 w-full sm:w-auto"
              style={{ backgroundColor: ACCENT, color: "#0A0F1E" }}>
              {activating ? "Publishing..." : "Set as live"}
            </button>
          )}
        </div>

        <FieldCard step={1} title="Hero section">
          <div><label className={labelCls}>Hero title</label>
            <input type="text" maxLength={150} value={form.heroTitle}
              onChange={(e) => set("heroTitle", e.target.value)} className={inputCls} />
          </div>
          <div><label className={labelCls}>Hero subtitle</label>
            <input type="text" maxLength={250} value={form.heroSubtitle || ""}
              onChange={(e) => set("heroSubtitle", e.target.value)} className={inputCls} />
          </div>
          <div><label className={labelCls}>Hero button text</label>
            <input type="text" maxLength={50} value={form.heroButtonText || ""}
              onChange={(e) => set("heroButtonText", e.target.value)} className={inputCls} />
          </div>
        </FieldCard>

        <FieldCard step={2} title="Problem section">
          <div><label className={labelCls}>Problem title</label>
            <input type="text" maxLength={150} value={form.problemTitle}
              onChange={(e) => set("problemTitle", e.target.value)} className={inputCls} />
          </div>
          <div><label className={labelCls}>Problem text</label>
            <textarea rows={3} value={form.problemText || ""}
              onChange={(e) => set("problemText", e.target.value)} className={`${inputCls} resize-none`} />
          </div>
          <ImageField label="Problem image" value={form.problemImageUrl}
            onUpload={(f) => handleImageUpload("problemImageUrl", f)}
            onClear={() => set("problemImageUrl", "")} />
        </FieldCard>

        <FieldCard step={3} title="Solution section">
          <div><label className={labelCls}>Solution title</label>
            <input type="text" maxLength={150} value={form.solutionTitle}
              onChange={(e) => set("solutionTitle", e.target.value)} className={inputCls} />
          </div>
          <div><label className={labelCls}>Solution text</label>
            <textarea rows={3} value={form.solutionText || ""}
              onChange={(e) => set("solutionText", e.target.value)} className={`${inputCls} resize-none`} />
          </div>
          <ImageField label="Solution image" value={form.solutionImageUrl}
            onUpload={(f) => handleImageUpload("solutionImageUrl", f)}
            onClear={() => set("solutionImageUrl", "")} />
        </FieldCard>

        <FieldCard step={4} title="CTA section">
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
        <div className="sticky bottom-0 mt-2 pt-4 pb-2 bg-gradient-to-t from-[#070B14] via-[#070B14]/95 to-transparent">
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-2 disabled:opacity-50 font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              style={{ backgroundColor: ACCENT, color: "#0A0F1E" }}>
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
        title="Can't delete live version"
        message="This is the live version. Activate another version first, then delete this one."
        onClose={() => setModal(null)}
      />
      <ConfirmModal
        open={modal?.kind === "confirm-delete"}
        mode="confirm" tone="danger"
        title="Delete this version?"
        message="This version will be permanently deleted. This can't be undone."
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