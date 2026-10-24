/* Author: Nithish Kaliannan Ananth */
// src/pages/admin/webcontent/about/ValuesAdmin.tsx
import { useState } from "react";
import { Plus, Save, Trash2, AlertCircle } from "lucide-react";
import {
  getAllValues, createValue, updateValue, deleteValue,
} from "../../../../api/admin/valueAdminApi";
import type { ValuePayload } from "../../../../api/admin/valueAdminApi";
import type { Value } from "../../../../types";
import ConfirmModal from "../../../../components/admin/ConfirmModal";
import { useMountLoad } from "../../../../hooks/useMountLoad";

const ACCENT = "#00E5FF";
const MAX = 3;

const inputCls = "w-full bg-white/[0.035] border border-white/[0.09] rounded-sm px-3.5 py-2.5 text-white text-sm placeholder:text-drift/70 focus:outline-none focus:border-[#00E5FF]/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,229,255,0.12)] transition-all duration-200";
const labelCls = "block text-drift text-[11px] font-semibold uppercase tracking-wide mb-1.5";

type ModalState = { kind: "confirm-delete"; id: number } | { kind: "error"; message: string } | null;

export default function ValuesAdmin() {
  const [values, setValues] = useState<Value[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | "new" | null>(null);
  const [modal, setModal] = useState<ModalState>(null);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await getAllValues();
      setValues([...data].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)));
    } catch { setError("Couldn't load values."); }
    finally { setLoading(false); }
  };

  useMountLoad(load);

  // Backend rejects blank description/icon (400 — likely @NotBlank validation),
  // so we send placeholder text on create instead of empty strings. The admin
  // then overwrites these placeholders with real content before saving.
  const handleAdd = async () => {
    if (values.length >= MAX) return;
    setBusy("new");
    try {
      const created = await createValue({
        title: "New value",
        description: "Add a description",
        icon: "Leaf",
        displayOrder: values.length + 1,
      });
      setValues((p) => [...p, created]);
    } catch { setModal({ kind: "error", message: "Couldn't add value." }); }
    finally { setBusy(null); }
  };

  const setField = (id: number, field: keyof Value, val: string | number) =>
    setValues((p) => p.map((v) => (v.id === id ? { ...v, [field]: val } : v)));

  const handleSave = async (v: Value) => {
    setBusy(v.id);
    try {
      const { id, ...payload } = v;
      const updated = await updateValue(id, payload as ValuePayload);
      setValues((p) => p.map((x) => (x.id === id ? updated : x)));
    } catch { setModal({ kind: "error", message: "Couldn't save value." }); }
    finally { setBusy(null); }
  };

  const confirmDelete = async (id: number) => {
    setBusy(id);
    try { await deleteValue(id); setValues((p) => p.filter((v) => v.id !== id)); }
    catch { setModal({ kind: "error", message: "Couldn't delete value." }); }
    finally { setBusy(null); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: ACCENT, borderTopColor: "transparent" }} />
    </div>
  );

  return (
    <div>
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-sm px-4 py-3 mb-5">
          <AlertCircle size={16} className="flex-shrink-0" /> {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <p className="text-drift text-sm">
          Value cards displayed on the About page. {values.length}/{MAX}
          {values.length >= MAX && " · delete one to add another"}
        </p>
        <button onClick={handleAdd} disabled={busy === "new" || values.length >= MAX}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ color: ACCENT, backgroundColor: `${ACCENT}14` }}>
          <Plus size={13} /> {busy === "new" ? "Adding..." : "Add value"}
        </button>
      </div>

      {/* Slot indicators */}
      <div className="flex items-center gap-2 mb-6">
        {Array.from({ length: MAX }, (_, i) => i + 1).map((n) => (
          <div key={n}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-all"
            style={values.length >= n
              ? { backgroundColor: `${ACCENT}1F`, borderColor: `${ACCENT}40`, color: ACCENT, boxShadow: `0 0 10px ${ACCENT}30` }
              : { backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#475569" }}>
            {n}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {values.length === 0 && (
          <p className="text-drift text-sm text-center py-10">No values yet.</p>
        )}
        {values.map((v) => (
          <div key={v.id}
            className="rounded-sm border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_100px] gap-3 mb-4">
              <div>
                <label className={labelCls}>Title</label>
                <input value={v.title} onChange={(e) => setField(v.id, "title", e.target.value)}
                  className={inputCls} placeholder="e.g. Sustainability" />
              </div>
              <div>
                <label className={labelCls}>Icon (Lucide name)</label>
                <input value={v.icon || ""} onChange={(e) => setField(v.id, "icon", e.target.value)}
                  className={inputCls} placeholder="e.g. Leaf" />
              </div>
              <div>
                <label className={labelCls}>Order</label>
                <input type="number" value={v.displayOrder ?? 0}
                  onChange={(e) => setField(v.id, "displayOrder", Number(e.target.value))}
                  className={inputCls} />
              </div>
            </div>
            <div className="mb-4">
              <label className={labelCls}>Description</label>
              <textarea rows={2} value={v.description}
                onChange={(e) => setField(v.id, "description", e.target.value)}
                className={`${inputCls} resize-none`} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => handleSave(v)} disabled={busy === v.id}
                className="inline-flex items-center gap-1.5 disabled:opacity-50 font-semibold text-xs px-4 py-2 rounded-sm transition-colors"
                style={{ backgroundColor: ACCENT, color: "#060A0E" }}>
                <Save size={13} /> Save
              </button>
              <button onClick={() => setModal({ kind: "confirm-delete", id: v.id })} disabled={busy === v.id}
                className="inline-flex items-center gap-1.5 text-drift hover:text-red-400 hover:bg-red-400/10 text-xs px-3 py-2 rounded-sm transition-colors disabled:opacity-30">
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={modal?.kind === "confirm-delete"}
        mode="confirm" tone="danger"
        title="Delete this value?"
        message="This value card will be permanently deleted. This can't be undone."
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