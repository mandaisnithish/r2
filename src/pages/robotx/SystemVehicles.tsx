import { useState } from "react";
import { Card, PageShell, Tag } from "../../components/robotx/ui";
import { VEHICLES } from "../../data/robotxData";
import type { Vehicle } from "../../data/robotxData";


// ═════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════

type VehicleCardProps = {
  vehicle: Vehicle;
  number: string;
  selected: boolean;
  onClick: () => void;
};

type DomainBadgeProps = {
  domain: Vehicle["domain"];
};

type VehicleDetailProps = {
  vehicle: Vehicle;
  onClose: () => void;
};

type VehiclePlaceholderProps = {
  vehicle: Vehicle;
};

type SystemNodeProps = {
  title: string;
  text: string;
};

type FlowArrowProps = {
  direction?: "horizontal" | "vertical";
};


// ═════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════

export default function SystemVehicles() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
    null
  );

  return (
    <PageShell
      eyebrow="The platforms"
      title="System & Vehicles"
      intro="Two autonomous platforms. One coordinated mission."
    >
      {/* ══════════════════════════════════════════════════════
          VEHICLE SELECTOR
      ══════════════════════════════════════════════════════ */}

      <section
        aria-labelledby="vehicles-heading"
        className="mb-16"
      >
        <div className="mb-7">
          <p
            id="vehicles-heading"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00B4D8]"
          >
            Autonomous platforms
          </p>

          <h2 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
            Built for different domains.
          </h2>

          <p className="mt-3 max-w-2xl text-slate-400">
            DRAKEN Mark 1 operates on the water while REVELATION provides an
            aerial perspective. Their capabilities are being integrated into
            one coordinated autonomous system.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {VEHICLES.map((vehicle: Vehicle, index: number) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              number={String(index + 1).padStart(2, "0")}
              selected={selectedVehicle?.id === vehicle.id}
              onClick={() => setSelectedVehicle(vehicle)}
            />
          ))}
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          SELECTED VEHICLE DETAIL
      ══════════════════════════════════════════════════════ */}

      {selectedVehicle && (
        <VehicleDetail
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}


      {/* ══════════════════════════════════════════════════════
          SYSTEM OF SYSTEMS
      ══════════════════════════════════════════════════════ */}

      <section
        aria-labelledby="sos-heading"
        className="mt-20"
      >
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00B4D8]">
            System architecture
          </p>

          <h2
            id="sos-heading"
            className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl"
          >
            One system. Multiple platforms.
          </h2>

          <p className="mt-3 max-w-3xl text-slate-400">
            The vehicles retain their own onboard control and safety systems
            while exchanging mission and telemetry information as part of the
            larger System of Systems.
          </p>
        </div>

        <SystemArchitecture />
      </section>


      {/* ══════════════════════════════════════════════════════
          ENGINEERING LAYERS
      ══════════════════════════════════════════════════════ */}

      <section className="mt-20">
        <div className="grid gap-6 md:grid-cols-3">
          <ArchitectureCard
            number="01"
            title="Air Domain"
            text="REVELATION provides aerial observation, onboard computing, GPS navigation and mission support."
          />

          <ArchitectureCard
            number="02"
            title="Surface Domain"
            text="DRAKEN Mark 1 performs surface navigation, perception, obstacle handling and mission execution."
          />

          <ArchitectureCard
            number="03"
            title="Mission Layer"
            text="OCS and the onboard autonomy systems coordinate vehicle behavior, commands, reporting and safety fallbacks."
          />
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          DESIGN PRINCIPLE
      ══════════════════════════════════════════════════════ */}

      <section className="mt-20">
        <Card>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00B4D8]">
                Engineering principle
              </p>

              <h2 className="mt-3 font-heading text-3xl font-bold text-white">
                Independent when needed.
                <br />
                Coordinated when it matters.
              </h2>
            </div>

            <p className="text-base leading-8 text-slate-300">
              Each vehicle maintains its own control, perception and safety
              mechanisms. Cross-domain communication then allows information
              from one platform to support decisions and actions on another
              platform. This approach allows the system to remain functional
              even when a communication or autonomy subsystem requires a
              fallback.
            </p>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}


// ═════════════════════════════════════════════════════════════
// VEHICLE CARD
// ═════════════════════════════════════════════════════════════

