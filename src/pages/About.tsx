// src/pages/About.tsx
// The people and the reason. Story, mission/vision, why we exist,
// values, the crew (dossier cards) and partners — all from the CMS.

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useAboutContent, useMembers, usePartners, useValues } from "../lib/queries";
import { EASE_HYDRO } from "../lib/motion";
import { cdn, initials, splitTags } from "../lib/format";
import TelemetryHeader from "../components/ui/TelemetryHeader";
import CircuitDivider from "../components/ui/CircuitDivider";
import RelayButton from "../components/ui/RelayButton";
import MediaSlot from "../components/ui/MediaSlot";
import HudPanel from "../components/ui/HudPanel";
import BlueprintCard from "../components/ui/BlueprintCard";
import Reveal from "../components/ui/Reveal";
import ServoBracket from "../components/ui/ServoBracket";
import { Icon } from "../components/ui/Icon";
import type { Member, Partner } from "../types";

export default function About() {
  const { data: c } = useAboutContent();
  const { data: members } = useMembers();
  const { data: values } = useValues();
  const { data: partners } = usePartners();
  const story = (c.storyText ?? "").split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  const kicker = story.length > 1 && story[0].length < 60 ? story.shift() : undefined;

  return (
    <>
      {/* ───────── hero ───────── */}
      <section className="pb-16 pt-14 sm:pb-24 sm:pt-24">
        <div className="grid-wrap grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <TelemetryHeader as="h1" size="xl" index="AQH-CREW" code="ABOUT" title={c.heroTitle} />
          </div>
          <Reveal className="lg:col-span-4 lg:pt-28">
            <p className="lede">{c.heroSubtitle}</p>
          </Reveal>
        </div>
      </section>

      {/* ───────── story ───────── */}
      <CircuitDivider variant="left" label="BUS 01 · ORIGIN" />
      <section className="py-16 sm:py-24">
        <div className="grid-wrap grid gap-12 lg:grid-cols-12">
          <Reveal side={-1} className="lg:col-span-7 lg:-ml-10">
            <MediaSlot
              slotId="ABOUT_STORY"
              src={c.storyImageUrl}
              alt="The Aquaholics team at Ideas to Impact"
              aspect="16:9"
              brief="Team photo from a competition or the lab: real faces, real hardware on the table."
              caption="Ideas to Impact 2.0 · IIT Madras"
            />
          </Reveal>
          <div className="lg:col-span-5">
            <TelemetryHeader index="SYS-01" code="ORIGIN" title={c.storyTitle} size="m" />
            {kicker && <p className="mt-6 font-mono text-[12px] uppercase tracking-stencil text-hydro">{kicker}</p>}
            <div className="mt-4 space-y-4">
              {story.map((para, i) => (
                <p key={i} className="text-[16px] leading-relaxed text-fog">{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── mission / vision ───────── */}
      <section className="py-12 sm:py-16">
        <div className="grid-wrap grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <HudPanel serial="DIRECTIVE · M" label={c.missionTitle || "Mission"} className="h-full" bodyClassName="p-6 sm:p-10">
              <p className="font-display text-2xl font-medium leading-snug text-bone sm:text-3xl">{c.missionText}</p>
            </HudPanel>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6 lg:mt-20">
            <HudPanel tone="hydro" serial="DIRECTIVE · V" label={c.visionTitle || "Vision"} className="h-full" bodyClassName="p-6 sm:p-10">
              <p className="font-display text-2xl font-medium leading-snug text-bone sm:text-3xl">{c.visionText}</p>
            </HudPanel>
          </Reveal>
        </div>
      </section>

      {/* ───────── why + values ───────── */}
      <CircuitDivider variant="right" label="BUS 02 · DOCTRINE" />
      <section className="py-16 sm:py-24">
        <div className="grid-wrap">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <TelemetryHeader index="SYS-02" code="DOCTRINE" title={c.whyTitle || "Why we exist"} size="m" />
            </div>
            <Reveal className="lg:col-span-6 lg:col-start-7 lg:pt-14">
              <p className="lede text-bone/90">{c.whyText}</p>
            </Reveal>
          </div>
          {values.length > 0 && (
            <div className="mt-16 grid gap-x-8 gap-y-10 md:grid-cols-3">
              {values.map((v, i) => (
                <Reveal key={v.id} delay={i * 0.08} className={i === 1 ? "md:mt-12" : i === 2 ? "md:mt-24" : ""}>
                  <BlueprintCard index={`V-0${i + 1}`} icon={v.icon} title={v.title}>
                    {v.description}
                  </BlueprintCard>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ───────── crew ───────── */}
      <CircuitDivider variant="split" label="BUS 03 · CREW MANIFEST" />
      <section className="py-16 sm:py-24">
        <div className="grid-wrap">
          <TelemetryHeader
            index="SYS-03"
            code="CREW MANIFEST"
            title="The people behind the machine."
            size="m"
            readouts={[{ label: "On roster", value: `${members.length} crew` }]}
          />
          <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((m, i) => (
              <Reveal as="li" key={m.id} delay={(i % 4) * 0.06} className={i % 4 === 1 || i % 4 === 3 ? "lg:mt-10" : ""}>
                <CrewCard member={m} index={i} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── partners ───────── */}
      {partners.length > 0 && (
        <>
          <CircuitDivider variant="left" label="BUS 04 · NETWORK" />
          <Partners partners={partners} />
        </>
      )}

      {/* ───────── CTA ───────── */}
      <section className="py-24 sm:py-32">
        <div className="grid-wrap">
          <HudPanel tone="hydro" serial="RECRUITMENT · OPEN" status="live" statusLabel="Accepting crew" bodyClassName="p-6 sm:p-12">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <h2 className="display-l text-bone lg:col-span-8">{c.ctaTitle || "Want to work with us?"}</h2>
              <div className="lg:col-span-4 lg:text-right">
                <RelayButton to="/contact" size="lg">{c.ctaButtonText || "Get in touch"}</RelayButton>
              </div>
            </div>
          </HudPanel>
        </div>
      </section>
    </>
  );
}

function CrewCard({ member: m, index }: { member: Member; index: number }) {
  const [open, setOpen] = useState(false);
  const tags = splitTags(m.expertise);
  const links = [
    { url: m.linkedin, icon: "linkedin", label: "LinkedIn", ok: (u: string) => /linkedin\.com/.test(u) },
    { url: m.github, icon: "github", label: "GitHub", ok: (u: string) => /github\.com/.test(u) },
    { url: m.instagram, icon: "instagram", label: "Instagram", ok: (u: string) => /instagram\.com/.test(u) },
  ].filter((l) => l.url && l.ok(l.url));
  const panelId = `crew-${m.id}`;

  return (
    <article className="group/crew relative">
      <div className="relative overflow-hidden border border-line bg-hull" style={{ aspectRatio: "6 / 5" }}>
        {m.photoUrl ? (
          <img
            src={cdn(m.photoUrl, 700)}
            alt={`Portrait of ${m.name}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover grayscale-[20%] transition-[filter] duration-500 group-hover/crew:grayscale-0"
            // Posters are 700×921 with the name baked into a banner across the
            // bottom third. A 6:5 frame anchored to the top shows the top
            // ~63% — portrait and comic burst — and drops the banner.
            style={{ objectPosition: "50% 0%" }}
          />
        ) : (
          <span className="grid h-full w-full place-items-center font-display text-5xl text-line-2">{initials(m.name)}</span>
        )}
        <span className="pointer-events-none absolute left-3 top-3 font-mono text-[10px] tracking-stencil text-bone/80 mix-blend-difference">
          CREW-{String(index + 1).padStart(2, "0")}
        </span>
        <AnimatePresence>
          {open && (
            <motion.div
              id={panelId}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: EASE_HYDRO }}
              className="absolute inset-0 flex flex-col overflow-y-auto border-t border-hydro/50 bg-abyss/95 p-5"
            >
              <span className="stencil text-hydro">Dossier</span>
              {m.bio && <p className="mt-3 text-[14px] leading-relaxed text-fog">{m.bio}</p>}
              {tags.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <li key={t} className="border border-line-2 px-2 py-1 font-mono text-[10px] uppercase tracking-stencil text-bone">{t}</li>
                  ))}
                </ul>
              )}
              {links.length > 0 && (
                <div className="mt-auto flex gap-2 pt-5">
                  {links.map((l) => (
                    <a
                      key={l.label}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${m.name} on ${l.label}`}
                      className="grid h-9 w-9 place-items-center border border-line-2 text-fog transition-colors hover:border-hydro hover:text-hydro"
                    >
                      <Icon name={l.icon} size={16} />
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <ServoBracket size={12} inset={-5} tone={open ? "hydro" : "line"} />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-tight text-bone">{m.name}</h3>
          <p className="mt-1 text-[13px] text-drift">{m.role}</p>
        </div>
        {(m.bio || tags.length > 0 || links.length > 0) && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? `Close ${m.name}'s dossier` : `Open ${m.name}'s dossier`}
            data-ping
            className={`grid h-9 w-9 shrink-0 place-items-center border transition-colors ${open ? "border-hydro text-hydro" : "border-line-2 text-fog hover:text-bone"}`}
          >
            {open ? <Minus size={16} /> : <Plus size={16} />}
          </button>
        )}
      </div>
    </article>
  );
}

function Partners({ partners }: { partners: Partner[] }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="grid-wrap">
        <TelemetryHeader index="SYS-04" code="NETWORK" title="Who we build with." size="m" />
        <ul className="mt-12 grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-5">
          {partners.map((p) => {
            const body = (
              <span className="flex h-full flex-col gap-3 p-5">
                {p.logoUrl ? (
                  <img src={cdn(p.logoUrl, 320)} alt={p.name} loading="lazy" className="h-10 w-auto self-start object-contain opacity-80 grayscale transition group-hover/p:opacity-100 group-hover/p:grayscale-0" />
                ) : (
                  <span className="grid h-10 w-10 place-items-center border border-line-2 font-display text-bone">{initials(p.name)}</span>
                )}
                <span className="text-sm text-bone">{p.name}</span>
                {p.category && <span className="stencil">{p.category}</span>}
              </span>
            );
            return (
              <li key={p.id} className="group/p border-b border-r border-line transition-colors hover:bg-hull/70">
                {p.website ? (
                  <a href={p.website} target="_blank" rel="noopener noreferrer" className="block h-full">{body}</a>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
