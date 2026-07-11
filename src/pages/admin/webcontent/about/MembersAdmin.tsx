// src/pages/admin/webcontent/about/MembersAdmin.tsx
import { useEffect, useState } from "react";
import { Plus, Save, Trash2, AlertCircle } from "lucide-react";
import {
  getAllMembers, createMember, updateMember, deleteMember,
} from "../../../../api/admin/memberAdminApi";
import type { MemberPayload } from "../../../../api/admin/memberAdminApi";
import { uploadMedia, isAllowedFileType } from "../../../../api/admin/uploadApi";
import type { Member } from "../../../../types";
import { ImageField } from "../../../../components/admin/shared/FormPrimitives";
import ConfirmModal from "../../../../components/admin/ConfirmModal";

const ACCENT = "#A855F7";

const inputCls = "w-full bg-white/[0.035] border border-white/[0.09] rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#A855F7]/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all duration-200";
const labelCls = "block text-slate-500 text-[11px] font-semibold uppercase tracking-wide mb-1.5";

type ModalState = { kind: "confirm-delete"; id: number } | { kind: "error"; message: string } | null;

export default function MembersAdmin() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | "new" | null>(null);
  const [modal, setModal] = useState<ModalState>(null);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await getAllMembers();
      setMembers([...data].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)));
    } catch { setError("Couldn't load members."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    setBusy("new");
    try {
      const created = await createMember({
        name: "New member", role: "New role", photoUrl: "", bio: "", expertise: "",
        linkedin: "", github: "", instagram: "", displayOrder: members.length + 1,
      });
      setMembers((p) => [...p, created]);
    } catch { setModal({ kind: "error", message: "Couldn't add member." }); }
    finally { setBusy(null); }
  };

  const setField = (id: number, field: keyof Member, val: string | number) =>
    setMembers((p) => p.map((x) => (x.id === id ? { ...x, [field]: val } : x)));

  const handleImageUpload = async (id: number, file: File) => {
    if (!isAllowedFileType(file)) { setError("Unsupported file type."); return; }
    try { setField(id, "photoUrl", await uploadMedia(file, "members")); }
    catch { setError("Photo upload failed."); }
  };

  const handleSave = async (m: Member) => {
    setBusy(m.id);
    try {
      const { id, ...payload } = m;
      const updated = await updateMember(id, payload as MemberPayload);
      setMembers((prev) => prev.map((x) => (x.id === id ? updated : x)));
    } catch { setModal({ kind: "error", message: "Couldn't save member." }); }
    finally { setBusy(null); }
  };

  const confirmDelete = async (id: number) => {
    setBusy(id);
    try { await deleteMember(id); setMembers((p) => p.filter((x) => x.id !== id)); }
    catch { setModal({ kind: "error", message: "Couldn't delete member." }); }
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
        <p className="text-slate-500 text-sm">Team roster displayed on the About page. {members.length} total.</p>
        <button onClick={handleAdd} disabled={busy === "new"}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
          style={{ color: ACCENT, backgroundColor: `${ACCENT}14` }}>
          <Plus size={13} /> Add member
        </button>
      </div>

      <div className="space-y-3">
        {members.length === 0 && (
          <p className="text-slate-500 text-sm text-center py-10">No members yet.</p>
        )}
        {members.map((m) => (
          <div key={m.id}
            className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-4 mb-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Name</label>
                    <input value={m.name} onChange={(e) => setField(m.id, "name", e.target.value)}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Role</label>
                    <input value={m.role} onChange={(e) => setField(m.id, "role", e.target.value)}
                      className={inputCls} placeholder="Lead Robotics Engineer" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Bio</label>
                  <textarea rows={2} value={m.bio || ""} onChange={(e) => setField(m.id, "bio", e.target.value)}
                    className={`${inputCls} resize-none`} />
                </div>
                <div>
                  <label className={labelCls}>Expertise</label>
                  <input value={m.expertise || ""} onChange={(e) => setField(m.id, "expertise", e.target.value)}
                    className={inputCls} placeholder="ROS2, OpenCV, Firmware" />
                </div>
              </div>
             <ImageField label="Photo" value={m.photoUrl}
  onUpload={(f) => handleImageUpload(m.id, f)}
  onClear={() => setField(m.id, "photoUrl", "")}
  accent={ACCENT} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div>
                <label className={labelCls}>LinkedIn</label>
                <input value={m.linkedin || ""} onChange={(e) => setField(m.id, "linkedin", e.target.value)}
                  className={inputCls} placeholder="https://..." />
              </div>
              <div>
                <label className={labelCls}>GitHub</label>
                <input value={m.github || ""} onChange={(e) => setField(m.id, "github", e.target.value)}
                  className={inputCls} placeholder="https://..." />
              </div>
              <div>
                <label className={labelCls}>Instagram</label>
                <input value={m.instagram || ""} onChange={(e) => setField(m.id, "instagram", e.target.value)}
                  className={inputCls} placeholder="https://..." />
              </div>
              <div>
                <label className={labelCls}>Order</label>
                <input type="number" value={m.displayOrder}
                  onChange={(e) => setField(m.id, "displayOrder", Number(e.target.value))}
                  className={inputCls} />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button onClick={() => handleSave(m)} disabled={busy === m.id}
                className="inline-flex items-center gap-1.5 disabled:opacity-50 font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: ACCENT, color: "#0A0F1E" }}>
                <Save size={13} /> Save
              </button>
              <button onClick={() => setModal({ kind: "confirm-delete", id: m.id })} disabled={busy === m.id}
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
        title="Delete this member?"
        message="This team member will be permanently deleted. This can't be undone."
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