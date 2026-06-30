"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/landing/layout/Navbar";
import { Footer } from "@/components/landing/layout/Footer";
import { Button } from "@/components/landing/ui/Button";
import { getBooking } from "@/lib/api/bookings";
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
    <div className="min-h-screen bg-neutral-50 text-gray-900 dark:bg-neutral-900 dark:text-white font-sans selection:bg-amber-200">
      <Navbar />

      <main className="pt-32 pb-20 px-6 min-h-[calc(100vh-20rem)]">
        <div className="max-w-xl mx-auto">
          {/* Search Form */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <span className="inline-block text-amber-600 font-bold text-xs uppercase tracking-widest mb-3 dark:text-amber-400">
                Pencarian
              </span>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                Cek Status Booking
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Masukkan ID Booking untuk melihat detail pesanan kamu
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Masukkan ID Booking (contoh: 3f8a1b2c)"
                  value={bookingId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBookingId(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl bg-neutral-50 dark:bg-neutral-900 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors outline-none text-center font-mono font-bold tracking-widest uppercase text-lg"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="py-4 text-base"
              >
                {loading ? "Mencari..." : "Cek Booking"}
              </Button>
            </form>
            {error && (
              <p className="text-red-500 text-sm mt-4 text-center font-medium bg-red-50 dark:bg-red-500/10 py-3 rounded-lg">{error}</p>
            )}
          </div>

          {/* Booking Details */}
          {booking && (
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                  Detail Booking
                </h2>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-center pb-5 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wide">ID Booking</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-neutral-900 px-3 py-1 rounded-lg">
                    #{booking.id?.slice(0, 8) || booking.id || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-5 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2 font-medium text-sm uppercase tracking-wide">
                    <User className="w-4 h-4" /> Nama
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {booking.customerName}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-5 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2 font-medium text-sm uppercase tracking-wide">
                    <Phone className="w-4 h-4" /> Telepon
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {booking.customerPhone}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-5 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2 font-medium text-sm uppercase tracking-wide">
                    <Scissors className="w-4 h-4" /> Layanan
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {booking.serviceName}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-5 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2 font-medium text-sm uppercase tracking-wide">
                    <Calendar className="w-4 h-4" /> Tanggal
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatDate(booking.bookingDate)}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-5 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2 font-medium text-sm uppercase tracking-wide">
                    <Clock className="w-4 h-4" /> Jam
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-500">
                    {formatTime(booking.bookingDate)} <span className="text-gray-400 font-medium ml-1">({booking.duration} menit)</span>
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wide">Status</span>
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      booking.status === "pending"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400"
                        : booking.status === "completed"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400"
                        : "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400"
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
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide text-sm">Mencari booking...</p>
            </div>
          )}

          {/* Actions */}
          {booking && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => router.push("/")}
                className="flex-1 py-4 text-base"
              >
                Kembali ke Beranda
              </Button>
              <Button
                onClick={() => router.push("/booking")}
                variant="outline"
                className="flex-1 py-4 text-base"
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
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium tracking-wide uppercase text-sm">Memuat...</p>
          </div>
        </div>
      }
    >
      <CekBookingContent />
    </Suspense>
  );
}
