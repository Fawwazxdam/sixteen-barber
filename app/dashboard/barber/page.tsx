"use client";

import { useEffect, useState } from "react";
import {
  getBarberDashboardStats,
  getBarberBookingsByRange,
  updateBookingStatus,
  BarberDashboardStats,
  Booking,
} from "@/lib/api/bookings";
import { getMe, UserResponse } from "@/lib/api/auth";
import {
  Calendar,
  CheckCircle,
  Clock,
  User,
  Phone,
  Scissors,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Loader2,
  AlertCircle,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import { idrFormat } from "@/lib/utils";

// Helper to format date key consistently in Asia/Jakarta timezone
const getLocalDateString = (dateInput: Date | string) => {
  const d = new Date(dateInput);
  return d.toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta" });
};

// Helper to format header date to readable Indonesian (or friendly text like "Hari Ini")
const formatHeaderDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const todayStr = getLocalDateString(new Date());
  
  if (dateStr === todayStr) {
    return "Hari Ini";
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = getLocalDateString(tomorrow);
  if (dateStr === tomorrowStr) {
    return "Besok";
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);
  if (dateStr === yesterdayStr) {
    return "Kemarin";
  }

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(d);
};

export default function BarberDashboard() {
  const [stats, setStats] = useState<BarberDashboardStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<UserResponse["user"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        // Get current user
        const userResponse = await getMe();
        setUser(userResponse.user);

        // Get dashboard stats & bookings in the range of -7 to +7 days
        if (userResponse.user.id) {
          const [statsResponse, bookingsResponse] = await Promise.all([
            getBarberDashboardStats(userResponse.user.id),
            getBarberBookingsByRange(userResponse.user.id),
          ]);
          setStats(statsResponse.data);
          
          const bookingsData = bookingsResponse.data || [];
          setBookings(bookingsData);

          // By default, open today's bookings if any exist
          const todayStr = getLocalDateString(new Date());
          setExpandedDates({ [todayStr]: true });
        }
      } catch (err) {
        setError("Gagal memuat data dashboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    status: "pending" | "confirmed" | "completed" | "cancelled"
  ) => {
    try {
      await updateBookingStatus(id, status);

      // Update state locally
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );

      // Refresh today's stats counters
      if (user?.id) {
        const statsResponse = await getBarberDashboardStats(user.id);
        setStats(statsResponse.data);
      }

      toast.success(
        `Booking berhasil diubah ke status: ${
          status === "confirmed"
            ? "Dikonfirmasi"
            : status === "completed"
            ? "Selesai"
            : "Dibatalkan"
        }`
      );
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah status booking");
    }
  };

  // Group bookings by local date
  const groupBookingsByDate = (bookingsList: Booking[]) => {
    const groups: Record<string, Booking[]> = {};
    bookingsList.forEach((booking) => {
      const dateKey = getLocalDateString(booking.bookingDate);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(booking);
    });
    return groups;
  };

  const groupedBookings = groupBookingsByDate(bookings);
  const sortedDates = Object.keys(groupedBookings).sort();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 dark:text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
        <p className="font-medium animate-pulse">Memuat data dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm max-w-7xl mx-auto">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Dashboard Barber
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Halo, {user?.name}! Ini ringkasan aktivitas dan jadwal Anda hari ini.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Bookings */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 group hover:shadow-lg hover:-translate-y-1 hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-amber-500 transition-colors duration-300" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Booking Hari Ini
              </p>
              <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">
                {stats?.todayBookings ?? 0}
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-500/10 group-hover:bg-amber-500 transition-colors duration-300 p-4 rounded-full">
              <Calendar className="w-7 h-7 text-amber-600 dark:text-amber-400 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Completed Today */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 group hover:shadow-lg hover:-translate-y-1 hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-amber-500 transition-colors duration-300" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Selesai Hari Ini
              </p>
              <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">
                {stats?.completedBookingsToday ?? 0}
              </p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-500/10 group-hover:bg-emerald-500 transition-colors duration-300 p-4 rounded-full">
              <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 group hover:shadow-lg hover:-translate-y-1 hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-amber-500 transition-colors duration-300" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Pendapatan Hari Ini
              </p>
              <p className="text-3xl font-black text-gray-900 dark:text-white mt-2">
                {idrFormat(stats?.todayRevenue ?? 0)}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-500/10 group-hover:bg-blue-500 transition-colors duration-300 p-4 rounded-full">
              <Wallet className="w-7 h-7 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Range Bookings Section (Accordion) */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg">
            <Clock className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Jadwal Booking (-7 s/d +7 Hari)
          </h2>
        </div>

        {sortedDates.length > 0 ? (
          <div className="space-y-4">
            {sortedDates.map((dateStr) => {
              const dayBookings = groupedBookings[dateStr];
              const isExpanded = !!expandedDates[dateStr];
              const displayDate = formatHeaderDate(dateStr);

              // Calculate pending bookings for warning badge count
              const pendingCount = dayBookings.filter(
                (b) => b.status === "pending"
              ).length;

              return (
                <div
                  key={dateStr}
                  className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden transition-colors duration-200 bg-white dark:bg-neutral-900"
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() =>
                      setExpandedDates((prev) => ({
                        ...prev,
                        [dateStr]: !prev[dateStr],
                      }))
                    }
                    className="w-full flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left border-b border-transparent data-[expanded=true]:border-gray-200 dark:data-[expanded=true]:border-gray-800"
                    data-expanded={isExpanded}
                  >
                    <div className="flex items-center flex-wrap gap-3">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {displayDate}
                      </span>
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full font-medium">
                        {dayBookings.length} Booking
                      </span>
                      {pendingCount > 0 && (
                        <span className="text-xs bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 px-2.5 py-1 rounded-full font-semibold animate-pulse">
                          {pendingCount} Menunggu Konfirmasi
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-white dark:bg-neutral-900 space-y-4">
                      {dayBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/20 rounded-xl gap-4 border border-gray-100 dark:border-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2.5">
                              <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {booking.customerName}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase rounded-full ${
                                  booking.status === "pending"
                                    ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
                                    : booking.status === "confirmed"
                                    ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400"
                                    : booking.status === "completed"
                                    ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                                    : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                                }`}
                              >
                                {booking.status === "pending"
                                  ? "Pending"
                                  : booking.status === "confirmed"
                                  ? "Dikonfirmasi"
                                  : booking.status === "completed"
                                  ? "Selesai"
                                  : "Dibatalkan"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {booking.customerPhone}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Scissors className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {booking.serviceName} - {idrFormat(booking.servicePrice)} ({booking.duration} menit)
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:items-end gap-3 justify-center mt-2 md:mt-0">
                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-semibold bg-white dark:bg-neutral-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                              <Clock className="w-4 h-4 text-amber-500" />
                              <span>
                                {new Date(booking.bookingDate).toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZone: "Asia/Jakarta",
                                })} WIB
                              </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2">
                              {booking.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-sm hover:shadow active:scale-95"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Konfirmasi
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                                    className="flex items-center gap-1.5 bg-white dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-500/30 active:scale-95"
                                  >
                                    <X className="w-3.5 h-3.5" /> Tolak
                                  </button>
                                </>
                              )}

                              {booking.status === "confirmed" && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(booking.id, "completed")}
                                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-sm hover:shadow active:scale-95"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Selesaikan
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                                    className="flex items-center gap-1.5 bg-white dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-500/30 active:scale-95"
                                  >
                                    <X className="w-3.5 h-3.5" /> Batalkan
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Tidak ada booking yang terdaftar untuk 7 hari ke belakang dan depan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
