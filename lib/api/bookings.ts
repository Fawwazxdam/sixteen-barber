import { apiFetch } from "./client";

export type Booking = {
  id: number;
  customerName: string;
  duration: string;
  bookingDate: string;
  serviceName: string;
  status: string;
};

export async function getBarberBookings(date: string, barberId: string) {
  return apiFetch<Booking[]>(
    `/bookings/barber?date=${date}&barberId=${barberId}`
  );
}

export async function updateBookingStatus(
  id: string, // ✅ ubah jadi string sesuai backend
  status: "pending" | "completed" | "cancelled"
) {
  return apiFetch<Booking>(`/bookings/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}