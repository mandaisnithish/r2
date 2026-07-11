// src/api/admin/blogAdminApi.ts
// Matches BlogController exactly:
//   GET    /api/v1/blogs/all          (admin -- drafts + published)
//   POST   /api/v1/blogs              (create draft)
//   PATCH  /api/v1/blogs/{id}         (partial update -- only send changed fields)
//   PATCH  /api/v1/blogs/{id}/publish (toggle, no body)
//   DELETE /api/v1/blogs/{id}         (blocked server-side if published=true)

import api from "../axiosInstance";
import type { Blog, BlogPayload } from "../../types/blog";

export async function getAllBlogsForAdmin(): Promise<Blog[]> {
  const res = await api.get<Blog[]>("/api/v1/blogs/all");
  return res.data;
}

export async function createBlog(payload: BlogPayload): Promise<Blog> {
  const res = await api.post<Blog>("/api/v1/blogs", payload);
  return res.data;
}

export async function updateBlog(
  id: number,
  payload: BlogPayload
): Promise<Blog> {
  const res = await api.patch<Blog>(`/api/v1/blogs/${id}`, payload);
  return res.data;
}

export async function togglePublish(id: number): Promise<Blog> {
  const res = await api.patch<Blog>(`/api/v1/blogs/${id}/publish`);
  return res.data;
}

/**
 * Backend throws BusinessRuleViolationException (400/409 depending on
 * your exception handler mapping) if the blog is currently published.
 * The caller must catch this and show the real reason, not a generic
 * "failed to delete" message -- the fix is to unpublish first.
 */
export async function deleteBlog(id: number): Promise<void> {
  await api.delete(`/api/v1/blogs/${id}`);
}