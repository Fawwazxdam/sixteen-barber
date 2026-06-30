"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAllPlans,
  togglePlanActive,
  deletePlan,
  Plan
} from "@/lib/api/plans";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Power,
  PowerOff,
  Globe,
  Star
} from "lucide-react";

export default function SuperAdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await getAllPlans();
      setPlans(data || []);
    } catch (error) {
      console.error("Failed to load plans:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(id: string) {
    try {
      await togglePlanActive(id);
      load();
    } catch (error) {
      console.error("Failed to toggle plan:", error);
    }
  }

  async function remove(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus paket layanan ini?")) return;
    try {
      await deletePlan(id);
      load();
    } catch (error) {
      console.error("Failed to delete plan:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 dark:text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
        <p className="font-medium animate-pulse">Memuat daftar paket layanan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Paket Layanan SaaS
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Kelola daftar paket layanan untuk landing page.
          </p>
        </div>
        <Link
          href="/superadmin/plans/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Paket</span>
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-neutral-50 dark:bg-neutral-800/50 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-200 dark:border-gray-800 tracking-wider">
              <tr>
                <th className="px-6 py-4">Nama Paket</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4">Maks Kapster</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {plans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Globe className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="font-medium text-lg">Belum ada paket layanan</p>
                      <p className="text-sm mt-1">Mulai dengan menambahkan paket pertama Anda.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr
                    key={plan.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          plan.isPopular
                            ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {plan.isPopular ? <Star className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white text-base">
                        {plan.name}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium text-amber-600 dark:text-amber-500">
                      Rp {plan.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">
                      {plan.maxBarbers === 999 ? "Tanpa Batas" : plan.maxBarbers}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          plan.isActive
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {plan.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggle(plan.id)}
                          title={plan.isActive ? "Nonaktifkan" : "Aktifkan"}
                          className={`p-2.5 rounded-lg transition-colors border ${
                            plan.isActive
                              ? "text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:hover:bg-amber-500/20"
                              : "text-gray-500 border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                          }`}
                        >
                          {plan.isActive ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                        </button>
                        <Link
                          href={`/superadmin/plans/edit/${plan.id}`}
                          title="Edit"
                          className="inline-flex p-2.5 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-lg transition-colors dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20 dark:hover:bg-blue-500/20"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => remove(plan.id)}
                          title="Hapus"
                          className="inline-flex p-2.5 text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition-colors dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20 dark:hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
