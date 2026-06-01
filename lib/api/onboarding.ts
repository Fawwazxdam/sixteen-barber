import { apiFetch } from "./client";
import type { UserResponse } from "./auth";

export type RegisterTenantRequest = {
  tenant: {
    name: string;
    slug: string;
    phone: string;
    address: string;
    openTime: string;
    closeTime: string;
  };
  admin: {
    name: string;
    email: string;
    password: string;
  };
  planId?: string;
};

export type RegisterTenantResponse = {
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
  admin: UserResponse;
};

export async function registerTenant(data: RegisterTenantRequest) {
  const res = await apiFetch<RegisterTenantResponse>("/onboarding/tenant/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res;
}