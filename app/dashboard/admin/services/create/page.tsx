"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";

export default function CreateServicePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    await apiFetch("/services", {
      method: "POST",
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        duration: Number(form.duration),
      }),
    });

    router.push("/dashboard/admin/services");
  }

  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-amber-900">
            Add New Service
          </h1>
          <p className="text-sm text-gray-500">
            Tambahkan layanan baru yang tersedia di barbershop
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {/* Service Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Service Name
            </label>
            <input
              placeholder="Contoh: Haircut Premium"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-600 focus:ring-amber-600"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Price (IDR)
            </label>
            <input
              type="number"
              placeholder="50000"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-600 focus:ring-amber-600"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <p className="text-xs text-gray-400">
              Harga dalam Rupiah, tanpa titik atau koma
            </p>
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <input
              type="number"
              placeholder="30"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-600 focus:ring-amber-600"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              required
            />
            <p className="text-xs text-gray-400">
              Estimasi waktu pengerjaan layanan
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-amber-700 text-white font-medium hover:bg-amber-800"
            >
              Save Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
