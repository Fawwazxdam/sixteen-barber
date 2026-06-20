// lib/api/tenants.ts (atau lib/api/tenant.ts)
import { apiFetch } from "./client";
import type { 
  Tenant, 
  CreateTenantData, 
  UpdateTenantData, 
  UpdateLandingPageData,
  TenantStats, 
  DashboardStats 
} from "@/types/tenants";

export async function getTenants() {
  const res = await apiFetch<Tenant[]>("/tenants");
  return res.data; // Buka bungkus envelope di sini
}

export async function getTenant(id: string) {
  const res = await apiFetch<Tenant>(`/tenants/${id}`);
  return res.data;
}

/**
 * Get the current tenant from auth context.
 */
export async function getCurrentTenant() {
  const res = await apiFetch<Tenant>("/tenants/current");
  return res.data; // Sekarang ini mengembalikan murni tipe 'Tenant'
}

export async function getTenantBySlug(slug: string) {
  const res = await apiFetch<Tenant>(`/tenants/slug/${slug}`);
  return res.data;
}

export async function getTenantStats(id: string) {
  const res = await apiFetch<TenantStats>(`/tenants/${id}/stats`);
  return res.data;
}

export async function getTenantDashboard(id: string) {
  const res = await apiFetch<DashboardStats>(`/tenants/${id}/dashboard`);
  return res.data;
}

export async function createTenant(data: CreateTenantData) {
  const res = await apiFetch<Tenant>("/tenants", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateTenant(id: string, data: UpdateTenantData) {
  const res = await apiFetch<Tenant>(`/tenants/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deleteTenant(id: string) {
  // Delete biasanya tidak mereturn data spesifik (data: null)
  const res = await apiFetch(`/tenants/${id}`, {
    method: "DELETE",
  });
  return res.data; 
}

export async function updateLandingPage(id: string, data: UpdateLandingPageData) {
  const res = await apiFetch<Tenant>(`/tenants/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function uploadLandingImage(
  file: File,
  type: "tenant-hero" | "tenant-gallery"
) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("type", type);

  const res = await apiFetch<{ id: string; url: string }>(
    "/media/upload-landing",
    { method: "POST", body: formData, multipart: true }
  );

  const rawUrl = res.data.url;
  const fullUrl = rawUrl.startsWith("http")
    ? rawUrl
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}${rawUrl}`;

  return { ...res.data, url: fullUrl };
}