/* Author: Nithish Kaliannan Ananth */
// src/pages/Contact.tsx
// Open channel. The form transmits to POST /api/v1/contact (unchanged
// contract) with an explicit transmitting → received / failed state; the
// map only loads Google's iframe when asked.

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { submitContactMessage } from "../api/contactApi";
import { useContactInfo } from "../lib/queries";
import { EASE_HYDRO } from "../lib/motion";
import TelemetryHeader from "../components/ui/TelemetryHeader";
import HudPanel from "../components/ui/HudPanel";
import RelayButton from "../components/ui/RelayButton";
import CircuitDivider from "../components/ui/CircuitDivider";
import SonarBadge from "../components/ui/SonarBadge";
import { Icon } from "../components/ui/Icon";
import type { ContactMessagePayload } from "../types/contact";

const SUBJECTS = [
  "Deploying Walrus on a water body",
  "A pilot or partnership",
  "RobotX 2026",
  "Research collaboration",
  "Investment",
  "Press",
  "Something else",
];

type Phase = "idle" | "sending" | "sent" | "error";

const field =
  "w-full border border-line-2 bg-abyss/70 px-4 py-3 text-[15px] text-bone placeholder:text-drift/70 transition-colors focus:border-hydro focus:outline-none focus:ring-1 focus:ring-hydro/40";

export default function ContactPage() {
  const { data: info } = useContactInfo();
  const phone = info.phone ? info.phone.replace(/\D/g, "").slice(-10) : "";

  return (
    <>
      <section className="pb-12 pt-14 sm:pb-16 sm:pt-24">
        <div className="grid-wrap">
          <TelemetryHeader as="h1" size="xl" index="COMMS-00" code="OPEN CHANNEL" title={info.heroTitle} lede={info.heroSubtitle} />
        </div>
      </section>

      <CircuitDivider variant="left" label="BUS 01 · UPLINK" />

      <section className="py-12 sm:py-20">
        <div className="grid-wrap grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <HudPanel serial="COMMS · DIRECT" padded={false}>
              <dl className="divide-y divide-line">
                {info.email && (
                  <div className="px-5 py-4">
                    <dt className="stencil">Email</dt>
                    <dd className="mt-1"><a href={`mailto:${info.email}`} className="break-all text-bone transition-colors hover:text-hydro">{info.email}</a></dd>
                  </div>
                )}
                {phone && (
                  <div className="px-5 py-4">
                    <dt className="stencil">Phone</dt>
                    <dd className="mt-1"><a href={`tel:+91${phone}`} className="font-mono text-bone tabular transition-colors hover:text-hydro">+91 {phone.replace(/(\d{5})(\d{5})/, "$1 $2")}</a></dd>
                  </div>
                )}
                {info.address && (
                  <div className="px-5 py-4">
                    <dt className="stencil">Base</dt>
                    <dd className="mt-1 text-[15px] leading-relaxed text-fog">{info.address}</dd>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 px-5 py-4">
                  {[
                    { url: info.linkedin, icon: "linkedin", label: "LinkedIn" },
                    { url: info.instagram, icon: "instagram", label: "Instagram" },
                    { url: info.twitter, icon: "x", label: "X" },
                    { url: info.youtube, icon: "youtube", label: "YouTube" },
                  ]
                    .filter((s) => s.url)
                    .map((s) => (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Aquaholics on ${s.label}`}
                        className="grid h-10 w-10 place-items-center border border-line-2 text-fog transition-colors hover:border-hydro hover:text-hydro"
                      >
                        <Icon name={s.icon} size={16} />
                      </a>
                    ))}
                </div>
              </dl>
            </HudPanel>
            <MapPanel src={info.mapEmbedUrl} />
          </div>
        </div>
      </section>
    </>
  );
}

function ContactForm() {
  const [form, setForm] = useState<ContactMessagePayload>({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [phase, setPhase] = useState<Phase>("idle");

  const set = (k: keyof ContactMessagePayload) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (phase === "sending") return;
    setPhase("sending");
    try {
      await submitContactMessage(form);
      setPhase("sent");
      setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" });
    } catch {
      setPhase("error");
    }
  };

  return (
    <HudPanel serial="UPLINK · FORM" status={phase === "sent" ? "validated" : phase === "error" ? "offline" : "ongoing"} statusLabel={phase === "sent" ? "Received" : phase === "error" ? "Failed" : phase === "sending" ? "Transmitting" : "Standing by"} bodyClassName="p-5 sm:p-8">
      <AnimatePresence mode="wait">
        {phase === "sent" ? (
          <motion.div key="sent" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE_HYDRO }} role="status" className="py-8">
            <SonarBadge status="live" label="Transmission received" />
            <h2 className="display-m mt-5 text-bone">Thank you. Your message is with the team.</h2>
            <p className="mt-4 max-w-md text-fog">We usually reply within one or two working days.</p>
            <div className="mt-8"><RelayButton onClick={() => setPhase("idle")} variant="secondary">Send another</RelayButton></div>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="stencil">Name</span>
                <input required maxLength={100} autoComplete="name" value={form.name} onChange={set("name")} className={`${field} mt-2`} />
              </label>
              <label className="block">
                <span className="stencil">Email</span>
                <input required type="email" maxLength={150} autoComplete="email" value={form.email} onChange={set("email")} className={`${field} mt-2`} />
              </label>
            </div>
            <label className="block">
              <span className="stencil">Subject</span>
              <select value={form.subject} onChange={set("subject")} className={`${field} mt-2`}>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s} className="bg-abyss">{s}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="stencil">Message</span>
              <textarea
                required
                rows={6}
                maxLength={3000}
                value={form.message}
                onChange={set("message")}
                placeholder="Where is the water body, roughly how big is it, and what would you like to achieve?"
                className={`${field} mt-2 resize-y`}
              />
            </label>
            {phase === "error" && (
              <p role="alert" className="border-l-2 border-rust pl-3 text-sm text-rust">
                The transmission didn’t go through. Try again, or email us directly.
              </p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <p className="text-[13px] text-drift">We only use your details to reply to you.</p>
              <RelayButton type="submit" size="lg" disabled={phase === "sending"}>
                {phase === "sending" ? "Transmitting…" : "Transmit message"}
              </RelayButton>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </HudPanel>
  );
}

function MapPanel({ src }: { src?: string }) {
  const [load, setLoad] = useState(false);
  if (!src) return null;
  return (
    <HudPanel serial="BASE · 13.1216° N 80.1378° E" padded={false}>
      <div className="relative aspect-[4/3] bg-hull">
        {load ? (
          <iframe src={src} title="Aquaholics location" className="absolute inset-0 h-full w-full grayscale invert-[0.9] hue-rotate-180" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        ) : (
          <button type="button" onClick={() => setLoad(true)} className="group/map absolute inset-0 grid place-items-center text-left" data-ping>
            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(42,58,71,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(42,58,71,.5) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <span className="relative flex flex-col items-center gap-3">
              <span className="grid h-14 w-14 place-items-center border border-hydro/60 text-hydro transition-colors group-hover/map:bg-hydro/10">
                <MapPin size={20} />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-stencil text-bone">Load map · Ambattur, Chennai</span>
              <span className="text-[12px] text-drift">Loads Google Maps</span>
            </span>
          </button>
        )}
      </div>
    </HudPanel>
  );
}
