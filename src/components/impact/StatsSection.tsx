// src/components/impact/StatsSection.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, IndianRupee, Banknote, Sparkles } from "lucide-react";
import type { TimelineDashboardStats } from "../../api/timelineapi";

function useCountUp(target: number, duration = 1800, started = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started || target <= 0) {
      setCount(target);
      return;
    }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, started, duration]);

  return count;
}

function StatCard({
  icon: Icon,
  value,
  label,
  prefix = "",
  suffix = "",
  delay = 0,
}: {
  icon: any;
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
}) {
  const count = useCountUp(value, 1800, true);
  const display =
    prefix === "₹"
      ? `₹${new Intl.NumberFormat("en-IN").format(count)}`
      : `${prefix}${count}${suffix}`;

  return (
    // Outer wrapper: animated glowing border, same conic-gradient trick used
    // on the Contact form/details cards, for visual consistency site-wide.
    <div className="relative p-[1.5px] rounded-2xl overflow-hidden">
      <div
        className="absolute inset-[-50%] animate-[spin_7s_linear_infinite] opacity-60"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        className="relative group rounded-2xl p-6 overflow-hidden bg-[#0A1422]"
      >
        {/* Hover glow, kept from before */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 0%, rgba(0,245,255,0.1) 0%, transparent 70%)" }}
        />

        {/* Small sparkle accent in the corner — achievement feel, kept subtle */}
        <motion.div
          className="absolute top-4 right-4 text-cyan-400/40"
          animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: delay + 0.5 }}
        >
          <Sparkles size={14} />
        </motion.div>

        <div className="relative z-10 flex items-start gap-4">
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay }}
            className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shrink-0"
          >
            <Icon className="w-6 h-6 text-cyan-400" />
          </motion.div>
          <div>
            <p className="text-3xl font-bold text-white font-['Exo_2'] tracking-tight">
              {display}
            </p>
            <p className="text-sm text-slate-400 mt-1">{label}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function StatsSection({ stats }: { stats: TimelineDashboardStats | null }) {
  if (!stats) return null;

  const cards = [
    {
      icon: Trophy,
      value: stats.totalCompetitionsCount,
      label: "Competitions Participated",
      delay: 0,
    },
    {
      icon: IndianRupee,
      value: stats.totalCompetitionPrize,
      label: "Total Competition Prize",
      prefix: "₹",
      delay: 0.15,
    },
    {
      icon: Banknote,
      value: stats.totalFunding,
      label: "Total Funding Secured",
      prefix: "₹",
      delay: 0.3,
    },
  ];

  return (
    <section className="px-6 pb-16 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map((c, i) => (
          <StatCard key={i} {...c} />
        ))}
      </div>
    </section>
  );
}
