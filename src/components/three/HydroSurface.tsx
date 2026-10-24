/* eslint-disable react-hooks/immutability --
 * react-three-fiber is imperative by design: GPU uniforms, scene fog and
 * object transforms are mutated every frame inside useFrame/effects
 * instead of going through React state (which would re-render at 60 fps).
 */
// src/components/three/HydroSurface.tsx
// The water. Listens to hydroBus so sonar pings and route changes become
// ripples, and follows the cursor with a decaying wake.

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { waterFragment, waterVertex } from "./shaders";
import { hydroBus } from "../../lib/hydroBus";
import { hydroClock, hydroEnv } from "./waves";

const SURFACE_Y = 0;

export default function HydroSurface({
  size = 90,
  segments = 160,
  amp = 1,
  fog = "#07131B",
  fogNear = 8,
  fogFar = 46,
  interactive = true,
  paused = false,
  followEnv = false,
}: {
  size?: number;
  segments?: number;
  amp?: number;
  fog?: string;
  fogNear?: number;
  fogFar?: number;
  interactive?: boolean;
  paused?: boolean;
  /** Take fog from the depth-driven camera rig (background stage only). */
  followEnv?: boolean;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { camera, gl } = useThree();
  const ripples = useRef(0);
  const wake = useRef(0);
  const lastMove = useRef(0);

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(size, size, segments, segments);
    g.rotateX(-Math.PI / 2);
    return g;
  }, [size, segments]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: amp },
      uRipples: { value: Array.from({ length: 4 }, () => new THREE.Vector4(0, 0, -100, 0)) },
      uPointer: { value: new THREE.Vector2(999, 999) },
      uWake: { value: 0 },
      uDeep: { value: new THREE.Color("#050C11") },
      uCrest: { value: new THREE.Color("#0C2430") },
      uLine: { value: new THREE.Color("#1F3542") },
      uHydro: { value: new THREE.Color("#00E5FF") },
      uFog: { value: new THREE.Color(fog) },
      uFogNear: { value: fogNear },
      uFogFar: { value: fogFar },
    }),
    // uniforms are created once; values are updated below
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    uniforms.uAmp.value = amp;
    uniforms.uFog.value.set(fog);
    uniforms.uFogNear.value = fogNear;
    uniforms.uFogFar.value = fogFar;
  }, [amp, fog, fogNear, fogFar, uniforms]);

  // Screen point (0..1) -> world xz on the water plane.
  const project = useMemo(() => {
    const ray = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -SURFACE_Y);
    const hit = new THREE.Vector3();
    const ndc = new THREE.Vector2();
    return (x: number, y: number): THREE.Vector2 => {
      ndc.set(x * 2 - 1, -(y * 2 - 1));
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, hit)) return new THREE.Vector2(hit.x, hit.z);
      // Looking down from under the surface: drop the ripple ahead of the camera.
      return new THREE.Vector2(camera.position.x + (x - 0.5) * 8, camera.position.z - 6);
    };
  }, [camera]);

  useEffect(() => {
    if (!interactive) return;
    const off = hydroBus.on((e) => {
      const t = uniforms.uTime.value;
      const slot = ripples.current++ % 4;
      if (e.type === "ripple") {
        const p = project(e.x, e.y);
        uniforms.uRipples.value[slot].set(p.x, p.y, t, e.strength);
      } else {
        const p = project(0.5, 0.62);
        uniforms.uRipples.value[slot].set(p.x, p.y, t, 1.6);
      }
    });
    const onMove = (ev: PointerEvent) => {
      const p = project(ev.clientX / window.innerWidth, ev.clientY / window.innerHeight);
      uniforms.uPointer.value.copy(p);
      lastMove.current = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      off();
      window.removeEventListener("pointermove", onMove);
    };
  }, [interactive, project, uniforms, gl]);

  useFrame((_, dt) => {
    if (paused) return;
    uniforms.uTime.value += Math.min(dt, 0.05);
    if (followEnv) {
      hydroClock.t = uniforms.uTime.value;
      uniforms.uFog.value.set(hydroEnv.fog);
      uniforms.uFogNear.value = hydroEnv.near;
      uniforms.uFogFar.value = hydroEnv.far;
    }
    const moving = performance.now() - lastMove.current < 220;
    wake.current = THREE.MathUtils.damp(wake.current, moving ? 1 : 0, moving ? 4 : 0.7, dt);
    uniforms.uWake.value = wake.current;
  });

  return (
    <mesh geometry={geometry} position={[0, SURFACE_Y, 0]} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={waterVertex}
        fragmentShader={waterFragment}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