function VehicleCard({
  vehicle,
  number,
  selected,
  onClick,
}: VehicleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="group w-full text-left"
    >
      <div
        className={[
          "overflow-hidden rounded-3xl border bg-white/[0.025] transition-all duration-300",
          selected
            ? "border-[#00B4D8]/60 bg-[#00B4D8]/[0.04]"
            : "border-white/10 hover:border-[#00B4D8]/40 hover:bg-white/[0.04]",
        ].join(" ")}
      >
        {/* Image / visual area */}
        <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10 bg-slate-950">
          {vehicle.photo ? (
            <img
              src={vehicle.photo}
              alt={vehicle.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <VehiclePlaceholder vehicle={vehicle} />
          )}

          <div className="absolute left-5 top-5">
            <DomainBadge domain={vehicle.domain} />
          </div>

          <div className="absolute right-5 top-5">
            <span className="font-mono text-xs tracking-[0.2em] text-white/50">
              {number}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00B4D8]">
                {vehicle.tagline}
              </p>

              <h3 className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
                {vehicle.name}
              </h3>
            </div>

            <span className="mt-1 text-xl text-white/30 transition-colors group-hover:text-[#00B4D8]">
              →
            </span>
          </div>

          <p className="mt-4 leading-7 text-slate-400">
            {vehicle.summary}
          </p>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
            <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
              {vehicle.status}
            </span>

            <span className="text-sm font-semibold text-[#00B4D8]">
              Explore
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}


// ═════════════════════════════════════════════════════════════
// DOMAIN BADGE
// ═════════════════════════════════════════════════════════════

function DomainBadge({ domain }: DomainBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs font-bold tracking-[0.16em] text-white backdrop-blur-md">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-[#00B4D8]"
      />

      {domain}
    </span>
  );
}


// ═════════════════════════════════════════════════════════════
// VEHICLE PLACEHOLDER
// ═════════════════════════════════════════════════════════════

function VehiclePlaceholder({ vehicle }: VehiclePlaceholderProps) {
  const isUSV = vehicle.domain === "USV";

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-[#061B2B]">
      {/* Grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      {/* Glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00B4D8]/10 blur-3xl"
      />

      {/* Vehicle silhouette */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isUSV ? (
          <div className="relative h-24 w-64 rounded-[45%] border border-[#00B4D8]/50 bg-[#00B4D8]/10 shadow-[0_0_60px_rgba(0,180,216,0.12)]">
            <div className="absolute left-1/2 top-1/2 h-12 w-24 -translate-x-1/2 -translate-y-1/2 rounded-md border border-white/20 bg-white/[0.04]" />

            <div className="absolute -bottom-4 left-8 h-8 w-8 rounded-full border border-white/15 bg-slate-950" />

            <div className="absolute -bottom-4 right-8 h-8 w-8 rounded-full border border-white/15 bg-slate-950" />
          </div>
        ) : (
          <div className="relative h-36 w-36">
            <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00B4D8]/60 bg-[#00B4D8]/10" />

            <div className="absolute left-1/2 top-0 h-14 w-1 -translate-x-1/2 rounded-full bg-white/20" />

            <div className="absolute bottom-0 left-1/2 h-14 w-1 -translate-x-1/2 rounded-full bg-white/20" />

            <div className="absolute left-0 top-1/2 h-1 w-14 -translate-y-1/2 rounded-full bg-white/20" />

            <div className="absolute right-0 top-1/2 h-1 w-14 -translate-y-1/2 rounded-full bg-white/20" />
          </div>
        )}
      </div>

      <div className="absolute bottom-5 left-5">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
          {vehicle.domain} / AQUAHOLICS
        </span>
      </div>
    </div>
  );
}


// ═════════════════════════════════════════════════════════════
// VEHICLE DETAIL
// ═════════════════════════════════════════════════════════════

