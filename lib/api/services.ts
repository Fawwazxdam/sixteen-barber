import { apiFetch } from "./client";
import { Service } from "@/types/services";

export async function getServices() {
  return apiFetch<Service[]>("/services");
}

export async function createService(data: {
  name: string;
  price: number;
  duration: number;
}) {
  return apiFetch<Service>("/services", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateService(id: string, data: Partial<Service>) {
  return apiFetch<Service>(`/services/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteService(id: string) {
  return apiFetch(`/services/${id}`, {
    method: "DELETE",
  });
}
