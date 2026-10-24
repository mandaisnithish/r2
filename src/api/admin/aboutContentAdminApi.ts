/* Author: Nithish Kaliannan Ananth */
// src/api/admin/aboutContentAdminApi.ts
import axiosInstance from "../axiosInstance";
import type { AboutContent } from "../../types";

const BASE = "/api/v1/about-content";

export type AboutContentPayload = Omit<AboutContent, "id" | "isActive">;

export async function getAllAboutContent(): Promise<AboutContent[]> {
  const res = await axiosInstance.get<AboutContent[]>(BASE);
  return res.data;
}

export async function getAboutContentById(id: number): Promise<AboutContent> {
  const res = await axiosInstance.get<AboutContent>(`${BASE}/${id}`);
  return res.data;
}

export async function createAboutContent(payload: AboutContentPayload): Promise<AboutContent> {
  const res = await axiosInstance.post<AboutContent>(BASE, payload);
  return res.data;
}

export async function updateAboutContent(id: number, payload: AboutContentPayload): Promise<AboutContent> {
  const res = await axiosInstance.patch<AboutContent>(`${BASE}/${id}`, payload);
  return res.data;
}

export async function activateAboutContent(id: number): Promise<AboutContent> {
  const res = await axiosInstance.patch<AboutContent>(`${BASE}/${id}/activate`);
  return res.data;
}

export async function deleteAboutContent(id: number): Promise<void> {
  await axiosInstance.delete(`${BASE}/${id}`);
}