/* Author: Nithish Kaliannan Ananth */
// src/api/admin/valueAdminApi.ts
import axiosInstance from "../axiosInstance";
import type { Value } from "../../types";

const BASE = "/api/v1/values";

export type ValuePayload = Omit<Value, "id">;

export async function getAllValues(): Promise<Value[]> {
  const res = await axiosInstance.get<Value[]>(BASE);
  return res.data;
}

export async function createValue(payload: ValuePayload): Promise<Value> {
  const res = await axiosInstance.post<Value>(BASE, payload);
  return res.data;
}

export async function updateValue(id: number, payload: ValuePayload): Promise<Value> {
  const res = await axiosInstance.patch<Value>(`${BASE}/${id}`, payload);
  return res.data;
}

export async function deleteValue(id: number): Promise<void> {
  await axiosInstance.delete(`${BASE}/${id}`);
}