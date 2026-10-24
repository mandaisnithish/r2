// src/lib/blogQueries.ts
// Blog reads live in their own module so the blog snapshot (≈30 KB of
// post HTML) only ships with the blog routes.

import { getPublishedBlogs, getBlogBySlug } from "../api/blogApi";
import { BLOGS } from "../constants/blogSnapshot";
import { useCms } from "./queries";
import type { Blog } from "../types/blog";

const newestFirst = (a: Blog, b: Blog) =>
  new Date(b.publishedAt || b.createdAt || 0).getTime() -
  new Date(a.publishedAt || a.createdAt || 0).getTime();

export const useBlogs = () =>
  useCms(["blogs"], async () => {
    const list = await getPublishedBlogs();
    // The API already returns newest first; only re-sort when dates exist.
    return list.some((b) => b.publishedAt || b.createdAt) ? [...list].sort(newestFirst) : list;
  }, BLOGS);

export function useBlog(slug: string) {
  const fallback = BLOGS.find((b) => b.slug === slug) ?? null;
  return useCms<Blog | null>(["blog", slug], () => getBlogBySlug(slug), fallback);
}
