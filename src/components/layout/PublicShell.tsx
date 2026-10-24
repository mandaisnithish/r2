// src/components/layout/PublicShell.tsx
// Persistent frame for the public site and RobotX. It stays mounted
// across routes so the WebGL Hydro-Field never restarts; only the outlet
// transitions. Admin uses its own console layout and never loads three.

import { Suspense, lazy, useEffect, useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import StagePoster from "./StagePoster";
import BootSequence from "./BootSequence";
import HydroRouteTransition from "./HydroRouteTransition";
import RouteFallback from "./RouteFallback";
import DepthGauge from "../ui/DepthGauge";
import SonarPingLayer from "../ui/SonarPingLayer";
import { detectTier, useReducedMotionPref } from "../../lib/quality";
import { hydroBus } from "../../lib/hydroBus";
import type { StageScene } from "../three/HydroStage";

const HydroStage = lazy(() => import("../three/HydroStage"));

function sceneFor(pathname: string): StageScene {
  if (pathname === "/") return "home";
  if (pathname === "/robotx" || pathname === "/robotx/") return "robotx";
  return "plain";
}

export default function PublicShell() {
  const location = useLocation();
  const outlet = useOutlet();
  const reduced = useReducedMotionPref();
  const [tier] = useState(detectTier);
  const [mountStage, setMountStage] = useState(false);
  const [stageReady, setStageReady] = useState(false);

  // Load WebGL after first paint so text is never waiting on three.js.
  useEffect(() => {
    if (tier === "off") return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const id = w.requestIdleCallback
      ? w.requestIdleCallback(() => setMountStage(true), { timeout: 1200 })
      : window.setTimeout(() => setMountStage(true), 300);
    return () => {
      if (!w.requestIdleCallback) window.clearTimeout(id);
    };
  }, [tier]);

  useEffect(() => {
    hydroBus.emit({ type: "route", path: location.pathname });
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen">
      <StagePoster visible={!stageReady} />
      {mountStage && (
        <Suspense fallback={null}>
          <HydroStage scene={sceneFor(location.pathname)} tier={tier} reduced={reduced} onReady={() => setStageReady(true)} />
        </Suspense>
      )}
      <div className="blueprint" aria-hidden="true" />
      <Navbar />
      <main id="main" className="relative z-10 min-h-screen pt-16">
        <HydroRouteTransition routeKey={location.pathname} reduced={reduced}>
          <Suspense fallback={<RouteFallback />}>{outlet}</Suspense>
        </HydroRouteTransition>
      </main>
      <Footer />
      <DepthGauge />
      <SonarPingLayer reduced={reduced} />
      <div className="grain" aria-hidden="true" />
      <BootSequence reduced={reduced} />
    </div>
  );
}
