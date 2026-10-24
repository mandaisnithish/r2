/* Author: Nithish Kaliannan Ananth */
// src/types/blog.ts
// Matches BlogDTO fields exactly (mirrors Blog entity,
// since BlogMapper.toDTO/toEntity appear to be 1:1 field maps
// based on BlogServiceImpl's null-checked patch logic).

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  category?: string;
  tags?: string; // comma-separated, e.g. "water,robot,AI"
  authorId?: number;
  author?: string;
  readTime?: number;
  published: boolean;
  publishedAt?: string; // ISO LocalDateTime, only set once published
  createdAt: string;
  updatedAt: string;
}

// Payload shape for create (POST) and update (PATCH).
// slug is never sent -- backend always generates/preserves it.
// id, createdAt, updatedAt, publishedAt are server-controlled.
export interface BlogPayload {
  title?: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  category?: string;
  tags?: string;
  authorId?: number;
  author?: string;
  readTime?: number;
  published?: boolean;
}