import { apiFetch } from "./client";
import { Barber } from "@/types/users";

export async function getBarbers(): Promise<Barber[]> {
  const res = await apiFetch<Barber[] | { data: Barber[] }>("/users/barbers");
  const payload = res.data;
  return Array.isArray(payload) ? payload : (payload && 'data' in payload ? payload.data : []);
}

export async function getBarber(id: string) {
  const res = await apiFetch<Barber>(`/users/barbers/${id}`);
  return res.data;
}

export async function createBarber(data: {
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

  const res = await apiFetch<Barber>("/users/barbers", {
    method: "POST",
    body: formData,
    multipart: true,
  });
  return res.data;
}

export async function updateBarber(
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

  const res = await apiFetch<Barber>(`/users/barbers/${id}`, {
    method: "PATCH",
    body: formData,
    multipart: true,
  });
  return res.data;
}

export async function deleteBarber(id: string) {
  const res = await apiFetch(`/users/barbers/${id}`, {
    method: "DELETE",
  });
  return res.data;
}

export async function getBarberMedia(barberId: string) {
  const res = await apiFetch<{ url: string }[]>(`/media?type=barber&referenceId=${barberId}`);
  return res.data;
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
