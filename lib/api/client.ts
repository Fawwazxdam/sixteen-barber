import axios, { AxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4002';

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
});

const apiClientServer = axios.create({
  baseURL: BACKEND_URL,
});

interface ApiFetchOptions extends AxiosRequestConfig {
  body?: any;
  multipart?: boolean;
}

export type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<ApiResponse<T>> {
  const { body, multipart, ...config } = options;

  const headers: Record<string, string> = {
    ...config.headers as Record<string, string>,
  };

  if (multipart && body instanceof FormData) {
  } else if (!headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await apiClient({
      url: endpoint,
      method: config.method || "GET",
      data: body || config.data,
      headers,
      withCredentials: true,
    });
    return response.data as ApiResponse<T>;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const message =
        error.response?.data?.message || error.message || "API Error";
      const data = error.response?.data;

      throw new ApiError(message, status, data);
    }
    throw new ApiError("Network error", 0);
  }
}

export async function apiFetchServer<T>(
  endpoint: string,
  cookieHeader: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { body, multipart, ...config } = options;

  const headers: Record<string, string> = {
    ...config.headers as Record<string, string>,
    Cookie: cookieHeader,
  };

  if (multipart && body instanceof FormData) {
  } else if (!headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await apiClientServer({
      url: endpoint,
      method: config.method || "GET",
      data: body || config.data,
      headers,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const message =
        error.response?.data?.message || error.message || "API Error";
      const data = error.response?.data;

      throw new ApiError(message, status, data);
    }
    throw new ApiError("Network error", 0);
  }
}

export async function apiFetchPublicServer<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { body, multipart, ...config } = options;

  const headers: Record<string, string> = {
    ...config.headers as Record<string, string>,
  };

  if (multipart && body instanceof FormData) {
  } else if (!headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await apiClientServer({
      url: endpoint,
      method: config.method || "GET",
      data: body || config.data,
      headers,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const message =
        error.response?.data?.message || error.message || "API Error";
      const data = error.response?.data;

      throw new ApiError(message, status, data);
    }
    throw new ApiError("Network error", 0);
  }
}
