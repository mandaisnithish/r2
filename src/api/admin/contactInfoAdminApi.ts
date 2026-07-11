// src/api/admin/contactInfoAdminApi.ts
import axiosInstance from "../axiosInstance";
import type { ContactInfo, ContactInfoPayload } from "../../types/contact";

const BASE = "/api/v1/contact-info";

/**
 * GET /api/v1/contact-info
 * Fetches all contact info versions (draft + live).
 */
export async function getAllContactInfo(): Promise<ContactInfo[]> {
  const res = await axiosInstance.get<ContactInfo[]>(BASE);
  return res.data;
}

/**
 * GET /api/v1/contact-info/{id}
 */
export async function getContactInfoById(id: number): Promise<ContactInfo> {
  const res = await axiosInstance.get<ContactInfo>(`${BASE}/${id}`);
  return res.data;
}

/**
 * POST /api/v1/contact-info
 * Creates a new draft contact info version.
 */
export async function createContactInfo(payload: ContactInfoPayload): Promise<ContactInfo> {
  const res = await axiosInstance.post<ContactInfo>(BASE, payload);
  return res.data;
}

/**
 * PATCH /api/v1/contact-info/{id}
 * Partial update of an existing version.
 */
export async function updateContactInfo(id: number, payload: ContactInfoPayload): Promise<ContactInfo> {
  const res = await axiosInstance.patch<ContactInfo>(`${BASE}/${id}`, payload);
  return res.data;
}

/**
 * PATCH /api/v1/contact-info/{id}/activate
 * Promotes this version to the single live/active one.
 */
export async function activateContactInfo(id: number): Promise<ContactInfo> {
  const res = await axiosInstance.patch<ContactInfo>(`${BASE}/${id}/activate`);
  return res.data;
}

/**
 * DELETE /api/v1/contact-info/{id}
 */
export async function deleteContactInfo(id: number): Promise<void> {
  await axiosInstance.delete(`${BASE}/${id}`);
}