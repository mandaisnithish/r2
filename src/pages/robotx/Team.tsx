// src/pages/robotx/Team.tsx
// RobotX crew manifest: the group photo, the roster by discipline, the
// faculty mentor. Portrait slots are placeholders until photos arrive.

import { ADVISOR, MEMBERS, TEAM, TEAM_SUMMARY, type Member } from "../../data/robotxData";
import { DossierHero, DossierSection } from "../../components/robotx/ui";
import MediaSlot from "../../components/ui/MediaSlot";
import HudPanel from "../../components/ui/HudPanel";
import Reveal from "../../components/ui/Reveal";
import { initials } from "../../lib/format";
import groupPhoto from "../../assets/robotx/groupphoto.jpeg";

export default function RobotXTeam() {
  return (
    <>
      <DossierHero
        code="RX-CREW"
        section="TEAM"
        title={`Meet ${TEAM.name}.`}
        intro={TEAM_SUMMARY.story}
        readouts={[
          { label: "Students", value: TEAM_SUMMARY.studentCount },
          { label: "Faculty", value: TEAM_SUMMARY.facultyCount },
          { label: "Institution", value: TEAM.institution },
          { label: "Base", value: TEAM.location },
        ]}
      />

      <section className="pb-6">
        <div className="grid-wrap">
          <MediaSlot
            slotId="RX_TEAM_GROUP"
            src={groupPhoto}
            alt="The Aquaholics RobotX 2026 team in the lab with their vehicles"
            aspect="21:9"
            focus="50% 35%"
            priority
            brief="Full-team photo with DRAKEN Mark 1 and REVELATION."
            caption={`${TEAM.name} · ${TEAM.institution}`}
            tone="arc"
          />
        </div>
      </section>

      <DossierSection
        index="RX-CREW-01"
        code="ROSTER"
        title="Student team."
        lede="Hardware, software, CAD, communication, USV, UAV and management."
        divider="left"
        aside={
          <ul className="flex flex-wrap gap-1.5 lg:justify-end">
            {TEAM_SUMMARY.disciplines.map((d) => (
              <li key={d} className="border border-line-2 px-2 py-1 font-mono text-[10px] uppercase tracking-stencil text-fog">{d}</li>
            ))}
          </ul>
        }
      >
        <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {MEMBERS.map((m, i) => (
            <Reveal as="li" key={m.name} delay={(i % 5) * 0.05} className={i % 5 === 1 || i % 5 === 3 ? "lg:mt-10" : ""}>
              <Crew member={m} index={i} />
            </Reveal>
          ))}
        </ul>
      </DossierSection>

      <DossierSection index="RX-CREW-02" code="MENTOR" title="Faculty guidance." divider="right">
        <HudPanel tone="arc" serial="FACULTY MENTOR" className="max-w-2xl" bodyClassName="p-6 sm:p-8">
          <div className="flex items-start gap-6">
            <span className="grid h-20 w-20 shrink-0 place-items-center border border-arc/50 font-display text-2xl text-arc">{initials(ADVISOR.name)}</span>
            <div>
              <h3 className="font-display text-2xl font-semibold text-bone">{ADVISOR.name}</h3>
              <p className="stencil mt-1">{ADVISOR.role}</p>
              {ADVISOR.bio && <p className="mt-4 text-[15px] leading-relaxed text-fog">{ADVISOR.bio}</p>}
            </div>
          </div>
        </HudPanel>
      </DossierSection>
    </>
  );
}

function Crew({ member: m, index }: { member: Member; index: number }) {
  return (
    <article>
      <MediaSlot
        slotId={`RX_CREW_${String(index + 1).padStart(2, "0")}`}
        src={m.photo || undefined}
        alt={`Portrait of ${m.name}`}
        aspect="4:5"
        width={600}
        brief={`Head-and-shoulders portrait of ${m.name}, plain background.`}
      />
      <h3 className="mt-4 font-display text-lg font-semibold leading-tight text-bone">{m.name}</h3>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-stencil text-arc">{m.role}</p>
      {m.bio && <p className="mt-2 text-[13px] leading-relaxed text-fog">{m.bio}</p>}
    </article>
  );
}
