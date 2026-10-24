// src/components/three/VesselModel.tsx
// Procedural model of Walrus / DRAKEN Mark 1, built from the gallery photos:
// two capped PVC pontoons, a steel deck frame, a clear acrylic electronics
// box, stern thrusters and (Walrus) a bow screw conveyor. DRAKEN adds the
// V-keel from robotxData and swaps LiDAR for a camera pod.
//
// Frame: X = beam (port −, starboard +), Y = up, Z = length (bow at −Z).

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges, Line } from "@react-three/drei";
import * as THREE from "three";
import { SUBSYSTEMS, type SchematicLayer } from "./vehicleSpecs";
import { ExplodeGroup, TelemetryPin } from "./parts";

export type VesselVariant = "walrus" | "draken";

type RoleMats = ReturnType<typeof makeMats>;

function makeMats(variant: VesselVariant) {
  return {
    pvc: new THREE.MeshStandardMaterial({ color: variant === "walrus" ? "#A2ADB4" : "#1A2026", roughness: 0.72, metalness: 0.08 }),
    cap: new THREE.MeshStandardMaterial({ color: variant === "walrus" ? "#5C6870" : "#0E1317", roughness: 0.6, metalness: 0.15 }),
    steel: new THREE.MeshStandardMaterial({ color: "#4A5963", roughness: 0.48, metalness: 0.7 }),
    deck: new THREE.MeshStandardMaterial({ color: "#121B22", roughness: 0.82, metalness: 0.35 }),
    acrylic: new THREE.MeshPhysicalMaterial({ color: "#CFF6FF", roughness: 0.06, metalness: 0, transparent: true, opacity: 0.12, depthWrite: false }),
    pcb: new THREE.MeshStandardMaterial({ color: "#0B2A2C", roughness: 0.7, emissive: new THREE.Color("#00E5FF"), emissiveIntensity: 0.06 }),
    chip: new THREE.MeshStandardMaterial({ color: "#1B242B", roughness: 0.38, metalness: 0.55 }),
    battery: new THREE.MeshStandardMaterial({ color: "#232B31", roughness: 0.55, metalness: 0.2, emissive: new THREE.Color("#FFB800"), emissiveIntensity: 0 }),
    rubber: new THREE.MeshStandardMaterial({ color: "#0A0E11", roughness: 0.92 }),
    lens: new THREE.MeshStandardMaterial({ color: "#04070A", roughness: 0.08, metalness: 0.95 }),
    tank: new THREE.MeshStandardMaterial({ color: "#0B6A7A", roughness: 0.3, transparent: true, opacity: 0.6, emissive: new THREE.Color("#00E5FF"), emissiveIntensity: 0.12 }),
    glow: new THREE.MeshBasicMaterial({ color: "#00E5FF", transparent: true }),
    amber: new THREE.MeshBasicMaterial({ color: "#FFB800", transparent: true }),
  };
}

type PartState = { ghost: boolean; dim: boolean; hot: boolean };

/** Stores each material's resting values once, then applies a state. */
function applyState(mats: RoleMats, s: PartState) {
  Object.values(mats).forEach((m) => {
    const mat = m as THREE.Material & { emissiveIntensity?: number; userData: Record<string, unknown> };
    if (mat.userData.base === undefined) {
      mat.userData.base = {
        opacity: mat.opacity,
        transparent: mat.transparent,
        depthWrite: mat.depthWrite,
        emissive: mat.emissiveIntensity ?? 0,
      };
    }
    const base = mat.userData.base as { opacity: number; transparent: boolean; depthWrite: boolean; emissive: number };
    const fade = s.ghost ? 0.1 : s.dim ? 0.28 : 1;
    mat.opacity = base.opacity * fade;
    mat.transparent = base.transparent || fade < 1;
    mat.depthWrite = fade < 1 ? false : base.depthWrite;
    if ("emissiveIntensity" in mat && mat.emissiveIntensity !== undefined) {
      const std = mat as THREE.MeshStandardMaterial;
      if (s.hot) {
        std.emissive.set(std === mats.battery ? "#FFB800" : "#00E5FF");
        std.emissiveIntensity = Math.max(base.emissive, 0.45);
      } else {
        std.emissiveIntensity = base.emissive;
      }
    }
    mat.needsUpdate = true;
  });
}

function useMats(variant: VesselVariant, state: PartState) {
  const mats = useMemo(() => makeMats(variant), [variant]);
  useEffect(() => applyState(mats, state), [mats, state.ghost, state.dim, state.hot]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  return mats;
}



function Pontoon({ x, mats, length = 2.9 }: { x: number; mats: RoleMats; length?: number }) {
  return (
    <group position={[x, 0.04, 0]}>
      <mesh material={mats.pvc} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.27, 0.27, length, 28, 1, true]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} material={mats.cap} position={[0, 0, (s * (length + 0.1)) / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.12, 28]} />
        </mesh>
      ))}
      {/* weld seams / pipe joints */}
      {[-0.7, 0.7].map((z) => (
        <mesh key={z} material={mats.cap} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.285, 0.285, 0.06, 28]} />
        </mesh>
      ))}
    </group>
  );
}

