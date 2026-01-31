import { apiFetch } from "./client";

export function getServices(token: string) {
  return apiFetch("/services", { token });
}

export function createService(token: string, data: {
  name: string;
  price: number;
  duration: number;
}) {
  return apiFetch("/services", {
    method: "POST",
    token,
    body: JSON.stringify(data),
  });
}

export function updateService(
  token: string,
  id: string,
  data: any
) {
  return apiFetch(`/services/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}

export function deleteService(token: string, id: string) {
  return apiFetch(`/services/${id}`, {
    method: "DELETE",
    token,
  });
}
