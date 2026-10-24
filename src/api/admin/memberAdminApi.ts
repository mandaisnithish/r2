/* Author: Nithish Kaliannan Ananth */
// src/api/admin/memberAdminApi.ts
import axiosInstance from "../axiosInstance";
import type { Member } from "../../types";

const BASE = "/api/v1/members";

export type MemberPayload = Omit<Member, "id">;

export async function getAllMembers(): Promise<Member[]> {
  const res = await axiosInstance.get<Member[]>(BASE);
  return res.data;
}

export async function createMember(payload: MemberPayload): Promise<Member> {
  const res = await axiosInstance.post<Member>(BASE, payload);
  return res.data;
}

export async function updateMember(id: number, payload: MemberPayload): Promise<Member> {
  const res = await axiosInstance.patch<Member>(`${BASE}/${id}`, payload);
  return res.data;
}

export async function deleteMember(id: number): Promise<void> {
  await axiosInstance.delete(`${BASE}/${id}`);
}