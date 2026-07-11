// src/api/productApi.ts
import axios from "axios";
import type {
  Product,
  ProductImage,
  ProductFeature,
  ProductSpec,
  ProductStep,
  ProductUseCase,
} from "../types/product";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const PRODUCTS_URL = `${BASE_URL}/api/v1/products`;

// Raw shape returned by GET /api/v1/products/active.
// This is the flat ProductDTO — no nested arrays.
interface ProductDTO {
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
}

/**
 * The backend has no single "full product detail" endpoint.
 * Product, images, features, specs, steps and use cases each
 * live behind their own endpoint (see ProductController), and
 * the sub-entities aren't filtered by product id since there's
 * only one product. So we fetch all 6 in parallel and merge
 * them into the shape the page components expect.
 */
export async function getActiveProduct(): Promise<Product> {
  const [productRes, imagesRes, featuresRes, specsRes, stepsRes, useCasesRes] =
    await Promise.all([
      axios.get<ProductDTO>(`${PRODUCTS_URL}/active`),
      axios.get<ProductImage[]>(`${PRODUCTS_URL}/images`),
      axios.get<ProductFeature[]>(`${PRODUCTS_URL}/features`),
      axios.get<ProductSpec[]>(`${PRODUCTS_URL}/specs`),
      axios.get<ProductStep[]>(`${PRODUCTS_URL}/steps`),
      axios.get<ProductUseCase[]>(`${PRODUCTS_URL}/usecases`),
    ]);

  return {
    ...productRes.data,
    images: imagesRes.data,
    features: featuresRes.data,
    specs: specsRes.data,
    steps: stepsRes.data,
    useCases: useCasesRes.data,
  };
}