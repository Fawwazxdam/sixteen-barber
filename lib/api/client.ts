import axios, { AxiosRequestConfig, AxiosError } from "axios";

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
  withCredentials: true, // ✅ Important untuk cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Flag untuk prevent infinite loop
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ✅ Response interceptor untuk auto-refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Jika error 401 dan bukan dari endpoint refresh/login
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        // Jika sedang refresh, queue request ini
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // ✅ Attempt to refresh token
        await apiClient.post("/auth/refresh");

        processQueue(null, null);

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Redirect ke login jika refresh gagal
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

interface ApiFetchOptions extends AxiosRequestConfig {
  cookieHeader?: string; // String cookie mentah: "access_token=xyz"
  body?: any;
  credentials?: "include" | "omit" | "same-origin";
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { headers, cookieHeader, body, ...config } = options;

  // Default config
  const defaultConfig: AxiosRequestConfig = {
    withCredentials: true, // Wajib untuk Client Side request
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  // Jika ada cookieHeader (artinya ini request dari Server Component Next.js)
  // Kita inject cookie tersebut ke header request yang menuju NestJS
  if (cookieHeader) {
    defaultConfig.headers = {
        ...defaultConfig.headers,
        Cookie: cookieHeader 
    }
  }

  try {
    const response = await apiClient({
      url: endpoint,
      ...config,
      ...defaultConfig, // Merge config
      data: body || config.data,
    });
    return response.data;
  } catch (error) {
     // ... error handling logic tetap sama
     // ...
     throw error;
  }
}