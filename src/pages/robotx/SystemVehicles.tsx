// src/pages/robotx/SystemVehicles.tsx

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Eye,
  Gauge,
  Radio,
  ShieldCheck,
  Sparkles,
  Waves,
  X,
  Zap,
} from "lucide-react";

import { PageShell } from "../../components/robotx/ui";

import {
  SAFETY,
  SYSTEM_OF_SYSTEMS,
  VEHICLES,
  type Vehicle,
  type VehicleDomain,
  type VehicleSystem,
} from "../../data/robotxData";

// ============================================================
// TYPES
// ============================================================

type Filter = "ALL" | VehicleDomain;

// ============================================================
// SMALL UI COMPONENTS
// ============================================================

function Eyebrow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#00B4D8]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#00F5FF]" />
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>

      <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-7 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function DomainBadge({
  domain,
}: {
  domain: VehicleDomain;
}) {
  const labels: Record<VehicleDomain, string> = {
    USV: "USV",
    UAV: "UAV",
    UUV: "UUV",
  };

  return (
    <span className="inline-flex items-center rounded-full border border-[#00B4D8]/30 bg-[#00B4D8]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#00F5FF]">
      {labels[domain]}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status?: string;
}) {
  if (!status) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      {status}
    </span>
  );
}

// ============================================================
// VEHICLE PLACEHOLDER
// ============================================================

function VehiclePlaceholder({
  vehicle,
}: {
  vehicle: Vehicle;
}) {
  const isUSV = vehicle.domain === "USV";

  return (
    <div className="flex h-full min-h-[260px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,rgba(0,180,216,0.16),transparent_60%)]">
      <div className="relative flex flex-col items-center justify-center">
        <div className="absolute h-40 w-40 rounded-full border border-[#00B4D8]/10" />
        <div className="absolute h-28 w-28 rounded-full border border-[#00B4D8]/15" />

        {isUSV ? (
          <Waves
            size={76}
            strokeWidth={1}
            className="relative text-[#00B4D8]"
          />
        ) : (
          <Sparkles
            size={76}
            strokeWidth={1}
            className="relative text-[#00B4D8]"
          />
        )}

        <span className="relative mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {vehicle.domain} Platform
        </span>
      </div>
    </div>
  );
}

// ============================================================
// VEHICLE CARD
// ============================================================

