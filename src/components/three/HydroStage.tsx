/* Author: Nithish Kaliannan Ananth */
/* eslint-disable react-hooks/immutability --
 * react-three-fiber is imperative by design: GPU uniforms, scene fog and
 * object transforms are mutated every frame inside useFrame/effects
 * instead of going through React state (which would re-render at 60 fps).
 */
// src/components/three/HydroStage.tsx
// The persistent Hydro-Field behind the public site and RobotX
// (DESIGN_SYSTEM.md §5). Lazy-loaded after first paint. The camera is
// bound to page scroll: canopy (0.0 m) → waterline (−1.5 m) → sensors
// (−8 m) → telemetry core (−25 m). Home and RobotX float their vehicles in
// the hero; every other page gets water only.

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import HydroSurface from "./HydroSurface";
import Seabed from "./Seabed";
import Bubbles from "./Bubbles";
import VesselModel, { type VesselVariant } from "./VesselModel";
import UavModel from "./UavModel";
import { godRayFragment, godRayVertex } from "./shaders";
import { hydroClock, hydroEnv, swellHeight } from "./waves";
import { scrollProgress } from "../../lib/depth";
import { hydroBus } from "../../lib/hydroBus";
import type { QualityTier } from "../../lib/quality";

export type StageScene = "home" | "robotx" | "plain";

type Key = { p: number; pos: [number, number, number]; look: [number, number, number] };

// Camera keyframes along the descent. x is added per scene to frame the hero.
const PATH: Key[] = [
  { p: 0, pos: [0, 2.3, 7.4], look: [0, 0.2, 0] },
  { p: 0.18, pos: [0, 0.32, 5.4], look: [0, 0.05, 0] },
  { p: 0.55, pos: [0, -6.2, 4.2], look: [0, -9.5, -7] },
  { p: 1, pos: [0, -16.5, 3.2], look: [0, -24, -11] },
];

const smooth = (t: number) => t * t * (3 - 2 * t);

function sample(p: number, out: { pos: THREE.Vector3; look: THREE.Vector3 }) {
  let i = 1;
  while (i < PATH.length - 1 && p > PATH[i].p) i++;
  const a = PATH[i - 1];
  const b = PATH[i];
  const t = smooth(Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p))));
  out.pos.set(
    a.pos[0] + (b.pos[0] - a.pos[0]) * t,
    a.pos[1] + (b.pos[1] - a.pos[1]) * t,
    a.pos[2] + (b.pos[2] - a.pos[2]) * t
  );
  out.look.set(
    a.look[0] + (b.look[0] - a.look[0]) * t,
    a.look[1] + (b.look[1] - a.look[1]) * t,
    a.look[2] + (b.look[2] - a.look[2]) * t
  );
}

// Natural Beer-Lambert ocean light attenuation: sunlit pelagic teal near the
// surface shifting toward deep oceanic indigo-slate at depth.
const SURFACE_FOG = new THREE.Color("#071C26");
const SHALLOW_FOG = new THREE.Color("#092936");
const DEEP_FOG = new THREE.Color("#030B11");

const RAY_SHAFTS: { pos: [number, number, number]; rot: [number, number, number]; scale: [number, number] }[] = [
  { pos: [-5.5, -9.5, -8], rot: [0.08, 0.22, -0.22], scale: [6.5, 20] },
  { pos: [-0.8, -10.0, -11], rot: [0.06, -0.15, -0.19], scale: [8.0, 22] },
  { pos: [4.2, -9.2, -9], rot: [0.07, 0.35, -0.21], scale: [6.0, 19] },
  { pos: [8.5, -10.5, -13], rot: [0.05, -0.28, -0.18], scale: [7.5, 21] },
];

function GodRays({ paused }: { paused: boolean }) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSunColor: { value: new THREE.Color("#7BE3F0") },
      uIntensity: { value: 0.22 },
    }),
    []
  );

  useFrame(({ camera }, dt) => {
    if (!paused) uniforms.uTime.value += Math.min(dt, 0.05);
    // Fade god rays in as the camera submerges below the waterline and fade out in the deep abyss
    const submerge = THREE.MathUtils.clamp((0.8 - camera.position.y) / 2.2, 0.05, 1);
    const abyssFade = THREE.MathUtils.clamp(1 - Math.max(0, -camera.position.y - 11) / 9, 0.2, 1);
    uniforms.uIntensity.value = 0.24 * submerge * abyssFade;
  });

  return (
    <group>
      {RAY_SHAFTS.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot} frustumCulled={false}>
          <planeGeometry args={s.scale} />
          <shaderMaterial
            vertexShader={godRayVertex}
            fragmentShader={godRayFragment}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig() {
  const { camera, scene } = useThree();
  const target = useRef({ pos: new THREE.Vector3(), look: new THREE.Vector3() });
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const pointer = useRef({ x: 0, y: 0 });
  const kick = useRef(0);
  const fog = useRef(new THREE.Color());

  useEffect(() => {
    scene.fog = new THREE.Fog("#071C26", 8, 46);
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const off = hydroBus.on((e) => {
      if (e.type === "route") kick.current = 1;
    });
    return () => {
      window.removeEventListener("pointermove", onMove);
      off();
      scene.fog = null;
    };
  }, [scene]);

  useFrame((_, dt) => {
    const p = scrollProgress();
    sample(p, target.current);
    const t = target.current;
    // Pointer parallax and the small "kick" from a route change.
    t.pos.x += pointer.current.x * 0.45;
    t.pos.y += -pointer.current.y * 0.18 + kick.current * 0.25;
    kick.current = THREE.MathUtils.damp(kick.current, 0, 3, dt);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, t.pos.x, 3.2, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, t.pos.y, 3.2, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, t.pos.z, 3.2, dt);
    look.current.lerp(t.look, 1 - Math.exp(-3.2 * dt));
    camera.lookAt(look.current);

    // Depth-dependent water colour and visibility.
    const y = camera.position.y;
    if (y >= 0) {
      fog.current.copy(SURFACE_FOG);
      hydroEnv.near = 8;
      hydroEnv.far = 46;
    } else {
      const d = Math.min(1, -y / 16);
      fog.current.copy(SHALLOW_FOG).lerp(DEEP_FOG, d);
      hydroEnv.near = 2.5;
      hydroEnv.far = THREE.MathUtils.lerp(34, 24, d);
    }
    hydroEnv.fog = `#${fog.current.getHexString()}`;
    hydroEnv.seabedFog = hydroEnv.fog;
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(fog.current);
      scene.fog.near = hydroEnv.near;
      scene.fog.far = hydroEnv.far;
    }
    (scene.background as THREE.Color | null)?.copy(fog.current);
  });
  return null;
}

