// src/pages/admin/webcontent/about/PartnersAdmin.tsx
// Partners shown in the About page "Network" section (hidden on the site
// while the list is empty). Same editing pattern as MembersAdmin.

import { useEffect, useState } from "react";
import { AlertCircle, Plus, Save, Trash2 } from "lucide-react";
import { createPartner, deletePartner, getAllPartners, updatePartner, type PartnerPayload } from "../../../../api/admin/partnerAdminApi";
import { isAllowedFileType, uploadMedia } from "../../../../api/admin/uploadApi";
import type { Partner } from "../../../../types";
import { ImageField } from "../../../../components/admin/shared/FormPrimitives";
import ConfirmModal from "../../../../components/admin/ConfirmModal";

const ACCENT = "#00E5FF";
const inputCls =
  "w-full border border-line-2 bg-abyss px-3.5 py-2.5 text-sm text-bone placeholder:text-drift/70 transition-colors focus:border-hydro focus:outline-none focus:ring-1 focus:ring-hydro/40";
const labelCls = "mb-1.5 block font-mono text-[10px] uppercase tracking-stencil text-drift";

const CATEGORIES = ["Academic", "Incubator", "Funding", "Industry", "Government", "Competition", "Media"];

type ModalState = { kind: "confirm-delete"; id: number } | { kind: "error"; message: string } | null;

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | "new" | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalState>(null);

  useEffect(() => {
    let cancelled = false;
    getAllPartners()
      .then((data) => {
        if (!cancelled) setPartners([...data].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)));
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load partners. If this persists, check that the backend exposes POST/PATCH/DELETE on /api/v1/partners.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = (id: number, field: keyof Partner, val: string | number) =>
    setPartners((p) => p.map((x) => (x.id === id ? { ...x, [field]: val } : x)));

  const handleAdd = async () => {
    setBusy("new");
    try {
      const created = await createPartner({ name: "New partner", logoUrl: "", website: "", category: CATEGORIES[0], displayOrder: partners.length + 1 });
      setPartners((p) => [...p, created]);
    } catch {
      setModal({ kind: "error", message: "Couldn't add a partner." });
    } finally {
      setBusy(null);
    }
  };

  const handleUpload = async (id: number, file: File) => {
    if (!isAllowedFileType(file)) return setError("Unsupported file type.");
    try {
      setField(id, "logoUrl", await uploadMedia(file, "partners"));
    } catch {
      setError("Logo upload failed.");
    }
  };

  const handleSave = async (p: Partner) => {
    setBusy(p.id);
    try {
      const { id, ...payload } = p;
      const updated = await updatePartner(id, payload as PartnerPayload);
      setPartners((prev) => prev.map((x) => (x.id === id ? updated : x)));
      setSavedId(id);
      window.setTimeout(() => setSavedId((s) => (s === id ? null : s)), 2500);
    } catch {
      setModal({ kind: "error", message: "Couldn't save this partner." });
    } finally {
      setBusy(null);
    }
  };

  const confirmDelete = async (id: number) => {
    setBusy(id);
    try {
      await deletePartner(id);
      setPartners((p) => p.filter((x) => x.id !== id));
    } catch {
      setModal({ kind: "error", message: "Couldn't delete this partner." });
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <p className="stencil py-16 text-center">Loading partners…</p>;

  return (
    <div>
      {error && (
        <div className="mb-5 flex items-center gap-2 border border-rust/30 bg-rust/10 px-4 py-3 text-sm text-rust">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-sm text-drift">Partners listed in the About page network. {partners.length} total. The section is hidden on the site while this list is empty.</p>
        <button
          onClick={handleAdd}
          disabled={busy === "new"}
          className="inline-flex shrink-0 items-center gap-1.5 border border-hydro/40 px-3 py-1.5 font-mono text-[11px] uppercase tracking-stencil text-hydro transition-colors hover:bg-hydro/10 disabled:opacity-40"
        >
          <Plus size={13} /> Add partner
        </button>
      </div>

      <div className="space-y-3">
        {partners.length === 0 && <p className="border border-dashed border-line-2 py-10 text-center text-sm text-drift">No partners yet.</p>}
        {partners.map((p) => (
          <div key={p.id} className="border border-line bg-hull/60 p-5">
            <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Name</label>
                  <input value={p.name} onChange={(e) => setField(p.id, "name", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select value={p.category ?? ""} onChange={(e) => setField(p.id, "category", e.target.value)} className={inputCls}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-abyss">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Website</label>
                  <input value={p.website ?? ""} onChange={(e) => setField(p.id, "website", e.target.value)} className={inputCls} placeholder="https://…" />
                </div>
                <div>
                  <label className={labelCls}>Order</label>
                  <input type="number" value={p.displayOrder ?? 0} onChange={(e) => setField(p.id, "displayOrder", Number(e.target.value))} className={inputCls} />
                </div>
              </div>
              <ImageField label="Logo" value={p.logoUrl} onUpload={(f) => handleUpload(p.id, f)} onClear={() => setField(p.id, "logoUrl", "")} accent={ACCENT} />
            </div>
            <div className="mt-4 flex items-center justify-end gap-3">
              {savedId === p.id && <span className="font-mono text-[11px] uppercase tracking-stencil text-hydro">Saved</span>}
              <button
                onClick={() => handleSave(p)}
                disabled={busy === p.id}
                className="inline-flex items-center gap-1.5 bg-bone px-4 py-2 font-mono text-[11px] uppercase tracking-stencil text-abyss transition-colors hover:bg-white disabled:opacity-50"
              >
                <Save size={13} /> Save
              </button>
              <button
                onClick={() => setModal({ kind: "confirm-delete", id: p.id })}
                disabled={busy === p.id}
                className="inline-flex items-center gap-1.5 px-3 py-2 font-mono text-[11px] uppercase tracking-stencil text-drift transition-colors hover:text-rust disabled:opacity-30"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={modal?.kind === "confirm-delete"}
        mode="confirm"
        tone="danger"
        title="Delete this partner?"
        message="This partner will be removed from the About page. This can't be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          if (modal?.kind === "confirm-delete") confirmDelete(modal.id);
        }}
        onClose={() => setModal(null)}
      />
      <ConfirmModal
        open={modal?.kind === "error"}
        mode="alert"
        tone="danger"
        title="Something went wrong"
        message={modal?.kind === "error" ? modal.message : ""}
        onClose={() => setModal(null)}
      />
    </div>
  );
}
