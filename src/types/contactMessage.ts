/* Author: Nithish Kaliannan Ananth */
// src/types/contactMessage.ts
// Matches ContactMessageController -> /api/v1/contact
// and ContactMessage entity fields exactly.

export interface ContactMessageAdmin {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  submittedAt: string; // ISO LocalDateTime string
}