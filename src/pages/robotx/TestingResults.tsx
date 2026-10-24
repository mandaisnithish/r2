// src/pages/robotx/TestingResults.tsx
// Validation and evidence. Field hours are the team's confirmed totals;
// the test record stays empty until real tests are logged in TESTS —
// nothing here is invented.

import { FIELD_HOURS, TESTS, TEST_METHOD, TEST_VIDEO, VALIDATION } from "../../data/robotxData";
import { DossierHero, DossierSection } from "../../components/robotx/ui";
import StatPlate from "../../components/ui/StatPlate";
import EmptyState from "../../components/ui/EmptyState";
import HudPanel from "../../components/ui/HudPanel";
import SonarBadge, { type SonarStatus } from "../../components/ui/SonarBadge";
import VideoSlot from "../../components/ui/VideoSlot";
import RelayButton from "../../components/ui/RelayButton";
import { stencilDate } from "../../lib/format";

const fmt = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}${m ? `h ${m}m` : ""}` : `${m}m`;
};

export default function RobotXTesting() {
  const minutes = (type: string, fixed: number | null) =>
    fixed ?? TESTS.filter((t) => t.type === type).reduce((sum, t) => sum + t.minutes, 0);
  const rows = [...TESTS].sort((a, b) => b.date.localeCompare(a.date));
  const validation = Object.values(VALIDATION);

  return (
    <>
      <DossierHero
        code="RX-VAL"
        section="TESTING & RESULTS"
        title="Evidence, not adjectives."
        intro="Each capability is validated on its own, failure modes are recorded, and the test is repeated after the system changes — before we move to integrated scenarios."
      />

      <DossierSection index="RX-VAL-01" code="FIELD TIME" title="Hours on water and in the air." divider="left">
        <div className="grid gap-10 sm:grid-cols-3">
          {FIELD_HOURS.map((f, i) => {
            const m = minutes(f.type, f.minutes);
            return (
              <StatPlate
                key={f.type}
                code={`FT-0${i + 1} · ${f.label.toUpperCase()}`}
                value={m > 0 ? (m % 60 === 0 ? m / 60 : fmt(m)) : "—"}
                unit={m > 0 && m % 60 === 0 ? "hours" : undefined}
                label={m > 0 ? f.text : `${f.text} · not logged yet`}
                tone={i === 0 ? "hydro" : i === 1 ? "arc" : "bone"}
              />
            );
          })}
        </div>
      </DossierSection>

      <DossierSection index="RX-VAL-02" code="METHOD" title="How we test." lede={TEST_METHOD.text} divider="right">
        <ol className="grid border-l border-t border-line sm:grid-cols-4">
          {TEST_METHOD.loop.map((a, i) => (
            <li key={a} className="border-b border-r border-line p-5">
              <span className="font-mono text-[10px] text-arc">LOOP-0{i + 1}</span>
              <p className="mt-3 font-display text-xl font-semibold text-bone">{a}</p>
            </li>
          ))}
        </ol>
      </DossierSection>

      <DossierSection index="RX-VAL-03" code="TEST RECORD" title="Logged tests." divider="split">
        {rows.length === 0 ? (
          <EmptyState
            code="TESTS[] · 0 RECORDS"
            title="No test records published yet."
            action={<RelayButton to="/robotx/contact" variant="secondary">Ask the team</RelayButton>}
          >
            Dates, durations, locations and results are published here only after the team confirms them. Field hours above are the confirmed totals.
          </EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line-2">
                  {["Date", "Domain", "Location", "Duration", "Objective", "Result"].map((h) => (
                    <th key={h} className="stencil py-3 pr-4 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((t) => (
                  <tr key={t.date + t.objective} className="align-top">
                    <td className="py-4 pr-4 font-mono text-[12px] text-drift">{stencilDate(t.date)}</td>
                    <td className="py-4 pr-4 font-mono text-[12px] text-arc">{t.type}</td>
                    <td className="py-4 pr-4 text-[14px] text-fog">{t.location}</td>
                    <td className="py-4 pr-4 font-mono text-[12px] text-bone">{fmt(t.minutes)}</td>
                    <td className="py-4 pr-4 text-[14px] text-bone">{t.objective}</td>
                    <td className="py-4 text-[14px] text-fog">{t.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DossierSection>

      <DossierSection index="RX-VAL-04" code="FOOTAGE" title="On the water." divider="left">
        <VideoSlot slotId="RX_TEST_VIDEO" url={`https://youtu.be/${TEST_VIDEO.youtubeId}`} title={TEST_VIDEO.title} brief="Common test video (YouTube)." />
      </DossierSection>

      <DossierSection index="RX-VAL-05" code="VALIDATION" title="Where each capability stands." divider="right">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {validation.map((v) => (
            <HudPanel key={v.title} serial={v.title} status={v.status as SonarStatus} statusLabel={v.status}>
              <p className="text-[15px] leading-relaxed text-fog">{v.text}</p>
            </HudPanel>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-6">
          <SonarBadge status="validated" label="Validated" />
          <SonarBadge status="partial" label="Partially validated" />
          <SonarBadge status="ongoing" label="Testing ongoing" />
        </div>
      </DossierSection>
    </>
  );
}
