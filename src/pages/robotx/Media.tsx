import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Maximize2,
  Play,
  X,
  type LucideIcon,
} from "lucide-react";
import { PageShell } from "../../components/robotx/ui";
import { PHOTOS, VIDEOS } from "../../data/robotxData";


// ═════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════

type Photo = (typeof PHOTOS)[number];
type Video = (typeof VIDEOS)[number];

type FrameSize = "lg" | "md";
type FrameMode = "always" | "hover";


// ═════════════════════════════════════════════════════════════
// CONSTANTS
// ═════════════════════════════════════════════════════════════

const GLOW_BORDER =
  "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)";

// Full class strings so Tailwind can detect them at build time.
const FRAME_RADIUS: Record<FrameSize, { outer: string; inner: string }> = {
  lg: { outer: "rounded-3xl", inner: "rounded-[calc(1.5rem-1.5px)]" },
  md: { outer: "rounded-2xl", inner: "rounded-[calc(1rem-1.5px)]" },
};

const BORDER_MODE: Record<FrameMode, { rest: string; active: string; motion: string }> = {
  always: {
    rest: "opacity-50",
    active: "opacity-90",
    motion: "animate-[spin_8s_linear_infinite]",
  },
  // Lightweight variant for large grids: the border only appears and spins on hover.
  hover: {
    rest: "opacity-0 group-hover:opacity-60",
    active: "opacity-60",
    motion: "group-hover:animate-[spin_8s_linear_infinite]",
  },
};

const BUBBLES = [
  { left: "15%", size: 3, delay: 0 },
  { left: "30%", size: 4, delay: 1.2 },
  { left: "70%", size: 3, delay: 0.6 },
  { left: "85%", size: 4, delay: 2 },
];

const HEADERS = {
  videos: {
    eyebrow: "Watch",
    title: "Videos",
    text: "Follow the development and testing of our autonomous platforms through video.",
  },
  photos: {
    eyebrow: "See",
    title: "Photo Gallery",
    text: "A visual record of our platforms, development, testing, and team.",
  },
};

const pad = (n: number) => String(n).padStart(2, "0");

/** The first photo, and every seventh after it, spans a 2×2 block. */
const isFeatured = (index: number) =>
  index === 0 || (index % 7 === 0 && PHOTOS.length > 4);

const ICON_BUTTON =
  "flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#0D1B2A] text-white transition hover:border-[#00B4D8] hover:text-[#00B4D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F5FF]";


// ═════════════════════════════════════════════════════════════
// SHARED BUILDING BLOCKS
// ═════════════════════════════════════════════════════════════

/** Fade-and-rise entrance that triggers once when scrolled into view. */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Small uppercase label with a pulsing dot. */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#00B4D8]">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00B4D8]"
      />
      {children}
    </span>
  );
}

/** Card with the rotating conic-gradient glow border and radial hover glow. */
function GlowFrame({
  children,
  size = "lg",
  mode = "always",
  active = false,
  glow = false,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  size?: FrameSize;
  mode?: FrameMode;
  active?: boolean;
  glow?: boolean;
  className?: string;
  innerClassName?: string;
}) {
  const reduceMotion = useReducedMotion();
  const { outer, inner } = FRAME_RADIUS[size];
  const border = BORDER_MODE[mode];

  return (
    <div
      className={`group relative h-full overflow-hidden p-[1.5px] ${outer} ${className}`}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-[-50%] transition-opacity duration-500 ${
          active ? border.active : border.rest
        } ${reduceMotion ? "" : border.motion}`}
        style={{ background: GLOW_BORDER }}
      />

      <div
        className={`relative h-full overflow-hidden bg-[#0D1B2A] ${inner} ${innerClassName}`}
      >
        {glow && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00B4D8]/10 blur-[80px]"
          />
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, #00B4D814, transparent 70%)",
          }}
        />

        {children}
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  text,
  id,
}: {
  eyebrow: string;
  title: string;
  text: string;
  id: string;
}) {
  return (
    <Reveal className="mb-10">
      <Eyebrow>{eyebrow}</Eyebrow>

      <h2
        id={id}
        className="mb-6 mt-3 font-heading text-3xl font-bold text-white md:text-5xl"
      >
        {title}
      </h2>

      <div className="mb-6 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#00B4D8] to-transparent" />

      <p className="max-w-2xl text-lg leading-relaxed text-slate-400">{text}</p>
    </Reveal>
  );
}

