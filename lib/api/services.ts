// lib/api/services.ts
import { apiFetch } from "./client";
import type { Service } from "@/types/services"; // Pastikan tipe Service sudah ada

export async function getServices() {
  const res = await apiFetch<Service[]>("/services");
  return res.data; // Buka bungkus envelope
}

export async function createService(data: {
  name: string;
  price: number;
  duration: number;
}) {
  const res = await apiFetch<Service>("/services", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateService(
  id: string,
  data: Partial<{ name: string; price: number; duration: number }>
) {
  const res = await apiFetch<Service>(`/services/${id}`, {
    method: "PATCH", // Di controller backend kamu menggunakan PATCH, bukan PUT
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function toggleServiceActive(id: string) {
  const res = await apiFetch<Service>(`/services/${id}/toggle-active`, {
    method: "PATCH",
  });
  return res.data;
}

export async function deleteService(id: string) {
  const res = await apiFetch(`/services/${id}`, {
    method: "DELETE",
  });
  return res.data;
}