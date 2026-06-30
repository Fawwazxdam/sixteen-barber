"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPlanById, updatePlan } from "@/lib/api/plans";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import Link from "next/link";

export default function EditPlanPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    maxBarbers: "",
    isPopular: false,
    features: [] as string[],
  });
  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const plan = await getPlanById(id);
        if (plan) {
          setForm({
            name: plan.name,
            price: String(plan.price),
            maxBarbers: String(plan.maxBarbers),
            isPopular: plan.isPopular,
            features: plan.features || [],
          });
        }
      } catch (error) {
        console.error("Failed to load plan:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      await updatePlan(id, {
        name: form.name,
        price: Number(form.price),
        maxBarbers: Number(form.maxBarbers),
        isPopular: form.isPopular,
        features: form.features,
      });
      router.push("/superadmin/plans");
    } catch (error) {
      console.error("Failed to update plan:", error);
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 dark:text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
        <p className="font-medium animate-pulse">Memuat data paket...</p>
      </div>
    );
  }

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
            Edit Paket Layanan
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
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
