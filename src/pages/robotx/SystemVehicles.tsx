
import { useState } from "react";
import { PageShell, Tag } from "../../components/robotx/ui";
import { VEHICLES } from "../../data/robotxData";

export default function SystemVehicles() {
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  return (
    <PageShell
      eyebrow="HARDWARE"
      title="System & Vehicles"
      intro="Two autonomous platforms. One coordinated mission."
    >
      {/* =====================================================
          VEHICLE SHOWCASE
      ====================================================== */}

      <section className="mb-24">
        <div className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#00B4D8]">
            OUR PLATFORMS
          </p>

          <h2 className="font-heading text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
            Meet the Fleet
          </h2>

          <p className="mt-4 max-w-2xl leading-relaxed text-slate-400">
            Each platform is designed for a specific domain while contributing
            to a shared autonomous mission.
          </p>
        </div>

        {/* Vehicle Cards */}
        <div className="grid gap-8 lg:grid-cols-2">
          {VEHICLES.map((vehicle, index) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              index={index}
              onClick={() => setSelectedVehicle(vehicle)}
            />
          ))}
        </div>
      </section>

      {/* =====================================================
          VEHICLE DETAIL
      ====================================================== */}

      {selectedVehicle && (
        <VehicleDetail
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}

      {/* =====================================================
          SYSTEM OF SYSTEMS
      ====================================================== */}

      <SystemOfSystems />

      {/* =====================================================
          CLOSING STATEMENT
      ====================================================== */}

      <section className="mt-24 border-t border-white/10 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#00B4D8]">
            AQUAHOLICS
          </p>

          <h2 className="mt-4 font-heading text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
            Built to work together.
          </h2>

          <p className="mt-5 leading-relaxed text-slate-400">
            DRAKEN Mark 1 and REVELATION are developed as coordinated
            autonomous platforms, combining surface and aerial capabilities
            for RobotX mission execution.
          </p>
        </div>
      </section>
    </PageShell>
  );
}


/* ============================================================
   VEHICLE CARD
============================================================ */

