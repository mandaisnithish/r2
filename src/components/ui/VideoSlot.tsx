/* Author: Nithish Kaliannan Ananth */
// src/components/ui/VideoSlot.tsx
// YouTube in the industrial frame. No third-party iframe (or its cookies)
// until the visitor presses play; until then it's a poster from YouTube's
// image CDN. Without a URL it falls back to a MediaSlot placeholder.

import { useState } from "react";
import { Play } from "lucide-react";
import MediaSlot, { type Aspect } from "./MediaSlot";
import ServoBracket from "./ServoBracket";
import { youtubeId } from "../../lib/format";
import { rippleAt } from "../../lib/hydroBus";

export default function VideoSlot({
  slotId,
  url,
  title,
  brief,
  aspect = "16:9",
  className = "",
}: {
  slotId: string;
  url?: string | null;
  title: string;
  brief: string;
  aspect?: Aspect;
  className?: string;
}) {
  const id = youtubeId(url ?? undefined);
  const [playing, setPlaying] = useState(false);
  const [poster, setPoster] = useState<"max" | "hq">("max");

  if (!id) {
    return <MediaSlot slotId={slotId} kind="video" alt={title} brief={brief} aspect={aspect} className={className} />;
  }

  return (
    <figure className={`group/media relative m-0 ${className}`}>
      <div className="relative overflow-hidden border border-line bg-hull" style={{ aspectRatio: aspect.replace(":", " / ") }}>
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={(e) => {
              rippleAt(e.clientX, e.clientY, 1);
              setPlaying(true);
            }}
            className="absolute inset-0 h-full w-full text-left"
            aria-label={`Play video: ${title}`}
            data-ping
          >
            <img
              src={`https://i.ytimg.com/vi/${id}/${poster === "max" ? "maxresdefault" : "hqdefault"}.jpg`}
              onError={() => setPoster("hq")}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover opacity-80 transition-[opacity,transform] duration-700 ease-hydro group-hover/media:scale-[1.02] group-hover/media:opacity-95"
              style={{ filter: "saturate(.85) contrast(1.05)" }}
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-abyss/20 to-abyss/30" />
            <span className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-stencil text-bone/75">{slotId} · YOUTUBE</span>
            <span className="absolute inset-0 grid place-items-center">
              <span className="relative grid h-20 w-20 place-items-center border border-bone/60 bg-abyss/50 backdrop-blur-[2px] transition-colors duration-300 group-hover/media:border-hydro">
                <Play size={22} className="translate-x-0.5 text-bone" strokeWidth={1.5} />
                <span className="absolute -inset-3 border border-hydro/0 transition-colors duration-300 group-hover/media:border-hydro/40" />
              </span>
            </span>
            <span className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <span className="font-display text-lg font-semibold text-bone sm:text-2xl">{title}</span>
              <span className="hidden font-mono text-[10px] uppercase tracking-stencil text-drift sm:block">Press to load player</span>
            </span>
          </button>
        )}
      </div>
      <ServoBracket size={14} inset={-5} />
    </figure>
  );
}
