"use client";

import { useEffect, useState } from "react";
import { getBarberDashboardStats, BarberDashboardStats } from "@/lib/api/bookings";
import { getMe, UserResponse } from "@/lib/api/auth";
import { Calendar, CheckCircle, Clock, User, Phone, Scissors } from "lucide-react";

export default function BarberDashboard() {
  const [stats, setStats] = useState<BarberDashboardStats | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Get current user
        const userResponse = await getMe();
        setUser(userResponse.user);

        // Get dashboard stats using the user's ID
        if (userResponse.user.id) {
          const statsResponse = await getBarberDashboardStats(userResponse.user.id);
          setStats(statsResponse.data);
        }
      } catch (err) {
        setError("Failed to load dashboard statistics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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

      {/* Pending Confirmations */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-yellow-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Menunggu Konfirmasi ({stats?.pendingConfirmations.length ?? 0})
          </h2>
        </div>

        {stats?.pendingConfirmations && stats.pendingConfirmations.length > 0 ? (
          <div className="space-y-4">
            {stats.pendingConfirmations.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-neutral-50 rounded-lg gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {booking.customerName}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {booking.status === "pending" ? "Pending" : "Confirmed"}
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
                      {booking.serviceName} - Rp{booking.servicePrice.toLocaleString()} (
                      {booking.duration} menit)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(booking.bookingDate).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Tidak ada booking yang menunggu konfirmasi
          </p>
        )}
      </div>
    </div>
  );
}
