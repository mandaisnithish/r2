// src/pages/admin/webcontent/AboutAdmin.tsx
import { NavLink, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import AboutContentAdmin from "./about/AboutContentAdmin";
import ValuesAdmin from "./about/ValuesAdmin";
import MembersAdmin from "./about/MembersAdmin";
import PartnersAdmin from "./about/PartnersAdmin";

const ACCENT = "#00E5FF";

const TABS = [
  { to: "/admin/dashboard/content/about/content", label: "About Content" },
  { to: "/admin/dashboard/content/about/values", label: "Values" },
  { to: "/admin/dashboard/content/about/members", label: "Team" },
  { to: "/admin/dashboard/content/about/partners", label: "Partners" },
];

export default function AboutAdmin() {
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => navigate("/admin/dashboard/content")}
        className="inline-flex items-center gap-1.5 text-drift hover:text-bone text-sm mb-6 transition-colors group"
      >
        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
        Website Content
      </button>

      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${ACCENT}1F`, border: `1px solid ${ACCENT}40`, color: ACCENT }}
        >
          <Users size={16} />
        </div>
        <h1 className="font-heading font-bold text-2xl text-white tracking-tight">About</h1>
      </div>
      <p className="text-drift text-sm mb-7 ml-12">
        Story, mission, values, team roster and partners for the About page.
      </p>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/[0.07] mb-8 overflow-x-auto">
        {TABS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors no-underline border-b-2 -mb-px ${
                isActive ? "text-white" : "text-drift border-transparent hover:text-bone/90"
              }`
            }
            style={({ isActive }) => ({
              borderColor: isActive ? ACCENT : "transparent",
              color: isActive ? ACCENT : undefined,
            })}
          >
            {label}
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route index element={<Navigate to="content" replace />} />
        <Route path="content" element={<AboutContentAdmin />} />
        <Route path="values" element={<ValuesAdmin />} />
        <Route path="members" element={<MembersAdmin />} />
        <Route path="partners" element={<PartnersAdmin />} />
      </Routes>
    </div>
  );
}