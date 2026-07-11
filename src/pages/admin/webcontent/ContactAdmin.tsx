// src/pages/admin/webcontent/ContactAdmin.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Save, CheckCircle2, Trash2, AlertCircle, Radio, ArrowLeft, Phone,
} from "lucide-react";
import {
  getAllContactInfo, createContactInfo, updateContactInfo,
  activateContactInfo, deleteContactInfo,
} from "../../../api/admin/contactInfoAdminApi";
import type { ContactInfo, ContactInfoPayload } from "../../../types/contact";
import ConfirmModal from "../../../components/admin/ConfirmModal";

const ACCENT = "#22C55E";

const EMPTY: ContactInfoPayload = {
  heroTitle: "", heroSubtitle: "", email: "", phone: "",
  address: "", mapEmbedUrl: "", linkedin: "", instagram: "",
  twitter: "", youtube: "",
};

const inputCls = "w-full bg-white/[0.035] border border-white/[0.09] rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#22C55E]/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(34,197,94,0.12)] transition-all duration-200";
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

function SocialField({ icon, label, value, onChange }: {
  icon: string; label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelCls}>
        <span className="inline-flex items-center gap-1.5 normal-case tracking-normal text-[13px] font-medium text-slate-300">
          <span
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${ACCENT}1A`, color: ACCENT }}
          >
            <i className={`ti ${icon} text-[13px]`} />
          </span>
          {label}
        </span>
      </label>
      <input type="text" value={value} placeholder="https://..."
        onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </div>
  );
}

type ModalState =
  | { kind: "blocked-delete" }
  | { kind: "confirm-delete"; id: number }
  | { kind: "error"; message: string }
  | null;

export default function ContactAdmin() {
  const navigate = useNavigate();
  const [versions, setVersions] = useState<ContactInfo[]>([]);
  const [selected, setSelected] = useState<ContactInfo | null>(null);
  const [form, setForm] = useState<ContactInfoPayload>(EMPTY);
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
      const content = await getAllContactInfo();
      setVersions(content);
      const active = content.find((c) => c.active) || content[0] || null;
      if (active) {
        setSelected(active);
        const { id, active: _a, ...rest } = active;
        setForm(rest);
      }
      setIsNew(false);
    } catch { setError("Couldn't load contact info."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const selectVersion = (v: ContactInfo) => {
    setSelected(v);
    const { id, active: _a, ...rest } = v;
    setForm(rest);
    setIsNew(false); setSaved(false); setError("");
  };

  const startNew = () => {
    setSelected(null); setForm(EMPTY); setIsNew(true); setSaved(false); setError("");
  };

  const set = (field: keyof ContactInfoPayload, val: string) => {
    setForm((p) => ({ ...p, [field]: val })); setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true); setError(""); setSaved(false);
    try {
      if (isNew) {
        const created = await createContactInfo(form);
        setVersions((p) => [...p, created]); setSelected(created); setIsNew(false);
      } else if (selected) {
        const updated = await updateContactInfo(selected.id, form);
        setVersions((p) => p.map((v) => (v.id === updated.id ? updated : v))); setSelected(updated);
      }
      setSaved(true); setTimeout(() => setSaved(false), 3000);
    } catch { setError("Couldn't save changes."); }
    finally { setSaving(false); }
  };

  const handleActivate = async () => {
    if (!selected) return;
    setActivating(true); setError("");
    try {
      await activateContactInfo(selected.id);
      setVersions((p) => p.map((v) => ({ ...v, active: v.id === selected.id })));
      setSelected((s) => (s ? { ...s, active: true } : s));
    } catch { setError("Couldn't publish this version."); }
    finally { setActivating(false); }
  };

  const requestDelete = (v: ContactInfo) => {
    if (v.active) { setModal({ kind: "blocked-delete" }); return; }
    setModal({ kind: "confirm-delete", id: v.id });
  };

  const confirmDelete = async (id: number) => {
    setDeleting(id);
    try {
      await deleteContactInfo(id);
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
    <div>
      <button
        onClick={() => navigate("/admin/dashboard/content")}
        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-200 text-sm mb-6 transition-colors group"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
        Website Content
      </button>

      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${ACCENT}1F`, border: `1px solid ${ACCENT}40`, color: ACCENT }}
        >
          <Phone size={16} />
        </div>
        <h1 className="font-heading font-bold text-2xl text-white tracking-tight">Contact</h1>
      </div>
      <p className="text-slate-500 text-sm mb-7 ml-12">
        Hero text, contact details, map embed and social links for the Contact page.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5 md:gap-6 items-start">

        {/* Version sidebar */}
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
          </FieldCard>

          <FieldCard step={2} title="Contact details">
            <div><label className={labelCls}>Email</label>
              <input type="email" maxLength={100} value={form.email}
                onChange={(e) => set("email", e.target.value)} className={inputCls} />
            </div>
            <div><label className={labelCls}>Phone</label>
              <input type="text" maxLength={30} value={form.phone || ""}
                onChange={(e) => set("phone", e.target.value)} className={inputCls} />
            </div>
            <div><label className={labelCls}>Address</label>
              <textarea rows={2} maxLength={250} value={form.address || ""}
                onChange={(e) => set("address", e.target.value)} className={`${inputCls} resize-none`} />
            </div>
          </FieldCard>

          <FieldCard step={3} title="Map">
            <div><label className={labelCls}>Google Maps embed URL</label>
              <input type="text" maxLength={500} value={form.mapEmbedUrl || ""}
                placeholder="https://www.google.com/maps/embed?..."
                onChange={(e) => set("mapEmbedUrl", e.target.value)} className={inputCls} />
            </div>
          </FieldCard>

          <FieldCard step={4} title="Social links">
            <div className="grid sm:grid-cols-2 gap-4">
              <SocialField icon="ti-brand-linkedin" label="LinkedIn" value={form.linkedin || ""}
                onChange={(v) => set("linkedin", v)} />
              <SocialField icon="ti-brand-instagram" label="Instagram" value={form.instagram || ""}
                onChange={(v) => set("instagram", v)} />
              <SocialField icon="ti-brand-twitter" label="Twitter" value={form.twitter || ""}
                onChange={(v) => set("twitter", v)} />
              <SocialField icon="ti-brand-youtube" label="YouTube" value={form.youtube || ""}
                onChange={(v) => set("youtube", v)} />
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