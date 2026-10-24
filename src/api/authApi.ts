/* Author: Nithish Kaliannan Ananth */
// src/api/authApi.ts
import axios from "axios";
import type { LoginRequest, LoginResponse } from "../types/auth";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Matches AuthController -> POST /api/v1/auth/login
 * Public endpoint, no token needed for this call itself.
 */
export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const res = await axios.post<LoginResponse>(
    `${BASE_URL}/api/v1/auth/login`,
    payload
  );
  return res.data;
}