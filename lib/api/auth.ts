import { apiFetch, apiFetchServer, ApiResponse } from "./client";

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "BARBER" | "SUPERADMIN";
  tenantId?: string;
}

export interface LoginResponse {
  message: string;
  user: UserResponse;
}

export interface MeResponse {
  user: UserResponse & {
    tenantId?: string;
    tenant?: {
      id: string;
      name: string;
      slug: string;
    };
  };
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

export async function getMe(cookieHeader?: string): Promise<MeResponse> {
  if (cookieHeader) {
    return apiFetchServer<MeResponse>("/auth/me", cookieHeader);
  }
  const result = await apiFetch<MeResponse>("/auth/me");
  return result as unknown as MeResponse;
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
