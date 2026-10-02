import { useState } from "react";
import { PageShell, Tag } from "../../components/robotx/ui";
import { BUILD_LOG, DECISIONS } from "../../data/robotxData";

export default function DesignDevelopment() {
  const posts = [...BUILD_LOG].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  const [selectedDecision, setSelectedDecision] = useState(0);

  return (
    <PageShell
      eyebrow="ENGINEERING JOURNEY"
      title="Design & Development"
      intro="From early design decisions to autonomous system integration — this is how we built the AQUAHOLICS RobotX platform."
    >
      {/* =========================================================
          ENGINEERING DECISIONS
      ========================================================= */}

      <section className="mb-20">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.25em] text-[#00B4D8]">
            01 / DESIGN THINKING
          </p>

          <h2 className="mt-2 font-heading text-3xl font-bold text-white">
            Engineering Decisions
          </h2>

          <p className="mt-3 max-w-2xl text-slate-400">
            Every major subsystem was selected by comparing the problem,
            available alternatives, implementation constraints, and expected
            mission requirements.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Decision selector */}
          <div className="space-y-3">
            {DECISIONS.map((decision, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedDecision(index)}
                className={`group w-full rounded-2xl border p-5 text-left transition-all duration-300 ${
                  selectedDecision === index
                    ? "border-[#00B4D8]/60 bg-[#00B4D8]/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      selectedDecision === index
                        ? "bg-[#00B4D8] text-slate-950"
                        : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className="font-heading font-bold text-white">
                      {decision.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                      {decision.problem}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected decision */}
          {DECISIONS[selectedDecision] && (
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-7 lg:p-9">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#00B4D8]/10 blur-3xl" />

              <div className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <Tag>ENGINEERING DECISION</Tag>

                  <span className="font-mono text-xs text-slate-500">
                    {String(selectedDecision + 1).padStart(2, "0")} /{" "}
                    {String(DECISIONS.length).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="font-heading text-2xl font-bold text-white lg:text-3xl">
                  {DECISIONS[selectedDecision].title}
                </h3>

                <div className="mt-8 space-y-6">
                  <DecisionItem
                    label="THE PROBLEM"
                    value={DECISIONS[selectedDecision].problem}
                  />

                  <DecisionItem
                    label="OPTIONS CONSIDERED"
                    value={DECISIONS[selectedDecision].options}
                  />

                  <DecisionItem
                    label="OUR DECISION"
                    value={DECISIONS[selectedDecision].decision}
                    highlight
                  />

                  <DecisionItem
                    label="WHY"
                    value={DECISIONS[selectedDecision].rationale}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          DEVELOPMENT JOURNEY
      ========================================================= */}

      <section className="mb-20">
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-[0.25em] text-[#00B4D8]">
            02 / BUILD HISTORY
          </p>

          <h2 className="mt-2 font-heading text-3xl font-bold text-white">
            Development Journey
          </h2>

          <p className="mt-3 max-w-2xl text-slate-400">
            A chronological record of the major milestones, iterations, and
            integration steps during development.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[11px] top-0 hidden h-full w-px bg-gradient-to-b from-[#00B4D8]/60 via-white/10 to-transparent md:block" />

          <div className="space-y-10">
            {posts.map((post, index) => (
              <article key={index} className="relative md:pl-12">
                {/* Timeline marker */}
                <div className="absolute left-0 top-1 hidden md:flex">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#00B4D8]/50 bg-slate-950">
                    <span className="h-2 w-2 rounded-full bg-[#00B4D8]" />
                  </span>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] lg:p-7">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <time
                        dateTime={post.date}
                        className="font-mono text-xs font-semibold tracking-wider text-[#00B4D8]"
                      >
                        {new Date(post.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>

                      <h3 className="mt-2 font-heading text-xl font-bold text-white lg:text-2xl">
                        {post.title}
                      </h3>
                    </div>

                    <span className="hidden font-mono text-xs text-slate-600 sm:block">
                      BUILD / {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="mt-4 max-w-3xl leading-relaxed text-slate-300">
                    {post.body}
                  </p>

                  {post.photo && (
                    <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                      <img
                        src={post.photo}
                        alt={post.title}
                        loading="lazy"
                        className="max-h-[420px] w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          CURRENT DEVELOPMENT STATUS
      ========================================================= */}

      <section className="mb-20">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.25em] text-[#00B4D8]">
            03 / CURRENT STATE
          </p>

          <h2 className="mt-2 font-heading text-3xl font-bold text-white">
            Where We Are Now
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatusCard
            number="01"
            title="DRAKEN Mark 1"
            text="Manual operation established; autonomous navigation under development."
          />

          <StatusCard
            number="02"
            title="REVELATION"
            text="Flight platform completed; autonomous flight testing in progress."
          />

          <StatusCard
            number="03"
            title="Autonomy"
            text="Vision-based perception and autonomous behaviors are being integrated."
          />

          <StatusCard
            number="04"
            title="Integration"
            text="USV–UAV communication and coordinated system testing are ongoing."
          />
        </div>
      </section>

      {/* =========================================================
          ENGINEERING PHILOSOPHY
      ========================================================= */}

      <section>
        <div className="relative overflow-hidden rounded-3xl border border-[#00B4D8]/20 bg-[#00B4D8]/[0.04] p-8 lg:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#00B4D8]/10 blur-3xl" />

          <div className="relative max-w-4xl">
            <p className="text-xs font-semibold tracking-[0.25em] text-[#00B4D8]">
              04 / OUR APPROACH
            </p>

            <h2 className="mt-3 font-heading text-3xl font-bold text-white lg:text-4xl">
              Build. Test. Learn. Integrate.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">
              We develop the system progressively — validating individual
              subsystems first, then combining them into increasingly complex
              autonomous behaviors. Each iteration is used to identify
              limitations, refine the design, and move closer to reliable
              multi-vehicle operation.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Tag>DESIGN</Tag>
              <span className="text-slate-600">→</span>
              <Tag>BUILD</Tag>
              <span className="text-slate-600">→</span>
              <Tag>TEST</Tag>
              <span className="text-slate-600">→</span>
              <Tag>ITERATE</Tag>
              <span className="text-slate-600">→</span>
              <Tag>INTEGRATE</Tag>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}


/* =========================================================
   SMALL COMPONENTS
========================================================= */

function DecisionItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-bold tracking-[0.2em] text-[#00B4D8]">
        {label}
      </p>

      <p
        className={
          highlight
            ? "leading-relaxed text-white"
            : "leading-relaxed text-slate-300"
        }
      >
        {value}
      </p>
    </div>
  );
}


function StatusCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#00B4D8]/30 hover:bg-white/[0.04]">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-[#00B4D8]">
          {number}
        </span>

        <span className="h-2 w-2 rounded-full bg-[#00B4D8]" />
      </div>

      <h3 className="mt-8 font-heading text-lg font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        {text}
      </p>
    </div>
  );
}