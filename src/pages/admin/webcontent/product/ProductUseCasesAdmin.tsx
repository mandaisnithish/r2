/* Author: Nithish Kaliannan Ananth */
// src/pages/admin/webcontent/product/ProductUseCasesAdmin.tsx
import { useState } from "react";
import { Plus, Save, Trash2, AlertCircle } from "lucide-react";
import { productUseCaseApi } from "../../../../api/admin/productSubAdminApi";
import type { ProductUseCase, ProductUseCasePayload } from "../../../../api/admin/productSubAdminApi";
import { uploadMedia, isAllowedFileType } from "../../../../api/admin/uploadApi";
import { ImageField } from "../../../../components/admin/shared/FormPrimitives";
import ConfirmModal from "../../../../components/admin/ConfirmModal";
import { useMountLoad } from "../../../../hooks/useMountLoad";

const ACCENT = "#00E5FF";

const inputCls = "w-full bg-white/[0.035] border border-white/[0.09] rounded-sm px-3.5 py-2.5 text-white text-sm placeholder:text-drift/70 focus:outline-none focus:border-[#00E5FF]/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,229,255,0.12)] transition-all duration-200";
const labelCls = "block text-drift text-[11px] font-medium mb-1.5";

type ModalState =
  | { kind: "confirm-delete"; id: number }
  | { kind: "error"; message: string }
  | null;

export default function ProductUseCasesAdmin() {
  const [items, setItems] = useState<ProductUseCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | "new" | null>(null);
  const [modal, setModal] = useState<ModalState>(null);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await productUseCaseApi.getAll();
      setItems([...data].sort((a, b) => a.displayOrder - b.displayOrder));
    } catch { setError("Couldn't load use cases."); }
    finally { setLoading(false); }
  };

  useMountLoad(load);

  // Backend rejects blank icon/description (400 — same @NotBlank pattern
  // hit across Values/Features/Specs/Steps). Send placeholder text on
  // create; imageUrl stays empty since that's filled via upload after.
  const handleAdd = async () => {
    setBusy("new");
    try {
      const created = await productUseCaseApi.create({
        icon: "Waves",
        title: "New use case",
        description: "Add a description",
        imageUrl: "",
        displayOrder: items.length + 1,
      });
      setItems((p) => [...p, created]);
    } catch { setModal({ kind: "error", message: "Couldn't add use case." }); }
    finally { setBusy(null); }
  };

  const setField = (id: number, field: keyof ProductUseCase, val: string | number) =>
    setItems((p) => p.map((x) => (x.id === id ? { ...x, [field]: val } : x)));

  const handleImageUpload = async (id: number, file: File) => {
    if (!isAllowedFileType(file)) { setError("Unsupported file type."); return; }
    try { setField(id, "imageUrl", await uploadMedia(file, "products/usecases")); }
    catch { setError("Image upload failed."); }
  };

  const handleSave = async (u: ProductUseCase) => {
    setBusy(u.id);
    try {
      const { id, ...payload } = u;
      const updated = await productUseCaseApi.update(id, payload as ProductUseCasePayload);
      setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
    } catch { setModal({ kind: "error", message: "Couldn't save use case." }); }
    finally { setBusy(null); }
  };

  const requestDelete = (id: number) => setModal({ kind: "confirm-delete", id });

  const confirmDelete = async (id: number) => {
    setBusy(id);
    try { await productUseCaseApi.remove(id); setItems((p) => p.filter((x) => x.id !== id)); }
    catch { setModal({ kind: "error", message: "Couldn't delete use case." }); }
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
        <p className="text-drift text-sm">Deployment use cases on the Product page. {items.length} total.</p>
        <button onClick={handleAdd} disabled={busy === "new"}
          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-sm transition-colors disabled:opacity-40 flex-shrink-0"
          style={{ color: ACCENT, backgroundColor: `${ACCENT}14` }}>
          <Plus size={13} /> {busy === "new" ? "Adding..." : "Add use case"}
        </button>
      </div>

      <div className="space-y-4">
        {items.length === 0 && (
          <p className="text-drift text-sm text-center py-10">No use cases yet.</p>
        )}
        {items.map((u) => (
          <div key={u.id} className="rounded-sm border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-4 sm:p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 mb-4">
              <ImageField label="Image" value={u.imageUrl}
                onUpload={(f) => handleImageUpload(u.id, f)}
                onClear={() => setField(u.id, "imageUrl", "")}
                accent={ACCENT} />
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Title</label>
                    <input value={u.title} onChange={(e) => setField(u.id, "title", e.target.value)}
                      className={inputCls} placeholder="Marine Cleanup" />
                  </div>
                  <div>
                    <label className={labelCls}>Icon (Lucide name)</label>
                    <input value={u.icon || ""} onChange={(e) => setField(u.id, "icon", e.target.value)}
                      className={inputCls} placeholder="e.g. Waves" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea rows={2} value={u.description}
                    onChange={(e) => setField(u.id, "description", e.target.value)}
                    className={`${inputCls} resize-none`} />
                </div>
                <div>
                  <label className={labelCls}>Order</label>
                  <input type="number" value={u.displayOrder}
                    onChange={(e) => setField(u.id, "displayOrder", Number(e.target.value))}
                    className={`${inputCls} w-24`} />
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => handleSave(u)} disabled={busy === u.id}
                className="inline-flex items-center gap-1.5 disabled:opacity-50 font-semibold text-xs px-4 py-2 rounded-sm transition-colors"
                style={{ backgroundColor: ACCENT, color: "#060A0E" }}>
                <Save size={13} /> Save
              </button>
              <button onClick={() => requestDelete(u.id)} disabled={busy === u.id}
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
        title="Delete this use case?"
        message="This use case will be permanently deleted. This can't be undone."
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