// src/api/admin/partnerAdminApi.ts
// Partner CRUD for the About page "Network" section. Mirrors the other
// admin modules (memberAdminApi, valueAdminApi): REST on /api/v1/partners
// with PATCH for updates. The public GET /api/v1/partners already exists.

import axiosInstance from "../axiosInstance";
import type { Partner } from "../../types";

const BASE = "/api/v1/partners";

export type PartnerPayload = Omit<Partner, "id">;

export async function getAllPartners(): Promise<Partner[]> {
  const res = await axiosInstance.get<Partner[]>(BASE);
  return res.data;
}

export async function createPartner(payload: PartnerPayload): Promise<Partner> {
  const res = await axiosInstance.post<Partner>(BASE, payload);
  return res.data;
}

export async function updatePartner(id: number, payload: PartnerPayload): Promise<Partner> {
  const res = await axiosInstance.patch<Partner>(`${BASE}/${id}`, payload);
  return res.data;
}

export async function deletePartner(id: number): Promise<void> {
  await axiosInstance.delete(`${BASE}/${id}`);
}
