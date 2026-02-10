import { apiFetch, apiFetchServer } from "./client";

export interface UserResponse {
  id: string;
  email: string;
  role: "ADMIN" | "BARBER";
}

export interface LoginResponse {
  message: string;
  user: UserResponse;
}

export interface MeResponse {
  user: UserResponse;
}

export interface LogoutResponse {
  message: string;
}

export async function login(data: { email: string; password: string }) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMe(cookieHeader?: string) {
  if (cookieHeader) {
    return apiFetchServer<MeResponse>("/auth/me", cookieHeader);
  }
  return apiFetch<MeResponse>("/auth/me");
}

export async function logout() {
  return apiFetch<LogoutResponse>("/auth/logout", {
    method: "POST",
  });
}

export async function refreshToken() {
  return apiFetch("/auth/refresh", {
    method: "POST",
  });
}
