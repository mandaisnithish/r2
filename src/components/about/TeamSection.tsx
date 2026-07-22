import { useRef, useState, useEffect, type PointerEvent } from "react";
import { motion, useInView } from "framer-motion";
import { User, ArrowUpRight, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import type { Member } from "../../types";

interface Props {
  members: Member[];
}

const LinkedInIcon = ({ size = 14 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GitHubIcon = ({ size = 14 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const InstagramIcon = ({ size = 14 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

function FlipCard({
  member,
  delay,
  inView,
  offset,
  flipped,
  onToggleFlip,
}: {
  member: Member;
  delay: number;
  inView: boolean;
  offset: number;
  flipped: boolean;
  onToggleFlip: () => void;
}) {
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: PointerEvent) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (!pointerDownPos.current) return;
    const dx = Math.abs(e.clientX - pointerDownPos.current.x);
    const dy = Math.abs(e.clientY - pointerDownPos.current.y);
    pointerDownPos.current = null;
    // Only treat as a tap-to-flip if the pointer barely moved.
    // A larger movement means the user was swiping the carousel, not tapping this card.
    if (dx < 8 && dy < 8) {
      onToggleFlip();
    }
  };

  // FIX (#1): no more slicing to 3 — show every expertise tag from the DB.
  const tags = member.expertise
    ? member.expertise.split(",").map(t => t.trim()).filter(Boolean)
    : [];

  const hasPhoto = !!(member.photoUrl && member.photoUrl.trim() !== "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={`relative w-full aspect-[3/4] p-[1.5px] rounded-2xl overflow-hidden`}
      style={{ perspective: "1200px" }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Rotating glow border wrapping the whole card, matching the
          site-wide card language now established everywhere else */}
      <div
        className="absolute inset-[-50%] animate-[spin_8s_linear_infinite] opacity-50 pointer-events-none"
        style={{
          background: "conic-gradient(from 0deg, transparent 0%, #00B4D8 15%, transparent 30%, transparent 70%, #00F5FF 85%, transparent 100%)",
          animationDelay: `${offset}s`,
        }}
      />

      <div
        className="relative w-full h-full transition-transform duration-500 select-none cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ── FRONT FACE ── */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden bg-[#0A0F1E]"
          style={{ backfaceVisibility: "hidden" }}
        >
          {hasPhoto ? (
            <>
              <img
                src={member.photoUrl}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#050B14]/80 to-transparent" />

              {/* FIX (#2): explicit "flip card" affordance — a small rotate
                  icon badge in the corner that's ALWAYS visible (not just
                  an animated hint), so new users immediately understand
                  the card is interactive, plus the animated text label
                  as a secondary cue. */}
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <RotateCw size={12} className="text-[#00F5FF]" />
              </div>

              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 text-slate-300 text-[10px] font-bold tracking-widest uppercase"
              >
                <span>Tap to flip</span>
                <ArrowUpRight size={12} className="text-[#00F5FF]" />
              </motion.div>
            </>
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-[#00B4D8]/10 blur-[50px] pointer-events-none" />

              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <RotateCw size={12} className="text-[#00B4D8]" />
              </div>

              <div className="relative w-24 h-24 rounded-full bg-[#00B4D8]/10 border-2 border-[#00B4D8]/30 flex items-center justify-center">
                <User size={36} className="text-[#00B4D8]" />
              </div>

              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-slate-500 text-[10px] font-bold tracking-widest uppercase"
              >
                <span>Tap to flip</span>
                <ArrowUpRight size={12} className="text-[#00B4D8]" />
              </motion.div>
            </div>
          )}
        </div>

        {/* ── BACK FACE ── */}
        <div
          className="absolute inset-0 rounded-2xl bg-[#0A0F1E] flex flex-col justify-between p-6 overflow-y-auto overflow-x-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#00B4D8]/10 blur-[60px] pointer-events-none" />

          <div className="relative w-full">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
              {hasPhoto ? (
                <img src={member.photoUrl} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-[#00B4D8]/40" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#00B4D8]/10 border border-[#00B4D8]/30 flex items-center justify-center">
                  <User size={16} className="text-[#00B4D8]" />
                </div>
              )}
              <div>
                <p className="text-white font-semibold text-sm line-clamp-1">{member.name}</p>
                <p className="text-[#00B4D8] text-xs line-clamp-2 leading-snug">{member.role}</p>
              </div>
            </div>

            {member.bio && member.bio.trim() !== "" ? (
              <p className="text-slate-400 text-xs leading-relaxed">{member.bio}</p>
            ) : (
              <p className="text-slate-500 text-xs italic leading-relaxed">Core engineer dedicated to the development of autonomous aquatic preservation frameworks.</p>
            )}
          </div>

          {/* FIX (#1): render every tag, not just the first 3. Wraps freely. */}
          {tags.length > 0 && (
            <div className="relative flex flex-wrap gap-1.5 my-2">
              {tags.map(tag => (
                <span key={tag} className="text-[9px] font-semibold bg-[#00B4D8]/10 border border-[#00B4D8]/20 text-[#00B4D8] px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="relative flex gap-3 mt-auto pt-2 border-t border-white/5">
            {member.linkedin && member.linkedin.trim() !== "" && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center text-[#00B4D8] hover:bg-[#00B4D8]/25 hover:-translate-y-0.5 transition-all">
                <LinkedInIcon size={15} />
              </a>
            )}
            {member.github && member.github.trim() !== "" && (
              <a href={member.github} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center text-[#00B4D8] hover:bg-[#00B4D8]/25 hover:-translate-y-0.5 transition-all">
                <GitHubIcon size={15} />
              </a>
            )}
            {member.instagram && member.instagram.trim() !== "" && (
              <a href={member.instagram} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center text-[#00B4D8] hover:bg-[#00B4D8]/25 hover:-translate-y-0.5 transition-all">
                <InstagramIcon size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const FALLBACK_MEMBERS: Member[] = [
  { id: 1, name: "Arjun Kumar", role: "CEO & Co-Founder", expertise: "AI, Robotics, Hardware", displayOrder: 1 },
  { id: 2, name: "Priya R", role: "CTO", expertise: "Embedded Systems, Navigation", displayOrder: 2 },
  { id: 3, name: "Mohamed S", role: "Lead Engineer", expertise: "Mechanical, CAD, Sensors", displayOrder: 3 },
];

function TeamCarousel({ data, inView }: { data: Member[]; inView: boolean }) {
  const [visible, setVisible] = useState(1);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isAutoScrolling = useRef(false);
  const isWrapping = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [flippedId, setFlippedId] = useState<string | number | null>(null);

  const realCount = data.length;

  // ── TRUE INFINITE RING ──
  // Clone `visible` cards onto each end of the strip:
  //   [ ...clones of last N real cards ] [ ...real cards ] [ ...clones of first N real cards ]
  // "displayIndex" always points into this extended array. `startOffset`
  // is where the REAL cards begin. Advancing past the last real card
  // scrolls smoothly into the cloned-CEO card at the end — which looks
  // identical to the real CEO card — and once that scroll settles we
  // silently snap (no animation) back to the real CEO position. Since
  // clone === real visually, the snap is invisible and it reads as one
  // continuous ring instead of scrolling backward through everyone.
  const startOffset = visible;
  const extended = realCount > visible
    ? [...data.slice(-visible), ...data, ...data.slice(0, visible)]
    : data;

  const [displayIndex, setDisplayIndex] = useState(startOffset);
  const maxDisplayIndex = Math.max(0, extended.length - visible);

  useEffect(() => {
    const measure = () => setVisible(window.innerWidth >= 768 ? 2 : 1);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Position the strip at the first real card on mount / whenever the
  // layout (visible count) changes — instantly, no animation.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || realCount <= visible) return;
    const card = scroller.children[startOffset] as HTMLElement | undefined;
    if (!card) return;
    isAutoScrolling.current = true;
    scroller.scrollTo({ left: card.offsetLeft, behavior: "auto" });
    setDisplayIndex(startOffset);
    window.setTimeout(() => { isAutoScrolling.current = false; }, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, realCount]);

  // Clean up any pending timers on unmount.
  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    };
  }, []);

  const scrollToDisplayIndex = (i: number, instant = false) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const clamped = Math.max(0, Math.min(i, maxDisplayIndex));
    const card = scroller.children[clamped] as HTMLElement | undefined;
    if (!card) return;
    isAutoScrolling.current = true;
    scroller.scrollTo({ left: card.offsetLeft, behavior: instant ? "auto" : "smooth" });
    setDisplayIndex(clamped);
    window.setTimeout(() => {
      isAutoScrolling.current = false;
      // After the visible scroll finishes, check if we've drifted into a
      // clone zone. If so, snap invisibly back to the matching real index.
      if (clamped >= realCount + startOffset) {
        isWrapping.current = true;
        scrollToDisplayIndex(clamped - realCount, true);
        window.setTimeout(() => { isWrapping.current = false; }, 80);
      } else if (clamped < startOffset) {
        isWrapping.current = true;
        scrollToDisplayIndex(clamped + realCount, true);
        window.setTimeout(() => { isWrapping.current = false; }, 80);
      }
    }, instant ? 60 : 520);
  };

  const goNext = () => scrollToDisplayIndex(displayIndex + 1);
  const goPrev = () => scrollToDisplayIndex(displayIndex - 1);

  // Autoplay — same gating as before: only runs once in view, and never
  // while a card is flipped open.
  useEffect(() => {
    if (!autoplayEnabled || !inView || flippedId !== null) return;
    if (realCount <= visible) return;
    const timer = setInterval(() => {
      goNext();
    }, 3500);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplayEnabled, inView, flippedId, realCount, visible, displayIndex]);

  const pauseAutoplay = () => {
    setAutoplayEnabled(false);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setAutoplayEnabled(true), 5000);
  };

  // FIX: manual swipes/drags weren't being wrapped back into the real
  // range — only arrow/dot clicks were. That's what caused the ring to
  // get "stuck" or jump weirdly after a user swiped by hand. We now run
  // the same clone-detection + silent-snap-back logic here too, but
  // debounced so it only fires once the scroll has actually settled
  // (not mid-drag, which would yank the carousel from under a finger).
  const handleScroll = () => {
    if (isAutoScrolling.current || isWrapping.current) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const children = Array.from(scroller.children) as HTMLElement[];
    let closest = 0;
    let closestDist = Infinity;
    children.forEach((child, i) => {
      const dist = Math.abs(child.offsetLeft - scroller.scrollLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    const clamped = Math.min(closest, maxDisplayIndex);
    setDisplayIndex(clamped);

    if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = setTimeout(() => {
      if (clamped >= realCount + startOffset) {
        isWrapping.current = true;
        scrollToDisplayIndex(clamped - realCount, true);
        window.setTimeout(() => { isWrapping.current = false; }, 80);
      } else if (clamped < startOffset) {
        isWrapping.current = true;
        scrollToDisplayIndex(clamped + realCount, true);
        window.setTimeout(() => { isWrapping.current = false; }, 80);
      }
    }, 120);
  };

  const handleToggleFlip = (id: string | number) => {
    pauseAutoplay();
    setFlippedId(prev => (prev === id ? null : id));
  };

  // Real index (0..realCount-1), used only to drive the dot indicators.
  const realIndex = ((displayIndex - startOffset) % realCount + realCount) % realCount;

  if (data.length === 0) return null;

  if (data.length === 1) {
    return (
      <div className="max-w-sm mx-auto">
        <FlipCard
          member={data[0]}
          delay={0}
          inView={inView}
          offset={0}
          flipped={flippedId === (data[0].id ?? 0)}
          onToggleFlip={() => handleToggleFlip(data[0].id ?? 0)}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        onTouchStart={pauseAutoplay}
        onPointerDown={pauseAutoplay}
        onWheel={pauseAutoplay}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {extended.map((member, i) => {
          // Cloned cards need their own React key distinct from the real
          // card's key, since the same member appears twice in `extended`.
          const id = member.id ?? i;
          const key = `${id}-slot${i}`;
          return (
            <div
              key={key}
              className="flex-shrink-0 snap-start w-[85vw] sm:w-[calc(50%-12px)]"
            >
              <FlipCard
                member={member}
                delay={0}
                inView={inView}
                offset={(i % 5) * 0.4}
                flipped={flippedId === id}
                onToggleFlip={() => handleToggleFlip(id)}
              />
            </div>
          );
        })}
      </div>

      {/* Dot indicators — always mapped to the REAL member list, not the
          clone slots, so there's exactly one dot per actual person. */}
      <div className="flex justify-center gap-2 mt-8">
        {data.map((_, i) => (
          <button
            key={i}
            onClick={() => { pauseAutoplay(); scrollToDisplayIndex(i + startOffset); }}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === realIndex ? "w-6 bg-[#00B4D8]" : "w-1.5 bg-[#00B4D8]/30"}`}
          />
        ))}
      </div>

      {/* Ring arrows — always active, never disabled, since the ring has no ends */}
      <button
        onClick={() => { pauseAutoplay(); goPrev(); }}
        aria-label="Previous"
        className="hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0A0F1E] border border-[#00B4D8]/30 text-[#00B4D8] items-center justify-center hover:bg-[#00B4D8]/10 transition-colors z-10"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => { pauseAutoplay(); goNext(); }}
        aria-label="Next"
        className="hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0A0F1E] border border-[#00B4D8]/30 text-[#00B4D8] items-center justify-center hover:bg-[#00B4D8]/10 transition-colors z-10"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export default function TeamSection({ members }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const data = members && members.length > 0
    ? [...members].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    : FALLBACK_MEMBERS;

  return (
    <section ref={ref} className="relative bg-[#0D1B2A] py-24 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-[#00B4D8]/6 blur-[120px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-2 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold tracking-widest text-[#00B4D8] uppercase">
            The People
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mt-3">
            Meet the Team
          </h2>
        </motion.div>

        <TeamCarousel data={data} inView={inView} />
      </div>
    </section>
  );
}