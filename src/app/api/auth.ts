import type { UserContext } from "../dashboard/types";
import { apiRequest } from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: UserContext;
}

export function login(payload: LoginRequest) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterRequest) {
  return apiRequest<void>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser() {
  return apiRequest<UserContext>("/auth/me");
}
