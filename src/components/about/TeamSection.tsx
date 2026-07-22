import { useRef, useState, useEffect, type PointerEvent } from "react";
import { motion, useInView } from "framer-motion";
import { User, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
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

function FlipCard({ member, delay, inView, offset }: { member: Member; delay: number; inView: boolean; offset: number }) {
  const [flipped, setFlipped] = useState(false);
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
      setFlipped(f => !f);
    }
  };

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
        {/* ── FRONT FACE ──
            Front only shows the photo (or placeholder icon) plus the
            "Explore" hint. No name, role, or tags here — those live on
            the back face only, revealed on flip/hover. */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden bg-[#0A0F1E]"
          style={{ backfaceVisibility: "hidden" }}
        >
          {hasPhoto ? (
            <>
              {/* Full-cover photo */}
              <img
                src={member.photoUrl}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />

              {/* Small gradient so the Explore hint stays legible over any photo */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#050B14]/80 to-transparent" />

              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 text-slate-300 text-[10px] font-bold tracking-widest uppercase"
              >
                <span>Explore</span>
                <ArrowUpRight size={12} className="text-[#00F5FF]" />
              </motion.div>
            </>
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
              {/* Ambient glow behind the placeholder icon for depth */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-[#00B4D8]/10 blur-[50px] pointer-events-none" />

              <div className="relative w-24 h-24 rounded-full bg-[#00B4D8]/10 border-2 border-[#00B4D8]/30 flex items-center justify-center">
                <User size={36} className="text-[#00B4D8]" />
              </div>

              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-slate-500 text-[10px] font-bold tracking-widest uppercase"
              >
                <span>Explore</span>
                <ArrowUpRight size={12} className="text-[#00B4D8]" />
              </motion.div>
            </div>
          )}
        </div>

        {/* ── BACK FACE ──
            All details — name, role, bio, tags, socials — live here. */}
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
                <p className="text-[#00B4D8] text-xs line-clamp-1">{member.role}</p>
              </div>
            </div>

            {member.bio && member.bio.trim() !== "" ? (
              <p className="text-slate-400 text-xs leading-relaxed line-clamp-4">{member.bio}</p>
            ) : (
              <p className="text-slate-500 text-xs italic leading-relaxed">Core engineer dedicated to the development of autonomous aquatic preservation frameworks.</p>
            )}
          </div>

          {tags.length > 0 && (
            <div className="relative flex flex-wrap gap-1.5 my-2">
              {tags.slice(0, 3).map(tag => (
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
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [visible, setVisible] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const gapPx = 24; // matches gap-6
  const maxIndex = Math.max(0, data.length - visible);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
      setVisible(window.innerWidth >= 768 ? 2 : 1);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Keep index in range whenever visible count or data length changes
  useEffect(() => {
    setIndex((prev) => Math.max(0, Math.min(prev, maxIndex)));
  }, [maxIndex]);

  const cardWidth = containerWidth > 0 ? (containerWidth - gapPx * (visible - 1)) / visible : 0;
  const slideDistance = cardWidth + gapPx;

  useEffect(() => {
    if (paused || data.length <= visible) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(timer);
  }, [paused, maxIndex, data.length]);

  const goTo = (i: number) => setIndex(Math.max(0, Math.min(i, maxIndex)));

  const handleDragStart = () => setPaused(true);

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const threshold = 60;
    if (info.offset.x < -threshold) goTo(index + 1);
    else if (info.offset.x > threshold) goTo(index - 1);
    setPaused(false);
  };

  if (data.length === 0) return null;

  if (data.length === 1) {
    return (
      <div className="max-w-sm mx-auto">
        <FlipCard member={data[0]} delay={0} inView={inView} offset={0} />
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden" ref={containerRef}>
        <motion.div
          className="flex gap-6 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          animate={{ x: -index * slideDistance }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {data.map((member, i) => (
            <div
              key={member.id || i}
              className="flex-shrink-0"
              style={{ width: cardWidth > 0 ? `${cardWidth}px` : `calc((100% - ${gapPx * (visible - 1)}px) / ${visible})` }}
            >
              <FlipCard member={member} delay={0} inView={inView} offset={(i % 5) * 0.4} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Manual controls */}
      <button
        onClick={() => goTo(index - 1)}
        disabled={index === 0}
        aria-label="Previous"
        className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0A0F1E] border border-[#00B4D8]/30 text-[#00B4D8] flex items-center justify-center disabled:opacity-30 hover:bg-[#00B4D8]/10 transition-colors z-10"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => goTo(index + 1)}
        disabled={index >= maxIndex}
        aria-label="Next"
        className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0A0F1E] border border-[#00B4D8]/30 text-[#00B4D8] flex items-center justify-center disabled:opacity-30 hover:bg-[#00B4D8]/10 transition-colors z-10"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-[#00B4D8]" : "w-1.5 bg-[#00B4D8]/30"}`}
          />
        ))}
      </div>
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