function Thruster({ x, mats, speed }: { x: number; mats: RoleMats; speed: number }) {
  const prop = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (prop.current) prop.current.rotation.z += dt * speed;
  });
  return (
    <group position={[x, -0.3, 1.55]}>
      <mesh material={mats.steel} position={[0, 0.16, -0.05]}>
        <boxGeometry args={[0.05, 0.22, 0.14]} />
      </mesh>
      <mesh material={mats.rubber} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.3, 24, 1, true]} />
      </mesh>
      <mesh material={mats.steel} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.18]}>
        <cylinderGeometry args={[0.07, 0.09, 0.12, 20]} />
      </mesh>
      <group ref={prop} position={[0, 0, 0.06]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} material={mats.glow} rotation={[0, 0, (i * Math.PI * 2) / 3]} position={[0, 0, 0]}>
            <boxGeometry args={[0.018, 0.2, 0.03]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function ScrewConveyor({ mats }: { mats: RoleMats }) {
  const screw = useRef<THREE.Group>(null);
  const helix = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const turns = 7;
    for (let i = 0; i <= turns * 32; i++) {
      const t = i / (turns * 32);
      const a = t * turns * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * 0.14, Math.sin(a) * 0.14, -0.55 + t * 1.1));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 220, 0.012, 6, false);
  }, []);
  useEffect(() => () => helix.dispose(), [helix]);
  // 30 RPM, as specified in the CMS.
  useFrame((_, dt) => {
    if (screw.current) screw.current.rotation.z += dt * Math.PI;
  });
  const tilt = -0.48;
  return (
    <group position={[0, 0.02, -1.45]} rotation={[tilt, 0, 0]}>
      {[-0.26, 0.26].map((x) => (
        <mesh key={x} material={mats.steel} position={[x, 0, 0]}>
          <boxGeometry args={[0.02, 0.24, 1.2]} />
        </mesh>
      ))}
      <group ref={screw}>
        <mesh material={mats.steel} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.12, 10]} />
        </mesh>
        <mesh geometry={helix} material={mats.glow} />
      </group>
      {/* collection net, behind the conveyor */}
      <mesh position={[0, 0.2, 0.75]}>
        <boxGeometry args={[0.5, 0.28, 0.32]} />
        <meshBasicMaterial color="#2A3A47" wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function FlowLines({ variant }: { variant: VesselVariant }) {
  const refs = useRef<(THREE.Object3D | null)[]>([]);
  const lines = useMemo(() => {
    const out: [number, number, number][][] = [];
    const lanes = [-1.45, -1.12, -0.58, 0.58, 1.12, 1.45];
    lanes.forEach((x0) => {
      const pts: [number, number, number][] = [];
      for (let i = 0; i <= 40; i++) {
        const z = -2.4 + (i / 40) * 5;
        const near = Math.abs(Math.abs(x0) - 0.85) < 0.3;
        const bulge = near ? Math.exp(-((z + 1.45) ** 2) * 1.2) * 0.12 * Math.sign(x0) : 0;
        pts.push([x0 + bulge, -0.12 - Math.abs(x0) * 0.04, z]);
      }
      out.push(pts);
    });
    if (variant === "walrus") {
      // intake: water drawn toward the bow conveyor
      [-0.45, -0.2, 0.2, 0.45].forEach((x0) => {
        const pts: [number, number, number][] = [];
        for (let i = 0; i <= 24; i++) {
          const t = i / 24;
          pts.push([x0 * (1 - t * 0.85), -0.04, -3.2 + t * 1.75]);
        }
        out.push(pts);
      });
    }
    return out;
  }, [variant]);

  useFrame((_, dt) => {
    refs.current.forEach((l) => {
      const m = (l as unknown as { material?: { dashOffset: number } })?.material;
      if (m) m.dashOffset -= dt * 0.9;
    });
  });

  return (
    <group>
      {lines.map((pts, i) => (
        <Line
          key={i}
          ref={(el) => { refs.current[i] = el as unknown as THREE.Object3D; }}
          points={pts}
          color={i >= 6 ? "#FFB800" : "#00E5FF"}
          lineWidth={1.2}
          dashed
          dashSize={0.18}
          gapSize={0.12}
          transparent
          opacity={0.85}
        />
      ))}
    </group>
  );
}

