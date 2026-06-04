import { apiFetch } from "./client";

export type DashboardStats = {
  todayBookings: number;
  completedBookingsToday: number;
  topHaircuts: {
    serviceId: string;
    serviceName: string;
    count: number;
  }[];
  todayRevenue?: number;
};

export type Booking = {
  id: string;
  barberId: string;
  barberName?: string;
  serviceId: string;
  serviceName: string;
  servicePrice?: number;
  customerName: string;
  customerPhone: string;
  customerNote: string | null;
  bookingDate: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  duration: number;
  createdAt: string;
  updatedAt: string;
};

export async function getBooking(id: string) {
  return apiFetch<Booking>(`/bookings/${id}`);
}

export async function getBarberBookings(date: string, barberId: string) {
  return apiFetch<Booking[]>(
    `/bookings/barber?date=${date}&barberId=${barberId}`
  );
}

export async function getTenantBookings(date: string) {
  return apiFetch<Booking[]>(`/bookings/tenant?date=${date}`);
}

export async function updateBookingStatus(
  id: string, // ✅ ubah jadi string sesuai backend
  status: "pending" | "confirmed" | "completed" | "cancelled",
  paymentMethod?: "cash" | "qris" | "transfer" | "other"
) {
  return apiFetch<Booking>(`/bookings/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, paymentMethod }),
  });
}

export async function getDashboardStats() {
  return apiFetch<{ status: number; data: DashboardStats }>(
    "/bookings/dashboard/stats"
  );
}

export type BarberDashboardStats = {
  todayBookings: number;
  completedBookingsToday: number;
  pendingConfirmations: {
    id: string;
    customerName: string;
    customerPhone: string;
    serviceName: string;
    servicePrice: number;
    bookingDate: string;
    status: "pending" | "confirmed";
    duration: number;
  }[];
  todayRevenue?: number;
};

export async function getBarberDashboardStats(barberId: string) {
  return apiFetch<{ status: number; data: BarberDashboardStats }>(
    `/bookings/barber/dashboard/stats?barberId=${barberId}`
  );
}

export async function getBarberBookingsByRange(
  barberId: string,
  startDate?: string,
  endDate?: string
) {
  let url = `/bookings/barber/range?barberId=${barberId}`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;
  return apiFetch<{ status: number; data: Booking[] }>(url);
}