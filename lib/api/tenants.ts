// lib/api/tenants.ts (atau lib/api/tenant.ts)
import { apiFetch } from "./client";
import type { 
  Tenant, 
  CreateTenantData, 
  UpdateTenantData, 
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