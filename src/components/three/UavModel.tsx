/* eslint-disable react-hooks/immutability --
 * react-three-fiber is imperative by design: GPU uniforms, scene fog and
 * object transforms are mutated every frame inside useFrame/effects
 * instead of going through React state (which would re-render at 60 fps).
 */
// src/components/three/UavModel.tsx
// Procedural S500 quadcopter (REVELATION): stacked centre plates, four
// arms, motors with spinning props, landing gear, GPS mast, camera and
// strapped LiPo. Same focus/explode/pin contract as VesselModel.

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SUBSYSTEMS } from "./vehicleSpecs";
import { ExplodeGroup, TelemetryPin } from "./parts";

function useMat(make: () => THREE.MeshStandardMaterial | THREE.MeshBasicMaterial, dim: boolean, hot: boolean) {
  const m = useMemo(() => make(), [make]);
  useEffect(() => {
    m.transparent = dim || m.userData.t === true;
    m.opacity = dim ? 0.25 : 1;
    m.depthWrite = !dim;
    if (m instanceof THREE.MeshStandardMaterial) {
      m.emissive.set(hot ? "#00E5FF" : "#000000");
      m.emissiveIntensity = hot ? 0.45 : 0;
    }
    m.needsUpdate = true;
  }, [m, dim, hot]);
  useEffect(() => () => m.dispose(), [m]);
  return m;
}

const frameMat = () => new THREE.MeshStandardMaterial({ color: "#14191E", roughness: 0.5, metalness: 0.4 });
const armMat = () => new THREE.MeshStandardMaterial({ color: "#1C232A", roughness: 0.45, metalness: 0.35 });
const motorMat = () => new THREE.MeshStandardMaterial({ color: "#3C4852", roughness: 0.35, metalness: 0.8 });
const chipMat = () => new THREE.MeshStandardMaterial({ color: "#1B242B", roughness: 0.4, metalness: 0.5 });
const lipoMat = () => new THREE.MeshStandardMaterial({ color: "#2A2F33", roughness: 0.6 });
const propMat = () => new THREE.MeshBasicMaterial({ color: "#00E5FF", transparent: true, opacity: 0.9 });



const ARMS = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
] as const;

export default function UavModel({
  explode = 0,
  focus = null,
  pins = false,
  compactPins = false,
  onPick,
  spinning = true,
}: {
  explode?: number;
  focus?: string | null;
  pins?: boolean;
  compactPins?: boolean;
  onPick?: (id: string) => void;
  spinning?: boolean;
}) {
  const subs = SUBSYSTEMS.revelation;
  const off = (id: string) => subs.find((s) => s.id === id)?.explode ?? ([0, 0, 0] as [number, number, number]);
  const dim = (id: string) => !!focus && focus !== id;
  const hot = (id: string) => focus === id;

  const frame = useMat(frameMat, dim("avionics") && dim("propulsion"), false);
  const arm = useMat(armMat, dim("propulsion"), hot("propulsion"));
  const motor = useMat(motorMat, dim("propulsion"), hot("propulsion"));
  const prop = useMat(propMat, dim("propulsion"), false);
  const avionics = useMat(chipMat, dim("avionics"), hot("avionics"));
  const cam = useMat(chipMat, dim("vision"), hot("vision"));
  const gps = useMat(chipMat, dim("nav"), hot("nav"));
  const lipo = useMat(lipoMat, dim("power"), hot("power"));

  const props = useRef<(THREE.Group | null)[]>([]);
  useFrame((_, dt) => {
    if (!spinning) return;
    props.current.forEach((p, i) => {
      if (p) p.rotation.y += dt * (i % 2 ? -38 : 38);
    });
  });

  return (
    <group>
      {/* centre plates */}
      <mesh material={frame} position={[0, 0.06, 0]}>
        <boxGeometry args={[0.42, 0.025, 0.42]} />
      </mesh>
      <mesh material={frame} position={[0, -0.04, 0]}>
        <boxGeometry args={[0.36, 0.02, 0.36]} />
      </mesh>

      {/* arms, motors, props */}
      <ExplodeGroup offset={off("propulsion")} explode={explode}>
        {ARMS.map(([sx, sz], i) => (
          <group key={i}>
            <mesh material={arm} position={[sx * 0.38, 0.03, sz * 0.38]} rotation={[0, (sx * sz > 0 ? -1 : 1) * Math.PI / 4, 0]}>
              <boxGeometry args={[0.07, 0.03, 0.82]} />
            </mesh>
            <mesh material={motor} position={[sx * 0.66, 0.1, sz * 0.66]}>
              <cylinderGeometry args={[0.06, 0.07, 0.08, 18]} />
            </mesh>
            <group ref={(el) => { props.current[i] = el; }} position={[sx * 0.66, 0.155, sz * 0.66]}>
              <mesh material={prop}>
                <boxGeometry args={[0.52, 0.006, 0.045]} />
              </mesh>
            </group>
          </group>
        ))}
        {/* landing gear */}
        {[-1, 1].map((sx) => (
          <group key={sx}>
            <mesh material={arm} position={[sx * 0.16, -0.2, 0]} rotation={[0, 0, sx * 0.25]}>
              <boxGeometry args={[0.02, 0.32, 0.02]} />
            </mesh>
            <mesh material={arm} position={[sx * 0.2, -0.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.52, 8]} />
            </mesh>
          </group>
        ))}
      </ExplodeGroup>

      {/* flight stack */}
      <ExplodeGroup offset={off("avionics")} explode={explode}>
        <mesh material={avionics} position={[0, 0.1, -0.02]}>
          <boxGeometry args={[0.16, 0.05, 0.12]} />
        </mesh>
        <mesh material={avionics} position={[0, 0.14, 0.12]}>
          <boxGeometry args={[0.15, 0.03, 0.1]} />
        </mesh>
      </ExplodeGroup>

      {/* GPS mast */}
      <ExplodeGroup offset={off("nav")} explode={explode}>
        <mesh material={gps} position={[0, 0.34, 0.15]}>
          <cylinderGeometry args={[0.008, 0.008, 0.4, 6]} />
        </mesh>
        <mesh material={gps} position={[0, 0.56, 0.15]}>
          <cylinderGeometry args={[0.07, 0.07, 0.025, 20]} />
        </mesh>
      </ExplodeGroup>

      {/* camera under the nose */}
      <ExplodeGroup offset={off("vision")} explode={explode}>
        <mesh material={cam} position={[0, -0.12, -0.24]}>
          <boxGeometry args={[0.08, 0.07, 0.06]} />
        </mesh>
      </ExplodeGroup>

      {/* LiPo strapped under the frame */}
      <ExplodeGroup offset={off("power")} explode={explode}>
        <mesh material={lipo} position={[0, -0.1, 0.06]}>
          <boxGeometry args={[0.12, 0.07, 0.3]} />
        </mesh>
      </ExplodeGroup>

      {pins &&
        subs.map((s) => (
          <ExplodeGroup key={s.id} offset={s.explode} explode={explode}>
            <TelemetryPin sub={s} active={focus === s.id} compact={compactPins} onPick={onPick} />
          </ExplodeGroup>
        ))}
    </group>
  );
}
