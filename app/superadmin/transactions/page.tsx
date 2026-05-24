"use client";

import { useEffect, useState } from "react";
import { getAllTransactions, updateTransactionStatus, SubscriptionTransaction } from "@/lib/api/superadmin";
import { Loader2, CreditCard, Check, X, Eye, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

export default function SuperAdminTransactionsPage() {
  const [transactions, setTransactions] = useState<SubscriptionTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchTransactions = () => {
    setLoading(true);
    getAllTransactions()
      .then((data) => setTransactions(data))
      .catch((err) => {
        toast.error("Gagal memuat daftar transaksi");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
    if (!confirm(`Apakah Anda yakin ingin ${status === "approved" ? "Menerima" : "Menolak"} transaksi ini?`)) {
      return;
    }

    setActionLoading(id);
    try {
      await updateTransactionStatus(id, { 
        status, 
        notes: status === "approved" ? "Pembayaran divalidasi" : "Bukti pembayaran tidak valid" 
      });
      toast.success(`Transaksi berhasil di-${status}`);
      fetchTransactions();
    } catch (err) {
      toast.error("Terjadi kesalahan saat mengupdate transaksi");
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
            Validasi Pembayaran
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Tinjau bukti pembayaran dan setujui / tolak transaksi tenant.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-neutral-50 dark:bg-neutral-800/50 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-200 dark:border-gray-800 tracking-wider">
              <tr>
                <th className="px-6 py-4">Tanggal / Waktu</th>
                <th className="px-6 py-4">Tenant ID / Info</th>
                <th className="px-6 py-4">Nominal</th>
                <th className="px-6 py-4">Bukti</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-3" />
                      <p className="font-medium animate-pulse">Memuat daftar transaksi...</p>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <CreditCard className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="font-medium text-lg">Belum ada transaksi</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {new Date(trx.createdAt).toLocaleString("id-ID", {
                        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 dark:text-white block max-w-[150px] truncate" title={trx.tenantId}>
                        {trx.tenantId || "-"}
                      </span>
                      <span className="text-xs text-gray-400">Plan: {trx.planId.split('-')[0] || "Unknown"}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(trx.amount)}
                    </td>
                    <td className="px-6 py-4">
                      {trx.paymentProofUrl ? (
                        <a 
                          href={trx.paymentProofUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Lihat Bukti
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">Tidak ada</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {trx.status === "pending" && (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400">
                          Pending
                        </span>
                      )}
                      {trx.status === "approved" && (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400">
                          Disetujui
                        </span>
                      )}
                      {trx.status === "rejected" && (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400">
                          Ditolak
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {trx.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateStatus(trx.id, "approved")}
                            disabled={actionLoading === trx.id}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 dark:hover:bg-emerald-500/20 disabled:opacity-50 transition-colors"
                            title="Setujui Pembayaran"
                          >
                            {actionLoading === trx.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(trx.id, "rejected")}
                            disabled={actionLoading === trx.id}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                            title="Tolak Pembayaran"
                          >
                            {actionLoading === trx.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-5 h-5" />}
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm italic">Selesai</span>
                      )}
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
