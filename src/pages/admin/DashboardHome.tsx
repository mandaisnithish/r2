// src/pages/admin/DashboardHome.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe,
  FileText,
  Mail,
  Activity,
  ArrowRight,
  Sparkles,
  Waves,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAllBlogsForAdmin } from "../../api/admin/blogAdminApi";
import { getAllMessages } from "../../api/admin/contactMessageAdminApi";

const CARDS = [
  {
    to: "/admin/dashboard/content",
    title: "Website Content",
    desc: "Edit the text, images, and stats shown across your website's pages.",
    icon: Globe,
    color: "#22C55E",
  },
  {
    to: "/admin/dashboard/blog",
    title: "Blog",
    desc: "Write new posts, edit drafts, publish or unpublish.",
    icon: FileText,
    color: "#A855F7",
  },
  {
    to: "/admin/dashboard/messages",
    title: "Contact Messages",
    desc: "View messages submitted through the contact form.",
    icon: Mail,
    color: "#F59E0B",
  },
  {
    to: "/admin/dashboard/sensors",
    title: "River Monitoring",
    desc: "Waste collected and water quality readings from the field.",
    icon: Activity,
    color: "#3B82F6",
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHome() {
  const { email } = useAuth();
  const name = email?.split("@")[0] ?? "there";
  const greeting = getGreeting();

  // Real counts, pulled live from the same APIs the Blog and
  // Contact Messages pages already use — no hardcoded numbers.
  const [blogCount, setBlogCount] = useState<number | null>(null);
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadStats = async () => {
      try {
        const [blogs, messages] = await Promise.all([
          getAllBlogsForAdmin(),
          getAllMessages(),
        ]);
        if (cancelled) return;
        setBlogCount(blogs.filter((b) => b.published).length);
        setUnreadCount(messages.filter((m) => !m.isRead).length);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
        if (!cancelled) setStatsError(true);
      }
    };

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  // While loading, show a quiet placeholder instead of a fake number
  const blogValue = blogCount === null ? "—" : String(blogCount);
  const unreadValue = unreadCount === null ? "—" : String(unreadCount);

  const STATS = [
    { label: "Blogs published", value: blogValue, icon: FileText, color: "#A855F7" },
    { label: "Unread messages", value: unreadValue, icon: Mail, color: "#F59E0B" },
  ];

  return (
    <div className="relative min-h-full p-8 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 right-0 w-[28rem] h-[28rem] rounded-full bg-[#00B4D8]/[0.18] blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-[#A855F7]/[0.10] blur-3xl" />

      {/* Hero banner */}
      <div className="relative z-10 mb-10 rounded-[28px] overflow-hidden border border-white/[0.08] bg-gradient-to-br from-[#0F2A40] via-[#0C1E2F] to-[#080D17] px-9 py-12 sm:px-12 sm:py-14 shadow-[0_20px_60px_-20px_rgba(0,180,216,0.25)]">
        <Waves className="pointer-events-none absolute -bottom-10 right-10 w-44 h-44 text-[#00B4D8]/[0.08]" />
        <Waves className="pointer-events-none absolute top-6 right-44 w-20 h-20 text-[#00B4D8]/[0.06] rotate-12" />

        <div className="relative inline-flex items-center gap-2 text-[#00B4D8] text-xs font-bold tracking-[0.15em] mb-5 px-3 py-1.5 rounded-full bg-[#00B4D8]/10 border border-[#00B4D8]/20">
          <Sparkles size={13} />
          <span>{greeting.toUpperCase()}</span>
        </div>

        <h1 className="relative font-heading font-bold text-4xl sm:text-5xl text-white mb-3 tracking-tight leading-[1.1]">
          Welcome to the{" "}
          <span className="text-[#00B4D8]">Aquaholics</span> Admin Portal
        </h1>
        <p className="relative text-slate-400 text-base max-w-xl mb-9">
          Hey {name}, here's a quick look at what's happening across your
          site, blog, and field data today.
        </p>

        {statsError && (
          <p className="relative text-red-400 text-xs mb-3">
            Couldn't load live stats — showing partial data.
          </p>
        )}

        <div className="relative flex flex-wrap gap-4">
          {STATS.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="flex items-center gap-3.5 px-5 py-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}1F`, color, boxShadow: `0 0 16px ${color}30` }}
              >
                <Icon size={17} />
              </div>
              <div>
                <div className="text-white font-bold text-xl leading-none">
                  {value}
                </div>
                <div className="text-slate-500 text-xs mt-1">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mb-4 px-1">
        <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Manage your sections
        </h2>
      </div>

      <div className="relative z-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CARDS.map(({ to, title, desc, icon: Icon, color }) => (
          <Link
            key={to}
            to={to}
            className="group relative flex flex-col rounded-2xl p-6 no-underline border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12]"
          >
            <div
              className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300"
              style={{ backgroundColor: `${color}33` }}
            />
            <div
              className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${color}1F`, boxShadow: `0 0 20px ${color}30` }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <h3 className="relative font-heading font-semibold text-white text-lg mb-2 flex items-center gap-2">
              {title}
              <ArrowRight
                size={15}
                className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                style={{ color }}
              />
            </h3>
            <p className="relative text-slate-500 text-sm leading-relaxed">{desc}</p>
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