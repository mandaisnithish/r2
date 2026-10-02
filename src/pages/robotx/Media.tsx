import { useState } from "react";
import { Empty, PageShell, Tag } from "../../components/robotx/ui";
import { PHOTOS, VIDEOS } from "../../data/robotxData";

export default function Media() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  return (
    <PageShell
      eyebrow="VISUAL JOURNEY"
      title="Media"
      intro="See the vehicles, the engineering process, the testing, and the people behind AQUAHOLICS RobotX 2026."
    >
      {/* =========================================================
          FEATURED VIDEOS
      ========================================================= */}

      <section className="mb-20">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.25em] text-[#00B4D8]">
            01 / WATCH
          </p>

          <h2 className="mt-2 font-heading text-3xl font-bold text-white">
            Videos
          </h2>

          <p className="mt-3 max-w-2xl text-slate-400">
            Follow the development and testing of our autonomous platforms
            through video.
          </p>
        </div>

        {VIDEOS.length === 0 ? (
          <Empty text="Videos coming soon." />
        ) : (
          <div className="grid gap-7 lg:grid-cols-2">
            {VIDEOS.map((video, index) => (
              <figure
                key={video.youtubeId}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] transition-all duration-300 hover:border-[#00B4D8]/30"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />

                  <div className="pointer-events-none absolute left-4 top-4">
                    <Tag>VIDEO {String(index + 1).padStart(2, "0")}</Tag>
                  </div>
                </div>

                <figcaption className="p-5">
                  <h3 className="font-heading text-lg font-bold text-white">
                    {video.title}
                  </h3>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          PHOTO GALLERY
      ========================================================= */}

      <section className="mb-20">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.25em] text-[#00B4D8]">
            02 / SEE
          </p>

          <h2 className="mt-2 font-heading text-3xl font-bold text-white">
            Photo Gallery
          </h2>

          <p className="mt-3 max-w-2xl text-slate-400">
            A visual record of our platforms, development, testing, and team.
          </p>
        </div>

        {PHOTOS.length === 0 ? (
          <Empty text="Photos coming soon." />
        ) : (
          <div className="grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-3 md:auto-rows-[260px]">
            {PHOTOS.map((photo, index) => {
              const featured =
                index === 0 || (index % 7 === 0 && PHOTOS.length > 4);

              return (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => setSelectedPhoto(index)}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950 text-left transition-all duration-300 hover:border-[#00B4D8]/40 ${
                    featured ? "col-span-2 row-span-2" : ""
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  {/* Number */}
                  <span className="absolute left-4 top-4 font-mono text-xs text-white/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    {photo.caption && (
                      <p className="text-sm font-medium text-white">
                        {photo.caption}
                      </p>
                    )}

                    <span className="mt-2 inline-block text-xs text-[#00B4D8] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      VIEW IMAGE →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================================
          MEDIA STORY
      ========================================================= */}

      <section className="mb-10">
        <div className="relative overflow-hidden rounded-3xl border border-[#00B4D8]/20 bg-[#00B4D8]/[0.04] p-8 lg:p-12">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#00B4D8]/10 blur-3xl" />

          <div className="relative max-w-4xl">
            <p className="text-xs font-semibold tracking-[0.25em] text-[#00B4D8]">
              03 / BEHIND THE SYSTEM
            </p>

            <h2 className="mt-3 font-heading text-3xl font-bold text-white lg:text-4xl">
              More than a finished robot.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">
              Our media documents the journey from individual subsystems to
              an integrated multi-domain system — capturing the engineering,
              testing, iteration, and teamwork behind every capability.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          LIGHTBOX
      ========================================================= */}

      {selectedPhoto !== null && PHOTOS[selectedPhoto] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={PHOTOS[selectedPhoto].src}
              alt={PHOTOS[selectedPhoto].alt}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain"
            />

            {PHOTOS[selectedPhoto].caption && (
              <p className="mt-4 text-center text-sm text-slate-300">
                {PHOTOS[selectedPhoto].caption}
              </p>
            )}

            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-900 text-xl text-white transition hover:border-[#00B4D8] hover:text-[#00B4D8]"
              aria-label="Close image viewer"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}