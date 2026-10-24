/* Author: Nithish Kaliannan Ananth */
// src/components/layout/LinkStatus.tsx
// Honest telemetry: shows whether the page is reading the live CMS or the
// built-in snapshot (the Render API sleeps when idle and takes a while to
// wake).

import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import SonarBadge from "../ui/SonarBadge";

export default function LinkStatus({ className = "" }: { className?: string }) {
  const qc = useQueryClient();
  const fetching = useIsFetching();
  const queries = qc.getQueryCache().getAll();
  const anyLive = queries.some((q) => q.state.dataUpdatedAt > 0);
  const anyError = queries.some((q) => q.state.status === "error");
  const status = anyLive ? "live" : fetching > 0 ? "ongoing" : anyError ? "cached" : "cached";
  const label = anyLive ? "CMS link · live" : fetching > 0 ? "CMS link · waking" : "CMS link · cached";
  return <SonarBadge status={status} label={label} className={className} />;
}
