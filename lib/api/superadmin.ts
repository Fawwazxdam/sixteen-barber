import { apiFetch } from "./client";

export interface SuperAdminStats {
  totalTenants: number;
  activeTenants: number;
  pendingTransactions: number;
  totalRevenue: number;
}

export interface SuperAdminTenant {
  id: string;
  name: string;
  isActive: boolean;
  subscription?: {
    planName: string;
    endsAt: string;
    status: string;
  };
}

export interface SubscriptionTransaction {
  id: string;
  tenantId?: string;
  planId: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  paymentProofUrl?: string;
  createdAt: string;
}

export async function getSuperAdminStats() {
  const res = await apiFetch<any>("/superadmin/stats");
  return res as unknown as SuperAdminStats;
}

export async function getSuperAdminTenants() {
  const res = await apiFetch<any>("/superadmin/tenants");
  return res as unknown as SuperAdminTenant[];
}

export async function suspendTenant(id: string) {
  const res = await apiFetch<any>(`/superadmin/tenants/${id}/suspend`, {
    method: "PUT",
  });
  return res as unknown as { message: string };
}

export async function activateTenant(id: string) {
  const res = await apiFetch<any>(`/superadmin/tenants/${id}/activate`, {
    method: "PUT",
  });
  return res as unknown as { message: string };
}

export async function getAllTransactions() {
  const res = await apiFetch<any>("/subscription-transactions/all");
  return res as unknown as SubscriptionTransaction[];
}

export async function updateTransactionStatus(id: string, data: { status: "approved" | "rejected"; notes?: string }) {
  const res = await apiFetch<any>(`/subscription-transactions/${id}/status`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res as unknown as { message: string; transaction: any };
}
