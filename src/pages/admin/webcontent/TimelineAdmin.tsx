// src/pages/admin/webcontent/TimelineAdmin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Save, CheckCircle2, Trash2, AlertCircle, Calendar, ArrowLeft, Clock,
} from "lucide-react";
import {
  getAllTimelineEventsAdmin, createTimelineEvent, updateTimelineEvent,
  deleteTimelineEvent,
} from "../../../api/admin/timelineAdminApi";
import type { TimelineEvent, TimelineCategory } from "../../../api/timelineapi";
import type { TimelineEventPayload } from "../../../api/admin/timelineAdminApi";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import { ImageField } from "../../../components/admin/shared/FormPrimitives";
import { uploadMedia, isAllowedFileType } from "../../../api/admin/uploadApi";
import { useMountLoad } from "../../../hooks/useMountLoad";

const ACCENT = "#FFB800";

const CATEGORY_OPTIONS: { value: TimelineCategory; label: string }[] = [
  { value: "MILESTONE", label: "Milestone" },
  { value: "COMPETITION", label: "Competition" },
  { value: "PUBLICATION", label: "Publication" },
  { value: "PATENT", label: "Patent" },
  { value: "FUNDING", label: "Funding" },
  { value: "RECOGNITION", label: "Recognition" },
];

const EMPTY: TimelineEventPayload = {
  title: "", description: "", category: "MILESTONE", date: "",
  result: "", organization: "", position: "",
  prizeAmount: undefined, link: "", extraInfo: "", imageUrl: "",
};

const inputCls = "w-full bg-white/[0.035] border border-white/[0.09] rounded-sm px-4 py-3 text-white text-sm placeholder:text-drift/70 focus:outline-none focus:border-[#FFB800]/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(255,184,0,0.12)] transition-all duration-200";
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

