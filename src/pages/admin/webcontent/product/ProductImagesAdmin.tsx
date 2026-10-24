/* Author: Nithish Kaliannan Ananth */
// src/pages/admin/webcontent/product/ProductImagesAdmin.tsx
import { useState } from "react";
import { Plus, Save, Trash2, AlertCircle } from "lucide-react";
import { productImageApi } from "../../../../api/admin/productSubAdminApi";
import type { ProductImage, ProductImagePayload } from "../../../../api/admin/productSubAdminApi";
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

export default function ProductImagesAdmin() {
  const [items, setItems] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | "new" | null>(null);
  const [modal, setModal] = useState<ModalState>(null);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await productImageApi.getAll();
      setItems([...data].sort((a, b) => a.displayOrder - b.displayOrder));
    } catch { setError("Couldn't load images."); }
    finally { setLoading(false); }
  };

  useMountLoad(load);

  const handleAdd = async (file: File) => {
    if (!isAllowedFileType(file)) { setError("Unsupported file type."); return; }
    setBusy("new");
    try {
      const url = await uploadMedia(file, "products/gallery");
      const created = await productImageApi.create({
        imageUrl: url, caption: "", displayOrder: items.length + 1,
      });
      setItems((p) => [...p, created]);
    } catch { setError("Couldn't add image."); }
    finally { setBusy(null); }
  };

  const setField = (id: number, field: keyof ProductImage, val: string | number) =>
    setItems((p) => p.map((x) => (x.id === id ? { ...x, [field]: val } : x)));

  const handleReplaceImage = async (id: number, file: File) => {
    if (!isAllowedFileType(file)) { setError("Unsupported file type."); return; }
    try { setField(id, "imageUrl", await uploadMedia(file, "products/gallery")); }
    catch { setError("Image upload failed."); }
  };

  const handleSave = async (img: ProductImage) => {
    setBusy(img.id);
    try {
      const { id, ...payload } = img;
      const updated = await productImageApi.update(id, payload as ProductImagePayload);
      setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
    } catch { setModal({ kind: "error", message: "Couldn't save image." }); }
    finally { setBusy(null); }
  };

  const requestDelete = (id: number) => setModal({ kind: "confirm-delete", id });

  const confirmDelete = async (id: number) => {
    setBusy(id);
    try { await productImageApi.remove(id); setItems((p) => p.filter((x) => x.id !== id)); }
    catch { setModal({ kind: "error", message: "Couldn't delete image." }); }
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
        <p className="text-drift text-sm">Gallery images on the Product page. {items.length} total.</p>
        <label className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-sm transition-colors cursor-pointer flex-shrink-0"
          style={{
            color: ACCENT, backgroundColor: `${ACCENT}14`,
            opacity: busy === "new" ? 0.4 : 1,
            pointerEvents: busy === "new" ? "none" : "auto",
          }}>
          <Plus size={13} /> Add image
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAdd(f); e.target.value = ""; }} />
        </label>
      </div>

      <div className="space-y-4">
        {items.length === 0 && (
          <p className="text-drift text-sm text-center py-10">No images yet.</p>
        )}
        {items.map((img) => (
          <div key={img.id} className="rounded-sm border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-4 sm:p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4 mb-4">
              <ImageField label="Image" value={img.imageUrl}
                onUpload={(f) => handleReplaceImage(img.id, f)}
                onClear={() => setField(img.id, "imageUrl", "")}
                accent={ACCENT} />
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Caption</label>
                  <input value={img.caption || ""} onChange={(e) => setField(img.id, "caption", e.target.value)}
                    className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Order</label>
                  <input type="number" value={img.displayOrder}
                    onChange={(e) => setField(img.id, "displayOrder", Number(e.target.value))}
                    className={inputCls} />
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => handleSave(img)} disabled={busy === img.id}
                className="inline-flex items-center gap-1.5 disabled:opacity-50 font-semibold text-xs px-4 py-2 rounded-sm transition-colors"
                style={{ backgroundColor: ACCENT, color: "#060A0E" }}>
                <Save size={13} /> Save
              </button>
              <button onClick={() => requestDelete(img.id)} disabled={busy === img.id}
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
        title="Delete this image?"
        message="This image will be permanently removed from the gallery. This can't be undone."
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