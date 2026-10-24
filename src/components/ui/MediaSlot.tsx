// src/components/ui/MediaSlot.tsx
// Every photo/video on the site goes through here (DESIGN_SYSTEM.md §8).
//  - `src` resolves  -> real media in an industrial frame: corner brackets,
//    slot id, timestamp, and a hydro-lens scan on hover.
//  - `src` empty or fails -> blueprint placeholder that says exactly what
//    to upload (slot id, aspect, target resolution, brief).
// All slots are catalogued in MEDIA_UPLOAD_GUIDE.md.

import { useState, type ReactNode } from "react";
import ServoBracket from "./ServoBracket";
import { cdn } from "../../lib/format";

export type Aspect = "16:9" | "4:3" | "3:2" | "1:1" | "4:5" | "3:4" | "21:9" | "2:1";

const RATIO: Record<Aspect, string> = {
  "16:9": "16 / 9", "4:3": "4 / 3", "3:2": "3 / 2", "1:1": "1 / 1",
  "4:5": "4 / 5", "3:4": "3 / 4", "21:9": "21 / 9", "2:1": "2 / 1",
};

export type MediaSlotProps = {
  slotId: string;
  src?: string | null;
  alt: string;
  aspect?: Aspect;
  /** Target resolution shown on the placeholder, e.g. "1920×1080". */
  resolution?: string;
  /** What belongs in this slot (placeholder copy + guide). */
  brief: string;
  kind?: "image" | "video";
  caption?: ReactNode;
  stamp?: string;
  /** CSS object-position, e.g. "50% 20%" to keep faces in frame. */
  focus?: string;
  /** Cloudinary width cap for this slot. */
  width?: number;
  priority?: boolean;
  /** Fill the parent instead of using the aspect ratio. */
  fill?: boolean;
  className?: string;
  imgClassName?: string;
  tone?: "line" | "hydro" | "arc";
};

export default function MediaSlot({
  slotId, src, alt, aspect = "16:9", resolution, brief, kind = "image",
  caption, stamp, focus = "50% 50%", width = 1600, priority = false,
  fill = false, className = "", imgClassName = "", tone = "line",
}: MediaSlotProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const show = !!src && !failed;
  const res = resolution ?? defaultRes(aspect);

  return (
    <figure className={`group/media relative m-0 ${className}`}>
      <div
        className={`relative overflow-hidden border border-line bg-hull ${fill ? "h-full w-full" : ""}`}
        style={fill ? undefined : { aspectRatio: RATIO[aspect] }}
        data-slot={slotId}
      >
        {show ? (
          <>
            {kind === "video" ? (
              <video
                src={src!}
                className={`h-full w-full object-cover ${imgClassName}`}
                style={{ objectPosition: focus }}
                muted
                playsInline
                loop
                autoPlay
                preload="metadata"
                onError={() => setFailed(true)}
                onLoadedData={() => setLoaded(true)}
              />
            ) : (
              <img
                src={cdn(src!, width)}
                alt={alt}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={priority ? "high" : "auto"}
                onError={() => setFailed(true)}
                onLoad={() => setLoaded(true)}
                className={`h-full w-full object-cover transition-[transform,opacity,filter] duration-700 ease-hydro group-hover/media:scale-[1.025] ${
                  loaded ? "opacity-100" : "opacity-0"
                } ${imgClassName}`}
                style={{ objectPosition: focus, filter: "saturate(0.92) contrast(1.04)" }}
              />
            )}
            {/* hydro-lens: scanlines + a single sweep on hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/media:opacity-100"
              style={{ background: "repeating-linear-gradient(to bottom, rgba(6,10,14,.22) 0 1px, transparent 1px 3px)" }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-1/3 -translate-y-full bg-gradient-to-b from-transparent via-hydro/10 to-transparent opacity-0 group-hover/media:opacity-100 group-hover/media:[animation:sonar-scan_1.1s_cubic-bezier(.22,.9,.24,1)_1_both]"
            />
            {!loaded && <Scanning />}
          </>
        ) : (
          <Placeholder slotId={slotId} aspect={aspect} res={res} brief={brief} kind={kind} />
        )}

        {/* frame telemetry */}
        <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 font-mono text-[10px] uppercase tracking-stencil text-bone/70 mix-blend-difference">
          {slotId}
        </span>
        {(stamp || show) && (
          <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-stencil text-bone/70 mix-blend-difference">
            {stamp ?? (kind === "video" ? "REC · LOOP" : `${aspect} · FIELD`)}
          </span>
        )}
      </div>
      <ServoBracket tone={tone} size={14} inset={-5} />
      {caption && <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-stencil text-drift">{caption}</figcaption>}
    </figure>
  );
}

function defaultRes(a: Aspect): string {
  switch (a) {
    case "16:9": return "1920×1080";
    case "21:9": return "2560×1080";
    case "2:1": return "2400×1200";
    case "4:3": return "1600×1200";
    case "3:2": return "1800×1200";
    case "1:1": return "1200×1200";
    case "4:5": return "1200×1500";
    case "3:4": return "1200×1600";
  }
}

function Scanning() {
  return (
    <span className="absolute inset-0 grid place-items-center bg-hull">
      <span className="stencil">Acquiring signal…</span>
    </span>
  );
}

function Placeholder({ slotId, aspect, res, brief, kind }: { slotId: string; aspect: Aspect; res: string; brief: string; kind: "image" | "video" }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* blueprint grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(42,58,71,.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(42,58,71,.55) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "-1px -1px",
        }}
      />
      {/* wireframe crosshair + sonar rings */}
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 400 225">
        <g fill="none" stroke="#2A3A47" strokeWidth="1">
          <circle cx="200" cy="112" r="34" />
          <circle cx="200" cy="112" r="64" strokeDasharray="2 5" />
          <path d="M200 60V164M148 112H252" />
        </g>
        <g fill="none" stroke="#00E5FF" strokeOpacity=".5" strokeWidth="1">
          <path d="M170 90v-8h8M230 90v-8h-8M170 134v8h8M230 134v8h-8" />
        </g>
      </svg>
      {/* scanline sweeps on enter + hover, never loops forever */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-transparent via-hydro/[0.07] to-transparent [animation:sonar-scan_2.4s_cubic-bezier(.22,.9,.24,1)_2_both] group-hover/media:[animation:sonar-scan_1.6s_cubic-bezier(.22,.9,.24,1)_1_both]"
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-gradient-to-t from-abyss via-abyss/85 to-transparent p-4 pt-10 sm:p-5 sm:pt-12">
        <span className="font-mono text-[11px] uppercase tracking-stencil text-hydro">
          {aspect} <span className="text-line-2">//</span> {res} {kind === "video" ? "RAW FOOTAGE" : "STILL"}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-stencil text-bone">ASSET_SLOT_{slotId}</span>
        <span className="max-w-[34rem] text-[13px] leading-snug text-fog">{brief}</span>
      </div>
    </div>
  );
}
