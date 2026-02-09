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
});

interface ApiFetchOptions extends AxiosRequestConfig {
  body?: any;
  multipart?: boolean;
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { body, multipart, ...config } = options;

  // Build headers
  const headers: Record<string, string> = {
    ...config.headers as Record<string, string>,
  };

  // Handle multipart/form-data - let browser set Content-Type with boundary
  if (multipart && body instanceof FormData) {
    // Don't set Content-Type, let browser auto-set with boundary
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
