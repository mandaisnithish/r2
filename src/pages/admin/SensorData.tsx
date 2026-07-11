// src/pages/admin/RiverMonitoring.tsx
import { Activity, Droplets, Trash2, Gauge, Waves } from "lucide-react";

const UPCOMING_METRICS = [
  { label: "Waste collected", icon: Trash2 },
  { label: "Water turbidity", icon: Droplets },
  { label: "pH level", icon: Gauge },
  { label: "Debris count", icon: Activity },
];

export default function RiverMonitoring() {
  return (
    <div className="relative min-h-full p-8 overflow-hidden">
      {/* ambient glow blobs, blue-themed to match this section's accent color */}
      <div className="pointer-events-none absolute -top-32 right-0 w-96 h-96 rounded-full bg-[#3B82F6]/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-[#00B4D8]/[0.05] blur-3xl" />

      {/* Hero banner */}
      <div className="relative z-10 mb-10 rounded-[28px] overflow-hidden border border-white/[0.08] bg-gradient-to-br from-[#11233F] via-[#0C1B2E] to-[#080D17] px-9 py-12 sm:px-12 sm:py-14 shadow-[0_20px_60px_-20px_rgba(59,130,246,0.25)]">
        <div className="pointer-events-none absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-[#3B82F6]/[0.18] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 w-72 h-72 rounded-full bg-[#00B4D8]/[0.10] blur-3xl" />
        <Waves className="pointer-events-none absolute -bottom-10 right-10 w-44 h-44 text-[#3B82F6]/[0.08]" />
        <Waves className="pointer-events-none absolute top-6 right-44 w-20 h-20 text-[#3B82F6]/[0.06] rotate-12" />

        <div className="relative inline-flex items-center gap-2 text-[#3B82F6] text-xs font-bold tracking-[0.15em] mb-5 px-3 py-1.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20">
          <Activity size={13} />
          <span>FIELD DATA</span>
        </div>

        <h1 className="relative font-heading font-bold text-4xl sm:text-5xl text-white mb-3 tracking-tight leading-[1.1]">
          River <span className="text-[#3B82F6]">Monitoring</span>
        </h1>
        <p className="relative text-slate-400 text-base max-w-xl">
          Waste collected and water quality readings, sent straight from the
          robot's onboard sensors out in the field.
        </p>
      </div>

      {/* Under development panel */}
      <div className="relative z-10 rounded-2xl border border-dashed border-[#3B82F6]/25 bg-gradient-to-b from-white/[0.02] to-transparent py-20 px-8 flex flex-col items-center text-center overflow-hidden">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#3B82F6]/[0.08] blur-3xl" />

        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 rounded-2xl bg-[#3B82F6]/30 blur-lg animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center">
            <Activity size={26} className="text-[#3B82F6]" />
          </div>
        </div>

        <h2 className="relative font-heading font-bold text-white text-xl mb-2.5">
          Under Development
        </h2>
        <p className="relative text-slate-500 text-sm max-w-md leading-relaxed mb-9">
          We're wiring up live data from the field. Once connected, this page
          will show real-time readings here.
        </p>

        {/* preview of what's coming, so the page feels purposeful instead of empty */}
        <div className="relative flex flex-wrap justify-center gap-3">
          {UPCOMING_METRICS.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-slate-400 text-xs"
            >
              <Icon size={13} className="text-[#3B82F6]" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}