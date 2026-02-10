"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/api/bookings";
import { Calendar, CheckCircle, Scissors } from "lucide-react";

type DashboardStats = {
  todayBookings: number;
  completedBookings: number;
  topHaircuts: {
    serviceId: string;
    serviceName: string;
    count: number;
  }[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (err) {
        setError("Failed to load dashboard statistics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

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

        {/* Completed Bookings */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Booking Selesai</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.completedBookings ?? 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Services */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Scissors className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Top Services</h2>
        </div>
        {stats?.topHaircuts && stats.topHaircuts.length > 0 ? (
          <div className="space-y-3">
            {stats.topHaircuts.map((service, index) => (
              <div
                key={service.serviceId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-700 text-sm font-medium rounded-full">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">
                    {service.serviceName}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {service.count} bookings
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No data available</p>
        )}
      </div>
    </div>
  );
}
