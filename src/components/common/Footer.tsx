import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import { getActiveContactInfo } from "../../api/contactApi";
import { DEFAULT_CONTACT_INFO } from "../../constants/contactFallback";
import type { ContactInfo } from "../../types/contact";

// Import your custom logo image
import companyLogo from "../../assets/companylogo.jpeg";

const companyLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Product", to: "/product" },
  { label: "Impact", to: "/impact" },
];

const resourceLinks = [
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

export default function Footer() {
  // Same fetch pattern as ContactPage: try the backend, fall back to
  // DEFAULT_CONTACT_INFO on error, so the footer always has something to
  // show rather than blank fields while loading or if the request fails.
  const [info, setInfo] = useState<ContactInfo>(DEFAULT_CONTACT_INFO);

  useEffect(() => {
    let cancelled = false;

    const fetchInfo = async () => {
      try {
        const data = await getActiveContactInfo();
        if (!cancelled) setInfo(data);
      } catch (err) {
        console.error("Footer: active contact info fetch failed, using fallback", err);
        if (!cancelled) setInfo(DEFAULT_CONTACT_INFO);
      }
    };

    fetchInfo();
    return () => {
      cancelled = true;
    };
  }, []);

  const socials = [
    { url: info.linkedin, label: "LinkedIn" },
    { url: info.twitter, label: "Twitter / X" },
    { url: info.instagram, label: "Instagram" },
    { url: info.youtube, label: "YouTube" },
  ].filter((s) => s.url);

  return (
    <footer className="w-full bg-[#060B16] border-t border-[#00B4D8]/10 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-3 mb-5 no-underline group w-fit"
            >
              <div className="w-9 h-9 rounded-xl bg-[#00B4D8] flex items-center justify-center group-hover:bg-[#00F5FF] transition-all duration-300 flex-shrink-0 overflow-hidden">
                <img 
                  src={companyLogo} 
                  alt="Aquaholics Logo" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="font-heading font-black text-lg tracking-[0.12em] uppercase text-white">
                Aqua<span className="text-[#00B4D8]">holics</span>
              </span>
            </Link>

            <p className="text-slate-500 text-sm leading-relaxed max-w-[220px] mb-6">
              Autonomous water surface cleaning robots for a cleaner, healthier planet.
            </p>

            <div className="space-y-2">
              {info.email && (
                <a
                  href={`mailto:${info.email}`}
                  className="flex items-center gap-2 text-slate-500 hover:text-[#00B4D8] text-xs no-underline transition-colors"
                >
                  <Mail size={13} className="text-[#00B4D8] flex-shrink-0" />
                  <span>{info.email}</span>
                </a>
              )}
              {info.address && (
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <MapPin size={13} className="text-[#00B4D8] flex-shrink-0" />
                  <span>{info.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-heading text-xs font-black text-[#00B4D8] tracking-[0.2em] uppercase mb-5">
              Company
            </h4>
            <ul className="space-y-3 list-none p-0 m-0">
              {companyLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-slate-500 hover:text-white text-sm transition-colors no-underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-heading text-xs font-black text-[#00B4D8] tracking-[0.2em] uppercase mb-5">
              Resources
            </h4>
            <ul className="space-y-3 list-none p-0 m-0">
              {resourceLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-slate-500 hover:text-white text-sm transition-colors no-underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column — now driven by backend social links instead
              of hardcoded "#" hrefs. A platform only shows up if the
              backend actually has a URL set for it. */}
          <div>
            <h4 className="font-heading text-xs font-black text-[#00B4D8] tracking-[0.2em] uppercase mb-5">
              Connect
            </h4>
            <div className="flex flex-col gap-3">
              {socials.length > 0 ? (
                socials.map(({ url, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-[#00B4D8] text-sm transition-colors no-underline"
                  >
                    {label}
                  </a>
                ))
              ) : (
                <span className="text-slate-600 text-sm">No links added yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#00B4D8]/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-slate-600 text-xs tracking-wide">
            © {new Date().getFullYear()} Aquaholics. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Built for cleaner waters 🌊
          </p>
        </div>

      </div>
    </footer>
  );
}