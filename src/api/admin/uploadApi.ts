/* Author: Nithish Kaliannan Ananth */
// src/api/admin/uploadApi.ts
// Matches UploadController exactly:
//   POST /api/v1/upload/media?folder=X   (NOT /image -- it's /media)
//   DELETE /api/v1/upload/media?url=X
//
// Backend allows: image/jpeg, image/png, image/webp, image/gif,
// image/svg+xml, video/mp4, video/quicktime
// Anything else gets rejected with 400 before it ever reaches Cloudinary.

import api from "../axiosInstance";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/quicktime",
];

export function isAllowedFileType(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type.toLowerCase());
}

export async function uploadMedia(
  file: File,
  folder: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<{ url: string }>(
    `/api/v1/upload/media?folder=${encodeURIComponent(folder)}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data.url;
}

export async function deleteMedia(url: string): Promise<void> {
  await api.delete(`/api/v1/upload/media?url=${encodeURIComponent(url)}`);
}