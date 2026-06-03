import { apiFetch } from "./client";

export type Plan = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  maxBarbers: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getActivePlans() {
  const res = await apiFetch<Plan[]>("/plans/active");
  return res.data;
}

export async function getAllPlans() {
  const res = await apiFetch<Plan[]>("/plans");
  return res.data;
}
