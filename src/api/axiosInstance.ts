/* Author: Nithish Kaliannan Ananth */
// src/api/axiosInstance.ts
// Shared axios instance for ADMIN/protected calls only.
// Public GET endpoints (blogs, products, timeline etc on the
// public site) can keep using plain axios or this instance --
// it only adds a header, it doesn't block anything.
//
// Attaches "Authorization: Bearer {token}" automatically so
// individual admin components never need to read localStorage
// themselves.

import axios from "axios";
import { TOKEN_KEY, clearStoredSession, announceAuthExpired } from "../lib/authEvents";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, the backend will return 401.
// Clear the stored session and tell AuthContext, which drops the
// in-memory token so ProtectedRoute redirects to login right away.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredSession();
      announceAuthExpired();
    }
    return Promise.reject(error);
  }
);

export default api;
