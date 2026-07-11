// src/pages/Product.tsx
import { useEffect, useState } from "react";
import { getActiveProduct } from "../api/productApi";
import { DEFAULT_PRODUCT } from "../constants/productFallback";
import type { Product } from "../types/product";

import ProductHero from "../components/product/ProductHero";
import ProductInfo from "../components/product/ProductInfo";
import ProductGallery from "../components/product/ProductGallery";
import ProductFeatures from "../components/product/ProductFeatures";
import HowItWorks from "../components/product/HowItWorks";
import ProductDemoVideo from "../components/product/ProductDemoVideo";
import TechSpecs from "../components/product/TechSpecs";
import UseCases from "../components/product/UseCases";
import ProductCTA from "../components/product/ProductCTA";

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getActiveProduct();
        setProduct(data);
      } catch (err) {
        console.error("Active product fetch failed, using fallback", err);
        setProduct(DEFAULT_PRODUCT);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E]">
        <div className="w-10 h-10 border-2 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div>
      <ProductHero
        heroTitle={product.heroTitle || product.name}
        heroSubtitle={product.heroSubtitle || product.tagline}
      />

      <ProductInfo
        name={product.name}
        tagline={product.tagline}
        description={product.description}
        coverImageUrl={product.coverImageUrl}
      />

      <ProductGallery
        name={product.name}
        images={product.images}
        fallbackImageUrl={product.coverImageUrl}
      />

      {product.features.length > 0 && (
        <ProductFeatures features={product.features} />
      )}

      {product.steps.length > 0 && <HowItWorks steps={product.steps} />}

      <ProductDemoVideo videoUrl={product.videoUrl} />

      {product.specs.length > 0 && <TechSpecs specs={product.specs} />}

      {product.useCases.length > 0 && (
        <UseCases useCases={product.useCases} />
      )}

      <ProductCTA
        ctaTitle={product.ctaTitle}
        ctaButtonText={product.ctaButtonText}
      />
    </div>
  );
}