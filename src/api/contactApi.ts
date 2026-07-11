// src/api/contactApi.ts
import axios from "axios";
import type { ContactInfo, ContactMessagePayload, ContactMessageResponse } from "../types/contact";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Fetches the single LIVE contact info block.
 * Matches ContactInfoController -> GET /api/v1/contact-info/active
 */
export async function getActiveContactInfo(): Promise<ContactInfo> {
  const res = await axios.get<ContactInfo>(
    `${BASE_URL}/api/v1/contact-info/active`
  );
  return res.data;
}

/**
 * Submits the contact form.
 * Matches ContactMessageController -> POST /api/v1/contact
 * Public endpoint, no auth required.
 */
export async function submitContactMessage(
  payload: ContactMessagePayload
): Promise<ContactMessageResponse> {
  const res = await axios.post<ContactMessageResponse>(
    `${BASE_URL}/api/v1/contact`,
    payload
  );
  return res.data;
}