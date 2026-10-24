/* Author: Nithish Kaliannan Ananth */
// src/pages/admin/webcontent/HomeAdmin.tsx
import { NavLink, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, BarChart3 } from "lucide-react";
import HomeContentAdmin from "../../../components/admin/webcontent/HomeContentAdmin";
import HomeStatsAdmin from "../../../components/admin/webcontent/HomeStatsAdmin";

const ACCENT = "#00E5FF";

const TABS = [
  { to: "/admin/dashboard/content/home/content", key: "content", label: "Home Content", icon: FileText },
  { to: "/admin/dashboard/content/home/stats", key: "stats", label: "Home Stats", icon: BarChart3 },
];

export default function HomeAdmin() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeKey = pathname.includes("/stats") ? "stats" : "content";

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
          <FileText size={16} />
        </div>
        <h1 className="font-heading font-bold text-2xl text-white tracking-tight">Home</h1>
      </div>
      <p className="text-drift text-sm mb-7 ml-12">
        Text, images and pollution stat cards for the Home page.
      </p>

      {/* Tabs — shared underline glides between them */}
      <div className="relative flex gap-1 border-b border-white/[0.07] mb-8">
        {TABS.map(({ to, key, label, icon: Icon }) => {
          const isActive = activeKey === key;
          return (
            <NavLink
              key={key}
              to={to}
              className="relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors no-underline flex items-center gap-2"
              style={{ color: isActive ? "#fff" : "#64748B" }}
            >
              <Icon size={14} />
              {label}
              {isActive && (
                <motion.div
                  layoutId="home-admin-tab-underline"
                  className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full"
                  style={{ backgroundColor: ACCENT, boxShadow: `0 0 8px ${ACCENT}90` }}
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </NavLink>
          );
        })}
      </div>

      <Routes>
        <Route index element={<Navigate to="content" replace />} />
        <Route path="content" element={<HomeContentAdmin />} />
        <Route path="stats" element={<HomeStatsAdmin />} />
      </Routes>
    </div>
  );
}