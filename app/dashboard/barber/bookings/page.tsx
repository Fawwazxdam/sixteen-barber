"use client";

import { useEffect, useState } from "react";
import { formatIndonesianDateShort } from "@/lib/utils";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Grid, List, Clock, User, Scissors } from "lucide-react";

type BookingStatus = "pending" | "completed" | "cancelled";

export default function BarberBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [view, setView] = useState<"list" | "grid">("list");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  const [barberId, setBarberId] = useState<string>("");

  const fetchBookings = async () => {
    if (!barberId) return;

    setLoading(true);
    try {
      const data = await getBarberBookings(date, barberId);
      setBookings(data);
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat booking");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: BookingStatus) => {
    try {
      await updateBookingStatus(String(id), status);

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );

      toast.success("Status berhasil diupdate");
    } catch (err: any) {
      toast.error(err.message || "Gagal update status");
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
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
    }
  };

  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  useEffect(() => {
    const getCurrentBarber = async () => {
      try {
        const { getMe } = await import("@/lib/api/auth");
        const user = await getMe();
        if (user.role === "BARBER") {
          setBarberId(user.id);
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
    <div className="p-6 space-y-6">
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
              className="pl-9 pr-4 py-2 border rounded-lg text-sm bg-background"
            />
          </div>
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setView("list")}
              className={`p-2 transition-colors ${
                view === "list"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-accent"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`p-2 transition-colors ${
                view === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-accent"
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
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card gap-4"
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatIndonesianDateShort(b.bookingDate)}</span>
                      <span className="text-border">•</span>
                      <Scissors className="h-4 w-4" />
                      <span>{b.serviceName}</span>
                    </div>
                  </div>
                  <Select
                    value={b.status}
                    onValueChange={(value) =>
                      updateStatus(b.id, value as BookingStatus)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Menunggu</SelectItem>
                      <SelectItem value="completed">Selesai</SelectItem>
                      <SelectItem value="cancelled">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatIndonesianDateShort(b.bookingDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Scissors className="h-4 w-4" />
                    <span>{b.serviceName}</span>
                  </div>
                </div>
                <Select
                  value={b.status}
                  onValueChange={(value) =>
                    updateStatus(b.id, value as BookingStatus)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