export default function VesselModel({
  variant = "walrus",
  layer = "hull",
  explode = 0,
  focus = null,
  pins = false,
  compactPins = false,
  onPick,
}: {
  variant?: VesselVariant;
  layer?: SchematicLayer;
  explode?: number;
  focus?: string | null;
  pins?: boolean;
  compactPins?: boolean;
  onPick?: (id: string) => void;
}) {
  const subs = SUBSYSTEMS[variant];
  const has = (id: string) => subs.some((s) => s.id === id);
  const off = (id: string) => subs.find((s) => s.id === id)?.explode ?? ([0, 0, 0] as [number, number, number]);

  const st = (id: string | "hull"): PartState => {
    const avionicsView = layer === "avionics";
    const isInternal = id === "avionics" || id === "power" || id === "ballast";
    return {
      ghost: avionicsView && !isInternal && id !== "vision",
      dim: !!focus && focus !== id,
      hot: focus === id || (avionicsView && isInternal),
    };
  };

  const hull = useMats(variant, st("hull"));
  const vision = useMats(variant, st("vision"));
  const collection = useMats(variant, st("collection"));
  const ballast = useMats(variant, st("ballast"));
  const propulsion = useMats(variant, st("propulsion"));
  const avionics = useMats(variant, st("avionics"));
  const power = useMats(variant, st("power"));
  const sensing = useMats(variant, st("sensing"));
  const comms = useMats(variant, st(variant === "draken" ? "comms" : "nav"));

  const lidar = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (lidar.current) lidar.current.rotation.y += dt * Math.PI;
  });

  const thrustSpeed = focus === "propulsion" ? 26 : 9;

  // V-keel for DRAKEN (robotxData: "V-shaped hull").
  const keel = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.42, 0);
    shape.lineTo(0.42, 0);
    shape.lineTo(0, -0.34);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: 1.9, bevelEnabled: false });
    g.translate(0, 0, -0.95);
    return g;
  }, []);
  useEffect(() => () => keel.dispose(), [keel]);

  return (
    <group>
      {/* ---------- hull: pontoons, frame, deck, acrylic box ---------- */}
      <Pontoon x={-0.86} mats={hull} />
      <Pontoon x={0.86} mats={hull} />
      {[-0.95, 0.95].map((z) => (
        <mesh key={z} material={hull.steel} position={[0, 0.36, z]}>
          <boxGeometry args={[1.98, 0.08, 0.1]} />
        </mesh>
      ))}
      {[-0.86, 0.86].map((x) => (
        <mesh key={x} material={hull.steel} position={[x, 0.33, 0]}>
          <boxGeometry args={[0.06, 0.06, 2.55]} />
        </mesh>
      ))}
      <mesh material={hull.deck} position={[0, 0.42, 0]}>
        <boxGeometry args={[1.3, 0.035, 1.75]} />
      </mesh>
      {variant === "draken" && (
        <mesh geometry={keel} material={hull.deck} position={[0, 0.4, 0]}>
          <Edges color="#2A3A47" />
        </mesh>
      )}
      <mesh material={hull.acrylic} position={[0, 0.73, 0]} renderOrder={2}>
        <boxGeometry args={[1.05, 0.58, 1.28]} />
        <Edges color={layer === "avionics" ? "#00E5FF" : "#7FDDEA"} threshold={15} />
      </mesh>
      {/* status LEDs on the box */}
      <mesh material={hull.glow} position={[0.36, 0.95, -0.645]}>
        <sphereGeometry args={[0.022, 10, 10]} />
      </mesh>
      <mesh material={hull.amber} position={[0.42, 0.95, -0.645]}>
        <sphereGeometry args={[0.022, 10, 10]} />
      </mesh>

      {/* ---------- vision ---------- */}
      <ExplodeGroup offset={off("vision")} explode={explode}>
        {variant === "walrus" ? (
          <group>
            <mesh material={vision.steel} position={[0, 1.36, 0.05]}>
              <cylinderGeometry args={[0.028, 0.028, 0.72, 10]} />
            </mesh>
            <group ref={lidar} position={[0, 1.76, 0.05]}>
              <mesh material={vision.chip}>
                <cylinderGeometry args={[0.13, 0.13, 0.12, 28]} />
              </mesh>
              <mesh material={vision.glow} position={[0, 0.01, 0]}>
                <torusGeometry args={[0.132, 0.008, 6, 40]} />
              </mesh>
              <mesh material={vision.lens} position={[0, 0.0, -0.125]}>
                <boxGeometry args={[0.08, 0.035, 0.01]} />
              </mesh>
            </group>
          </group>
        ) : null}
        {/* camera pod at the bow face of the box */}
        <group position={[0, 0.98, -0.72]}>
          <mesh material={vision.chip}>
            <boxGeometry args={[0.16, 0.11, 0.12]} />
          </mesh>
          <mesh material={vision.lens} position={[0, 0, -0.07]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.04, 0.04, 18]} />
          </mesh>
        </group>
      </ExplodeGroup>

      {/* ---------- navigation / comms mast ---------- */}
      {(has("nav") || has("comms") || variant === "walrus") && (
        <ExplodeGroup offset={variant === "draken" ? off("comms") : [0, 0, 0]} explode={explode}>
          <mesh material={comms.steel} position={[0.42, 1.3, 0.55]}>
            <cylinderGeometry args={[0.01, 0.01, 0.6, 6]} />
          </mesh>
          <mesh material={comms.amber} position={[0.42, 1.62, 0.55]}>
            <sphereGeometry args={[0.025, 10, 10]} />
          </mesh>
        </ExplodeGroup>
      )}
      {variant === "draken" && (
        <ExplodeGroup offset={off("nav")} explode={explode}>
          <mesh material={comms.steel} position={[0, 1.27, 0.05]}>
            <cylinderGeometry args={[0.022, 0.022, 0.5, 10]} />
          </mesh>
          <mesh material={comms.chip} position={[0, 1.55, 0.05]}>
            <cylinderGeometry args={[0.09, 0.09, 0.04, 24]} />
          </mesh>
        </ExplodeGroup>
      )}

      {/* ---------- collection (Walrus only) ---------- */}
      {variant === "walrus" && (
        <ExplodeGroup offset={off("collection")} explode={explode}>
          <ScrewConveyor mats={collection} />
        </ExplodeGroup>
      )}

      {/* ---------- ballast: one tank inside each pontoon ---------- */}
      {[-1, 1].map((side) => (
        <ExplodeGroup key={side} offset={[off("ballast")[0] * side, 0, 0]} explode={explode}>
          <mesh material={ballast.tank} position={[0.86 * side, 0.04, 0.2]} rotation={[Math.PI / 2, 0, 0]} renderOrder={1}>
            <cylinderGeometry args={[0.15, 0.15, 1.15, 20]} />
          </mesh>
        </ExplodeGroup>
      ))}

      {/* ---------- propulsion ---------- */}
      <ExplodeGroup offset={off("propulsion")} explode={explode}>
        <Thruster x={-0.86} mats={propulsion} speed={thrustSpeed} />
        <Thruster x={0.86} mats={propulsion} speed={-thrustSpeed} />
      </ExplodeGroup>

      {/* ---------- avionics: PCB, Pi, Pixhawk, harness ---------- */}
      <ExplodeGroup offset={off("avionics")} explode={explode}>
        <mesh material={avionics.pcb} position={[0, 0.5, -0.2]}>
          <boxGeometry args={[0.78, 0.02, 0.55]} />
        </mesh>
        <mesh material={avionics.chip} position={[-0.18, 0.54, -0.28]}>
          <boxGeometry args={[0.24, 0.05, 0.16]} />
        </mesh>
        <mesh material={avionics.chip} position={[0.18, 0.545, -0.12]}>
          <boxGeometry args={[0.17, 0.06, 0.12]} />
        </mesh>
        {[-0.3, -0.12, 0.06, 0.24].map((x) => (
          <mesh key={x} material={avionics.glow} position={[x, 0.512, -0.43]}>
            <boxGeometry args={[0.1, 0.004, 0.006]} />
          </mesh>
        ))}
      </ExplodeGroup>

      {/* ---------- power ---------- */}
      <ExplodeGroup offset={off("power")} explode={explode}>
        <mesh material={power.battery} position={[0, 0.56, 0.32]}>
          <boxGeometry args={[0.52, 0.17, 0.24]} />
        </mesh>
        <mesh material={power.amber} position={[0, 0.648, 0.32]}>
          <boxGeometry args={[0.46, 0.004, 0.02]} />
        </mesh>
      </ExplodeGroup>

      {/* ---------- water-quality probe (Walrus) ---------- */}
      {variant === "walrus" && (
        <ExplodeGroup offset={off("sensing")} explode={explode}>
          <mesh material={sensing.steel} position={[-0.62, 0.1, 0.45]}>
            <cylinderGeometry args={[0.012, 0.012, 0.7, 6]} />
          </mesh>
          <mesh material={sensing.chip} position={[-0.62, -0.32, 0.45]}>
            <cylinderGeometry args={[0.04, 0.04, 0.16, 14]} />
          </mesh>
          <mesh material={sensing.glow} position={[-0.62, -0.41, 0.45]}>
            <sphereGeometry args={[0.018, 8, 8]} />
          </mesh>
        </ExplodeGroup>
      )}

      {layer === "flow" && <FlowLines variant={variant} />}

      {pins &&
        subs.map((s) => (
          <ExplodeGroup key={s.id} offset={s.id === "ballast" ? [s.explode[0], 0, 0] : s.explode} explode={explode}>
            <TelemetryPin sub={s} active={focus === s.id} compact={compactPins} onPick={onPick} />
          </ExplodeGroup>
        ))}
    </group>
  );
}
