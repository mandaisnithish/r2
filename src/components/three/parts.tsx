// src/components/three/parts.tsx
// Shared bits for the procedural models: the exploded-view group and the
// HTML-in-3D telemetry pin.

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { Subsystem } from "./vehicleSpecs";

/** Slides its children along `offset × explode`, damped. */
export function ExplodeGroup({ offset, explode, children }: { offset: [number, number, number]; explode: number; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    g.position.x = THREE.MathUtils.damp(g.position.x, offset[0] * explode, 5, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, offset[1] * explode, 5, dt);
    g.position.z = THREE.MathUtils.damp(g.position.z, offset[2] * explode, 5, dt);
  });
  return <group ref={ref}>{children}</group>;
}

/** Telemetry pin tethered to a 3D anchor. zIndexRange keeps it under the nav. */
export function TelemetryPin({
  sub,
  active,
  compact,
  onPick,
}: {
  sub: Subsystem;
  active: boolean;
  compact: boolean;
  onPick?: (id: string) => void;
}) {
  return (
    <Html position={sub.anchor} zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
      <div className="pointer-events-none relative -translate-y-1/2" style={{ width: 0 }}>
        <span className={`absolute left-[-5px] top-[-5px] block h-2.5 w-2.5 border ${active ? "border-arc bg-arc/30" : "border-hydro bg-abyss/80"}`} />
        <span className={`absolute left-[5px] top-0 block h-px ${active ? "w-10 bg-arc" : "w-6 bg-hydro/70"}`} />
        <button
          type="button"
          onClick={() => onPick?.(sub.id)}
          className={`pointer-events-auto absolute top-[-11px] whitespace-nowrap border px-2 py-1 text-left font-mono uppercase tracking-stencil backdrop-blur-[2px] transition-colors ${
            active ? "left-[46px] border-arc/70 bg-abyss/85 text-bone" : "left-[30px] border-line-2 bg-abyss/70 text-fog hover:text-bone"
          }`}
        >
          <span className={`block text-[9px] ${active ? "text-arc" : "text-drift"}`}>{sub.code}</span>
          {(active || !compact) && <span className="block text-[10px]">{sub.label}</span>}
          {active && <span className="mt-0.5 block text-[9px] normal-case tracking-normal text-hydro">{sub.value}</span>}
        </button>
      </div>
    </Html>
  );
}
