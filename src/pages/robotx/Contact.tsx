/* Author: Nithish Kaliannan Ananth */
// src/pages/robotx/Contact.tsx
// Comms for RobotX: copyable team email, who we want to hear from, and
// the channels to follow (from the CMS contact block).

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { CONTACT, EVENT, TEAM } from "../../data/robotxData";
import { DossierHero, DossierSection, SpecList } from "../../components/robotx/ui";
import HudPanel from "../../components/ui/HudPanel";
import RelayButton from "../../components/ui/RelayButton";
import { Icon } from "../../components/ui/Icon";
import { useContactInfo } from "../../lib/queries";

const AUDIENCES = ["Sponsors", "Competition organisers", "Mentors", "Fellow RobotX teams", "Press"];

export default function RobotXContact() {
  const { data: info } = useContactInfo();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${CONTACT.email}`;
    }
  };

  const socials = [
    { url: info.linkedin, icon: "linkedin", label: "LinkedIn" },
    { url: info.instagram, icon: "instagram", label: "Instagram" },
    { url: info.youtube, icon: "youtube", label: "YouTube" },
    { url: info.twitter, icon: "x", label: "X" },
  ].filter((s) => s.url);

  return (
    <>
      <DossierHero
        code="RX-COM"
        section="CONTACT"
        title="Open a channel."
        intro="Sponsors, organisers, mentors and fellow teams — we would love to hear from you. Email is the fastest way to get a reply."
      />

      <DossierSection index="RX-COM-01" code="DIRECT LINE" title="Reach the team." divider="left">
        <div className="grid gap-6 lg:grid-cols-12">
          <HudPanel tone="arc" serial="TEAM INBOX" status="live" statusLabel="Monitored" className="lg:col-span-7" bodyClassName="p-6 sm:p-8">
            <p className="stencil">Email</p>
            <p className="mt-2 break-all font-display text-2xl font-semibold text-bone sm:text-4xl">{CONTACT.email}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <RelayButton href={`mailto:${CONTACT.email}?subject=RobotX%202026`}>Write to us</RelayButton>
              <RelayButton
                variant="secondary"
                onClick={copy}
                arrow={false}
                leading={copied ? <Check size={14} className="text-hydro" /> : <Copy size={14} />}
              >
                {copied ? "Copied" : "Copy address"}
              </RelayButton>
            </div>
            <p className="sr-only" role="status" aria-live="polite">{copied ? "Email address copied to clipboard" : ""}</p>
          </HudPanel>
          <div className="lg:col-span-5">
            <SpecList rows={[
              { label: "Team", value: TEAM.name },
              { label: "Institution", value: CONTACT.institution },
              { label: "Location", value: CONTACT.location },
              { label: "Event", value: EVENT.name },
              { label: "Website", value: <a href={CONTACT.website} className="text-hydro hover:text-bone">{CONTACT.website.replace(/^https?:\/\//, "")}</a> },
            ]} />
          </div>
        </div>
      </DossierSection>

      <DossierSection index="RX-COM-02" code="AUDIENCE" title="Who we welcome messages from." divider="right">
        <ul className="flex flex-wrap gap-2">
          {AUDIENCES.map((a) => (
            <li key={a} className="border border-line-2 px-3 py-2 font-mono text-[12px] uppercase tracking-stencil text-bone">{a}</li>
          ))}
        </ul>
        {socials.length > 0 && (
          <div className="mt-12">
            <p className="stencil">Follow along · updates, build progress and team news</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/s inline-flex items-center gap-3 border border-line-2 px-4 py-3 text-sm text-fog transition-colors hover:border-arc/60 hover:text-bone"
                >
                  <Icon name={s.icon} size={16} />
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </DossierSection>
    </>
  );
}
