"use client";

import { useEffect, useState } from "react";
import { getSuperAdminStats, SuperAdminStats } from "@/lib/api/superadmin";
import { Users, Store, Clock, DollarSign, Loader2, AlertCircle } from "lucide-react";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSuperAdminStats()
      .then((data) => setStats(data))
      .catch((err) => {
        setError("Gagal memuat statistik Super Admin");
        console.error(err);
      })
      .finally(() => setLoading(false));
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
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Super Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Pantau keseluruhan performa barbershop dan transaksi SaaS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tenants */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex items-center gap-4">
          <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-full">
            <Store className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Total Tenant
            </p>
            <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">
              {stats?.totalTenants ?? 0}
            </p>
          </div>
        </div>

        {/* Active Tenants */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex items-center gap-4">
          <div className="bg-green-50 dark:bg-green-500/10 p-4 rounded-full">
            <Users className="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Tenant Aktif
            </p>
            <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">
              {stats?.activeTenants ?? 0}
            </p>
          </div>
        </div>

        {/* Pending Transactions */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex items-center gap-4">
          <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-full">
            <Clock className="w-7 h-7 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Pending Transaksi
            </p>
            <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">
              {stats?.pendingTransactions ?? 0}
            </p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex items-center gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-full">
            <DollarSign className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Total Pendapatan
            </p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1 truncate">
              {stats?.totalRevenue ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(stats.totalRevenue) : "Rp0"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
