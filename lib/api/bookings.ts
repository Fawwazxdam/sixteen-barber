import { apiFetch } from "./client";

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
  id: string,
  status: "pending" | "confirmed" | "completed" | "cancelled"
) {
  return apiFetch<Booking>(`/bookings/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
