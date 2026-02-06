import { apiFetch } from "./client";

export interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "BARBER";
}

export interface LoginResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export async function login(data: { email: string; password: string }) {
  // Return type ubah jadi generic object karena token ada di cookie
  return apiFetch<{ success: boolean; message: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    // Credentials include SANGAT PENTING agar browser mau menerima Set-Cookie
    credentials: "include", 
  });
}

export async function getMe(cookieHeader?: string) {
  return apiFetch<MeResponse>("/auth/me", {
    // Pass cookie header jika dipanggil dari Server Component
    cookieHeader, 
  });
}

export async function logout(): Promise<{ message: string }> {
  return apiFetch("/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

// ✅ Function untuk refresh access token
export async function refreshToken(): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>("/auth/refresh", {
    method: "POST",
    credentials: "include",
  });
}