"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/landing/layout/Navbar";
import { Footer } from "@/components/landing/layout/Footer";
import { TenantNavbar } from "@/components/landing/layout/TenantNavbar";
import { TenantFooter } from "@/components/landing/layout/TenantFooter";
import { Button } from "@/components/landing/ui/Button";
import { FloatingWhatsApp } from "@/components/landing/ui/FloatingWhatsApp";
import { getBooking } from "@/lib/api/bookings";
import { getTenantBySlug } from "@/lib/api/tenants";
import { CheckCircle, Calendar, Clock, User, Phone, Scissors, MapPin } from "lucide-react";

interface BookingDetails {
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
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  address?: string;
  phone?: string;
}

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  
  const slug = params?.slug as string;
  const bookingId = searchParams.get("id");

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    if (!bookingId) {
      setError("Booking ID tidak ditemukan");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [bookingData, tenantData] = await Promise.all([
          getBooking(bookingId),
          getTenantBySlug(slug),
        ]);

        const resolvedBooking = (bookingData as any)?.data || bookingData;
        
        if (!tenantData) {
          setError("Store tidak ditemukan");
          return;
        }

        setBooking(resolvedBooking as BookingDetails);
        setTenant(tenantData);
      } catch (err) {
        console.error("Error fetching success page details:", err);
        setError("Gagal memuat detail booking atau informasi store");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId, slug]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium tracking-wide uppercase text-sm">Memuat detail booking...</p>
        </div>
      </div>
    );
  }

  if (error || !booking || !tenant) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-gray-900 dark:text-white font-sans selection:bg-amber-200">
        <Navbar />
        <main className="pt-32 pb-20 px-6 min-h-[calc(100vh-20rem)] flex items-center justify-center">
          <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-10 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">❌</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-tight">
              Terjadi Kesalahan
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{error || "Data tidak ditemukan."}</p>
            <Button
              onClick={() => router.push(slug ? `/${slug}/booking` : "/")}
              className="w-full text-lg py-6"
            >
              Kembali ke Booking
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-gray-900 dark:text-white font-sans selection:bg-amber-200">
      <TenantNavbar tenantName={tenant.name} tenantSlug={tenant.slug} />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-xl mx-auto">
          {/* Success Header */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 mb-8 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-500/20 rounded-full animate-ping opacity-75"></div>
              <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400 relative z-10" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3 uppercase tracking-tight">
              Booking Berhasil!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Terima kasih, <span className="text-amber-600 dark:text-amber-400 font-bold">{booking.customerName}</span>! Booking kamu di <span className="text-amber-600 dark:text-amber-400 font-bold">{tenant.name}</span> telah kami terima.
            </p>
            {tenant.address && (
              <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {tenant.address}
              </p>
            )}
          </div>

          {/* Booking Details */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-lg font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              Detail Booking
            </h2>

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
                      : booking.status === "confirmed" || booking.status === "completed"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400"
                      : "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400"
                  }`}
                >
                  {booking.status === "pending"
                    ? "Menunggu Konfirmasi"
                    : booking.status === "confirmed"
                    ? "Terkonfirmasi"
                    : booking.status === "completed"
                    ? "Selesai"
                    : "Dibatalkan"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => router.push(`/${tenant.slug}/booking`)}
              className="flex-1 py-4 text-base"
            >
              Halaman Booking
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="flex-1 py-4 text-base"
            >
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </main>

      <TenantFooter tenantName={tenant.name} />
      <FloatingWhatsApp phoneNumber={tenant.phone} tenantName={tenant.name} />
    </div>
  );
}

export default function BookingSuccessPage() {
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
      <BookingSuccessContent />
    </Suspense>
  );
}
