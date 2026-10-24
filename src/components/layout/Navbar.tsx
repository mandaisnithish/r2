// src/components/layout/Navbar.tsx
// Instrument-strip navigation. Mono links with a trace that charges under
// the active route; the mobile menu is a full-height panel with large
// display links and the current depth.

import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Wordmark from "./Wordmark";
import LinkStatus from "./LinkStatus";
import RelayButton from "../ui/RelayButton";
import { EASE_HYDRO } from "../../lib/motion";
import { NAV_LINKS } from "./navLinks";


export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the panel whenever the route changes. Deferred so we don't set
  // state synchronously inside the effect body.
  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? "border-b border-line bg-abyss/85 backdrop-blur-md" : "border-b border-transparent bg-transparent"
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[80] focus:bg-bone focus:px-3 focus:py-2 focus:text-abyss">
        Skip to content
      </a>
      <div className="grid-wrap flex h-16 items-center justify-between gap-6">
        <Link to="/" aria-label="Aquaholics home" data-ping className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              data-ping
              className={({ isActive }) =>
                `group/nav relative px-3 py-2 font-mono text-[11px] uppercase tracking-stencil transition-colors ${
                  isActive ? "text-bone" : "text-drift hover:text-bone"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`mr-1.5 text-[9px] ${isActive ? "text-hydro" : "text-line-2 group-hover/nav:text-drift"}`}>{l.code}</span>
                  {l.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 -bottom-px h-px origin-left bg-hydro transition-transform duration-500 ease-hydro ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-50"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LinkStatus className="hidden xl:inline-flex" />
          <RelayButton to="/contact" size="sm" className="hidden sm:inline-flex">
            Get demo
          </RelayButton>
          <button
            type="button"
            className="relative grid h-10 w-10 place-items-center border border-line-2 text-bone lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`absolute h-px w-4 bg-current transition-transform duration-300 ease-hydro ${open ? "rotate-45" : "-translate-y-1"}`} />
            <span className={`absolute h-px w-4 bg-current transition-transform duration-300 ease-hydro ${open ? "-rotate-45" : "translate-y-1"}`} />
          </button>
        </div>
      </div>

    </header>
    {/* Outside <header>: its backdrop-filter would otherwise become the
        containing block for this fixed panel and collapse it. */}
    <AnimatePresence>
      {open && (
        <motion.nav
          id="mobile-nav"
          aria-label="Mobile"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.45, ease: EASE_HYDRO }}
          className="fixed inset-x-0 bottom-0 top-16 z-[49] overflow-y-auto border-t border-line bg-abyss lg:hidden"
        >
          <ul className="grid-wrap py-6">
            {NAV_LINKS.map((l, i) => {
              const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
              return (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: EASE_HYDRO, delay: 0.05 + i * 0.04 }}
                  className="border-b border-line"
                >
                  <Link to={l.to} className="flex items-baseline gap-4 py-4" data-ping>
                    <span className={`font-mono text-[11px] ${active ? "text-hydro" : "text-drift"}`}>{l.code}</span>
                    <span className={`font-display text-3xl font-semibold ${active ? "text-bone" : "text-fog"}`}>{l.label}</span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
          <div className="grid-wrap flex flex-col gap-5 pb-10">
            <RelayButton to="/contact" size="lg" className="w-full">Get demo</RelayButton>
            <LinkStatus />
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
    </>
  );
}
