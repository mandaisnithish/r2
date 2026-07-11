// src/api/blogApi.ts
// Public endpoints only -- matches BlogController exactly:
//   GET /api/v1/blogs          (published only, reverse-chronological)
//   GET /api/v1/blogs/{slug}   (single published post)
//
// Note: plain axios here, NOT the authenticated axiosInstance --
// these are public reads, no token needed, same pattern as
// productApi.ts and contactApi.ts.

import axios from "axios";
import type { Blog } from "../types/blog";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function getPublishedBlogs(): Promise<Blog[]> {
  const res = await axios.get<Blog[]>(`${BASE_URL}/api/v1/blogs`);
  return res.data;
}

export async function getBlogBySlug(slug: string): Promise<Blog> {
  const res = await axios.get<Blog>(`${BASE_URL}/api/v1/blogs/${slug}`);
  return res.data;
}