/* Author: Nithish Kaliannan Ananth */
/* eslint-disable react-hooks/immutability --
 * react-three-fiber is imperative by design: GPU uniforms, scene fog and
 * object transforms are mutated every frame inside useFrame/effects
 * instead of going through React state (which would re-render at 60 fps).
 */
// src/components/three/Seabed.tsx
// Sonar bathymetry survey of the river bed at the bottom of the descent.
// Route changes send a sonar sweep across it.

import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { seabedFragment, seabedVertex } from "./shaders";
import { hydroBus } from "../../lib/hydroBus";
import { hydroEnv } from "./waves";

export default function Seabed({
  y = -24,
  size = 140,
  segments = 128,
  fog = "#03080B",
  paused = false,
}: {
  y?: number;
  size?: number;
  segments?: number;
  fog?: string;
  paused?: boolean;
}) {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(size, size, segments, segments);
    g.rotateX(-Math.PI / 2);
    return g;
  }, [size, segments]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBase: { value: new THREE.Color("#0B1820") },
      uLine: { value: new THREE.Color("#22414E") },
      uHydro: { value: new THREE.Color("#00E5FF") },
      uFog: { value: new THREE.Color(fog) },
      uFogNear: { value: 6 },
      uFogFar: { value: 42 },
      uPing: { value: new THREE.Vector4(0, 0, -100, 0) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    uniforms.uFog.value.set(fog);
  }, [fog, uniforms]);

  useEffect(
    () =>
      hydroBus.on((e) => {
        if (e.type === "route") uniforms.uPing.value.set(0, -6, uniforms.uTime.value, 1);
      }),
    [uniforms]
  );

  useFrame((_, dt) => {
    if (!paused) uniforms.uTime.value += Math.min(dt, 0.05);
    uniforms.uFog.value.set(hydroEnv.seabedFog);
  });

  return (
    <mesh geometry={geometry} position={[0, y, -10]} frustumCulled={false}>
      <shaderMaterial vertexShader={seabedVertex} fragmentShader={seabedFragment} uniforms={uniforms} />
    </mesh>
  );
}
