/* Author: Nithish Kaliannan Ananth */
// src/lib/queries.ts
// Cached CMS reads. Every hook starts with the real CMS snapshot as
// `initialData` (marked stale with `initialDataUpdatedAt: 0`), so pages
// render instantly while the Render-hosted API wakes up, and keep showing
// real content if it never answers. `live` tells the UI which one it got.

import { QueryClient, useQuery, type QueryKey } from "@tanstack/react-query";
import { getHomeContent, getStats } from "../api/homeApi";
import { getAboutContent, getMembers, getValues, getPartners } from "../api/aboutApi";
import { getActiveProduct } from "../api/productApi";
import { timelineApi } from "../api/timelineapi";
import { getActiveContactInfo } from "../api/contactApi";
import {
  HOME_CONTENT, HOME_STATS, ABOUT_CONTENT, VALUES, MEMBERS, PARTNERS,
  PRODUCT, TIMELINE_EVENTS, TIMELINE_STATS, CONTACT_INFO,
} from "../constants/cmsSnapshot";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000,
      gcTime: 30 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export type CmsResult<T> = { data: T; live: boolean; error: boolean };

export function useCms<T>(key: QueryKey, fetcher: () => Promise<T>, fallback: T): CmsResult<T> {
  const q = useQuery({
    queryKey: key,
    queryFn: fetcher,
    initialData: fallback,
    initialDataUpdatedAt: 0,
  });
  return { data: q.data ?? fallback, live: q.dataUpdatedAt > 0, error: q.isError };
}

const byOrder = <T extends { displayOrder?: number }>(a: T, b: T) =>
  (a.displayOrder ?? 0) - (b.displayOrder ?? 0);

export const useHomeContent = () =>
  useCms(["home-content"], async () => {
    const d = await getHomeContent();
    return (Array.isArray(d) ? d[0] : d) ?? HOME_CONTENT;
  }, HOME_CONTENT);

export const useHomeStats = () =>
  useCms(["home-stats"], async () => [...(await getStats())].sort(byOrder), HOME_STATS);

export const useAboutContent = () => useCms(["about-content"], getAboutContent, ABOUT_CONTENT);

export const useMembers = () =>
  useCms(["members"], async () => [...(await getMembers())].sort(byOrder), MEMBERS);

export const useValues = () =>
  useCms(["values"], async () => [...(await getValues())].sort(byOrder), VALUES);

export const usePartners = () =>
  useCms(["partners"], async () => [...(await getPartners())].sort(byOrder), PARTNERS);

export const useProduct = () =>
  useCms(["product"], async () => {
    const p = await getActiveProduct();
    return {
      ...p,
      images: [...p.images].sort(byOrder),
      features: [...p.features].sort(byOrder),
      specs: [...p.specs].sort(byOrder),
      steps: [...p.steps].sort((a, b) => a.stepNumber - b.stepNumber),
      useCases: [...p.useCases].sort(byOrder),
    };
  }, PRODUCT);

export const useTimeline = () =>
  useCms(["timeline"], async () =>
    [...(await timelineApi.getAll())].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ), TIMELINE_EVENTS);

export const useTimelineStats = () => useCms(["timeline-stats"], timelineApi.getStats, TIMELINE_STATS);

export const useContactInfo = () => useCms(["contact-info"], getActiveContactInfo, CONTACT_INFO);