function VehicleCard({ vehicle, index, onClick }) {
  const domainLabel =
    vehicle.domain === "USV"
      ? "SURFACE DOMAIN"
      : vehicle.domain === "UAV"
        ? "AIR DOMAIN"
        : "UNDERWATER DOMAIN";

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group relative overflow-hidden rounded-[28px]
        border border-white/10
        bg-[#071018]
        text-left
        transition-all duration-500
        hover:-translate-y-2
        hover:border-[#00B4D8]/50
        hover:shadow-[0_25px_70px_rgba(0,0,0,0.35)]
        focus:outline-none
        focus:ring-2
        focus:ring-[#00B4D8]/60
      "
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        {vehicle.photo ? (
          <img
            src={vehicle.photo}
            alt={`${vehicle.name} ${vehicle.domain}`}
            className="
              h-full w-full object-cover
              transition-transform duration-700
              group-hover:scale-105
            "
          />
        ) : (
          <VehiclePlaceholder domain={vehicle.domain} />
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#03080d] via-[#03080d]/30 to-transparent" />

        {/* Number */}
        <div className="absolute right-6 top-6 font-heading text-5xl font-black text-white/10">
          0{index + 1}
        </div>

        {/* Domain */}
        <div className="absolute left-6 top-6">
          <Tag>{vehicle.domain}</Tag>
        </div>

        {/* Vehicle name */}
        <div className="absolute bottom-0 left-0 right-0 p-7">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[#00B4D8]">
            {domainLabel}
          </p>

          <h3 className="font-heading text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
            {vehicle.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-7">
        <p className="mb-6 min-h-[72px] leading-relaxed text-slate-400">
          {vehicle.summary}
        </p>

        <div className="flex items-center justify-between border-t border-white/10 pt-5">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-600">
            {vehicle.status}
          </span>

          <span className="flex items-center gap-2 text-sm font-bold text-[#00B4D8] transition-transform duration-300 group-hover:translate-x-1">
            EXPLORE
            <span className="text-lg">→</span>
          </span>
        </div>
      </div>
    </button>
  );
}


/* ============================================================
   VEHICLE PLACEHOLDER
============================================================ */

function VehiclePlaceholder({ domain }) {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden">
      {/* Technical grid */}
      <div
        className="
          absolute inset-0 opacity-20
          bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),
          linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)]
          bg-[size:40px_40px]
        "
      />

      {/* Glow */}
      <div className="absolute h-64 w-64 rounded-full bg-[#00B4D8]/10 blur-3xl" />

      <div className="relative text-center">
        <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-[#00B4D8]/30">
          <span className="font-heading text-3xl font-black text-[#00B4D8]">
            {domain}
          </span>
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-600">
          Vehicle imagery coming soon
        </p>
      </div>
    </div>
  );
}


/* ============================================================
   VEHICLE DETAIL
============================================================ */

function VehicleDetail({ vehicle, onClose }) {
  return (
    <section
      id={`${vehicle.id}-details`}
      className="
        mb-24
        scroll-mt-24
        overflow-hidden
        rounded-[28px]
        border border-[#00B4D8]/20
        bg-[#050d13]
        shadow-[0_30px_100px_rgba(0,0,0,0.4)]
      "
    >
      {/* =====================================================
          DETAIL HEADER
      ====================================================== */}

      <div className="relative overflow-hidden border-b border-white/10">
        {vehicle.photo && (
          <>
            <img
              src={vehicle.photo}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-15"
            />

            <div className="absolute inset-0 bg-[#050d13]/90" />
          </>
        )}

        <div className="relative p-7 md:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <Tag>{vehicle.domain}</Tag>

                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  {vehicle.status}
                </span>
              </div>

              <h2 className="font-heading text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
                {vehicle.name}
              </h2>

              <p className="mt-3 text-lg font-medium text-[#00B4D8]">
                {vehicle.tagline}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                rounded-full
                border border-white/10
                px-5 py-2.5
                text-xs font-bold uppercase tracking-[0.2em]
                text-slate-400
                transition
                hover:border-white/30
                hover:text-white
              "
            >
              CLOSE ×
            </button>
          </div>
        </div>
      </div>


      {/* =====================================================
          DETAIL CONTENT
      ====================================================== */}

      <div className="grid gap-12 p-7 md:p-10 lg:grid-cols-[1fr_0.9fr]">
        {/* LEFT */}
        <div>
          <div>
            <p className="leading-8 text-slate-300">
              {vehicle.summary}
            </p>
          </div>

          {/* Systems */}
          {vehicle.systems?.length > 0 && (
            <div className="mt-12">
              <div className="mb-6">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#00B4D8]">
                  ARCHITECTURE
                </p>

                <h3 className="font-heading text-2xl font-black uppercase text-white">
                  Systems
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {vehicle.systems.map((system) => (
                  <div
                    key={system.title}
                    className="
                      rounded-2xl
                      border border-white/10
                      bg-white/[0.025]
                      p-5
                      transition
                      hover:border-[#00B4D8]/30
                    "
                  >
                    <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#00B4D8]">
                      {system.title}
                    </h4>

                    <ul className="space-y-2.5">
                      {system.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm text-slate-300"
                        >
                          <span className="mt-0.5 text-[#00B4D8]">
                            +
                          </span>

                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety */}
          {vehicle.safety?.length > 0 && (
            <div className="mt-12">
              <div className="mb-5">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#00B4D8]">
                  RELIABILITY
                </p>

                <h3 className="font-heading text-2xl font-black uppercase text-white">
                  Safety & Fallback
                </h3>
              </div>

              <div className="space-y-3">
                {vehicle.safety.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#00B4D8]" />

                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


        {/* RIGHT */}
        <div>
          <div
            className="
              overflow-hidden
              rounded-2xl
              border border-white/10
              bg-white/[0.025]
            "
          >
            <div className="border-b border-white/10 px-6 py-5">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#00B4D8]">
                TECHNICAL DATA
              </p>

              <h3 className="font-heading text-xl font-black uppercase text-white">
                Specifications
              </h3>
            </div>

            <div className="divide-y divide-white/10">
              {vehicle.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="grid grid-cols-[0.9fr_1.1fr] gap-5 px-6 py-4"
                >
                  <span className="text-sm text-slate-500">
                    {spec.label}
                  </span>

                  <span className="text-right text-sm font-medium text-white">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ============================================================
   SYSTEM OF SYSTEMS
============================================================ */

function SystemOfSystems() {
  return (
    <section className="border-t border-white/10 pt-20">
      {/* Heading */}
      <div className="mb-12">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#00B4D8]">
          INTEGRATION
        </p>

        <h2 className="font-heading text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
          One System. Multiple Domains.
        </h2>

        <p className="mt-5 max-w-3xl leading-relaxed text-slate-400">
          DRAKEN Mark 1 and REVELATION are developed as coordinated
          autonomous platforms, combining surface and aerial capabilities
          while retaining independent vehicle-level control.
        </p>
      </div>


      {/* Architecture */}
      <div
        className="
          relative
          overflow-hidden
          rounded-[28px]
          border border-white/10
          bg-[#050d13]
          p-7
          md:p-12
        "
      >
        {/* Background grid */}
        <div
          className="
            pointer-events-none
            absolute inset-0 opacity-10
            bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),
            linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)]
            bg-[size:50px_50px]
          "
        />

        <div className="relative">
          {/* Vehicles */}
          <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
            {/* UAV */}
            <ArchitectureNode
              number="01"
              domain="AIR DOMAIN"
              name="REVELATION"
              description="Aerial perception & mission support"
            />

            {/* Link */}
            <div className="flex flex-col items-center gap-3">
              <div className="hidden h-px w-20 bg-[#00B4D8]/50 md:block" />

              <div
                className="
                  rounded-full
                  border border-[#00B4D8]/30
                  bg-[#00B4D8]/5
                  px-5 py-2.5
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#00B4D8]
                "
              >
                MAVLink / RF
              </div>

              <div className="hidden h-px w-20 bg-[#00B4D8]/50 md:block" />
            </div>

            {/* USV */}
            <ArchitectureNode
              number="02"
              domain="SURFACE DOMAIN"
              name="DRAKEN MARK 1"
              description="Navigation & mission execution"
            />
          </div>


          {/* Down connection */}
          <div className="mx-auto flex w-fit flex-col items-center">
            <div className="h-12 w-px bg-gradient-to-b from-[#00B4D8]/50 to-white/10" />

            <div
              className="
                rounded-2xl
                border border-white/10
                bg-white/[0.03]
                px-8 py-5
                text-center
              "
            >
              <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-600">
                COMMAND INTERFACE
              </p>

              <p className="font-heading text-lg font-bold text-white">
                OCS / RoboCommand
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Architecture note */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <IntegrationPoint
          title="PERCEIVE"
          text="Vehicles collect information from their respective operating domains."
        />

        <IntegrationPoint
          title="COORDINATE"
          text="Mission and telemetry information can be exchanged between platforms."
        />

        <IntegrationPoint
          title="ACT"
          text="Each vehicle executes its assigned behavior while retaining safety fallbacks."
        />
      </div>
    </section>
  );
}


/* ============================================================
   ARCHITECTURE NODE
============================================================ */

function ArchitectureNode({
  number,
  domain,
  name,
  description,
}) {
  return (
    <div
      className="
        group
        rounded-2xl
        border border-white/10
        bg-white/[0.025]
        p-6
        transition
        hover:border-[#00B4D8]/30
      "
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-[0.25em] text-slate-600">
          {number}
        </span>

        <span className="text-[10px] font-bold tracking-[0.2em] text-[#00B4D8]">
          {domain}
        </span>
      </div>

      <h3 className="font-heading text-2xl font-black uppercase text-white">
        {name}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}


/* ============================================================
   INTEGRATION POINT
============================================================ */

function IntegrationPoint({ title, text }) {
  return (
    <div className="border-l border-[#00B4D8]/30 pl-5">
      <p className="text-[10px] font-bold tracking-[0.3em] text-[#00B4D8]">
        {title}
      </p>

      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        {text}
      </p>
    </div>
  );
}

