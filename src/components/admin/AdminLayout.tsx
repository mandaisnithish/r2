// src/components/admin/AdminLayout.tsx
import { type ReactNode, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Globe,
  FileText,
  Mail,
  Activity,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/companylogo.jpeg";

interface Props {
  children: ReactNode;
}

const NAV_ITEMS = [
  {
    to: "/admin/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    desc: "Dashboard summary",
    end: true,
    color: "#00B4D8",
  },
  {
    to: "/admin/dashboard/content",
    label: "Website Content",
    icon: Globe,
    desc: "Edit text, images & stats",
    color: "#22C55E",
  },
  {
    to: "/admin/dashboard/blog",
    label: "Blog",
    icon: FileText,
    desc: "Write & manage posts",
    color: "#A855F7",
  },
  {
    to: "/admin/dashboard/messages",
    label: "Contact Messages",
    icon: Mail,
    desc: "Inbox from website",
    color: "#F59E0B",
  },
  {
    to: "/admin/dashboard/sensors",
    label: "River Monitoring",
    icon: Activity,
    desc: "Waste & water quality data",
    color: "#3B82F6",
  },
];

export default function AdminLayout({ children }: Props) {
  const { email, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const initial = email?.[0]?.toUpperCase() ?? "A";

  // close the mobile drawer automatically whenever the route changes
  // (e.g. tapping a nav link should close the menu, not leave it open)
  const closeOnNavigate = () => setMobileOpen(false);

  const activeItem = NAV_ITEMS.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
  );

  return (
    <div className="min-h-screen bg-[#070B14] flex">
      {/* Mobile top bar — only visible below md breakpoint */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between gap-3 px-4 py-3 bg-[#0B121F]/95 backdrop-blur-sm border-b border-white/[0.06]">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-slate-300 hover:bg-white/[0.06] transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          {activeItem && (
            <activeItem.icon size={16} style={{ color: activeItem.color }} />
          )}
          <span className="text-white text-sm font-semibold truncate">
            {activeItem?.label ?? "Dashboard"}
          </span>
        </div>
        <div className="w-9 h-9 flex-shrink-0" /> {/* spacer to keep title centered */}
      </div>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — fixed drawer on mobile (slides in), static column on md+ */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 flex-shrink-0 bg-gradient-to-b from-[#0B121F] to-[#080D17] border-r border-white/5 flex flex-col overflow-hidden transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* ambient glow blobs */}
        <div className="pointer-events-none absolute -top-24 -left-16 w-56 h-56 rounded-full bg-[#00B4D8]/[0.12] blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-12 w-48 h-48 rounded-full bg-[#A855F7]/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 w-40 h-40 rounded-full bg-[#22C55E]/[0.06] blur-3xl" />

        {/* Logo row + mobile close button */}
        <div className="relative z-10 px-6 pt-7 pb-6 flex items-center justify-between gap-3.5">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative w-11 h-11 flex-shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-[#00B4D8]/30 blur-md" />
              <div className="relative w-11 h-11 rounded-2xl bg-[#0E2233] ring-1 ring-[#00B4D8]/30 shadow-lg flex items-center justify-center p-1.5">
                <img
                  src={logo}
                  alt="Aquaholics logo"
                  className="w-full h-full object-contain rounded-md"
                />
              </div>
            </div>
            <div className="min-w-0">
              <div className="font-heading font-bold text-white text-base leading-tight tracking-wide">
                AQUA<span className="text-[#00B4D8]">HOLICS</span>
              </div>
              <div className="text-slate-500 text-[10px] font-medium tracking-[0.15em]">
                ADMIN PANEL
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors flex-shrink-0"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative z-10 mx-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Nav */}
        <nav className="relative z-10 flex-1 px-4 pt-6 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, desc, end, color }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeOnNavigate}
              className={({ isActive }) =>
                `group relative flex items-center gap-3.5 pl-4 pr-3 py-3 rounded-xl text-sm no-underline transition-all duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-slate-300 hover:bg-white/[0.05] hover:text-white hover:translate-x-0.5"
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${color}1F, ${color}08)`,
                      boxShadow: `0 0 0 1px ${color}33, 0 8px 20px -8px ${color}55`,
                    }
                  : undefined
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full"
                      style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                    />
                  )}
                  <span
                    className="relative flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                    style={
                      isActive
                        ? { backgroundColor: `${color}26`, color, boxShadow: `0 0 14px ${color}40` }
                        : { backgroundColor: "rgba(255,255,255,0.06)", color: "#94A3B8" }
                    }
                  >
                    <Icon size={16} className="group-hover:scale-110 transition-transform duration-200" />
                  </span>
                  <div className="min-w-0">
                    <div className={`font-semibold leading-tight ${isActive ? "text-white" : "text-slate-200"}`}>
                      {label}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{desc}</div>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="relative z-10 mt-auto">
          <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="px-5 py-5">
            <div className="flex items-center gap-2.5 mb-3 px-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00B4D8] to-[#0077B6] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-[0_0_10px_rgba(0,180,216,0.4)]">
                {initial}
              </div>
              <div className="text-slate-400 text-xs truncate">{email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] text-sm font-medium transition-colors border border-white/5"
            >
              <LogOut size={15} /> Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content — top padding on mobile to clear the fixed top bar */}
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">{children}</main>
    </div>
  );
}