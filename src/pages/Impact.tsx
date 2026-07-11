// src/pages/Impact.tsx
import { useState, useEffect } from "react";
import { timelineApi } from "../api/timelineapi";
import type { TimelineEvent, TimelineDashboardStats } from "../api/timelineapi";

import ImpactHero from "../components/impact/ImpactHero";
import StatsSection from "../components/impact/StatsSection";
import Timeline from "../components/impact/Timeline";

export default function Impact() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [stats, setStats] = useState<TimelineDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([timelineApi.getAll(), timelineApi.getStats()])
      .then(([evts, st]) => {
        const sorted = [...evts].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setEvents(sorted);
        setStats(st);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <ImpactHero />
      <StatsSection stats={stats} />
      <Timeline events={events} loading={loading} error={error} />
    </div>
  );
}