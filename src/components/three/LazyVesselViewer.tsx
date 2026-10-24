// src/components/three/LazyVesselViewer.tsx
// Keeps three.js out of the page chunk: the inspection bay loads when it
// is about to scroll into view. Without WebGL it falls back to a photo.

import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { detectTier, useReducedMotionPref } from "../../lib/quality";
import MediaSlot from "../ui/MediaSlot";
import type { VehicleKind } from "./vehicleSpecs";

const VesselViewer = lazy(() => import("./VesselViewer"));

export default function LazyVesselViewer({
  kind,
  fallbackSrc,
  fallbackSlot,
  className = "",
}: {
  kind: VehicleKind;
  fallbackSrc?: string;
  fallbackSlot: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [tier] = useState(detectTier);
  const reduced = useReducedMotionPref();

  useEffect(() => {
    const el = ref.current;
    if (!el || tier === "off") return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setNear(true);
        io.disconnect();
      }
    }, { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [tier]);

  if (tier === "off") {
    return (
      <MediaSlot
        className={className}
        slotId={fallbackSlot}
        src={fallbackSrc}
        alt="Vehicle photo"
        aspect="16:9"
        brief="Static fallback for browsers without WebGL: a clean three-quarter photo of the vehicle on water."
      />
    );
  }

  const placeholder = (
    <div className="grid min-h-[380px] place-items-center border border-line bg-[#071017] sm:min-h-[460px] lg:min-h-[560px]">
      <span className="stencil">Powering inspection bay…</span>
    </div>
  );

  return (
    <div ref={ref} className={className}>
      {near ? (
        <Suspense fallback={placeholder}>
          <VesselViewer kind={kind} reduced={reduced} />
        </Suspense>
      ) : (
        placeholder
      )}
    </div>
  );
}
