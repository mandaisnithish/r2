/* Author: Nithish Kaliannan Ananth */
// src/api/admin/timelineAdminApi.ts
import axiosInstance from "../axiosInstance";
import type { TimelineEvent, TimelineCategory } from "../timelineapi";

const BASE = "/api/v1/timeline";

export type TimelineEventPayload = Omit<TimelineEvent, "id" | "createdAt" | "updatedAt">;

/**
 * GET /api/v1/timeline (admin — uses authenticated instance since it may
 * be called from the dashboard; the public page uses the plain axios version
 * in timelineapi.ts instead)
 */
export async function getAllTimelineEventsAdmin(): Promise<TimelineEvent[]> {
  const res = await axiosInstance.get<TimelineEvent[]>(BASE);
  return res.data;
}

export async function getTimelineEventByIdAdmin(id: number): Promise<TimelineEvent> {
  const res = await axiosInstance.get<TimelineEvent>(`${BASE}/${id}`);
  return res.data;
}

export async function createTimelineEvent(payload: TimelineEventPayload): Promise<TimelineEvent> {
  const res = await axiosInstance.post<TimelineEvent>(BASE, payload);
  return res.data;
}

export async function updateTimelineEvent(id: number, payload: TimelineEventPayload): Promise<TimelineEvent> {
  const res = await axiosInstance.patch<TimelineEvent>(`${BASE}/${id}`, payload);
  return res.data;
}

export async function deleteTimelineEvent(id: number): Promise<void> {
  await axiosInstance.delete(`${BASE}/${id}`);
}

export type { TimelineEvent, TimelineCategory };