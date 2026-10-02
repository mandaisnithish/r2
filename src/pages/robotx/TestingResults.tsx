import { useState } from "react";
import { PageShell, Tag } from "../../components/robotx/ui";
import { TESTS } from "../../data/robotxData";

const fmt = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;

  if (h) {
    return `${h} h${m ? ` ${m} min` : ""}`;
  }

  return `${m} min`;
};

type Test = (typeof TESTS)[number];

export default function TestingResults() {
  const rows = [...TESTS].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  const total = (type: string) =>
    TESTS.filter((t) => t.type === type).reduce(
      (sum, t) => sum + t.minutes,
      0
    );

  const [selectedTest, setSelectedTest] = useState<Test | null>(
    rows[0] ?? null
  );

  return (
    <PageShell
      eyebrow="VALIDATION & EVIDENCE"
      title="Testing & Results"
      intro="We test progressively — from individual capabilities to integrated system behavior — using every iteration to identify limitations and improve the platform."
    >
      {/* =========================================================
          TESTING TIME
      ========================================================= */}

      <section className="mb-20">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.25em] text-[#00B4D8]">
            01 / FIELD TIME
          </p>

          <h2 className="mt-2 font-heading text-3xl font-bold text-white">
            Time in Testing
          </h2>

          <p className="mt-3 max-w-2xl text-slate-400">
            Our testing effort spans water operations, aerial operations,
            and simulation-based development.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <TimeCard
            label="Water"
            value={fmt(total("Water"))}
            description="USV testing"
          />

          <TimeCard
            label="Air"
            value={fmt(total("Air"))}
            description="UAV testing"
          />

          <TimeCard
            label="Simulation"
            value={fmt(total("Simulation"))}
            description="Virtual validation"
          />
        </div>
      </section>

      {/* =========================================================
          TESTING PIPELINE
      ========================================================= */}

      <section className="mb-20">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.25em] text-[#00B4D8]">
            02 / METHODOLOGY
          </p>

          <h2 className="mt-2 font-heading text-3xl font-bold text-white">
            How We Test
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-5">
          {[
            ["01", "Prepare"],
            ["02", "Execute"],
            ["03", "Observe"],
            ["04", "Improve"],
            ["05", "Retest"],
          ].map(([number, label], index) => (
            <div
              key={label}
              className="relative rounded-2xl border border-white/10 bg-white/[0.025] p-5"
            >
              <span className="font-mono text-xs text-[#00B4D8]">
                {number}
              </span>

              <h3 className="mt-5 font-heading font-bold text-white">
                {label}
              </h3>

              {index < 4 && (
                <span className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-slate-600 lg:block">
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-400">
          Each test is used to validate a specific capability, identify
          failure modes or limitations, modify the system, and repeat the
          test before moving toward more complex integrated scenarios.
        </p>
      </section>

      {/* =========================================================
          TEST RESULTS
      ========================================================= */}

      <section className="mb-20">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.25em] text-[#00B4D8]">
            03 / TEST RECORD
          </p>

          <h2 className="mt-2 font-heading text-3xl font-bold text-white">
            Test Results
          </h2>

          <p className="mt-3 max-w-2xl text-slate-400">
            Select a test to inspect its objective, environment, duration,
            and recorded outcome.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Test list */}
          <div className="space-y-3">
            {rows.map((test, index) => {
              const active =
                selectedTest?.date === test.date &&
                selectedTest?.objective === test.objective;

              return (
                <button
                  key={`${test.date}-${index}`}
                  type="button"
                  onClick={() => setSelectedTest(test)}
                  className={`w-full rounded-2xl border p-5 text-left transition-all duration-300 ${
                    active
                      ? "border-[#00B4D8]/60 bg-[#00B4D8]/10"
                      : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag>{test.type}</Tag>

                        <span className="font-mono text-xs text-slate-500">
                          {test.date}
                        </span>
                      </div>

                      <h3 className="mt-3 font-heading font-bold text-white">
                        {test.objective}
                      </h3>
                    </div>

                    <span className="font-mono text-xs text-slate-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm text-slate-400">
                    {test.result}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Selected test */}
          {selectedTest && (
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-7 lg:p-9">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#00B4D8]/10 blur-3xl" />

              <div className="relative">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Tag>{selectedTest.type}</Tag>

                  <span className="font-mono text-xs text-slate-500">
                    {selectedTest.date}
                  </span>
                </div>

                <h3 className="mt-6 font-heading text-2xl font-bold text-white lg:text-3xl">
                  {selectedTest.objective}
                </h3>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <InfoBlock
                    label="LOCATION"
                    value={selectedTest.location}
                  />

                  <InfoBlock
                    label="DURATION"
                    value={fmt(selectedTest.minutes)}
                  />
                </div>

                <div className="mt-8 border-t border-white/10 pt-7">
                  <p className="text-[11px] font-bold tracking-[0.2em] text-[#00B4D8]">
                    OBJECTIVE
                  </p>

                  <p className="mt-2 leading-relaxed text-slate-300">
                    {selectedTest.objective}
                  </p>
                </div>

                <div className="mt-7 border-t border-white/10 pt-7">
                  <p className="text-[11px] font-bold tracking-[0.2em] text-[#00B4D8]">
                    RESULT
                  </p>

                  <p className="mt-2 leading-relaxed text-slate-300">
                    {selectedTest.result}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          VALIDATION STATUS
      ========================================================= */}

      <section className="mb-20">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.25em] text-[#00B4D8]">
            04 / VALIDATION STATUS
          </p>

          <h2 className="mt-2 font-heading text-3xl font-bold text-white">
            Current Validation
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ValidationCard
            status="VALIDATED"
            title="AI Detection"
            text="Vision-based detection has been tested."
          />

          <ValidationCard
            status="VALIDATED"
            title="USV Manual Control"
            text="Manual water operation has been tested."
          />

          <ValidationCard
            status="PARTIAL"
            title="Autonomous Navigation"
            text="Autonomous navigation remains under continued validation."
          />

          <ValidationCard
            status="ONGOING"
            title="USV–UAV Integration"
            text="Inter-vehicle communication and coordinated operation are being tested."
          />
        </div>
      </section>

      {/* =========================================================
          CLOSING
      ========================================================= */}

      <section>
        <div className="relative overflow-hidden rounded-3xl border border-[#00B4D8]/20 bg-[#00B4D8]/[0.04] p-8 lg:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#00B4D8]/10 blur-3xl" />

          <div className="relative max-w-4xl">
            <p className="text-xs font-semibold tracking-[0.25em] text-[#00B4D8]">
              05 / ENGINEERING LOOP
            </p>

            <h2 className="mt-3 font-heading text-3xl font-bold text-white lg:text-4xl">
              Test results become the next design decision.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">
              Testing is not treated as the final step of development.
              Results from each iteration feed directly back into the
              mechanical, electrical, software, and autonomy development
              process.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}


/* =========================================================
   COMPONENTS
========================================================= */

function TimeCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#00B4D8]/30">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {label}
        </span>

        <span className="h-2 w-2 rounded-full bg-[#00B4D8]" />
      </div>

      <p className="mt-4 font-heading text-3xl font-extrabold text-[#00F5FF]">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}


function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold tracking-[0.2em] text-[#00B4D8]">
        {label}
      </p>

      <p className="mt-2 text-white">
        {value}
      </p>
    </div>
  );
}


function ValidationCard({
  status,
  title,
  text,
}: {
  status: "VALIDATED" | "PARTIAL" | "ONGOING";
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-bold tracking-[0.18em] text-[#00B4D8]">
          {status}
        </span>

        <span className="h-2 w-2 rounded-full bg-[#00B4D8]" />
      </div>

      <h3 className="mt-6 font-heading text-lg font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        {text}
      </p>
    </div>
  );
}