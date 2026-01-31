const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit & { cookieHeader?: string } = {} // ✅ tambah ini
): Promise<T> {
  const { headers, cookieHeader, ...rest } = options;
  
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader && { Cookie: cookieHeader }), // ✅ forward cookie
      ...headers,
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "API Error");
  }

  return res.json();
}