function VehicleDetail({
  vehicle,
  onClose,
}: VehicleDetailProps) {
  return (
    <section
      aria-labelledby="vehicle-detail-heading"
      className="mb-20 scroll-mt-24"
    >
      <div className="overflow-hidden rounded-3xl border border-[#00B4D8]/20 bg-[#00B4D8]/[0.025]">
        {/* Header */}
        <div className="flex flex-col gap-5 border-b border-white/10 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <DomainBadge domain={vehicle.domain} />

              <span className="text-xs uppercase tracking-[0.15em] text-slate-500">
                Detailed platform view
              </span>
            </div>

            <h2
              id="vehicle-detail-heading"
              className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl"
            >
              {vehicle.name}
            </h2>

            <p className="mt-2 text-slate-400">
              {vehicle.tagline}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="self-start rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-white/25 hover:text-white sm:self-auto"
          >
            Close ×
          </button>
        </div>


        {/* Main details */}
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Systems */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00B4D8]">
              Platform systems
            </p>

            <div className="mt-5 space-y-3">
              {vehicle.systems.map(
                (system: Vehicle["systems"][number]) => (
                  <div
                    key={system.title}
                    className="rounded-2xl border border-white/10 bg-black/10 p-4"
                  >
                    <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
                      {system.title}
                    </h3>

                    <ul className="mt-3 space-y-2">
                      {system.items.map((item: string) => (
                        <li
                          key={item}
                          className="flex gap-2 text-sm leading-6 text-slate-400"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00B4D8]"
                          />

                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          </div>


          {/* Specifications */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00B4D8]">
              Specifications
            </p>

            <div className="mt-5 divide-y divide-white/10 rounded-2xl border border-white/10 bg-black/10">
              {vehicle.specs.map(
                (spec: Vehicle["specs"][number]) => (
                  <div
                    key={spec.label}
                    className="grid gap-2 px-5 py-4 sm:grid-cols-[0.8fr_1.2fr]"
                  >
                    <span className="text-sm text-slate-500">
                      {spec.label}
                    </span>

                    <span className="text-sm font-medium text-slate-200">
                      {spec.value}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>


        {/* Safety */}
        <div className="border-t border-white/10 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00B4D8]">
            Safety & fallback
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {vehicle.safety.map((item: string) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


// ═════════════════════════════════════════════════════════════
// SYSTEM ARCHITECTURE
// ═════════════════════════════════════════════════════════════

function SystemArchitecture() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-8">
      <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">

        <SystemNode
          title="REVELATION"
          text="Aerial perception, flight control and mission support"
        />

        <FlowArrow />

        <SystemNode
          title="USV ↔ UAV"
          text="RF telemetry + MAVLink communication"
        />

        <FlowArrow />

        <SystemNode
          title="DRAKEN Mark 1"
          text="Surface navigation, perception and mission execution"
        />

      </div>

      {/* Mission layer */}
      <div className="mt-6 flex flex-col items-center">
        <div className="hidden h-8 w-px bg-gradient-to-b from-[#00B4D8]/60 to-white/10 md:block" />

        <div className="w-full rounded-2xl border border-[#00B4D8]/20 bg-[#00B4D8]/[0.035] p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00B4D8]">
            Mission interface
          </p>

          <h3 className="mt-2 font-heading text-xl font-bold text-white">
            OCS / RoboCommand
          </h3>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            System-level commands and reporting interface supporting the
            coordinated autonomous system.
          </p>
        </div>
      </div>
    </div>
  );
}


// ═════════════════════════════════════════════════════════════
// SYSTEM NODE
// ═════════════════════════════════════════════════════════════

function SystemNode({
  title,
  text,
}: SystemNodeProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-center">
      <p className="font-mono text-xs tracking-[0.16em] text-[#00B4D8]">
        PLATFORM
      </p>

      <h3 className="mt-2 font-heading text-lg font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}


// ═════════════════════════════════════════════════════════════
// FLOW ARROW
// ═════════════════════════════════════════════════════════════

function FlowArrow({
  direction = "horizontal",
}: FlowArrowProps) {
  if (direction === "vertical") {
    return (
      <div
        aria-hidden="true"
        className="mx-auto h-8 w-px bg-gradient-to-b from-[#00B4D8]/60 to-white/10"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="hidden items-center justify-center text-xl text-[#00B4D8]/70 md:flex"
    >
      →
    </div>
  );
}


// ═════════════════════════════════════════════════════════════
// ARCHITECTURE CARD
// ═════════════════════════════════════════════════════════════

function ArchitectureCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <span className="font-mono text-xs tracking-[0.16em] text-[#00B4D8]">
          {number}
        </span>

        <div>
          <h3 className="font-heading text-xl font-bold text-white">
            {title}
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            {text}
          </p>
        </div>
      </div>
    </Card>
  );
}