function SelectField({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0D151C]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

type ModalState =
  | { kind: "confirm-delete"; id: number }
  | { kind: "error"; message: string }
  | null;

export default function TimelineAdmin() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [selected, setSelected] = useState<TimelineEvent | null>(null);
  const [form, setForm] = useState<TimelineEventPayload>(EMPTY);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<ModalState>(null);

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllTimelineEventsAdmin();
      setEvents(data);
      setIsNew(false);
      setSelected(null);
      setForm(EMPTY);
    } catch { setError("Couldn't load timeline events."); }
    finally { setLoading(false); }
  };

  useMountLoad(load);

  const toPayload = (e: TimelineEvent): TimelineEventPayload => {
    const { id, createdAt, updatedAt, ...rest } = e;
    return rest;
  };

  const selectEvent = (e: TimelineEvent) => {
    setSelected(e);
    setForm(toPayload(e));
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

  const set = (field: keyof TimelineEventPayload, val: string | number | undefined) => {
    setForm((p) => ({ ...p, [field]: val }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.date) {
      setError("Title and date are required.");
      return;
    }
    setSaving(true); setError(""); setSaved(false);
    try {
      if (isNew) {
        const created = await createTimelineEvent(form);
        setEvents((p) => [...p, created]);
        setSelected(created);
        setIsNew(false);
      } else if (selected) {
        const updated = await updateTimelineEvent(selected.id, form);
        setEvents((p) => p.map((e) => (e.id === updated.id ? updated : e)));
        setSelected(updated);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { setError("Couldn't save this event."); }
    finally { setSaving(false); }
  };

  const requestDelete = (id: number) => setModal({ kind: "confirm-delete", id });

  const confirmDelete = async (id: number) => {
    setDeleting(id);
    try {
      await deleteTimelineEvent(id);
      const remaining = events.filter((e) => e.id !== id);
      setEvents(remaining);
      if (selected?.id === id) { setSelected(null); setForm(EMPTY); setIsNew(true); }
    } catch { setModal({ kind: "error", message: "Couldn't delete this event." }); }
    finally { setDeleting(null); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: ACCENT, borderTopColor: "transparent" }} />
    </div>
  );

  return (
    <div>
      <button
        onClick={() => navigate("/admin/dashboard/content")}
        className="inline-flex items-center gap-1.5 text-drift hover:text-bone text-sm mb-6 transition-colors group"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
        Website Content
      </button>

      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${ACCENT}1F`, border: `1px solid ${ACCENT}40`, color: ACCENT }}
        >
          <Clock size={16} />
        </div>
        <h1 className="font-heading font-bold text-2xl text-white tracking-tight">Impact / Timeline</h1>
      </div>
      <p className="text-drift text-sm mb-7 ml-12">
        Milestones, competitions, publications, patents, funding and recognition events.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5 md:gap-6 items-start">

        {/* Events sidebar */}
        <div className="rounded-sm border border-white/[0.07] bg-gradient-to-b from-white/[0.03] to-transparent overflow-hidden shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)] md:sticky md:top-4">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
            <span className="text-fog text-[11px] font-semibold uppercase tracking-wider">Events</span>
            <button onClick={startNew}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-sm transition-colors flex-shrink-0"
              style={{ color: ACCENT, backgroundColor: `${ACCENT}14` }}>
              <Plus size={12} /> New
            </button>
          </div>

          <div className="p-2 flex md:flex-col gap-1.5 md:gap-1 overflow-x-auto md:overflow-x-visible -mx-0.5 px-0.5 md:mx-0 md:px-2">
            {sortedEvents.map((e) => (
              <div key={e.id}
                onClick={() => selectEvent(e)}
                className={`group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-sm cursor-pointer transition-all flex-shrink-0 w-[180px] md:w-auto ${
                  selected?.id === e.id && !isNew
                    ? "text-white"
                    : "hover:bg-white/[0.04] text-fog"
                }`}
                style={selected?.id === e.id && !isNew ? {
                  background: `linear-gradient(135deg, ${ACCENT}1F, ${ACCENT}08)`,
                  boxShadow: `0 0 0 1px ${ACCENT}33`,
                } : undefined}
              >
                {selected?.id === e.id && !isNew && (
                  <span className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full"
                    style={{ backgroundColor: ACCENT }} />
                )}
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate">{e.title}</div>
                  <div className="text-[10px] flex items-center gap-1 mt-0.5 text-drift">
                    <Calendar size={9} /> {e.date} · {e.category}
                  </div>
                </div>
                <button
                  onClick={(ev) => { ev.stopPropagation(); requestDelete(e.id); }}
                  disabled={deleting === e.id}
                  className="text-drift/70 hover:text-red-400 p-1 rounded flex-shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all disabled:opacity-30">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {isNew && (
              <div className="px-3 py-2.5 rounded-sm flex-shrink-0 w-[180px] md:w-auto"
                style={{ background: `linear-gradient(135deg, ${ACCENT}1F, ${ACCENT}08)`, boxShadow: `0 0 0 1px ${ACCENT}33` }}>
                <div className="text-white text-xs font-medium">New event</div>
                <div className="text-drift text-[10px]">Unsaved</div>
              </div>
            )}
            {events.length === 0 && !isNew && (
              <p className="text-drift text-xs px-3 py-2">No events yet.</p>
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

          <FieldCard step={1} title="Details">
            <div><label className={labelCls}>Title</label>
              <input type="text" maxLength={200} value={form.title}
                onChange={(e) => set("title", e.target.value)} className={inputCls} />
            </div>
            <div><label className={labelCls}>Description</label>
              <textarea rows={3} value={form.description || ""}
                onChange={(e) => set("description", e.target.value)} className={`${inputCls} resize-none`} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <SelectField label="Category" value={form.category}
                options={CATEGORY_OPTIONS}
                onChange={(v) => set("category", v as TimelineCategory)} />
              <div><label className={labelCls}>Date</label>
                <input type="date" value={form.date || ""}
                  onChange={(e) => set("date", e.target.value)} className={inputCls} />
              </div>
            </div>
          </FieldCard>

          <FieldCard step={2} title="Result & recognition">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Result</label>
                <input type="text" maxLength={50} value={form.result || ""}
                  placeholder="Won, Filed, Completed..."
                  onChange={(e) => set("result", e.target.value)} className={inputCls} />
              </div>
              <div><label className={labelCls}>Position</label>
                <input type="text" maxLength={100} value={form.position || ""}
                  placeholder="1st Place, Finalist..."
                  onChange={(e) => set("position", e.target.value)} className={inputCls} />
              </div>
            </div>
            <div><label className={labelCls}>Organization</label>
              <input type="text" maxLength={200} value={form.organization || ""}
                onChange={(e) => set("organization", e.target.value)} className={inputCls} />
            </div>
          </FieldCard>

          <FieldCard step={3} title="Financial">
            <div><label className={labelCls}>Prize / funding amount (₹ INR)</label>
              <input type="number" value={form.prizeAmount ?? ""}
                onChange={(e) => set("prizeAmount", e.target.value === "" ? undefined : Number(e.target.value))}
                className={inputCls} />
            </div>
          </FieldCard>

          <FieldCard step={4} title="Media & links">
            <ImageField
              label="Event photo"
              value={form.imageUrl || ""}
              onUpload={async (file) => {
                if (!isAllowedFileType(file)) { setError("Unsupported file type."); return; }
                try { set("imageUrl", await uploadMedia(file, "timeline")); }
                catch { setError("Photo upload failed."); }
              }}
              onClear={() => set("imageUrl", "")}
              accent={ACCENT}
            />
            <div><label className={labelCls}>Link</label>
              <input type="url" maxLength={500} value={form.link || ""}
                placeholder="https://… (press release, certificate, post)"
                onChange={(e) => set("link", e.target.value)} className={inputCls} />
            </div>
            <div><label className={labelCls}>Extra info</label>
              <textarea rows={2} maxLength={500} value={form.extraInfo || ""}
                placeholder="Team members involved, jury notes, venue…"
                onChange={(e) => set("extraInfo", e.target.value)} className={`${inputCls} resize-none`} />
            </div>
          </FieldCard>

          {/* Sticky save bar */}
          <div className="sticky bottom-0 mt-2 pt-4 pb-2 bg-gradient-to-t from-[#060A0E] via-[#060A0E]/95 to-transparent">
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={handleSave} disabled={saving}
                className="inline-flex items-center gap-2 disabled:opacity-50 font-semibold px-6 py-3 rounded-sm transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                style={{ backgroundColor: ACCENT, color: "#060A0E" }}>
                <Save size={16} />
                {saving ? "Saving..." : isNew ? "Add event" : "Save changes"}
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
        open={modal?.kind === "confirm-delete"}
        mode="confirm" tone="danger"
        title="Delete this event?"
        message="This timeline event will be permanently deleted. This can't be undone."
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