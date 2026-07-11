// src/pages/admin/webcontent/product/ProductSpecsAdmin.tsx
import { useEffect, useState } from "react";
import { Plus, Save, Trash2, AlertCircle } from "lucide-react";
import { productSpecApi } from "../../../../api/admin/productSubAdminApi";
import type { ProductSpec, ProductSpecPayload } from "../../../../api/admin/productSubAdminApi";
import ConfirmModal from "../../../../components/admin/ConfirmModal";

const ACCENT = "#3B82F6";

const inputCls = "w-full bg-white/[0.035] border border-white/[0.09] rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6]/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)] transition-all duration-200";
const labelCls = "block text-slate-500 text-[11px] font-medium mb-1.5";

type ModalState =
  | { kind: "confirm-delete"; id: number }
  | { kind: "error"; message: string }
  | null;

export default function ProductSpecsAdmin() {
  const [items, setItems] = useState<ProductSpec[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | "new" | null>(null);
  const [modal, setModal] = useState<ModalState>(null);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await productSpecApi.getAll();
      setItems([...data].sort((a, b) => a.displayOrder - b.displayOrder));
    } catch { setError("Couldn't load specs."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // Backend rejects blank category/value/description (400 — same @NotBlank
  // pattern hit across Values/Features/Steps). Send placeholder text on
  // create so validation passes; admin overwrites it right after.
  const handleAdd = async () => {
    setBusy("new");
    try {
      const created = await productSpecApi.create({
        category: "General",
        label: "New spec",
        value: "TBD",
        description: "Add a description",
        displayOrder: items.length + 1,
      });
      setItems((p) => [...p, created]);
    } catch { setModal({ kind: "error", message: "Couldn't add spec." }); }
    finally { setBusy(null); }
  };

  const setField = (id: number, field: keyof ProductSpec, val: string | number) =>
    setItems((p) => p.map((x) => (x.id === id ? { ...x, [field]: val } : x)));

  const handleSave = async (s: ProductSpec) => {
    setBusy(s.id);
    try {
      const { id, ...payload } = s;
      const updated = await productSpecApi.update(id, payload as ProductSpecPayload);
      setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
    } catch { setModal({ kind: "error", message: "Couldn't save spec." }); }
    finally { setBusy(null); }
  };

  const requestDelete = (id: number) => setModal({ kind: "confirm-delete", id });

  const confirmDelete = async (id: number) => {
    setBusy(id);
    try { await productSpecApi.remove(id); setItems((p) => p.filter((x) => x.id !== id)); }
    catch { setModal({ kind: "error", message: "Couldn't delete spec." }); }
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
        <p className="text-slate-500 text-sm">Technical specs table on the Product page. {items.length} total.</p>
        <button onClick={handleAdd} disabled={busy === "new"}
          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-40 flex-shrink-0"
          style={{ color: ACCENT, backgroundColor: `${ACCENT}14` }}>
          <Plus size={13} /> {busy === "new" ? "Adding..." : "Add spec"}
        </button>
      </div>

      <div className="space-y-4">
        {items.length === 0 && (
          <p className="text-slate-500 text-sm text-center py-10">No specs yet.</p>
        )}
        {items.map((s) => (
          <div key={s.id} className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-4 sm:p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
              <div>
                <label className={labelCls}>Category</label>
                <input value={s.category || ""} onChange={(e) => setField(s.id, "category", e.target.value)}
                  className={inputCls} placeholder="Dimensions, Power..." />
              </div>
              <div>
                <label className={labelCls}>Label</label>
                <input value={s.label} onChange={(e) => setField(s.id, "label", e.target.value)}
                  className={inputCls} placeholder="Payload Capacity" />
              </div>
              <div>
                <label className={labelCls}>Value</label>
                <input value={s.value} onChange={(e) => setField(s.id, "value", e.target.value)}
                  className={inputCls} placeholder="500 kg" />
              </div>
              <div>
                <label className={labelCls}>Order</label>
                <input type="number" value={s.displayOrder}
                  onChange={(e) => setField(s.id, "displayOrder", Number(e.target.value))}
                  className={inputCls} />
              </div>
            </div>
            <div className="mb-4">
              <label className={labelCls}>Description (optional)</label>
              <input value={s.description || ""} onChange={(e) => setField(s.id, "description", e.target.value)}
                className={inputCls} />
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
        title="Delete this spec?"
        message="This spec row will be permanently removed. This can't be undone."
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