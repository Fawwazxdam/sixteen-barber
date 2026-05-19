"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/barber/layout/Header";
import Footer from "@/components/barber/layout/Footer";
import { Button } from "../../components/ui/button";
import Input from "@/components/barber/ui/Input";
import { getBooking } from "../../lib/api/bookings";
import { idrFormat } from "../../lib/utils";
import { CheckCircle, Calendar, Clock, User, Phone, Scissors, Search } from "lucide-react";

interface BookingDetails {
  id: string;
  barberId: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  customerNote: string | null;
  bookingDate: string;
  status: "pending" | "completed" | "cancelled";
  duration: number;
  createdAt: string;
  updatedAt: string;
}

function CekBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [bookingId, setBookingId] = useState(initialId);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId.trim()) {
      setError("Masukkan ID Booking terlebih dahulu");
      return;
    }

    setLoading(true);
    setError(null);
    setBooking(null);

    try {
      const data = await getBooking(bookingId);
      const bookingData = (data as any)?.data || data;
      if (bookingData && bookingData.id) {
        setBooking(bookingData as BookingDetails);
      } else {
        setError("Booking tidak ditemukan");
      }
    } catch (err) {
      console.error("Error fetching booking:", err);
      setError("Booking tidak ditemukan");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Tanggal tidak tersedia";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Try parsing as ISO string
      const isoDate = dateString.replace(" ", "T");
      const parsedDate = new Date(isoDate);
      if (isNaN(parsedDate.getTime())) {
        return "Tanggal tidak tersedia";
      }
      return parsedDate.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return "Jam tidak tersedia";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const isoDate = dateString.replace(" ", "T");
      const parsedDate = new Date(isoDate);
      if (isNaN(parsedDate.getTime())) {
        return "Jam tidak tersedia";
      }
      return parsedDate.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-yellow-50 to-orange-100">
      <Header />

      <main className="pt-24 pb-12 px-6 min-h-[calc(100vh-20rem)]">
        <div className="max-w-lg mx-auto">
          {/* Search Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-amber-200/50">
            <h1 className="text-2xl font-bold text-amber-900 mb-2 font-playfair text-center">
              Cek Status Booking
            </h1>
            <p className="text-amber-700 text-center mb-6">
              Masukkan ID Booking untuk melihat detail pesanan kamu
            </p>

            <form onSubmit={handleSearch} className="flex flex-col gap-3">
              <Input
                type="text"
                placeholder="Masukkan ID Booking (8 karakter)"
                value={bookingId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBookingId(e.target.value)}
                maxLength={8}
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-amber-700 hover:bg-amber-800"
              >
                {loading ? "Mencari..." : "Cek Booking"}
              </Button>
            </form>
            {error && (
              <p className="text-red-600 text-sm mt-3 text-center">{error}</p>
            )}
          </div>

          {/* Booking Details */}
          {booking && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-amber-200/50 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-lg font-semibold text-amber-900">
                  Detail Booking
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-amber-100">
                  <span className="text-gray-600">ID Booking</span>
                  <span className="font-mono text-sm text-amber-800">
                    #{booking.id?.slice(0, 8) || booking.id || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-amber-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <User className="w-4 h-4" /> Nama
                  </span>
                  <span className="font-medium text-amber-900">
                    {booking.customerName}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-amber-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Telepon
                  </span>
                  <span className="font-medium text-amber-900">
                    {booking.customerPhone}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-amber-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Scissors className="w-4 h-4" /> Layanan
                  </span>
                  <span className="font-medium text-amber-900">
                    {booking.serviceName}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-amber-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Tanggal
                  </span>
                  <span className="font-medium text-amber-900">
                    {formatDate(booking.bookingDate)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-amber-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Jam
                  </span>
                  <span className="font-medium text-amber-900">
                    {formatTime(booking.bookingDate)} ({booking.duration} menit)
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : booking.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booking.status === "pending"
                      ? "Menunggu Konfirmasi"
                      : booking.status === "completed"
                      ? "Selesai"
                      : "Dibatalkan"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
              <p className="text-amber-800">Mencari booking...</p>
            </div>
          )}

          {/* Actions */}
          {booking && (
            <div className="mt-6 flex gap-4">
              <Button
                onClick={() => router.push("/")}
                className="flex-1 bg-amber-700 hover:bg-amber-800"
              >
                Kembali ke Beranda
              </Button>
              <Button
                onClick={() => router.push("/booking")}
                variant="outline"
                className="flex-1 border-amber-700 text-amber-700 hover:bg-amber-50"
              >
                Booking Kursimu
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CekBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
            <p className="text-amber-800">Memuat...</p>
          </div>
        </div>
      }
    >
      <CekBookingContent />
    </Suspense>
  );
}
