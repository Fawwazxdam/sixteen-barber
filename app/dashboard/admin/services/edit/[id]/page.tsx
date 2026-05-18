"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getServices, updateService } from "@/lib/api/services";

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchService() {
      try {
        // Karena API getServiceById belum diexpose secara spesifik, 
        // kita tetap memfilter dari getServices() seperti kodemu sebelumnya
        const data = await getServices();
        const service = data.find((s) => s.id === id);

        if (!service) {
          router.push("/dashboard/admin/services");
          return;
        }

        setForm({
          name: service.name,
          price: String(service.price),
          duration: String(service.duration),
        });
      } catch (error) {
        console.error("Failed to load service:", error);
        router.push("/dashboard/admin/services");
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [id, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      await updateService(id, {
        name: form.name,
        price: Number(form.price),
        duration: Number(form.duration),
      });
      router.push("/dashboard/admin/services");
    } catch (error) {
      console.error("Failed to update service:", error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-gray-500">Loading service data...</div>;
  }

  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-amber-900">
            Edit Service
          </h1>
          <p className="text-sm text-gray-500">
            Perbarui informasi layanan barbershop
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Service Name
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-600 focus:ring-amber-600"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Price (IDR)
            </label>
            <input
              type="number"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-600 focus:ring-amber-600"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              min="0"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <input
              type="number"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-600 focus:ring-amber-600"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              required
              min="1"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={saving}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-neutral-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-amber-700 text-white font-medium hover:bg-amber-800 disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}