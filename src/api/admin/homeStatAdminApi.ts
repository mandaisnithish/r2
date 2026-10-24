/* Author: Nithish Kaliannan Ananth */
// src/api/admin/homeStatAdminApi.ts
// Matches HomeStatController exactly: GET, POST, PATCH, DELETE
// all under /api/v1/home-stats, no special sub-paths.

import api from "../axiosInstance";
import type { HomeStat, HomeStatPayload } from "../../types/homeContent";

const BASE = "/api/v1/home-stats";

export async function getAllHomeStats(): Promise<HomeStat[]> {
  const res = await api.get<HomeStat[]>(BASE);
  return res.data;
}

export async function createHomeStat(
  payload: HomeStatPayload
): Promise<HomeStat> {
  const res = await api.post<HomeStat>(BASE, payload);
  return res.data;
}

export async function updateHomeStat(
  id: number,
  payload: Partial<HomeStatPayload>
): Promise<HomeStat> {
  const res = await api.patch<HomeStat>(`${BASE}/${id}`, payload);
  return res.data;
}

export async function deleteHomeStat(id: number): Promise<void> {
  await api.delete(`${BASE}/${id}`);
}