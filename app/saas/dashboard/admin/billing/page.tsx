"use client";

import { useEffect, useState, useRef } from "react";
import { getActivePlans, Plan } from "@/lib/api/plans";
import {
  createSubscriptionTransaction,
  getMySubscriptionTransactions,
  SubscriptionTransaction,
} from "@/lib/api/subscription-transactions";
import {
  CreditCard,
  CheckCircle,
  Loader2,
  AlertCircle,
  UploadCloud,
  FileImage,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { idrFormat } from "@/lib/utils";

export default function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [transactions, setTransactions] = useState<SubscriptionTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [plansData, txData] = await Promise.all([
        getActivePlans(),
        getMySubscriptionTransactions(),
      ]);
      
      // Sort plans by price
      setPlans((plansData || []).sort((a, b) => a.price - b.price));
      
      // Sort transactions by newest
      setTransactions(
        (txData || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );
    } catch (err: any) {
      setError("Gagal memuat data langganan.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) {
      toast.error("Pilih paket langganan terlebih dahulu");
      return;
    }
    if (!file) {
      toast.error("Silakan unggah bukti pembayaran");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("planId", selectedPlan.id);
      formData.append("amount", selectedPlan.price.toString());
      formData.append("paymentProof", file);

      await createSubscriptionTransaction(formData);
      
      toast.success("Bukti pembayaran berhasil dikirim. Menunggu verifikasi admin.");
      
      // Reset form
      setSelectedPlan(null);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Refresh transactions
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Gagal mengirim pembayaran");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 dark:text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
        <p className="font-medium animate-pulse">Memuat data langganan...</p>
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

  const pendingTransaction = transactions.find((tx) => tx.status === "pending");

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Billing & Langganan
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Kelola paket langganan dan bukti pembayaran barbershop Anda.
        </p>
      </div>

      {pendingTransaction && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 dark:bg-amber-500/20 p-3 rounded-full shrink-0">
              <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 dark:text-amber-400">Menunggu Verifikasi</h3>
              <p className="text-amber-700 dark:text-amber-500 text-sm mt-1">
                Anda memiliki pembayaran sebesar <strong>{idrFormat(pendingTransaction.amount)}</strong> yang sedang direview oleh Superadmin. Paket langganan Anda akan aktif setelah diverifikasi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan)}
            className={`relative bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border-2 p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
              selectedPlan?.id === plan.id
                ? "border-amber-500 shadow-md ring-4 ring-amber-500/10"
                : "border-gray-200 dark:border-gray-800 hover:border-amber-500/50"
            }`}
          >
            {selectedPlan?.id === plan.id && (
              <div className="absolute -top-3 -right-3 bg-amber-500 text-white p-1 rounded-full shadow-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
            )}
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
              {plan.name}
            </h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-black text-amber-600 dark:text-amber-500">
                {idrFormat(plan.price)}
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/bulan</span>
            </div>
            
            <ul className="space-y-3 mt-6">
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Maksimal <strong>{plan.maxBarbers === 999 ? "Unlimited" : plan.maxBarbers}</strong> Kapster</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Dashboard Admin Lengkap</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Akses Booking Online</span>
              </li>
            </ul>
          </div>
        ))}
      </div>

      {/* Payment Form */}
      {selectedPlan && !pendingTransaction && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 lg:p-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Selesaikan Pembayaran
            </h2>
          </div>
          
          <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-xl p-5 mb-8 border border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Silakan transfer sebesar <strong>{idrFormat(selectedPlan.price)}</strong> ke rekening berikut:
            </p>
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 font-mono text-lg font-bold text-gray-900 dark:text-white">
              BCA - 1234567890 (a/n Barber Express)
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              * Pastikan nominal transfer sesuai agar mempercepat proses verifikasi.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Unggah Bukti Pembayaran
              </label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-200 ${
                  file 
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10" 
                    : "border-gray-300 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-500/50 hover:bg-gray-50 dark:hover:bg-neutral-800"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                />
                
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileImage className="w-10 h-10 text-amber-500" />
                    <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Klik untuk mengubah file
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <UploadCloud className="w-10 h-10 text-gray-400" />
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      Klik untuk memilih file struk / screenshot
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Format: JPG, PNG (Maks. 2MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full sm:w-auto px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-amber-500/20"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mengirim...
                </>
              ) : (
                "Kirim Bukti Pembayaran"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mt-12">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Riwayat Transaksi</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
              <thead className="bg-gray-50 dark:bg-neutral-800/50 text-gray-900 dark:text-white font-semibold border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Paket</th>
                  <th className="px-6 py-4">Nominal</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Intl.DateTimeFormat("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(tx.createdAt))}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white uppercase">
                      {tx.plan?.name || "-"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {idrFormat(tx.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          tx.status === "approved"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                            : tx.status === "pending"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                            : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
