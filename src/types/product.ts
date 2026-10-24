/* Author: Nithish Kaliannan Ananth */
// src/types/product.ts
// Matches ProductDTO + sub-entity DTOs returned by
// GET /api/v1/products/active

export interface ProductImage {
  id?: number;
  imageUrl: string;
  caption?: string;
  displayOrder?: number;
}

export interface ProductFeature {
  id?: number;
  icon?: string;
  title: string;
  description: string;
  displayOrder?: number;
}

export interface ProductSpec {
  id?: number;
  category?: string;
  label: string;
  value: string;
  description?: string;
  displayOrder?: number;
}

export interface ProductStep {
  id?: number;
  stepNumber: number;
  icon?: string;
  title: string;
  description: string;
}

export interface ProductUseCase {
  id?: number;
  icon?: string;
  title: string;
  description: string;
  imageUrl?: string;
  displayOrder?: number;
}

export interface Product {
  id: number;
  name: string;
  tagline: string;
  description: string;
  coverImageUrl?: string;
  videoUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  ctaTitle?: string;
  ctaButtonText?: string;
  active: boolean;

  images: ProductImage[];
  features: ProductFeature[];
  specs: ProductSpec[];
  steps: ProductStep[];
  useCases: ProductUseCase[];
}