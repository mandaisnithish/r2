import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";

import companyLogo from "../../assets/companylogo.jpeg";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Product", to: "/product" },
  { label: "Impact", to: "/impact" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Entrance animation flag — nav slides/fades in once on first mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Scroll state for frosted-blur background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        mounted ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${
        scrolled || menuOpen
          ? "bg-[#0A0F1E]/95 backdrop-blur-xl border-b border-[#00B4D8]/15"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[72px]">

        {/* Logo with ripple-on-hover */}
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <div className="relative w-9 h-9 rounded-xl bg-[#00B4D8] flex items-center justify-center group-hover:bg-[#00F5FF] transition-all duration-300 flex-shrink-0 overflow-hidden">
            <img
              src={companyLogo}
              alt="Aquaholics Logo"
              className="w-full h-full object-cover"
            />
            {/* Ripple ring that expands on hover, like a droplet hitting the logo */}
            <span className="absolute inset-0 rounded-xl border-2 border-[#00F5FF] opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-150 group-hover:[animation:ripple-once_0.6s_ease-out] transition-opacity duration-150" />
          </div>
          <span className="font-heading font-black text-lg tracking-[0.12em] uppercase text-white">
            Aqua<span className="text-[#00B4D8]">holics</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ label, to }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-200 no-underline group py-2 ${
                  isActive ? "text-[#00B4D8]" : "text-slate-400 hover:text-white"
                }`}
              >
                {label}

                {isActive && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00B4D8]" />
                )}

                {/* Wave-shaped underline instead of a straight line.
                    Active: solid wave, always visible.
                    Hover: same wave fades/grows in. */}
                <svg
                  className={`absolute left-0 -bottom-1 w-full h-[6px] transition-all duration-300 ${
                    isActive
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100"
                  }`}
                  viewBox="0 0 40 6"
                  preserveAspectRatio="none"
                  style={{ transformOrigin: "left" }}
                >
                  <path
                    d="M0,3 Q5,0 10,3 T20,3 T30,3 T40,3"
                    fill="none"
                    stroke="#00B4D8"
                    strokeWidth="1.5"
                  />
                </svg>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {/* Get Demo — icon + idle pulse glow, not just hover */}
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center gap-1.5 bg-[#00B4D8] hover:bg-[#00F5FF] text-[#0A0F1E] font-bold text-xs tracking-[0.12em] uppercase px-5 py-2.5 rounded-lg transition-all duration-300 no-underline hover:scale-[1.02] active:scale-[0.98] animate-pulse-glow group"
          >
            Get Demo
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[#00B4D8]/20 text-slate-400 hover:text-white hover:border-[#00B4D8]/40 transition-all relative z-[110]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drop menu panel */}
      {menuOpen && (
        <div className="md:hidden fixed top-[72px] left-0 right-0 bottom-0 h-[calc(100vh-72px)] bg-[#0A0F1E] backdrop-blur-xl px-6 py-6 flex flex-col gap-2 overflow-y-auto z-[100]">
          {links.map(({ label, to }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`px-4 py-4 rounded-xl text-sm font-semibold tracking-[0.12em] uppercase transition-all no-underline ${
                  isActive
                    ? "text-[#00B4D8] bg-[#00B4D8]/10 border border-[#00B4D8]/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {label}
              </Link>
            );
          })}

          <Link
            to="/contact"
            className="mt-4 text-center bg-[#00B4D8] hover:bg-[#00F5FF] text-[#0A0F1E] font-bold text-xs tracking-[0.12em] uppercase px-5 py-4 rounded-xl transition-all no-underline shadow-lg shadow-[#00B4D8]/10"
          >
            Get Demo
          </Link>
        </div>
      )}

      <style>{`
        @keyframes ripple-once {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.8); }
        }
      `}</style>
    </nav>
  );
}