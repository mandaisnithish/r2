// src/api/admin/productSubAdminApi.ts
import axiosInstance from "../axiosInstance";

const BASE = "/api/v1/products";

// ── Images ──────────────────────────────────────────────────────────────
export interface ProductImage {
  id: number;
  imageUrl: string;
  caption?: string;
  displayOrder: number;
}
export type ProductImagePayload = Omit<ProductImage, "id">;

export const productImageApi = {
  getAll: async (): Promise<ProductImage[]> => (await axiosInstance.get(`${BASE}/images`)).data,
  create: async (payload: ProductImagePayload): Promise<ProductImage> => (await axiosInstance.post(`${BASE}/images`, payload)).data,
  update: async (id: number, payload: ProductImagePayload): Promise<ProductImage> => (await axiosInstance.patch(`${BASE}/images/${id}`, payload)).data,
  remove: async (id: number): Promise<void> => { await axiosInstance.delete(`${BASE}/images/${id}`); },
};

// ── Features ────────────────────────────────────────────────────────────
export interface ProductFeature {
  id: number;
  icon?: string;
  title: string;
  description: string;
  displayOrder: number;
}
export type ProductFeaturePayload = Omit<ProductFeature, "id">;

export const productFeatureApi = {
  getAll: async (): Promise<ProductFeature[]> => (await axiosInstance.get(`${BASE}/features`)).data,
  create: async (payload: ProductFeaturePayload): Promise<ProductFeature> => (await axiosInstance.post(`${BASE}/features`, payload)).data,
  update: async (id: number, payload: ProductFeaturePayload): Promise<ProductFeature> => (await axiosInstance.patch(`${BASE}/features/${id}`, payload)).data,
  remove: async (id: number): Promise<void> => { await axiosInstance.delete(`${BASE}/features/${id}`); },
};

// ── Specs ───────────────────────────────────────────────────────────────
export interface ProductSpec {
  id: number;
  category?: string;
  label: string;
  value: string;
  description?: string;
  displayOrder: number;
}
export type ProductSpecPayload = Omit<ProductSpec, "id">;

export const productSpecApi = {
  getAll: async (): Promise<ProductSpec[]> => (await axiosInstance.get(`${BASE}/specs`)).data,
  create: async (payload: ProductSpecPayload): Promise<ProductSpec> => (await axiosInstance.post(`${BASE}/specs`, payload)).data,
  update: async (id: number, payload: ProductSpecPayload): Promise<ProductSpec> => (await axiosInstance.patch(`${BASE}/specs/${id}`, payload)).data,
  remove: async (id: number): Promise<void> => { await axiosInstance.delete(`${BASE}/specs/${id}`); },
};

// ── Steps (no displayOrder — uses stepNumber) ──────────────────────────
export interface ProductStep {
  id: number;
  stepNumber: number;
  icon?: string;
  title: string;
  description: string;
}
export type ProductStepPayload = Omit<ProductStep, "id">;

export const productStepApi = {
  getAll: async (): Promise<ProductStep[]> => (await axiosInstance.get(`${BASE}/steps`)).data,
  create: async (payload: ProductStepPayload): Promise<ProductStep> => (await axiosInstance.post(`${BASE}/steps`, payload)).data,
  update: async (id: number, payload: ProductStepPayload): Promise<ProductStep> => (await axiosInstance.patch(`${BASE}/steps/${id}`, payload)).data,
  remove: async (id: number): Promise<void> => { await axiosInstance.delete(`${BASE}/steps/${id}`); },
};

// ── Use Cases ───────────────────────────────────────────────────────────
export interface ProductUseCase {
  id: number;
  icon?: string;
  title: string;
  description: string;
  imageUrl?: string;
  displayOrder: number;
}
export type ProductUseCasePayload = Omit<ProductUseCase, "id">;

export const productUseCaseApi = {
  getAll: async (): Promise<ProductUseCase[]> => (await axiosInstance.get(`${BASE}/usecases`)).data,
  create: async (payload: ProductUseCasePayload): Promise<ProductUseCase> => (await axiosInstance.post(`${BASE}/usecases`, payload)).data,
  update: async (id: number, payload: ProductUseCasePayload): Promise<ProductUseCase> => (await axiosInstance.patch(`${BASE}/usecases/${id}`, payload)).data,
  remove: async (id: number): Promise<void> => { await axiosInstance.delete(`${BASE}/usecases/${id}`); },
};