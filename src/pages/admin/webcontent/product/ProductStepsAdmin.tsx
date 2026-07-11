// src/pages/admin/webcontent/product/ProductStepsAdmin.tsx
import { useEffect, useState } from "react";
import { Plus, Save, Trash2, AlertCircle } from "lucide-react";
import { productStepApi } from "../../../../api/admin/productSubAdminApi";
import type { ProductStep, ProductStepPayload } from "../../../../api/admin/productSubAdminApi";
import ConfirmModal from "../../../../components/admin/ConfirmModal";

const ACCENT = "#3B82F6";

const inputCls = "w-full bg-white/[0.035] border border-white/[0.09] rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6]/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)] transition-all duration-200";
const labelCls = "block text-slate-500 text-[11px] font-medium mb-1.5";

type ModalState =
  | { kind: "confirm-delete"; id: number }
  | { kind: "error"; message: string }
  | null;

export default function ProductStepsAdmin() {
  const [items, setItems] = useState<ProductStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | "new" | null>(null);
  const [modal, setModal] = useState<ModalState>(null);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await productStepApi.getAll();
      setItems([...data].sort((a, b) => a.stepNumber - b.stepNumber));
    } catch { setError("Couldn't load steps."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // Backend rejects blank icon/description (400 — same @NotBlank pattern
  // hit across Values/Features/Specs). Send placeholder text on create.
  const handleAdd = async () => {
    setBusy("new");
    try {
      const created = await productStepApi.create({
        stepNumber: items.length + 1,
        icon: "Rocket",
        title: "New step",
        description: "Add a description",
      });
      setItems((p) => [...p, created]);
    } catch { setModal({ kind: "error", message: "Couldn't add step." }); }
    finally { setBusy(null); }
  };

  const setField = (id: number, field: keyof ProductStep, val: string | number) =>
    setItems((p) => p.map((x) => (x.id === id ? { ...x, [field]: val } : x)));

  const handleSave = async (s: ProductStep) => {
    setBusy(s.id);
    try {
      const { id, ...payload } = s;
      const updated = await productStepApi.update(id, payload as ProductStepPayload);
      setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
    } catch { setModal({ kind: "error", message: "Couldn't save step." }); }
    finally { setBusy(null); }
  };

  const requestDelete = (id: number) => setModal({ kind: "confirm-delete", id });

  const confirmDelete = async (id: number) => {
    setBusy(id);
    try { await productStepApi.remove(id); setItems((p) => p.filter((x) => x.id !== id)); }
    catch { setModal({ kind: "error", message: "Couldn't delete step." }); }
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
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 mb-5">
          <AlertCircle size={16} className="flex-shrink-0" /> {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <p className="text-slate-500 text-sm">"How it works" steps on the Product page. {items.length} total.</p>
        <button onClick={handleAdd} disabled={busy === "new"}
          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40 flex-shrink-0"
          style={{ color: ACCENT, backgroundColor: `${ACCENT}14` }}>
          <Plus size={13} /> {busy === "new" ? "Adding..." : "Add step"}
        </button>
      </div>

      <div className="space-y-4">
        {items.length === 0 && (
          <p className="text-slate-500 text-sm text-center py-10">No steps yet.</p>
        )}
        {items.map((s) => (
          <div key={s.id} className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-4 sm:p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr_1fr] gap-3 mb-4">
              <div>
                <label className={labelCls}>Step #</label>
                <input type="number" value={s.stepNumber}
                  onChange={(e) => setField(s.id, "stepNumber", Number(e.target.value))}
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Title</label>
                <input value={s.title} onChange={(e) => setField(s.id, "title", e.target.value)}
                  className={inputCls} placeholder="Deploy Autonomous Craft" />
              </div>
              <div>
                <label className={labelCls}>Icon (Lucide name)</label>
                <input value={s.icon || ""} onChange={(e) => setField(s.id, "icon", e.target.value)}
                  className={inputCls} placeholder="e.g. Rocket" />
              </div>
            </div>
            <div className="mb-4">
              <label className={labelCls}>Description</label>
              <textarea rows={2} value={s.description}
                onChange={(e) => setField(s.id, "description", e.target.value)}
                className={`${inputCls} resize-none`} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => handleSave(s)} disabled={busy === s.id}
                className="inline-flex items-center gap-1.5 disabled:opacity-50 font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: ACCENT, color: "#0A0F1E" }}>
                <Save size={13} /> Save
              </button>
              <button onClick={() => requestDelete(s.id)} disabled={busy === s.id}
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 text-xs px-3 py-2 rounded-lg transition-colors disabled:opacity-30">
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={modal?.kind === "confirm-delete"}
        mode="confirm" tone="danger"
        title="Delete this step?"
        message="This step will be permanently deleted. This can't be undone."
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