/** Rides the swell: heave from the wave height, pitch/roll from the slope.
 *  As the page dives, the vessel sails off into the fog so it never sits
 *  behind body copy. */
function Floating({ x, z = 0, children }: { x: number; z?: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const away = Math.min(1, scrollProgress() / 0.14);
    g.position.z = THREE.MathUtils.damp(g.position.z, z - away * away * 34, 2.2, dt);
    g.position.x = THREE.MathUtils.damp(g.position.x, x + away * 4, 2.2, dt);
    const t = hydroClock.t;
    const h = swellHeight(x, z, t);
    const pitch = Math.atan2(swellHeight(x, z + 1.4, t) - swellHeight(x, z - 1.4, t), 2.8);
    const roll = Math.atan2(swellHeight(x + 0.9, z, t) - swellHeight(x - 0.9, z, t), 1.8);
    g.position.y = THREE.MathUtils.damp(g.position.y, h * 0.85 - 0.02, 4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pitch * 0.8, 4, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, roll * 0.8, 4, dt);
  });
  return (
    <group ref={ref} position={[x, 0, z]}>
      {children}
    </group>
  );
}

function Hovering({ position, children }: { position: [number, number, number]; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const t = hydroClock.t;
    const climb = Math.min(1, scrollProgress() / 0.12);
    g.position.y = position[1] + Math.sin(t * 1.1) * 0.06 + climb * climb * 9;
    g.rotation.y = -0.6 + Math.sin(t * 0.25) * 0.15;
    g.rotation.z = Math.sin(t * 0.9) * 0.03;
  });
  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}

function HeroVehicles({ scene, heroX }: { scene: StageScene; heroX: number }) {
  if (scene === "plain") return null;
  const variant: VesselVariant = scene === "robotx" ? "draken" : "walrus";
  return (
    <group>
      {/* Desktop: right of the headline. Phone: down in the open water
          below the buttons, so it never sits behind text. */}
      <Floating x={heroX > 0 ? heroX : 0.7} z={heroX > 0 ? -0.9 : 3.8}>
        <group rotation={[0, -0.8, 0]} scale={heroX > 0 ? 0.66 : 0.26}>
          <VesselModel variant={variant} />
        </group>
      </Floating>
      {heroX > 0 && (
        <Hovering position={[heroX + 0.75, 1.35, -2.1]}>
          <group scale={0.55}>
            <UavModel />
          </group>
        </Hovering>
      )}
    </group>
  );
}

export default function HydroStage({
  scene,
  tier,
  reduced,
  onReady,
}: {
  scene: StageScene;
  tier: QualityTier;
  reduced: boolean;
  onReady?: () => void;
}) {
  const [dpr, setDpr] = useState(tier === "high" ? 1.75 : 1);
  const [heroX, setHeroX] = useState(() => (window.innerWidth >= 1024 ? 2.9 : 0));

  useEffect(() => {
    const onResize = () => setHeroX(window.innerWidth >= 1024 ? 2.9 : 0);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Canvas
      aria-hidden="true"
      dpr={dpr}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: tier === "high", powerPreference: "high-performance", alpha: false }}
      camera={{ fov: 42, near: 0.1, far: 140, position: [0, 2.3, 7.4] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        onReady?.();
      }}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <color attach="background" args={["#071C26"]} />
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <hemisphereLight args={["#B8EEF8", "#041017", 0.68]} />
      <directionalLight position={[4, 9, 3.5]} intensity={1.35} color="#EAF9FC" />
      <pointLight position={[-2.5, 1.4, 2.5]} intensity={3.6} distance={11} color="#48C9D9" />
      <CameraRig />
      <HydroSurface segments={tier === "high" ? 160 : 72} paused={reduced} followEnv />
      <GodRays paused={reduced} />
      <Seabed segments={tier === "high" ? 128 : 64} paused={reduced} />
      {tier === "high" && <Bubbles count={640} paused={reduced} />}
      <HeroVehicles scene={scene} heroX={heroX} />
    </Canvas>
  );
}
