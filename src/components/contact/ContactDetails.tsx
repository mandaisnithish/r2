// src/components/contact/ContactDetails.tsx
// Note: lucide-react removed brand icons (Linkedin, Instagram,
// Twitter, Youtube, Facebook, Github) in v1. We use Tabler's
// icon font classes for these instead, same as the product page
// (ti ti-robot, ti ti-trophy etc) so the whole site stays on one
// icon system rather than mixing two libraries.
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Contact as ContactIcon } from "lucide-react";
import type { ContactInfo } from "../../types/contact";
import { useTilt } from "../../hooks/useTilt";

interface Props {
  info: ContactInfo;
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ContactDetails({ info }: Props) {
  const tilt = useTilt(6);

  const socials = [
    { url: info.linkedin, iconClass: "ti-brand-linkedin", label: "LinkedIn" },
    { url: info.instagram, iconClass: "ti-brand-instagram", label: "Instagram" },
    { url: info.twitter, iconClass: "ti-brand-x", label: "Twitter" },
    { url: info.youtube, iconClass: "ti-brand-youtube", label: "YouTube" },
  ].filter((s) => s.url);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      className="space-y-6"
    >
      {/* Glowing animated border wrapper, same treatment as ContactForm */}
      <div className="relative p-[2px] rounded-2xl overflow-hidden">
        <div className="absolute inset-[-50%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_180deg,transparent_0%,#00B4D8_15%,transparent_30%,transparent_70%,#00F5FF_85%,transparent_100%)] opacity-70" />

        <motion.div
          ref={tilt.ref}
          onMouseMove={tilt.onMouseMove}
          onMouseLeave={tilt.onMouseLeave}
          variants={container}
          initial="hidden"
          animate="show"
          className="relative bg-[#0D1B2A] rounded-2xl p-8 space-y-5 overflow-hidden will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="absolute -bottom-24 -left-16 w-56 h-56 rounded-full bg-[#00B4D8]/8 blur-[80px] pointer-events-none" />

          {/* Ambient bubbles, mirrored from the form card for consistency */}
          {[...Array(4)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-[#00B4D8]/30 pointer-events-none"
              style={{
                width: `${3 + (i % 2) * 2}px`,
                height: `${3 + (i % 2) * 2}px`,
                right: `${15 + i * 20}%`,
                bottom: "4%",
              }}
              animate={{ y: [0, -300], opacity: [0, 0.7, 0] }}
              transition={{ duration: 5.5 + i * 0.7, repeat: Infinity, delay: i * 1.3, ease: "easeIn" }}
            />
          ))}

          <motion.div variants={item} className="relative z-10 flex items-center gap-3 mb-2">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="w-9 h-9 rounded-lg bg-[#00B4D8]/15 border border-[#00B4D8]/30 flex items-center justify-center flex-shrink-0"
            >
              <ContactIcon size={16} className="text-[#00B4D8]" />
            </motion.div>
            <h2 className="font-heading font-semibold text-2xl text-white">
              Reach us directly
            </h2>
          </motion.div>

          <motion.a
            variants={item}
            href={`mailto:${info.email}`}
            className="relative z-10 flex items-start gap-4 no-underline group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#00B4D8]/20 group-hover:border-[#00B4D8]/50 group-hover:-translate-y-0.5 group-hover:shadow-[0_4px_16px_rgba(0,180,216,0.25)]">
              <Mail size={18} className="text-[#00B4D8]" />
            </div>
            <div>
              <div className="text-slate-500 text-xs mb-0.5">Email</div>
              <div className="text-white text-sm group-hover:text-[#00B4D8] transition-colors">
                {info.email}
              </div>
            </div>
          </motion.a>

          {info.phone && (
            <motion.a
              variants={item}
              href={`tel:${info.phone}`}
              className="relative z-10 flex items-start gap-4 no-underline group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-[#00B4D8]/20 group-hover:border-[#00B4D8]/50 group-hover:-translate-y-0.5 group-hover:shadow-[0_4px_16px_rgba(0,180,216,0.25)]">
                <Phone size={18} className="text-[#00B4D8]" />
              </div>
              <div>
                <div className="text-slate-500 text-xs mb-0.5">Phone</div>
                <div className="text-white text-sm group-hover:text-[#00B4D8] transition-colors">
                  {info.phone}
                </div>
              </div>
            </motion.a>
          )}

          {info.address && (
            <motion.div variants={item} className="relative z-10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-[#00B4D8]" />
              </div>
              <div>
                <div className="text-slate-500 text-xs mb-0.5">Location</div>
                <div className="text-white text-sm">{info.address}</div>
              </div>
            </motion.div>
          )}

          {socials.length > 0 && (
            <motion.div variants={item} className="relative z-10 flex gap-3 pt-2">
              {socials.map(({ url, iconClass, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center transition-all duration-300 hover:bg-[#00B4D8]/25 hover:border-[#00B4D8]/60 hover:-translate-y-1 hover:shadow-[0_4px_14px_rgba(0,180,216,0.3)]"
                >
                  <i className={`ti ${iconClass} text-base text-[#00B4D8]`} />
                </a>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {info.mapEmbedUrl && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative rounded-2xl overflow-hidden border border-[#00B4D8]/15 h-64"
        >
          {/* NOTE: removed the invert/hue-rotate filter. That filter was
              applied to the entire iframe, including Google's own overlay
              links and controls — depending on the browser, it can make
              Google's UI fail to render/paint correctly inside the frame,
              which is the likely reason "Open in Maps" disappeared.
              A subtle dark overlay tint achieves a similar "fits our theme"
              look without touching the content Google renders. */}
          <iframe
            src={info.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office location"
          />
          {/* Decorative tint only — pointer-events-none so it never blocks
              clicks on Google's actual map/links underneath it. */}
          <div className="absolute inset-0 bg-[#0A0F1E]/15 mix-blend-multiply pointer-events-none" />

          {/* Our own guaranteed-working link, independent of whatever
              Google's embed UI does or doesn't render. Always visible,
              always clickable, opens the real location in a new tab. */}
          {info.address && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-[#0A0F1E]/90 border border-[#00B4D8]/30 text-[#00B4D8] text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm hover:bg-[#00B4D8]/15 transition-colors no-underline z-10"
            >
              Open in Maps
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <path d="M15 3h6v6" />
                <path d="M10 14L21 3" />
              </svg>
            </a>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}