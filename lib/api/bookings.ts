import { apiFetch } from "./client";

export type DashboardStats = {
  todayBookings: number;
  completedBookings: number;
  topHaircuts: {
    serviceId: string;
    serviceName: string;
    count: number;
  }[];
};

export type Booking = {
  id: string;
  barberId: string;
  serviceId: string;
  serviceName: string;
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

export async function updateBookingStatus(
  id: string, // ✅ ubah jadi string sesuai backend
  status: "pending" | "confirmed" | "completed" | "cancelled"
) {
  return apiFetch<Booking>(`/bookings/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
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
};

export async function getBarberDashboardStats(barberId: string) {
  return apiFetch<{ status: number; data: BarberDashboardStats }>(
    `/bookings/barber/dashboard/stats?barberId=${barberId}`
  );
}