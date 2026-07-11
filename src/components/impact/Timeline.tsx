// src/components/impact/Timeline.tsx
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Trophy,
  IndianRupee,
  Milestone,
  BookOpen,
  ShieldCheck,
  Banknote,
  Star,
  ExternalLink,
  Calendar,
  Building2,
  Medal,
} from "lucide-react";
import type { TimelineEvent, TimelineCategory } from "../../api/timelineapi";

const CATEGORY_META: Record<
  TimelineCategory,
  { label: string; color: string; bg: string; border: string; Icon: any; glowHex: string }
> = {
  MILESTONE: { label: "Milestone", color: "text-violet-300", bg: "bg-violet-500/10", border: "border-violet-500/30", Icon: Milestone, glowHex: "#a78bfa" },
  COMPETITION: { label: "Competition", color: "text-cyan-300", bg: "bg-cyan-500/10", border: "border-cyan-500/30", Icon: Trophy, glowHex: "#22d3ee" },
  PUBLICATION: { label: "Publication", color: "text-emerald-300", bg: "bg-emerald-500/10", border: "border-emerald-500/30", Icon: BookOpen, glowHex: "#34d399" },
  PATENT: { label: "Patent", color: "text-amber-300", bg: "bg-amber-500/10", border: "border-amber-500/30", Icon: ShieldCheck, glowHex: "#fbbf24" },
  FUNDING: { label: "Funding", color: "text-green-300", bg: "bg-green-500/10", border: "border-green-500/30", Icon: Banknote, glowHex: "#4ade80" },
  RECOGNITION: { label: "Recognition", color: "text-pink-300", bg: "bg-pink-500/10", border: "border-pink-500/30", Icon: Star, glowHex: "#f472b6" },
};

const ALL_FILTERS: (TimelineCategory | "ALL")[] = [
  "ALL", "MILESTONE", "COMPETITION", "PUBLICATION", "PATENT", "FUNDING", "RECOGNITION",
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function getYear(dateStr: string) {
  return new Date(dateStr).getFullYear();
}

function TimelineCard({ event, index }: { event: TimelineEvent; index: number }) {
  const meta = CATEGORY_META[event.category];
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="relative flex gap-4 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex flex-col items-center">
        <motion.div
          animate={{ boxShadow: [
            `0 0 0px ${meta.glowHex}00`,
            `0 0 14px ${meta.glowHex}80`,
            `0 0 0px ${meta.glowHex}00`,
          ] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: index * 0.2, ease: "easeInOut" }}
          className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${meta.bg} ${meta.border} ${hovered ? "scale-110" : ""}`}
        >
          <meta.Icon className={`w-5 h-5 ${meta.color}`} />
        </motion.div>
        {/* Connecting line now carries a soft glow tinted to the category
            color instead of a plain flat gradient, tying the line visually
            to the dot above it. */}
        <div
          className="flex-1 w-px mt-2"
          style={{
            background: `linear-gradient(to bottom, ${meta.glowHex}50, transparent)`,
          }}
        />
      </div>

      <div
        className="flex-1 mb-6 rounded-2xl p-5 pl-6 transition-all duration-300 overflow-hidden relative"
        style={{
          background: hovered ? "rgba(0,180,216,0.1)" : "rgba(13,27,42,0.8)",
          border: hovered ? "0.5px solid rgba(0,180,216,0.4)" : "0.5px solid rgba(255,255,255,0.07)",
          borderLeft: `3px solid ${meta.glowHex}` + (hovered ? "" : "99"),
        }}
      >
        {event.imageUrl && hovered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-0 pointer-events-none">
            <img src={event.imageUrl} alt="" className="w-full h-full object-cover opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2A]/90 to-[#0D1B2A]/60" />
          </motion.div>
        )}

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${meta.bg} ${meta.color} ${meta.border} border`}>
              {meta.label}
            </span>
            {event.position && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 flex items-center gap-1">
                <Medal className="w-3 h-3" /> {event.position}
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-white font-['Exo_2'] mb-2 leading-tight">
            {event.title}
          </h3>

          {event.description && (
            <p className="text-sm text-slate-400 mb-3 leading-relaxed">{event.description}</p>
          )}

          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
            {event.date && (
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(event.date)}
              </span>
            )}
            {event.organization && (
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5">
                <Building2 className="w-3.5 h-3.5" />
                {event.organization}
              </span>
            )}
            {event.prizeAmount != null && event.prizeAmount > 0 && (
              <span className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-lg px-2.5 py-1.5 text-green-400 font-medium">
                <IndianRupee className="w-3.5 h-3.5" />
                {formatINR(event.prizeAmount)}
              </span>
            )}
          </div>

          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {event.category === "PUBLICATION" ? "Read paper" : "View details"}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface TimelineProps {
  events: TimelineEvent[];
  loading: boolean;
  error: boolean;
}

export default function Timeline({ events, loading, error }: TimelineProps) {
  const [activeFilter, setActiveFilter] = useState<TimelineCategory | "ALL">("ALL");

  const filtered = activeFilter === "ALL" ? events : events.filter((e) => e.category === activeFilter);

  const byYear: Record<number, TimelineEvent[]> = {};
  filtered.forEach((e) => {
    const yr = getYear(e.date);
    if (!byYear[yr]) byYear[yr] = [];
    byYear[yr].push(e);
  });
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  return (
    <section className="px-6 pb-24 max-w-3xl mx-auto">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white font-['Exo_2'] mb-6">
          Achievement Timeline
        </h2>

        <div className="flex flex-wrap gap-2">
          {ALL_FILTERS.map((f) => {
            const isAll = f === "ALL";
            const active = activeFilter === f;
            const meta = isAll ? null : CATEGORY_META[f as TimelineCategory];
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  active
                    ? isAll
                      ? "bg-cyan-500 text-white border-cyan-400"
                      : `${meta!.bg} ${meta!.color} ${meta!.border}`
                    : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20"
                }`}
              >
                {isAll ? "All" : meta!.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-center py-20 text-slate-500">
          <p>Could not load timeline. Make sure the backend is running.</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No events found for this filter.</p>
        </div>
      )}

      {!loading && !error && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {years.map((year) => (
              <div key={year} className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-4xl font-bold text-white/20 font-['Exo_2'] select-none">
                    {year}
                  </h3>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {byYear[year].map((event, i) => (
                  <TimelineCard key={event.id} event={event} index={i} />
                ))}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
} 