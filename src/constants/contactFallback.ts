// src/constants/contactFallback.ts
// Used only while backend is empty or unreachable

import type { ContactInfo } from "../types/contact";

export const DEFAULT_CONTACT_INFO: ContactInfo = {
  id: 0,
  heroTitle: "Let's Talk",
  heroSubtitle: "We'd love to hear from you — reach out anytime",
  email: "hello@aquaholics.com",
  phone: "+91 98765 43210",
  address: "Chennai, Tamil Nadu, India",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=13.0827,80.2707&z=13&output=embed",
  linkedin: "",
  instagram: "",
  twitter: "",
  youtube: "",
  isActive: true,
};