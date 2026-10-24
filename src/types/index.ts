/* Author: Nithish Kaliannan Ananth */
// ==========================================
// 🏠 1. HOME / LANDING MODULE CONTRACTS
// ==========================================
// ==========================================
// 🏠 1. HOME / LANDING MODULE CONTRACTS
// ==========================================
export interface HomeContent {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  
  problemTitle: string;
  problemText: string;
  problemImageUrl: string;   // Exact match to backend JSON key
  
  solutionTitle: string;
  solutionText: string;
  solutionImageUrl: string;  // Exact match to backend JSON key
  
  ctaTitle: string;
  ctaButtonText: string;
  active: boolean;           // Matches "active": true from your response
}


export interface Stat {
  id: number;
  label: string;
  numericValue: number;
  suffix?: string;
  prefix?: string;
  displayOrder: number;
}


// ==========================================
// ☕ 2. PRODUCT / HARDWARE MODULE CONTRACTS
// ==========================================
export interface Product {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  coverImageUrl: string;
  active: boolean;
  displayOrder: number;
}

// Sub-component API payload shapes (Imported directly from our product API layer)
export interface ProductImageDTO {
  id: number;
  imageUrl: string;
  caption?: string;
  displayOrder: number;
}

export interface ProductFeatureDTO {
  id: number;
  icon?: string;
  title: string;
  description: string;
  displayOrder: number;
}

export interface ProductSpecDTO {
  id: number;
  category?: string;
  label: string;
  value: string;
  description?: string;
  displayOrder: number;
}

export interface ProductStepDTO {
  id: number;
  stepNumber: number;
  icon?: string;
  title: string;
  description: string;
}

export interface ProductUseCaseDTO {
  id: number;
  icon?: string;
  title: string;
  description: string;
  imageUrl?: string;
  displayOrder: number;
}


// ==========================================
// 🏢 3. ABOUT / CORPORATE MODULE CONTRACTS
// ==========================================
export interface AboutContent {
  id: number;
  heroTitle: string;
  heroSubtitle?: string;
  storyTitle: string;
  storyText?: string;
  storyImageUrl?: string;
  missionTitle?: string;
  missionText?: string;
  visionTitle?: string;
  visionText?: string;
  whyTitle?: string;
  whyText?: string;
  ctaTitle?: string;
  ctaButtonText?: string;
  isActive: boolean;
}

export interface Value {
  id: number;
  title: string;
  description: string;
  icon?: string;
  displayOrder?: number;
}

export interface Member {
  id: number;
  name: string;
  role: string;
  photoUrl?: string;
  bio?: string;
  expertise?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  displayOrder: number;
}

export interface Partner {
  id: number;
  name: string;
  logoUrl?: string;
  website?: string;
  category?: string;
  displayOrder?: number;
}