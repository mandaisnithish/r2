/* Author: Nithish Kaliannan Ananth */
// src/api/admin/productAdminApi.ts
import axiosInstance from "../axiosInstance";

const BASE = "/api/v1/products";

// Matches the REAL backend ProductDTO — note this differs from the
// `Product` interface in src/types.ts (that one has slug/active/displayOrder
// which don't exist on the actual DTO; this one has heroTitle/videoUrl/cta*
// which the DTO actually has). Use THIS type for all product admin work.
export interface AdminProduct {
  id: number;
  name: string;
  tagline: string;
  description: string;
  heroTitle?: string;
  heroSubtitle?: string;
  coverImageUrl?: string;
  videoUrl?: string;
  ctaTitle?: string;
  ctaButtonText?: string;
  createdAt?: string;
}

export type AdminProductPayload = Omit<AdminProduct, "id" | "createdAt">;

export async function getAllProducts(): Promise<AdminProduct[]> {
  const res = await axiosInstance.get<AdminProduct[]>(BASE);
  return res.data;
}

export async function getProductById(id: number): Promise<AdminProduct> {
  const res = await axiosInstance.get<AdminProduct>(`${BASE}/${id}`);
  return res.data;
}

/**
 * The DTO has no `active` field, so we resolve the live product by calling
 * /active and returning its id. Returns null if none is active (e.g. 404).
 */
export async function getActiveProductId(): Promise<number | null> {
  try {
    const res = await axiosInstance.get<AdminProduct>(`${BASE}/active`);
    return res.data?.id ?? null;
  } catch {
    return null;
  }
}

export async function createProduct(payload: AdminProductPayload): Promise<AdminProduct> {
  const res = await axiosInstance.post<AdminProduct>(BASE, payload);
  return res.data;
}

export async function updateProduct(id: number, payload: AdminProductPayload): Promise<AdminProduct> {
  const res = await axiosInstance.patch<AdminProduct>(`${BASE}/${id}`, payload);
  return res.data;
}

export async function activateProduct(id: number): Promise<void> {
  await axiosInstance.patch(`${BASE}/${id}/activate`);
}

export async function deleteProduct(id: number): Promise<void> {
  await axiosInstance.delete(`${BASE}/${id}`);
}