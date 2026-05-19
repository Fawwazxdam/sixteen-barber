"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/api/bookings";
import {
  Calendar,
  CheckCircle,
  Scissors,
  Loader2,
  AlertCircle,
} from "lucide-react";

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
        setError("Gagal memuat statistik dashboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

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
      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Pantau performa harian dan layanan terpopuler barbershop Anda.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Completed Bookings */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 group hover:shadow-lg hover:-translate-y-1 hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-amber-500 transition-colors duration-300" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Booking Selesai
              </p>
              <p className="text-4xl font-black text-gray-900 dark:text-white mt-2">
                {stats?.completedBookings ?? 0}
              </p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-500/10 group-hover:bg-emerald-500 transition-colors duration-300 p-4 rounded-full">
              <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Services */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg">
            <Scissors className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Layanan Terpopuler
          </h2>
        </div>

        {stats?.topHaircuts && stats.topHaircuts.length > 0 ? (
          <div className="space-y-3">
            {stats.topHaircuts.map((service, index) => (
              <div
                key={service.serviceId}
                className="flex items-center justify-between p-4 bg-neutral-50 hover:bg-white dark:bg-neutral-800/40 dark:hover:bg-neutral-800 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-8 h-8 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-sm font-bold rounded-full group-hover:scale-110 transition-transform">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {service.serviceName}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {service.count}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    transaksi
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <Scissors className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Belum ada data layanan untuk ditampilkan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}