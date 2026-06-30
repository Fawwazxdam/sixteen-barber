"use client";

import { useEffect, useState } from "react";
import { formatIndonesianDateShort, generateWhatsAppLink } from "@/lib/utils";
import {
  getBarberBookings,
  updateBookingStatus,
  type Booking,
} from "@/lib/api/bookings";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Grid, List, Clock, User, Scissors, Check, X, CheckCircle2, MessageCircle } from "lucide-react";

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export default function BarberBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [view, setView] = useState<"list" | "grid">("list");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  const [barberId, setBarberId] = useState<string>("");
  const [checkoutBooking, setCheckoutBooking] = useState<Booking | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qris" | "transfer">("cash");
  console.log({bookings})

  const fetchBookings = async () => {
    if (!barberId) return;

    setLoading(true);
    try {
      const response = await getBarberBookings(date, barberId);
      const bookingsData = (response as any)?.data || response;
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat booking");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: BookingStatus) => {
    try {
      await updateBookingStatus(id, status);

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );

      toast.success("Status berhasil diupdate");
    } catch (err: any) {
      toast.error(err.message || "Gagal update status");
    }
  };

  const handleCheckout = async () => {
    if (!checkoutBooking) return;
    try {
      await updateBookingStatus(checkoutBooking.id, "completed", paymentMethod);
      setBookings((prev) =>
        prev.map((b) => (b.id === checkoutBooking.id ? { ...b, status: "completed" } : b))
      );
      toast.success("Pembayaran berhasil, transaksi selesai");
      setCheckoutBooking(null);
    } catch (err: any) {
      toast.error(err.message || "Gagal memproses pembayaran");
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      default:
        return "bg-neutral-100 text-gray-800 dark:bg-neutral-900/30 dark:text-gray-200";
    }
  };

  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "confirmed":
        return "Dikonfirmasi";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const renderActionButtons = (b: Booking) => {
    if (b.status === "pending") {
      return (
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button size="sm" className="flex-1 sm:flex-none" onClick={() => updateStatus(b.id, "confirmed")}>
            <Check className="h-4 w-4 mr-1" /> Terima
          </Button>
          <Button size="sm" variant="outline" className="flex-1 sm:flex-none text-destructive border-destructive hover:bg-destructive/10" onClick={() => updateStatus(b.id, "cancelled")}>
            <X className="h-4 w-4 mr-1" /> Tolak
          </Button>
        </div>
      );
    }
    if (b.status === "confirmed") {
      return (
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button size="sm" className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white" onClick={() => setCheckoutBooking(b)}>
            <CheckCircle2 className="h-4 w-4 mr-1" /> Selesaikan
          </Button>
          <Button size="sm" variant="outline" className="flex-1 sm:flex-none text-destructive border-destructive hover:bg-destructive/10" onClick={() => updateStatus(b.id, "cancelled")}>
            <X className="h-4 w-4 mr-1" /> Batal
          </Button>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const getCurrentBarber = async () => {
      try {
        const { getMe } = await import("@/lib/api/auth");
        const user = await getMe();
        if (user.user.role === "BARBER") {
          setBarberId(user.user.id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getCurrentBarber();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [date, barberId]);

  return (
    <div className="p-6 space-y-6 text-foreground">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Jadwal Booking</h1>
          <p className="text-muted-foreground text-sm">
            Kelola booking pelanggan Anda
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-background text-foreground dark:[color-scheme:dark]"
            />
          </div>
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setView("list")}
              className={`p-2 transition-colors ${
                view === "list"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`p-2 transition-colors ${
                view === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Date Display */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Tanggal: {formatIndonesianDateShort(date)}</span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Tidak ada booking untuk tanggal ini</p>
          </CardContent>
        </Card>
      ) : view === "list" ? (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card text-card-foreground gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{b.customerName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          b.status as BookingStatus
                        )}`}
                      >
                        {getStatusLabel(b.status as BookingStatus)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground">
                        {b.customerPhone}
                      </div>
                      <a
                        href={generateWhatsAppLink(b.customerPhone, `Halo ${b.customerName}, reservasi Anda untuk layanan ${b.serviceName} pada ${formatIndonesianDateShort(b.bookingDate)} telah kami terima.`)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 bg-green-50 dark:bg-green-500/10 px-2.5 py-1 rounded-md transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Hubungi WA
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatIndonesianDateShort(b.bookingDate)}</span>
                      <span className="text-border">•</span>
                      <Scissors className="h-4 w-4" />
                      <span>{b.serviceName}</span>
                    </div>
                  </div>
                  {renderActionButtons(b)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((b) => (
            <Card key={b.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base">{b.customerName}</CardTitle>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      b.status as BookingStatus
                    )}`}
                  >
                    {getStatusLabel(b.status as BookingStatus)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">
                      {b.customerPhone}
                    </div>
                    <a
                      href={generateWhatsAppLink(b.customerPhone, `Halo ${b.customerName}, reservasi Anda untuk layanan ${b.serviceName} pada ${formatIndonesianDateShort(b.bookingDate)} telah kami terima.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 bg-green-50 dark:bg-green-500/10 px-2.5 py-1 rounded-md transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Hubungi WA
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatIndonesianDateShort(b.bookingDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Scissors className="h-4 w-4" />
                    <span>{b.serviceName}</span>
                  </div>
                </div>
                {renderActionButtons(b)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Checkout Drawer / Modal */}
      {checkoutBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-foreground">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold">Proses Pembayaran</h2>
              <p className="text-sm text-muted-foreground mt-1">Selesaikan transaksi untuk pesanan ini.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-muted/50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Pelanggan</span>
                  <span className="font-semibold">{checkoutBooking.customerName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Layanan</span>
                  <span className="font-semibold">{checkoutBooking.serviceName}</span>
                </div>
                <div className="pt-2 mt-2 border-t flex justify-between items-center">
                  <span className="font-medium">Total Tagihan</span>
                  <span className="font-bold text-lg text-primary">
                    Rp {(checkoutBooking.servicePrice || 0).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-sm font-medium">Metode Pembayaran</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod("cash")}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                      paymentMethod === "cash" 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-background text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    onClick={() => setPaymentMethod("qris")}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                      paymentMethod === "qris" 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-background text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    QRIS
                  </button>
                  <button
                    onClick={() => setPaymentMethod("transfer")}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                      paymentMethod === "transfer" 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-background text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    Transfer
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border bg-muted/20 flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setCheckoutBooking(null)}
              >
                Batal
              </Button>
              <Button 
                className="flex-1"
                onClick={handleCheckout}
              >
                Selesaikan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
