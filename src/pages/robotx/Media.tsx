import {
  useCallback,
  useEffect,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
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
import groupPhoto from "../../assets/robotx/groupphoto.jpeg";

/* =========================================================
   TYPES
========================================================= */

type FrameSize = "lg" | "md";

type Photo = {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption?: string;
  category?: string;
};

type Video = {
  id: string;
  youtubeId: string;
  title: string;
  description?: string;
  category?: string;
};

/* =========================================================
   MEDIA DATA
========================================================= */

const PHOTOS: Photo[] = [
  {
    id: "team-group-photo",
    src: groupPhoto,
    alt: "AQUAHOLICS RobotX 2026 team group photograph",
    title: "AQUAHOLICS RobotX 2026 Team",
    caption:
      "The AQUAHOLICS team representing R.M.K Engineering College.",
    category: "Team",
  },
];

const VIDEOS: Video[] = [];

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <div className="mb-3 flex items-center gap-3">
        <span className="h-px w-8 bg-cyan-400" />

        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          {eyebrow}
        </span>
      </div>

      <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-3 text-sm leading-7 text-slate-400 md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/5">
        <Icon className="h-6 w-6 text-cyan-300" />
      </div>

      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   VIDEO CARD
========================================================= */

function VideoCard({ video }: { video: Video }) {
  const thumbnail = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

  const openVideo = () => {
    window.open(
      `https://www.youtube.com/watch?v=${video.youtubeId}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
    >
      <button
        type="button"
        onClick={openVideo}
        className="block w-full text-left"
        aria-label={`Play ${video.title}`}
      >
        <div className="relative aspect-video overflow-hidden bg-slate-900">
          <img
            src={thumbnail}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/35 transition group-hover:bg-black/20" />

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/50 backdrop-blur-sm transition group-hover:scale-110 group-hover:border-cyan-300">
              <Play className="ml-1 h-6 w-6 fill-current text-white" />
            </span>
          </div>
        </div>

        <div className="p-5">
          {video.category && (
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
              {video.category}
            </span>
          )}

          <h3 className="mt-2 text-lg font-semibold text-white">
            {video.title}
          </h3>

          {video.description && (
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {video.description}
            </p>
          )}
        </div>
      </button>
    </motion.article>
  );
}

/* =========================================================
   PHOTO TILE
========================================================= */

function PhotoTile({
  photo,
  onOpen,
  size = "md",
}: {
  photo: Photo;
  onOpen: () => void;
  size?: FrameSize;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left ${
        size === "lg" ? "min-h-[420px]" : "min-h-[280px]"
      }`}
      aria-label={`Open ${photo.title}`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5" />

      <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
        <Maximize2 className="h-4 w-4 text-white" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5">
        {photo.category && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
            {photo.category}
          </span>
        )}

        <h3 className="mt-2 text-xl font-semibold text-white">
          {photo.title}
        </h3>

        {photo.caption && (
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {photo.caption}
          </p>
        )}
      </div>
    </motion.button>
  );
}

/* =========================================================
   LIGHTBOX
========================================================= */

function Lightbox({
  photo,
  onClose,
  onPrevious,
  onNext,
}: {
  photo: Photo;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const handleBackdropClick = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md md:p-8"
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image viewer"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 md:right-8 md:top-8"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={onPrevious}
        aria-label="Previous image"
        className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 md:left-8"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next image"
        className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 md:right-8"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="flex max-h-[90vh] max-w-6xl flex-col items-center"
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl"
        />

        <div className="mt-5 max-w-2xl text-center">
          {photo.category && (
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
              {photo.category}
            </span>
          )}

          <h2 className="mt-2 text-xl font-semibold text-white">
            {photo.title}
          </h2>

          {photo.caption && (
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {photo.caption}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   STORY CARD
========================================================= */

function StoryCard({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
    >
      <div className="mb-5 flex items-center gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/5 text-sm font-bold text-cyan-300">
          {number}
        </span>

        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>
      </div>

      <p className="text-sm leading-7 text-slate-400">
        {children}
      </p>
    </motion.article>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Media() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    null
  );

  const closeViewer = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const stepViewer = useCallback((direction: 1 | -1) => {
    setSelectedIndex((current) => {
      if (current === null || PHOTOS.length === 0) {
        return current;
      }

      return (
        (current + direction + PHOTOS.length) %
        PHOTOS.length
      );
    });
  }, []);

  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeViewer();
      }

      if (event.key === "ArrowLeft") {
        stepViewer(-1);
      }

      if (event.key === "ArrowRight") {
        stepViewer(1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedIndex, closeViewer, stepViewer]);

  return (
    <PageShell
      eyebrow="RobotX 2026"
      title="Media"
      intro="Visual documentation of the AQUAHOLICS RobotX 2026 team, vehicles, development and testing."
    >
      <div className="space-y-20">
        {/* =================================================
            VIDEOS
        ================================================= */}

        <section>
          <SectionHeading
            eyebrow="Video Archive"
            title="Videos"
            description="Development footage, testing sessions, demonstrations and competition documentation will be added here."
          />

          {VIDEOS.length === 0 ? (
            <EmptyState
              icon={Play}
              title="Videos coming soon"
              description="The video library is currently being prepared. Testing and competition footage will be published here as it becomes available."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {VIDEOS.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                />
              ))}
            </div>
          )}
        </section>

        {/* =================================================
            PHOTOS
        ================================================= */}

        <section>
          <SectionHeading
            eyebrow="Photo Archive"
            title="Team & Build Gallery"
            description="A visual record of the AQUAHOLICS RobotX 2026 team and vehicle development."
          />

          {PHOTOS.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="Photos coming soon"
              description="Team photographs, vehicle builds, testing activities and field operations will be documented here."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {PHOTOS.map((photo, index) => (
                <PhotoTile
                  key={photo.id}
                  photo={photo}
                  size={index === 0 ? "lg" : "md"}
                  onOpen={() => setSelectedIndex(index)}
                />
              ))}
            </div>
          )}
        </section>

        {/* =================================================
            DEVELOPMENT STORY
        ================================================= */}

        <section>
          <SectionHeading
            eyebrow="Development Story"
            title="Building the System"
            description="RobotX development is documented as a progression from individual vehicle development toward an integrated autonomous System of Systems."
          />

          <div className="grid gap-6 md:grid-cols-3">
            <StoryCard
              number="01"
              title="Design"
            >
              Vehicle structures, propulsion, electronics, communication,
              sensing and autonomy concepts are developed and refined
              through engineering iterations.
            </StoryCard>

            <StoryCard
              number="02"
              title="Integration"
            >
              The USV and UAV are progressively integrated with onboard
              computing, perception, navigation, telemetry and
              mission-level communication.
            </StoryCard>

            <StoryCard
              number="03"
              title="Testing"
            >
              Testing focuses on validating vehicle behavior, autonomy,
              communication, perception and operational procedures under
              controlled conditions before competition deployment.
            </StoryCard>
          </div>
        </section>

        {/* =================================================
            DOCUMENTATION
        ================================================= */}

        <section>
          <div className="rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.06] via-white/[0.02] to-transparent p-8 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px w-8 bg-cyan-400" />

                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                    Documentation
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-white md:text-3xl">
                  Engineering progress, documented.
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-400 md:text-base">
                  The media archive will grow alongside the RobotX
                  development process, capturing design decisions,
                  construction, integration, testing and real-world
                  vehicle operation.
                </p>
              </div>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/5">
                <ImageIcon className="h-7 w-7 text-cyan-300" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =================================================
          LIGHTBOX
      ================================================= */}

      <AnimatePresence>
        {selectedIndex !== null &&
          PHOTOS[selectedIndex] && (
            <Lightbox
              photo={PHOTOS[selectedIndex]}
              onClose={closeViewer}
              onPrevious={() => stepViewer(-1)}
              onNext={() => stepViewer(1)}
            />
          )}
      </AnimatePresence>
    </PageShell>
  );
}