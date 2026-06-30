import { apiFetch, apiFetchPublicServer, ApiResponse } from "./client";

export type Plan = {
  id: string;
  name: string;
  price: number;
  maxBarbers: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
};

export async function getActivePlans() {
  const res = await apiFetchPublicServer<ApiResponse<Plan[]>>("/plans/active");
  return res.data;
}

export async function getAllPlans() {
  const res = await apiFetch<Plan[]>("/plans");
  return res.data;
}

export async function getPlanById(id: string) {
  const res = await apiFetch<Plan>(`/plans/${id}`);
  return res.data;
}

export async function createPlan(data: Partial<Plan>) {
  const res = await apiFetch<Plan>("/plans", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updatePlan(id: string, data: Partial<Plan>) {
  const res = await apiFetch<Plan>(`/plans/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deletePlan(id: string) {
  const res = await apiFetch<{ message: string }>(`/plans/${id}`, {
    method: "DELETE",
  });
  return res.data;
}

export async function togglePlanActive(id: string) {
  const plans = await getAllPlans();
  const plan = plans.find(p => p.id === id);
  if (!plan) throw new Error("Plan not found");
  
  return updatePlan(id, { isActive: !plan.isActive });
}
