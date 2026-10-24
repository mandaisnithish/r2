/* eslint-disable react-hooks/immutability --
 * react-three-fiber is imperative by design: GPU uniforms, scene fog and
 * object transforms are mutated every frame inside useFrame/effects
 * instead of going through React state (which would re-render at 60 fps).
 */
// src/components/three/Bubbles.tsx
// Bubbles rising through the water column; they lean with the cursor.

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { bubbleFragment, bubbleVertex } from "./shaders";
import { mulberry32 } from "./waves";

export default function Bubbles({ count = 600, top = -0.4, bottom = -24, paused = false }: { count?: number; top?: number; bottom?: number; paused?: boolean }) {
  const drift = useRef(0);
  const target = useRef(0);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    const seed = new Float32Array(count);
    const rand = mulberry32(7);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * 40;
      pos[i * 3 + 1] = bottom + rand() * (top - bottom);
      pos[i * 3 + 2] = -rand() * 30 + 4;
      speed[i] = 0.25 + rand() * 0.6;
      seed[i] = rand();
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count, top, bottom]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTop: { value: top },
      uBottom: { value: bottom },
      uDrift: { value: 0 },
      uHydro: { value: new THREE.Color("#7FF3FF") },
    }),
    [top, bottom]
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current = (e.clientX / window.innerWidth - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, dt) => {
    if (paused) return;
    uniforms.uTime.value += Math.min(dt, 0.05);
    drift.current = THREE.MathUtils.damp(drift.current, target.current, 1.2, dt);
    uniforms.uDrift.value = drift.current;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={bubbleVertex}
        fragmentShader={bubbleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
