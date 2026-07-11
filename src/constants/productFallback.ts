// src/constants/productFallback.ts
// Used only while backend is empty or unreachable,
// so the page never looks broken during development.

import type { Product } from "../types/product";

export const DEFAULT_PRODUCT: Product = {
  id: 0,
  name: "AquaBot v1",
  tagline: "First autonomous water surface cleaning robot",
  description:
    "AquaBot patrols lakes, rivers and harbors around the clock, using AI-powered sensors to detect and collect floating waste. Solar powered, fully autonomous, and built to operate without a single human hand on deck.",
  coverImageUrl: "",
  videoUrl: "",
  heroTitle: "Meet AquaBot",
  heroSubtitle: "The future of water cleanup is autonomous",
  ctaTitle: "Interested in AquaBot?",
  ctaButtonText: "Contact Us",
  active: true,
  images: [],
  features: [
    {
      icon: "ti-robot",
      title: "Fully autonomous",
      description: "No human operator needed once deployed.",
      displayOrder: 1,
    },
    {
      icon: "ti-solar-panel",
      title: "Solar powered",
      description: "Zero carbon footprint, charges itself in daylight.",
      displayOrder: 2,
    },
    {
      icon: "ti-wifi",
      title: "Real-time data",
      description: "Live monitoring dashboard for every deployment.",
      displayOrder: 3,
    },
    {
      icon: "ti-recycle",
      title: "Eco friendly",
      description: "No chemicals, no fuel, no disruption to wildlife.",
      displayOrder: 4,
    },
  ],
  steps: [
    {
      stepNumber: 1,
      icon: "ti-anchor",
      title: "Deployed on water",
      description: "Robot is placed on the water surface and begins patrol.",
    },
    {
      stepNumber: 2,
      icon: "ti-scan",
      title: "AI detects waste",
      description: "Onboard sensors scan and identify floating debris.",
    },
    {
      stepNumber: 3,
      icon: "ti-trash",
      title: "Waste collected",
      description: "Debris is gathered and stored in the onboard bin.",
    },
  ],
  specs: [
    { category: "Physical", label: "Weight", value: "15 kg", displayOrder: 1 },
    { category: "Physical", label: "Dimensions", value: "120 x 80 x 40 cm", displayOrder: 2 },
    { category: "Performance", label: "Speed", value: "2 m/s", displayOrder: 1 },
    { category: "Performance", label: "Battery life", value: "8 hours", displayOrder: 2 },
    { category: "Performance", label: "Coverage", value: "500 sqm/hr", displayOrder: 3 },
    { category: "Connectivity", label: "Network", value: "4G + WiFi", displayOrder: 1 },
    { category: "Connectivity", label: "GPS", value: "Yes", displayOrder: 2 },
  ],
  useCases: [
    {
      title: "Lakes",
      description: "Perfect for large still water bodies and reservoirs.",
      imageUrl: "",
      displayOrder: 1,
    },
    {
      title: "Rivers",
      description: "Handles flowing water with adaptive navigation.",
      imageUrl: "",
      displayOrder: 2,
    },
    {
      title: "Harbors",
      description: "Industrial-grade cleaning for ports and marinas.",
      imageUrl: "",
      displayOrder: 3,
    },
  ],
};