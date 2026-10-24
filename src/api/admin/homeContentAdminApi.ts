/* Author: Nithish Kaliannan Ananth */
// src/api/admin/homeContentAdminApi.ts
// Matches HomeContentController exactly. Note the inconsistent
// path: create is POST /api/v1/home-content/createContent
// (not just POST /api/v1/home-content like every other module),
// while everything else uses the plain base path.

import api from "../axiosInstance";
import type { HomeContent, HomeContentPayload } from "../../types/homeContent";

const BASE = "/api/v1/home-content";

export async function getAllHomeContent(): Promise<HomeContent[]> {
  const res = await api.get<HomeContent[]>(`${BASE}/all`);
  return res.data;
}

export async function getHomeContentById(id: number): Promise<HomeContent> {
  const res = await api.get<HomeContent>(`${BASE}/${id}`);
  return res.data;
}

export async function createHomeContent(
  payload: HomeContentPayload
): Promise<HomeContent> {
  const res = await api.post<HomeContent>(`${BASE}/createContent`, payload);
  return res.data;
}

export async function updateHomeContent(
  id: number,
  payload: Partial<HomeContentPayload>
): Promise<HomeContent> {
  const res = await api.patch<HomeContent>(`${BASE}/${id}`, payload);
  return res.data;
}

/**
 * Pushes a draft version live. This is a SEPARATE step from create/update --
 * the backend does not auto-activate new content. Without calling this,
 * saved changes never appear on the public site.
 */
export async function activateHomeContent(id: number): Promise<HomeContent> {
  const res = await api.patch<HomeContent>(`${BASE}/${id}/activate`);
  return res.data;
}

export async function deleteHomeContent(id: number): Promise<void> {
  await api.delete(`${BASE}/${id}`);
}