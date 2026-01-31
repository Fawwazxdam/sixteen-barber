import { apiFetch } from "./client";

export interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "BARBER";
}

export async function login(data: {
  email: string;
  password: string;
}) {
  return apiFetch<{ accessToken: string }>("/auth/login", {
    credentials: "include",
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMe(cookieHeader?: string) { // ✅ tambah parameter
  return apiFetch<MeResponse>("/auth/me", {
    credentials: "include",
    cookieHeader, // ✅ pass cookie
  });
}

export async function logout() {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
}