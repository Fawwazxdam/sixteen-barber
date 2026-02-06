import axios, { AxiosRequestConfig } from "axios";
import { refreshToken } from "./auth"; // Tambah import

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export class ApiError extends Error {
  constructor(message: string, public status: number, public data?: any) {
    super(message);
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ApiFetchOptions extends AxiosRequestConfig {
  body?: any;
  cookieHeader?: string;
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { body, cookieHeader, ...config } = options;

  try {
    const response = await apiClient({
      url: endpoint,
      ...config,
      data: body || config.data,
      headers: {
        ...(cookieHeader && { Cookie: cookieHeader }),
        ...config.headers,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const message = error.response?.data?.message || error.message || "API Error";
      const data = error.response?.data;

      // Auto-refresh jika 401 dan bukan endpoint refresh/login
      if (status === 401 && !endpoint.includes("/auth/refresh") && !endpoint.includes("/auth/login")) {
        try {
          await refreshToken(); // Refresh token
          // Retry request sekali
          const retryResponse = await apiClient({
            url: endpoint,
            ...config,
            data: body || config.data,
            headers: {
              ...(cookieHeader && { Cookie: cookieHeader }),
              ...config.headers,
            },
          });
          return retryResponse.data;
        } catch (refreshError) {
          // Jika refresh gagal, redirect
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      }

      throw new ApiError(message, status, data);
    }
    throw new ApiError("Network error", 0);
  }
}