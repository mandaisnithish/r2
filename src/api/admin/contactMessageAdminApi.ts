// src/api/admin/contactMessageAdminApi.ts
// Admin-only calls. Uses the authenticated axios instance
// (axiosInstance.ts) so the Bearer token is attached
// automatically. Matches ContactMessageController exactly:
//   GET    /api/v1/contact
//   GET    /api/v1/contact/{id}
//   PATCH  /api/v1/contact/{id}/read
//   DELETE /api/v1/contact/{id}

import api from "../axiosInstance";
import type { ContactMessageAdmin } from "../../types/contactMessage";

export async function getAllMessages(): Promise<ContactMessageAdmin[]> {
  const res = await api.get<ContactMessageAdmin[]>("/api/v1/contact");
  return res.data;
}

export async function getMessageById(
  id: number
): Promise<ContactMessageAdmin> {
  const res = await api.get<ContactMessageAdmin>(`/api/v1/contact/${id}`);
  return res.data;
}

export async function markMessageAsRead(
  id: number
): Promise<ContactMessageAdmin> {
  const res = await api.patch<ContactMessageAdmin>(
    `/api/v1/contact/${id}/read`
  );
  return res.data;
}

export async function deleteMessage(id: number): Promise<void> {
  await api.delete(`/api/v1/contact/${id}`);
}