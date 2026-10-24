/* Author: Nithish Kaliannan Ananth */
// src/pages/admin/WebsiteContentPage.tsx
import { Routes, Route, Link } from "react-router-dom";
import { Home, Users, BarChart2, Box, Phone, ArrowRight, Globe } from "lucide-react";
import HomeAdmin from "./webcontent/HomeAdmin";
import ContactAdmin from "./webcontent/ContactAdmin";
import TimelineAdmin from "./webcontent/TimelineAdmin";
import AboutAdmin from "./webcontent/AboutAdmin";
import ProductAdmin from "./webcontent/ProductAdmin";

const ACCENT = "#00E5FF";

const SECTIONS = [
  {
    to: "home",
    label: "Home",
    desc: "Hero, problem, solution, CTA text & images + 3 pollution stat cards",
    icon: Home,
    color: "#00E5FF",
  },
  {
    to: "about",
    label: "About",
    desc: "Story, mission, vision, values, partners & team",
    icon: Users,
    color: "#00E5FF",
  },
  {
    to: "impact",
    label: "Impact",
    desc: "Timeline events, competition wins, publications",
    icon: BarChart2,
    color: "#FFB800",
  },
  {
    to: "product",
    label: "Product",
    desc: "Product info, images, features, specs, steps & use cases",
    icon: Box,
    color: "#00E5FF",
  },
  {
    to: "contact",
    label: "Contact",
    desc: "Contact info, address, social links & map",
    icon: Phone,
    color: "#00E5FF",
  },
];

function SectionGrid() {
  return (
    <div className="relative min-h-full overflow-hidden">
      {/* ambient glow — green-themed to match Website Content's sidebar accent */}
      <div className="pointer-events-none absolute -top-32 right-0 w-96 h-96 rounded-full bg-[#00E5FF]/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-[#00E5FF]/[0.04] blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3.5 mb-8">
        <div className="relative w-11 h-11 flex-shrink-0">
          <div className="absolute inset-0 rounded-sm bg-[#00E5FF]/30 blur-md" />
          <div
            className="relative w-11 h-11 rounded-sm flex items-center justify-center shadow-lg"
            style={{ backgroundColor: `${ACCENT}26`, color: ACCENT, border: `1px solid ${ACCENT}40` }}
          >
            <Globe size={19} />
          </div>
        </div>
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Website Content
          </h1>
          <p className="text-drift text-sm mt-0.5">
            Select a page to manage its content.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="relative z-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SECTIONS.map(({ to, label, desc, icon: Icon, color }) => (
          <Link
            key={to}
            to={to}
            className="group relative flex flex-col rounded-sm p-6 no-underline border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12]"
          >
            {/* per-card hover glow */}
            <div
              className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300"
              style={{ backgroundColor: `${color}33` }}
            />

            <div
              className="relative w-12 h-12 rounded-sm flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${color}1F`, boxShadow: `0 0 20px ${color}30` }}
            >
              <Icon size={20} style={{ color }} />
            </div>

            <h2 className="relative font-heading font-semibold text-white text-lg mb-2 flex items-center gap-2">
              {label}
              <ArrowRight
                size={15}
                className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                style={{ color }}
              />
            </h2>
            <p className="relative text-drift text-sm leading-relaxed">{desc}</p>

            {/* bottom accent line on hover */}
            <div
              className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300"
              style={{ backgroundColor: color }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function WebsiteContentPage() {
  return (
    <div className="p-8">
      <Routes>
        <Route index element={<SectionGrid />} />
        <Route path="home/*" element={<HomeAdmin />} />
        <Route path="about/*" element={<AboutAdmin />} />
        <Route path="impact" element={<TimelineAdmin />} />
        <Route path="product/*" element={<ProductAdmin />} />
        <Route path="contact" element={<ContactAdmin />} />
      </Routes>
    </div>
  );
}