// src/components/layout/BootSequence.tsx
// Replaces the old 2-second blocking <Loader>. The app renders underneath
// immediately; this HUD overlay runs ~450 ms once per session, then gets
// out of the way. Skipped for reduced motion.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DropletMark } from "./Wordmark";

const KEY = "aqh-booted";

export default function BootSequence({ reduced }: { reduced: boolean }) {
  const [show, setShow] = useState(() => {
    try {
      return !reduced && sessionStorage.getItem(KEY) !== "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* private mode: just play it */
    }
    const t = window.setTimeout(() => setShow(false), 480);
    return () => window.clearTimeout(t);
  }, [show]);

  const lines = ["hydro-field ........ online", "telemetry link ..... handshake", "sonar .............. armed"];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-abyss"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35 } }}
        >
          <div className="w-[min(320px,80vw)]">
            <div className="flex items-center gap-3 text-hydro">
              <DropletMark size={22} />
              <span className="font-mono text-[11px] uppercase tracking-stencil text-bone">AQH // boot v3</span>
            </div>
            <div className="mt-4 h-px w-full bg-line">
              <div className="h-px origin-left bg-arc" style={{ animation: "boot-line 420ms cubic-bezier(.22,.9,.24,1) both" }} />
            </div>
            <ul className="mt-4 space-y-1">
              {lines.map((l, i) => (
                <motion.li
                  key={l}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.06 + i * 0.09, duration: 0.12 }}
                  className="font-mono text-[11px] text-drift"
                >
                  <span className="text-hydro">[ ok ]</span> {l}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
