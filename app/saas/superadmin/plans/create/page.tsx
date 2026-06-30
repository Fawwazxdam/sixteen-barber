"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPlan } from "@/lib/api/plans";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import Link from "next/link";

export default function CreatePlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    maxBarbers: "",
    isPopular: false,
    features: [] as string[],
  });
  const [featureInput, setFeatureInput] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await createPlan({
        name: form.name,
        price: Number(form.price),
        maxBarbers: Number(form.maxBarbers),
        isPopular: form.isPopular,
        features: form.features,
      });
      router.push("/superadmin/plans");
    } catch (error) {
      console.error("Failed to create plan:", error);
    } finally {
      setLoading(false);
    }
  }

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] });
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setForm({
      ...form,
      features: form.features.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/superadmin/plans"
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Tambah Paket Layanan
          </h1>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Nama Paket
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-900 dark:text-white"
              placeholder="Contoh: STARTER"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Harga (Rp)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-900 dark:text-white"
                placeholder="99000"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Maksimal Kapster
              </label>
              <input
                type="number"
                value={form.maxBarbers}
                onChange={(e) => setForm({ ...form, maxBarbers: e.target.value })}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-900 dark:text-white"
                placeholder="Misal 999 untuk tanpa batas"
                min="1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Fitur Paket
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-900 dark:text-white"
                placeholder="Ketik fitur dan tekan Enter atau klik tambah"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {form.features.map((feature, idx) => (
                <div key={idx} className="flex items-center justify-between px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-gray-100 dark:border-gray-800 rounded-lg">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  <button type="button" onClick={() => removeFeature(idx)} className="text-red-500 hover:text-red-600 transition-colors p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.isPopular}
              onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 dark:border-gray-700 dark:bg-neutral-900"
            />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Tandai sebagai Paket Paling Populer (Highlighted)
            </span>
          </label>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
            <Link
              href="/superadmin/plans"
              className="px-6 py-2.5 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Simpan Paket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
