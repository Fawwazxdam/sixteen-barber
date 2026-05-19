import { apiFetch } from "./client";
import { Barber } from "@/types/users";

export function getBarbers() {
  return apiFetch<Barber[]>("/users/barbers");
}

export function getBarber(id: string) {
  return apiFetch<Barber>(`/users/barbers/${id}`);
}

export function createBarber(data: {
  name: string;
  email: string;
  password: string;
  description?: string;
  image?: File;
}) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.password);
  if (data.description) {
    formData.append("description", data.description);
  }
  if (data.image) {
    formData.append("image", data.image);
  }

  return apiFetch<Barber>("/users/barbers", {
    method: "POST",
    body: formData,
    multipart: true,
  });
}

export function updateBarber(
  id: string,
  data: {
    name?: string;
    password?: string;
    image?: File | null;
  }
) {
  const formData = new FormData();
  if (data.name) {
    formData.append("name", data.name);
  }
  if (data.password) {
    formData.append("password", data.password);
  }
  if (data.image) {
    formData.append("image", data.image);
  }

  return apiFetch<Barber>(`/users/barbers/${id}`, {
    method: "PATCH",
    body: formData,
    multipart: true,
  });
}

export function deleteBarber(id: string) {
  return apiFetch(`/users/barbers/${id}`, {
    method: "DELETE",
  });
}

export function getBarberMedia(barberId: string) {
  return apiFetch<{ url: string }[]>(`/media?type=barber&referenceId=${barberId}`);
}
