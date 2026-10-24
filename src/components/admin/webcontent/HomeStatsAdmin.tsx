/* Author: Nithish Kaliannan Ananth */
// src/components/admin/webcontent/HomeStatsAdmin.tsx
import { useState } from "react";
import { Plus, Save, Trash2, AlertCircle } from "lucide-react";
import {
  getAllHomeStats, createHomeStat, updateHomeStat, deleteHomeStat,
} from "../../../api/admin/homeStatAdminApi";
import type { HomeStat } from "../../../types/homeContent";
import ConfirmModal from "../ConfirmModal";
import { useMountLoad } from "../../../hooks/useMountLoad";

const ACCENT = "#00E5FF";
const MAX = 3;

const inp = "w-full bg-white/[0.035] border border-white/[0.09] rounded-sm px-4 py-3 text-white text-sm placeholder:text-drift/70 focus:outline-none focus:border-[#00E5FF]/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(0,229,255,0.12)] transition-all duration-200";
const labelCls = "block text-fog text-xs font-semibold uppercase tracking-wide mb-2";

type ModalState = { kind: "confirm-delete"; id: number } | null;

export default function HomeStatsAdmin() {
  const [stats, setStats] = useState<HomeStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | "new" | null>(null);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<ModalState>(null);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await getAllHomeStats();
      setStats([...data].sort((a, b) => a.displayOrder - b.displayOrder));
    } catch { setError("Couldn't load stats."); }
    finally { setLoading(false); }
  };

  useMountLoad(load);

  const handleAdd = async () => {
    if (stats.length >= MAX) return;
    setBusy("new");
    try {
      const created = await createHomeStat({
        label: "New stat", numericValue: 0, prefix: "", suffix: "",
        displayOrder: stats.length + 1,
      });
      setStats((p) => [...p, created]);
    } catch { setError("Couldn't add stat."); }
    finally { setBusy(null); }
  };

  const set = (id: number, field: keyof HomeStat, val: string | number) =>
    setStats((p) => p.map((s) => (s.id === id ? { ...s, [field]: val } : s)));

  const handleSave = async (stat: HomeStat) => {
    setBusy(stat.id);
    try { const { id, ...payload } = stat; await updateHomeStat(id, payload); }
    catch { setError("Couldn't save stat."); }
    finally { setBusy(null); }
  };

  const confirmDelete = async (id: number) => {
    setBusy(id);
    try { await deleteHomeStat(id); setStats((p) => p.filter((s) => s.id !== id)); }
    catch { setError("Couldn't delete stat."); }
    finally { setBusy(null); }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: ACCENT, borderTopColor: "transparent" }} />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-heading font-semibold text-white text-lg mb-1">
            Pollution stat cards
          </h2>
          <p className="text-drift text-sm">
            Exactly 3 cards shown in the Problem section of the Home page. Each animates from 0 to the number you set.
          </p>
        </div>
        <button onClick={handleAdd} disabled={busy === "new" || stats.length >= MAX}
          className="inline-flex items-center gap-1.5 font-semibold text-xs px-4 py-2.5 rounded-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 ml-4"
          style={{ backgroundColor: `${ACCENT}1A`, color: ACCENT, border: `1px solid ${ACCENT}33` }}>
          <Plus size={14} /> Add stat
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-sm px-4 py-3 mb-5">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Slot indicators */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((n) => (
          <div key={n}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-all"
            style={stats.length >= n
              ? { backgroundColor: `${ACCENT}1F`, borderColor: `${ACCENT}40`, color: ACCENT, boxShadow: `0 0 10px ${ACCENT}30` }
              : { backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "#475569" }}>
            {n}
          </div>
        ))}
        <span className="text-drift text-xs ml-1">
          {stats.length}/{MAX} cards
          {stats.length >= MAX && " · delete one to add another"}
        </span>
      </div>

      {stats.length === 0 ? (
        <div className="rounded-sm border border-dashed border-white/[0.08] bg-white/[0.02] p-12 text-center">
          <p className="text-drift text-sm mb-3">No stat cards yet.</p>
          <button onClick={handleAdd}
            className="text-sm font-medium hover:underline" style={{ color: ACCENT }}>
            Add your first stat
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {stats.map((stat, i) => (
            <div key={stat.id}
              className="rounded-sm border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                    style={{ backgroundColor: `${ACCENT}1F`, color: ACCENT }}>
                    {i + 1}
                  </span>
                  <span className="text-bone/90 text-xs font-semibold uppercase tracking-wide">Card {i + 1}</span>
                </div>
                <button onClick={() => setModal({ kind: "confirm-delete", id: stat.id })}
                  disabled={busy === stat.id}
                  className="text-drift hover:text-red-400 p-2 rounded-sm hover:bg-red-400/10 transition-colors disabled:opacity-30">
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Live preview */}
              <div className="rounded-sm border border-white/[0.06] bg-white/[0.02] p-5 mb-5 text-center">
                <div className="text-3xl font-bold font-heading mb-1" style={{ color: ACCENT }}>
                  {stat.prefix || ""}{stat.numericValue}{stat.suffix || ""}
                </div>
                <div className="text-fog text-xs">{stat.label || "Label goes here"}</div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Label</label>
                  <input value={stat.label}
                    onChange={(e) => set(stat.id, "label", e.target.value)}
                    placeholder="e.g. Tons of plastic in oceans yearly"
                    className={inp} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Prefix</label>
                    <input value={stat.prefix || ""}
                      onChange={(e) => set(stat.id, "prefix", e.target.value)}
                      placeholder="~" className={inp} />
                  </div>
                  <div>
                    <label className={labelCls}>Number</label>
                    <input type="number" value={stat.numericValue}
                      onChange={(e) => set(stat.id, "numericValue", Number(e.target.value))}
                      className={inp} />
                  </div>
                  <div>
                    <label className={labelCls}>Suffix</label>
                    <input value={stat.suffix || ""}
                      onChange={(e) => set(stat.id, "suffix", e.target.value)}
                      placeholder="M+" className={inp} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Display order</label>
                  <input type="number" value={stat.displayOrder}
                    onChange={(e) => set(stat.id, "displayOrder", Number(e.target.value))}
                    className={inp} />
                </div>
              </div>

              <button onClick={() => handleSave(stat)} disabled={busy === stat.id}
                className="mt-5 inline-flex items-center gap-2 font-semibold text-xs px-4 py-2.5 rounded-sm transition-all hover:-translate-y-0.5 disabled:opacity-40"
                style={{ backgroundColor: `${ACCENT}1A`, color: ACCENT, border: `1px solid ${ACCENT}33` }}>
                <Save size={13} />
                {busy === stat.id ? "Saving..." : "Save card"}
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={modal?.kind === "confirm-delete"}
        mode="confirm" tone="danger"
        title="Delete this stat card?"
        message="This stat card will be permanently deleted."
        confirmLabel="Delete"
        onConfirm={() => { if (modal?.kind === "confirm-delete") confirmDelete(modal.id); }}
        onClose={() => setModal(null)}
      />
    </div>
  );
}