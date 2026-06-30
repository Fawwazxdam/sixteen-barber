"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getServices, updateService } from "@/lib/api/services";
// import { PageHeader } from "../../../components";
import { PageHeader, FormCard, NumberInput, FormInput, FormActions } from "../../../components";

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

  async function handleSubmit(e: React.FormEvent) {
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
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500 dark:text-gray-400">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-medium animate-pulse">Mengambil data layanan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl animate-in fade-in duration-300">
      <PageHeader
        title="Edit Layanan"
        backHref="/dashboard/admin/services"
        backText="Kembali ke Daftar Layanan"
      />

      <FormCard title="Edit Layanan" description="Perbarui informasi nama, harga, atau durasi layanan ini." onSubmit={handleSubmit}>
        <FormInput
          label="Nama Layanan"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Harga (Rupiah)"
            prefix="Rp"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            min="0"
          />

          <NumberInput
            label="Durasi Pengerjaan"
            suffix="Menit"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            required
            min="1"
          />
        </div>

        <FormActions
          loading={saving}
          onCancel={() => router.back()}
          submitText="Update Layanan"
        />
      </FormCard>
    </div>
  );
}