function VehicleCard({
  vehicle,
  onSelect,
}: {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
}) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0D1424] transition duration-300 hover:-translate-y-1 hover:border-[#00B4D8]/40 hover:shadow-[0_20px_60px_rgba(0,180,216,0.08)]">
      {/* Visual */}
      <div className="relative overflow-hidden border-b border-white/10">
        {vehicle.image ? (
          <img
            src={vehicle.image}
            alt={vehicle.name}
            loading="lazy"
            className="h-[280px] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <VehiclePlaceholder vehicle={vehicle} />
        )}

        <div className="absolute left-5 top-5 flex items-center gap-2">
          <DomainBadge domain={vehicle.domain} />
          <StatusBadge status={vehicle.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {vehicle.type}
            </p>

            <h3 className="mt-2 font-heading text-2xl font-bold text-white">
              {vehicle.name}
            </h3>
          </div>

          <div className="hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:block">
            {vehicle.domain === "USV" ? (
              <Waves size={20} className="text-[#00B4D8]" />
            ) : (
              <Sparkles size={20} className="text-[#00B4D8]" />
            )}
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-400">
          {vehicle.description}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {vehicle.specs.slice(0, 4).map((spec) => (
            <div
              key={`${vehicle.id}-${spec.label}`}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-3"
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                {spec.label}
              </p>

              <p className="mt-1 text-sm font-medium text-slate-200">
                {spec.value}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onSelect(vehicle)}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#00F5FF] transition hover:gap-3"
        >
          Explore platform
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}

// ============================================================
// SYSTEM CARD
// ============================================================

function SystemCard({
  system,
}: {
  system: VehicleSystem;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D1424] p-5 transition hover:border-[#00B4D8]/30">
      <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-white">
        {system.name}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {system.description}
      </p>
    </div>
  );
}

// ============================================================
// DETAIL MODAL
// ============================================================

function VehicleDetail({
  vehicle,
  onClose,
}: {
  vehicle: Vehicle;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0A0F1E] shadow-2xl">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close vehicle details"
          className="absolute right-5 top-5 z-10 rounded-full border border-white/10 bg-black/30 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="border-b border-white/10 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <DomainBadge domain={vehicle.domain} />
            <StatusBadge status={vehicle.status} />
          </div>

          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {vehicle.type}
          </p>

          <h2 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
            {vehicle.name}
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
            {vehicle.description}
          </p>
        </div>

        <div className="space-y-8 p-6 sm:p-8">
          {/* Image / placeholder */}
          <div className="overflow-hidden rounded-2xl border border-white/10">
            {vehicle.image ? (
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="max-h-[420px] w-full object-cover"
              />
            ) : (
              <VehiclePlaceholder vehicle={vehicle} />
            )}
          </div>

          {/* Specs */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Gauge size={18} className="text-[#00B4D8]" />

              <h3 className="font-heading text-lg font-bold text-white">
                Platform specifications
              </h3>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {vehicle.specs.map((spec) => (
                <div
                  key={`${vehicle.id}-${spec.label}`}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                >
                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                    {spec.label}
                  </p>

                  <p className="mt-1 text-sm font-medium leading-6 text-slate-200">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Additional properties */}
          <section>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {vehicle.dimensions && (
                <InfoBox
                  icon={<Gauge size={16} />}
                  label="Dimensions"
                  value={vehicle.dimensions}
                />
              )}

              {vehicle.material && (
                <InfoBox
                  icon={<Waves size={16} />}
                  label="Material"
                  value={vehicle.material}
                />
              )}

              {vehicle.hull && (
                <InfoBox
                  icon={<Waves size={16} />}
                  label="Hull"
                  value={vehicle.hull}
                />
              )}

              {vehicle.power && (
                <InfoBox
                  icon={<Zap size={16} />}
                  label="Power"
                  value={vehicle.power}
                />
              )}

              {vehicle.communication && (
                <InfoBox
                  icon={<Radio size={16} />}
                  label="Communication"
                  value={vehicle.communication}
                />
              )}

              {vehicle.autonomy && (
                <InfoBox
                  icon={<Cpu size={16} />}
                  label="Autonomy"
                  value={vehicle.autonomy}
                />
              )}

              {vehicle.payload && (
                <InfoBox
                  icon={<Sparkles size={16} />}
                  label="Payload"
                  value={vehicle.payload}
                />
              )}
            </div>
          </section>

          {/* Systems */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Cpu size={18} className="text-[#00B4D8]" />

              <h3 className="font-heading text-lg font-bold text-white">
                Platform systems
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {vehicle.systems.map((system) => (
                <SystemCard
                  key={`${vehicle.id}-${system.name}`}
                  system={system}
                />
              ))}
            </div>
          </section>

          {/* Safety */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#00B4D8]" />

              <h3 className="font-heading text-lg font-bold text-white">
                Safety & fallback
              </h3>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {SAFETY.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-[#00B4D8]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs leading-6 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// INFO BOX
// ============================================================

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 text-[#00B4D8]">
        {icon}

        <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-500">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-200">
        {value}
      </p>
    </div>
  );
}

// ============================================================
// SYSTEM OVERVIEW
// ============================================================

function SystemOverview() {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0D1424]">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-6 sm:p-8 lg:p-10">
          <Eyebrow>System Architecture</Eyebrow>

          <h2 className="mt-3 font-heading text-2xl font-bold text-white sm:text-3xl">
            {SYSTEM_OF_SYSTEMS.title}
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            {SYSTEM_OF_SYSTEMS.summary}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {SYSTEM_OF_SYSTEMS.domains.map((domain) => (
              <div
                key={domain.id}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                    {domain.name}
                  </span>

                  <span className="rounded-full border border-[#00B4D8]/20 bg-[#00B4D8]/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#00F5FF]">
                    {domain.domain}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-bold text-white">
                  {domain.vehicle}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {domain.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#080D19] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
          <Eyebrow>Communication Layer</Eyebrow>

          <div className="mt-6 space-y-4">
            <CommunicationRow
              label="Protocol"
              value={SYSTEM_OF_SYSTEMS.communication.protocol}
            />

            <CommunicationRow
              label="Telemetry"
              value={SYSTEM_OF_SYSTEMS.communication.telemetry}
            />

            <CommunicationRow
              label="Frequency"
              value={SYSTEM_OF_SYSTEMS.communication.frequency}
            />

            <CommunicationRow
              label="Modulation"
              value={SYSTEM_OF_SYSTEMS.communication.modulation}
            />

            <CommunicationRow
              label="Status"
              value={SYSTEM_OF_SYSTEMS.communication.status}
            />
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="border-t border-white/10 p-6 sm:p-8">
        <Eyebrow>System Links</Eyebrow>

        <div className="mt-5 grid gap-3">
          {SYSTEM_OF_SYSTEMS.links.map((link, index) => (
            <div
              key={`${link.from}-${link.to}-${index}`}
              className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-white">
                  {link.from}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {link.label}
                </p>
              </div>

              <ArrowRight
                size={18}
                className="hidden text-[#00B4D8] sm:block"
              />

              <p className="text-sm font-semibold text-[#00F5FF]">
                {link.to}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400">
          {SYSTEM_OF_SYSTEMS.principle}
        </p>
      </div>
    </section>
  );
}

function CommunicationRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
      <span className="text-xs uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>

      <span className="max-w-[60%] text-right text-sm font-medium text-slate-200">
        {value}
      </span>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function SystemVehicles() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [selectedVehicle, setSelectedVehicle] =
    useState<Vehicle | null>(null);

  const filteredVehicles = useMemo(() => {
    if (filter === "ALL") {
      return VEHICLES;
    }

    return VEHICLES.filter((vehicle) => vehicle.domain === filter);
  }, [filter]);

  const filters: Filter[] = ["ALL", "USV", "UAV", "UUV"];

  return (
    <>
      <PageShell
        eyebrow="AQUAHOLICS · ROBOTX 2026"
        title="System & Vehicles"
      >
        <div className="space-y-24">
          {/* ================================================== */}
          {/* INTRO */}
          {/* ================================================== */}

          <section className="max-w-4xl">
            <Eyebrow>Multi-Domain Robotics</Eyebrow>

            <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
              System of Systems
            </h1>

            <p className="mt-5 text-base leading-8 text-slate-400">
              AQUAHOLICS is developing a multi-domain autonomous architecture
              combining surface and aerial platforms for coordinated maritime
              operations.
            </p>
          </section>

          {/* ================================================== */}
          {/* SYSTEM OVERVIEW */}
          {/* ================================================== */}

          <SystemOverview />

          {/* ================================================== */}
          {/* VEHICLES */}
          {/* ================================================== */}

          <section>
            <SectionHeading
              eyebrow="Vehicle Platforms"
              title="DRAKEN Mark 1 & REVELATION"
              description="Explore the current vehicle platforms and their computing, sensing, navigation, communication and control architectures."
            />

            {/* Filters */}
            <div className="mt-8 flex flex-wrap gap-2">
              {filters.map((item) => {
                const active = filter === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={[
                      "rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition",
                      active
                        ? "border-[#00B4D8] bg-[#00B4D8]/15 text-[#00F5FF]"
                        : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white",
                    ].join(" ")}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            {/* Vehicle grid */}
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onSelect={setSelectedVehicle}
                />
              ))}
            </div>

            {filteredVehicles.length === 0 && (
              <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-10 text-center">
                <p className="text-sm text-slate-500">
                  No vehicle has been added for this domain yet.
                </p>
              </div>
            )}
          </section>

          {/* ================================================== */}
          {/* SAFETY */}
          {/* ================================================== */}

          <section>
            <SectionHeading
              eyebrow="Operational Safety"
              title="Safety & fallback architecture"
              description="Safety mechanisms are treated as part of the vehicle architecture rather than as an afterthought to autonomy."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SAFETY.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-[#0D1424] p-5"
                >
                  <ShieldCheck
                    size={20}
                    className="text-[#00B4D8]"
                  />

                  <h3 className="mt-4 text-sm font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </PageShell>

      {/* ==================================================== */}
      {/* VEHICLE DETAIL MODAL */}
      {/* ==================================================== */}

      {selectedVehicle && (
        <VehicleDetail
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </>
  );
}