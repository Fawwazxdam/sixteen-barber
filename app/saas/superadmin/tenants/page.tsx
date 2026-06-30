"use client";

import { useEffect, useState } from "react";
import { getSuperAdminTenants, suspendTenant, activateTenant, SuperAdminTenant } from "@/lib/api/superadmin";
import { Loader2, Store, AlertCircle, Ban, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SuperAdminTenantsPage() {
  const [tenants, setTenants] = useState<SuperAdminTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchTenants = () => {
    setLoading(true);
    getSuperAdminTenants()
      .then((data) => setTenants(data))
      .catch((err) => {
        toast.error("Gagal memuat daftar barbershop");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleToggleStatus = async (tenant: SuperAdminTenant) => {
    setActionLoading(tenant.id);
    try {
      if (tenant.isActive) {
        await suspendTenant(tenant.id);
        toast.success(`Barbershop ${tenant.name} berhasil dinonaktifkan`);
      } else {
        await activateTenant(tenant.id);
        toast.success(`Barbershop ${tenant.name} berhasil diaktifkan`);
      }
      fetchTenants(); // Refresh data
    } catch (err) {
      toast.error("Terjadi kesalahan saat mengubah status tenant");
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Manajemen Barbershop
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Pantau dan kelola akses (aktif/suspend) semua tenant.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-neutral-50 dark:bg-neutral-800/50 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-200 dark:border-gray-800 tracking-wider">
              <tr>
                <th className="px-6 py-4">Nama Barbershop</th>
                <th className="px-6 py-4">Status Akses</th>
                <th className="px-6 py-4">Status Langganan</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-3" />
                      <p className="font-medium animate-pulse">Memuat daftar tenant...</p>
                    </div>
                  </td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Store className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="font-medium text-lg">Belum ada tenant yang terdaftar</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white text-base">
                      {t.name}
                    </td>
                    <td className="px-6 py-4">
                      {t.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400">
                          <Ban className="w-3.5 h-3.5" />
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {t.subscription ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {t.subscription.planName}
                          </span>
                          <span className={`text-xs mt-0.5 ${t.subscription.status === "active" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                            {t.subscription.status === "active" ? "Aktif s/d " : "Berakhir "}{new Date(t.subscription.endsAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 italic">Belum ada langganan</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(t)}
                        disabled={actionLoading === t.id}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          t.isActive 
                            ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-500/20" 
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 dark:hover:bg-emerald-500/20"
                        } disabled:opacity-50`}
                      >
                        {actionLoading === t.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : t.isActive ? (
                          <>
                            <Ban className="w-4 h-4" /> Suspend
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> Aktifkan
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
