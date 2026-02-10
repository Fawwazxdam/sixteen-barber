import { apiFetch } from "./client";

export function getServices() {
  return apiFetch("/services");
}

export function createService(data: {
  name: string;
  price: number;
  duration: number;
}) {
  return apiFetch("/services", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateService(
  id: string,
  data: any
) {
  return apiFetch(`/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteService(id: string) {
  return apiFetch(`/services/${id}`, {
    method: "DELETE",
  });
}
