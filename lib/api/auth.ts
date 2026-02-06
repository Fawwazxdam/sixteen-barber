import { apiFetch } from "./client";

export interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "BARBER";
}

export async function login(data: { email: string; password: string }) {
  return apiFetch<{ success: boolean }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function refreshToken() {
  return apiFetch<{ success: boolean }>("/auth/refresh", {
    method: "POST",
  });
}

export async function getMe(cookieHeader?: string) {
  return apiFetch<MeResponse>("/auth/me", {
    cookieHeader, // Pass ke apiFetch
  });
}

export async function logout() {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
}