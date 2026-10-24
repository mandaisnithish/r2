/* Author: Nithish Kaliannan Ananth */
// src/lib/authEvents.ts
// Lets the axios layer tell React that the session died (401), so the
// admin UI logs out immediately instead of waiting for a manual refresh.

export const AUTH_EXPIRED_EVENT = "aquaholics:auth-expired";
export const TOKEN_KEY = "aquaholics_admin_token";
export const EMAIL_KEY = "aquaholics_admin_email";

export function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

export function announceAuthExpired() {
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}
