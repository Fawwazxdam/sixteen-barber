import axios, { AxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
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
  cookieHeader?: string;
  body?: any;
  credentials?: "include" | "omit" | "same-origin";
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { headers, cookieHeader, body, ...config } = options;

  try {
    const response = await apiClient({
      url: endpoint,
      ...config,
      data: body || config.data,
      headers: {
        ...(cookieHeader && { Cookie: cookieHeader }),
        ...headers,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const message = error.response?.data?.message || error.message || "API Error";
      const data = error.response?.data;

      // Auto redirect on 401
      if (status === 401 && typeof window !== "undefined") {
        window.location.href = "/login";
      }

      throw new ApiError(message, status, data);
    }
    throw new ApiError("Network error", 0);
  }
}
