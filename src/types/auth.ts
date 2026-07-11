// src/types/auth.ts
// Matches LoginRequestDTO / LoginResponseDTO exactly

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  message: string;
}