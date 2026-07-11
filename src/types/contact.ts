// src/types/contact.ts
// Matches ContactInfoDTO (GET /api/v1/contact-info/active, and admin CRUD)
// and ContactMessageDTO (POST /api/v1/contact)

export interface ContactInfo {
  id: number;
  heroTitle: string;
  heroSubtitle?: string;
  email: string;
  phone?: string;
  address?: string;
  mapEmbedUrl?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  // NOTE: backend DTO field is "active", not "isActive"
  active: boolean;
}

// Payload for create/update — id and active are handled separately
// (id generated on create, active toggled via /activate endpoint)
export type ContactInfoPayload = Omit<ContactInfo, "id" | "active">;

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessageResponse extends ContactMessagePayload {
  id: number;
  isRead: boolean;
  submittedAt: string;
}