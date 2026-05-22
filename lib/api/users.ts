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
  schedules?: BarberScheduleItem[];
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
  if (data.schedules) {
    formData.append("schedules", JSON.stringify(data.schedules));
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

export interface BarberScheduleItem {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export async function getBarberSchedule(barberId: string) {
  const res = await apiFetch<BarberScheduleItem[]>(`/barbers/${barberId}/schedule`);
  return res.data;
}

export async function updateBarberSchedule(barberId: string, schedules: BarberScheduleItem[]) {
  const res = await apiFetch<BarberScheduleItem[]>(`/barbers/${barberId}/schedule`, {
    method: "PUT",
    body: JSON.stringify({ schedules }),
  });
  return res.data;
}
