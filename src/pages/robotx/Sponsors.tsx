/* Author: Nithish Kaliannan Ananth */
// src/pages/robotx/Sponsors.tsx
// Confirmed sponsors only (SPONSORS in robotxData). Until there are some,
// the page explains how to back the team instead of showing logos we
// don't have.

import { SPONSORS, TEAM } from "../../data/robotxData";
import { DossierHero, DossierSection } from "../../components/robotx/ui";
import EmptyState from "../../components/ui/EmptyState";
import RelayButton from "../../components/ui/RelayButton";
import BlueprintCard from "../../components/ui/BlueprintCard";
import { cdn, initials } from "../../lib/format";

const WAYS = [
  { title: "Hardware & components", text: "Thrusters, sensors, batteries, compute and fabrication materials for DRAKEN Mark 1 and REVELATION." },
  { title: "Travel to Singapore", text: "Getting the team and both vehicles to Marina Bay for the competition week." },
  { title: "Test access", text: "Water bodies, pools or airspace where we can run longer, safer field tests." },
  { title: "Mentorship", text: "Marine robotics, autonomy and UAV engineers willing to review our designs." },
];

export default function RobotXSponsors() {
  return (
    <>
      <DossierHero
        code="RX-SPN"
        section="SPONSORS"
        title="The organisations that back us."
        intro="Our work is possible because of the organisations that back us."
      />

      <DossierSection index="RX-SPN-01" code="PARTNERS" title="Sponsors." divider="left">
        {SPONSORS.length === 0 ? (
          <EmptyState
            code="SPONSORS[] · 0 CONFIRMED"
            title="Sponsor list coming soon."
            action={<RelayButton href={`mailto:${TEAM.email}?subject=RobotX%202026%20sponsorship`}>Back the team</RelayButton>}
          >
            Only confirmed sponsors are listed here. If your organisation would like to support the team at RobotX 2026, we’d love to talk.
          </EmptyState>
        ) : (
          <ul className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-4">
            {SPONSORS.map((s) => (
              <li key={s.name} className="border-b border-r border-line">
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex h-full flex-col gap-3 p-5 transition-colors hover:bg-hull/70">
                  {s.logo ? (
                    <img src={cdn(s.logo, 320)} alt={s.name} loading="lazy" className="h-12 w-auto self-start object-contain" />
                  ) : (
                    <span className="grid h-12 w-12 place-items-center border border-line-2 font-display text-bone">{initials(s.name)}</span>
                  )}
                  <span className="text-bone">{s.name}</span>
                  {s.tier && <span className="stencil text-arc">{s.tier}</span>}
                  {s.description && <span className="text-[13px] text-fog">{s.description}</span>}
                </a>
              </li>
            ))}
          </ul>
        )}
      </DossierSection>

      <DossierSection index="RX-SPN-02" code="HOW TO HELP" title="Ways to back the team." divider="right">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {WAYS.map((w, i) => (
            <BlueprintCard key={w.title} index={`SUP-0${i + 1}`} title={w.title}>{w.text}</BlueprintCard>
          ))}
        </div>
      </DossierSection>
    </>
  );
}
