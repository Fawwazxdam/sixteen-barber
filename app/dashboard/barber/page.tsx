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
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Barber Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Barber Dashboard</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Barber Dashboard</h1>

      {/* Welcome message */}
      <p className="text-gray-600 mb-6">
        Halo, {user?.name}! Ini ringkasan aktivitas kamu hari ini.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Today's Bookings */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Booking Hari Ini</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.todayBookings ?? 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Completed Today */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Selesai Hari Ini</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.completedBookingsToday ?? 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Range Bookings Section (Accordion) */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-yellow-600" />
          <h2 className="text-lg font-semibold text-gray-900">
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
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() =>
                      setExpandedDates((prev) => ({
                        ...prev,
                        [dateStr]: !prev[dateStr],
                      }))
                    }
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-800">
                        {displayDate}
                      </span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                        {dayBookings.length} Booking
                      </span>
                      {pendingCount > 0 && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold animate-pulse">
                          {pendingCount} Menunggu Konfirmasi
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="p-4 bg-white border-t border-gray-200 space-y-4">
                      {dayBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-neutral-50 rounded-lg gap-4 border border-gray-100 hover:border-gray-200 transition"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900">
                                {booking.customerName}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                                  booking.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : booking.status === "confirmed"
                                    ? "bg-blue-100 text-blue-700"
                                    : booking.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
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
                            <div className="flex items-center gap-2 mb-1">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {booking.customerPhone}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Scissors className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {booking.serviceName} - {idrFormat(booking.servicePrice)} ({booking.duration} menit)
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:items-end gap-3 justify-center">
                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1.5 rounded-md">
                              <Clock className="w-4 h-4" />
                              <span>
                                {new Date(booking.bookingDate).toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZone: "Asia/Jakarta",
                                })} WIB
                              </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              {booking.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                                    className="flex items-center gap-1 bg-green-600 hover:bg-green-750 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition shadow-sm"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Konfirmasi
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                                    className="flex items-center gap-1 bg-white hover:bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-md transition border border-red-200"
                                  >
                                    <X className="w-3.5 h-3.5" /> Tolak
                                  </button>
                                </>
                              )}

                              {booking.status === "confirmed" && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(booking.id, "completed")}
                                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-750 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition shadow-sm"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Selesaikan
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                                    className="flex items-center gap-1 bg-white hover:bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-md transition border border-red-200"
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
          <p className="text-gray-500 text-center py-8">
            Tidak ada booking yang terdaftar untuk 7 hari ke belakang dan depan
          </p>
        )}
      </div>
    </div>
  );
}
