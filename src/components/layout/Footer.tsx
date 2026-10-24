// src/components/layout/Footer.tsx
// The "telemetry core" at the bottom of every dive: contact details from
// the CMS, navigation, socials, coordinates and the CMS link state.

import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";
import Wordmark from "./Wordmark";
import LinkStatus from "./LinkStatus";
import { useContactInfo } from "../../lib/queries";
import { NAV_LINKS } from "./navLinks";

const ROBOTX = [
  { label: "Overview", to: "/robotx" },
  { label: "System & vehicles", to: "/robotx/system-vehicles" },
  { label: "Testing & results", to: "/robotx/testing" },
  { label: "Team", to: "/robotx/team" },
];

export default function Footer() {
  const { data: info } = useContactInfo();
  const socials = [
    { url: info.linkedin, label: "LinkedIn", icon: "linkedin" },
    { url: info.instagram, label: "Instagram", icon: "instagram" },
    { url: info.twitter, label: "X", icon: "x" },
    { url: info.youtube, label: "YouTube", icon: "youtube" },
  ].filter((s) => s.url);

  return (
    <footer className="relative z-10 mt-24 border-t border-line bg-abyss/90 backdrop-blur-sm">
      <div className="grid-wrap py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))]">
          <div>
            <Wordmark />
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-fog">
              Autonomous robots that clean rivers and lakes. Designed, wired and tested in Chennai.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {info.email && (
                <li>
                  <a href={`mailto:${info.email}`} className="text-bone transition-colors hover:text-hydro">{info.email}</a>
                </li>
              )}
              {info.phone && (
                <li>
                  <a href={`tel:+91${info.phone.replace(/\D/g, "").slice(-10)}`} className="font-mono text-fog tabular transition-colors hover:text-hydro">
                    +91 {info.phone.replace(/\D/g, "").slice(-10).replace(/(\d{5})(\d{5})/, "$1 $2")}
                  </a>
                </li>
              )}
              {info.address && <li className="max-w-xs text-[13px] leading-relaxed text-drift">{info.address}</li>}
            </ul>
          </div>

          <FooterCol title="Navigate" links={NAV_LINKS.map(({ label, to }) => ({ label, to }))} />
          <FooterCol title="RobotX 2026" links={ROBOTX} />

          <div>
            <p className="stencil">Signal</p>
            <ul className="mt-4 space-y-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/s inline-flex items-center gap-3 text-sm text-fog transition-colors hover:text-bone"
                  >
                    <span className="grid h-8 w-8 place-items-center border border-line text-drift transition-colors group-hover/s:border-hydro/60 group-hover/s:text-hydro">
                      <Icon name={s.icon} size={15} />
                    </span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="stencil">© {new Date().getFullYear()} Aquaholics Pvt Ltd · R.M.K Engineering College</span>
          <span className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="stencil tabular">13.1216° N · 80.1378° E</span>
            <LinkStatus />
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <p className="stencil">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-fog transition-colors hover:text-bone">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
