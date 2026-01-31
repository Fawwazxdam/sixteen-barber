// lib/api/client.ts - versi improved
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

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit & { cookieHeader?: string } = {}
): Promise<T> {
  const { headers, cookieHeader, ...rest } = options;

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...rest,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader && { Cookie: cookieHeader }),
        ...headers,
      },
      cache: "no-store",
    });

    // Handle non-OK responses
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: res.statusText }));

      // Auto redirect on 401
      if (res.status === 401 && typeof window !== "undefined") {
        window.location.href = "/login";
      }

      throw new ApiError(
        error.message || "API Error",
        res.status,
        error
      );
    }

    return res.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Network error", 0);
  }
}