function RisingBubbles() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <>
      {BUBBLES.map((b, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full bg-[#00B4D8]/30"
          style={{ left: b.left, width: b.size, height: b.size, bottom: "8%" }}
          animate={{ y: [0, -280], opacity: [0, 0.8, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: b.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#00B4D8]/30 bg-[#0A0F1E]/70 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#00B4D8] backdrop-blur-md">
      {children}
    </span>
  );
}

function EmptyState({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <Reveal>
      <GlowFrame innerClassName="flex flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 0px rgba(0,180,216,0.3)",
                    "0 0 30px rgba(0,180,216,0.5)",
                    "0 0 0px rgba(0,180,216,0.3)",
                  ],
                }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#00B4D8]/30 bg-[#00B4D8]/10"
        >
          <Icon size={24} className="text-[#00B4D8]" />
        </motion.div>

        <p className="relative text-sm text-slate-500">{text}</p>
      </GlowFrame>
    </Reveal>
  );
}


// ═════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════

export default function Media() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const closeViewer = useCallback(() => setSelectedIndex(null), []);

  const stepViewer = useCallback(
    (direction: 1 | -1) =>
      setSelectedIndex((current) =>
        current === null
          ? current
          : (current + direction + PHOTOS.length) % PHOTOS.length
      ),
    []
  );

  return (
    <PageShell
      eyebrow="VISUAL JOURNEY"
      title="Media"
      intro="See the vehicles, the engineering process, the testing, and the people behind AQUAHOLICS RobotX 2026."
    >
      <div className="flex flex-col gap-24">
        {/* Videos */}
        <section aria-labelledby="videos-heading">
          <SectionHeader id="videos-heading" {...HEADERS.videos} />

          {VIDEOS.length === 0 ? (
            <EmptyState icon={Play} text="Videos coming soon." />
          ) : (
            <div className="grid gap-7 lg:grid-cols-2">
              {VIDEOS.map((video, index) => (
                <Reveal key={video.youtubeId} delay={index * 0.15} className="h-full">
                  <VideoCard video={video} number={pad(index + 1)} />
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* Photo gallery */}
        <section aria-labelledby="photos-heading">
          <SectionHeader id="photos-heading" {...HEADERS.photos} />

          {PHOTOS.length === 0 ? (
            <EmptyState icon={ImageIcon} text="Photos coming soon." />
          ) : (
            <div className="grid auto-rows-[220px] grid-cols-2 gap-4 md:auto-rows-[260px] md:grid-cols-3">
              {PHOTOS.map((photo, index) => (
                <Reveal
                  key={photo.src}
                  delay={(index % 3) * 0.1}
                  className={isFeatured(index) ? "col-span-2 row-span-2" : ""}
                >
                  <PhotoTile
                    photo={photo}
                    number={pad(index + 1)}
                    onOpen={() => setSelectedIndex(index)}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* Media story */}
        <section aria-labelledby="story-heading">
          <Reveal>
            <GlowFrame glow innerClassName="p-8 lg:p-12">
              <RisingBubbles />

              <div className="relative max-w-4xl">
                <Eyebrow>Behind the system</Eyebrow>

                <h2
                  id="story-heading"
                  className="mb-6 mt-3 font-heading text-3xl font-bold text-white md:text-5xl"
                >
                  More than a finished robot.
                </h2>

                <div className="mb-6 h-[2px] w-12 rounded-full bg-gradient-to-r from-[#00B4D8] to-transparent" />

                <p className="max-w-3xl text-lg leading-relaxed text-slate-400">
                  Our media documents the journey from individual subsystems to
                  an integrated multi-domain system — capturing the
                  engineering, testing, iteration, and teamwork behind every
                  capability.
                </p>
              </div>
            </GlowFrame>
          </Reveal>
        </section>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && PHOTOS[selectedIndex] && (
          <Lightbox
            key="lightbox"
            photo={PHOTOS[selectedIndex]}
            position={pad(selectedIndex + 1)}
            total={pad(PHOTOS.length)}
            onClose={closeViewer}
            onStep={stepViewer}
          />
        )}
      </AnimatePresence>
    </PageShell>
  );
}


// ═════════════════════════════════════════════════════════════
// VIDEO CARD
// ═════════════════════════════════════════════════════════════

function VideoCard({ video, number }: { video: Video; number: string }) {
  return (
    <figure className="h-full">
      <GlowFrame>
        <div className="relative aspect-video overflow-hidden border-b border-white/10 bg-[#0A0F1E]">
          <iframe
            className="relative z-10 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          <div className="pointer-events-none absolute left-4 top-4 z-20">
            <Chip>Video {number}</Chip>
          </div>
        </div>

        <figcaption className="relative p-5">
          <h3 className="font-heading text-lg font-bold text-white">
            {video.title}
          </h3>
        </figcaption>
      </GlowFrame>
    </figure>
  );
}


// ═════════════════════════════════════════════════════════════
// PHOTO TILE
// ═════════════════════════════════════════════════════════════

function PhotoTile({
  photo,
  number,
  onOpen,
}: {
  photo: Photo;
  number: string;
  onOpen: () => void;
}) {
  return (
    <GlowFrame size="md" mode="hover" innerClassName="bg-[#0A0F1E]">
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        className="h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/90 via-transparent to-transparent" />

      <span className="pointer-events-none absolute left-4 top-4 text-xs font-semibold tracking-widest text-white/60">
        {number}
      </span>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
        {photo.caption && (
          <p className="text-sm font-medium text-white">{photo.caption}</p>
        )}

        <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#00B4D8] opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100">
          View image <Maximize2 size={12} />
        </span>
      </div>

      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open photo: ${photo.alt}`}
        className="absolute inset-0 z-20 rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00F5FF]"
      />
    </GlowFrame>
  );
}


// ═════════════════════════════════════════════════════════════
// LIGHTBOX
// ═════════════════════════════════════════════════════════════

function Lightbox({
  photo,
  position,
  total,
  onClose,
  onStep,
}: {
  photo: Photo;
  position: string;
  total: string;
  onClose: () => void;
  onStep: (direction: 1 | -1) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const multiple = Number(total) > 1;

  // Lock page scroll, move focus into the dialog, and restore both on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  // Keyboard: Escape closes, arrows move between photos.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onStep(-1);
      if (e.key === "ArrowRight") onStep(1);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onStep]);

  const step = (direction: 1 | -1) => (e: MouseEvent) => {
    e.stopPropagation();
    onStep(direction);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0F1E]/95 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={onClose}
    >
      {multiple && (
        <button
          type="button"
          onClick={step(-1)}
          aria-label="Previous photo"
          className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 ${ICON_BUTTON}`}
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {multiple && (
        <button
          type="button"
          onClick={step(1)}
          aria-label="Next photo"
          className={`absolute right-4 top-1/2 z-10 -translate-y-1/2 ${ICON_BUTTON}`}
        >
          <ChevronRight size={20} />
        </button>
      )}

      <motion.div
        key={photo.src}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="relative max-h-[92vh] w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <GlowFrame innerClassName="p-3">
          <div className="relative flex items-center justify-center overflow-hidden rounded-xl bg-[#0A0F1E]">
            <img
              src={photo.src}
              alt={photo.alt}
              className="max-h-[70vh] w-auto max-w-full object-contain"
            />
          </div>

          <div className="relative flex items-start justify-between gap-4 px-2 pb-1 pt-4">
            <p className="text-sm text-slate-400">{photo.caption || photo.alt}</p>

            <span className="shrink-0 text-xs font-semibold tracking-widest text-slate-500">
              {position} / {total}
            </span>
          </div>
        </GlowFrame>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className={`absolute -right-3 -top-3 z-10 ${ICON_BUTTON}`}
        >
          <X size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
}