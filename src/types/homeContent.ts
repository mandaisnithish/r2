/* Author: Nithish Kaliannan Ananth */
// src/types/homeContent.ts
// Matches HomeContentDTO and HomeStatDTO exactly.

export interface HomeContent {
  id: number;
  heroTitle: string;
  heroSubtitle?: string;
  heroButtonText?: string;
  problemTitle: string;
  problemText?: string;
  problemImageUrl?: string;
  solutionTitle: string;
  solutionText?: string;
  solutionImageUrl?: string;
  ctaTitle?: string;
  ctaButtonText?: string;
  active?: boolean;
}

// Used for both create (POST /createContent) and update (PATCH /{id}).
// id is omitted on create -- backend generates it.
export type HomeContentPayload = Omit<HomeContent, "id">;

export interface HomeStat {
  id: number;
  label: string;
  numericValue: number;
  prefix?: string;
  suffix?: string;
  displayOrder: number;
}

export type HomeStatPayload = Omit<HomeStat, "id">;