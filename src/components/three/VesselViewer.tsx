/* Author: Nithish Kaliannan Ananth */
// src/components/three/VesselViewer.tsx
// Interactive inspection bay: drag to rotate (vertical swipes still scroll
// on phones), switch schematic layers, explode the assembly, focus a
// subsystem from the pins or the list. Renders only while on screen.

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Grid, PresentationControls } from "@react-three/drei";
import * as THREE from "three";
import VesselModel from "./VesselModel";
import UavModel from "./UavModel";
import HydroSurface from "./HydroSurface";
import { SUBSYSTEMS, VEHICLE_META, type SchematicLayer, type VehicleKind } from "./vehicleSpecs";
import SchematicSwitch from "../ui/SchematicSwitch";
import ServoBracket from "../ui/ServoBracket";
import { rippleAt } from "../../lib/hydroBus";

const LAYERS: { value: SchematicLayer; label: string; code: string }[] = [
  { value: "hull", label: "Hull", code: "L1" },
  { value: "avionics", label: "Avionics", code: "L2" },
  { value: "flow", label: "Hydro-flow", code: "L3" },
];

export default function VesselViewer({
  kind,
  reduced = false,
  className = "",
}: {
  kind: VehicleKind;
  reduced?: boolean;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [layer, setLayer] = useState<SchematicLayer>("hull");
  const [exploded, setExploded] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);
  const [compact, setCompact] = useState(() => window.innerWidth < 1280);
  const subs = SUBSYSTEMS[kind];
  const meta = VEHICLE_META[kind];
  const isUav = kind === "revelation";

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    const onResize = () => setCompact(window.innerWidth < 1280);
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const pick = (id: string) => setFocus((f) => (f === id ? null : id));

  return (
    <div className={`grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] ${className}`}>
      <div ref={wrap} className="relative min-h-[380px] border border-line bg-[#071017] sm:min-h-[460px] lg:min-h-[560px]" style={{ touchAction: "pan-y" }}>
        <ServoBracket tone="hydro" size={16} inset={-5} />
        <div className="pointer-events-none absolute left-4 top-3 z-10 flex flex-col gap-1">
          <span className="stencil text-bone">{meta.serial}</span>
          <span className="stencil">{meta.kind}</span>
        </div>
        <div className="pointer-events-none absolute bottom-3 left-4 z-10 stencil">Drag to rotate</div>
        <div className="pointer-events-none absolute bottom-3 right-4 z-10 stencil tabular">
          {exploded ? "VIEW · EXPLODED" : "VIEW · ASSEMBLED"} / {isUav ? "BENCH" : layer.toUpperCase()}
        </div>
        <Canvas
          className="!absolute inset-0"
          dpr={[1, 1.75]}
          frameloop={!visible ? "never" : reduced ? "demand" : "always"}
          camera={{ fov: 34, position: isUav ? [2.5, 1.6, 2.8] : [4.9, 3.0, 5.7], near: 0.1, far: 80 }}
          gl={{ antialias: true }}
          onCreated={({ gl, camera }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            camera.lookAt(0, isUav ? 0.05 : 0.45, 0);
          }}
          onPointerMissed={() => setFocus(null)}
        >
          <color attach="background" args={["#071017"]} />
          <fog attach="fog" args={["#071017", 6, 16]} />
          <hemisphereLight args={["#9BE7F2", "#05080A", 0.7]} />
          <directionalLight position={[3, 6, 4]} intensity={1.3} color="#E2F3F8" />
          <pointLight position={[-3, 1, -2]} intensity={6} distance={9} color="#00E5FF" />
          <Suspense fallback={null}>
            <PresentationControls
              global={false}
              cursor
              snap={false}
              speed={1.4}
              polar={[-0.15, 0.4]}
              azimuth={[-Infinity, Infinity]}
            >
              <group position={[0, isUav ? 0.1 : 0, 0]} rotation={[0, isUav ? 0.4 : -0.6, 0]}>
                {isUav ? (
                  <UavModel explode={exploded ? 1 : 0} focus={focus} pins compactPins={compact} onPick={pick} />
                ) : (
                  <VesselModel
                    variant={kind === "draken" ? "draken" : "walrus"}
                    layer={layer}
                    explode={exploded ? 1 : 0}
                    focus={focus}
                    pins
                    compactPins={compact}
                    onPick={pick}
                  />
                )}
              </group>
            </PresentationControls>
            {isUav ? (
              <>
                <Grid
                  position={[0, -0.38, 0]}
                  args={[10, 10]}
                  cellSize={0.25}
                  cellThickness={0.6}
                  cellColor="#1B2833"
                  sectionSize={1}
                  sectionThickness={1}
                  sectionColor="#2A3A47"
                  fadeDistance={9}
                  infiniteGrid
                />
                <ContactShadows position={[0, -0.37, 0]} opacity={0.45} scale={4} blur={2.6} far={1.2} />
              </>
            ) : (
              <group position={[0, -0.06, 0]}>
                <HydroSurface size={44} segments={140} amp={0.55} fogNear={5} fogFar={14} fog="#071017" interactive={false} paused={reduced} />
              </group>
            )}
          </Suspense>
        </Canvas>
      </div>

      {/* control panel */}
      <div className="flex flex-col gap-6">
        <div>
          <p className="stencil">Inspection bay</p>
          <p className="mt-2 font-display text-2xl font-semibold text-bone">{meta.name}</p>
        </div>
        {!isUav && <SchematicSwitch label="Schematic layer" options={LAYERS} value={layer} onChange={setLayer} />}
        <div>
          <span className="stencil">Assembly</span>
          <button
            type="button"
            aria-pressed={exploded}
            onClick={(e) => {
              rippleAt(e.clientX, e.clientY, 0.7);
              setExploded((v) => !v);
            }}
            data-ping
            className={`mt-2 flex w-full items-center justify-between border px-3 py-2.5 font-mono text-[11px] uppercase tracking-stencil transition-colors ${
              exploded ? "border-arc/70 bg-arc/10 text-bone" : "border-line-2 text-fog hover:text-bone"
            }`}
          >
            <span>{exploded ? "Exploded view" : "Assembled view"}</span>
            <span className={`h-2 w-2 ${exploded ? "bg-arc" : "border border-line-2"}`} />
          </button>
        </div>
        <div>
          <span className="stencil">Subsystems</span>
          <ul className="mt-2 divide-y divide-line border-y border-line">
            {subs.map((s) => {
              const on = focus === s.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => pick(s.id)}
                    aria-pressed={on}
                    data-ping
                    className={`grid w-full grid-cols-[3.6rem_1fr] items-baseline gap-2 py-2.5 text-left transition-colors ${on ? "text-bone" : "text-fog hover:text-bone"}`}
                  >
                    <span className={`font-mono text-[10px] tracking-stencil ${on ? "text-arc" : "text-drift"}`}>{s.code}</span>
                    <span>
                      <span className="block text-sm">{s.label}</span>
                      {on && <span className="mt-0.5 block font-mono text-[11px] text-hydro">{s.value}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
