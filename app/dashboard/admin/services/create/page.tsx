"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createService } from "@/lib/api/services";
// import { PageHeader } from "../../components";
import { PageHeader, FormCard, NumberInput, FormInput, FormActions } from "../../components";

export default function CreateServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await createService({
        name: form.name,
        price: Number(form.price),
        duration: Number(form.duration),
      });
      router.push("/dashboard/admin/services");
    } catch (error) {
      console.error("Failed to create service:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl animate-in fade-in duration-300">
      <PageHeader
        backHref="/dashboard/admin/services"
        backText="Kembali ke Daftar Layanan"
      />

      <FormCard title="Tambah Layanan Baru" description="Lengkapi detail di bawah untuk menambahkan menu layanan barbershop." onSubmit={handleSubmit}>
        <FormInput
          label="Nama Layanan"
          placeholder="Contoh: Haircut Premium"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            label="Harga (Rupiah)"
            placeholder="50000"
            prefix="Rp"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            min="0"
          />

          <NumberInput
            label="Durasi Pengerjaan"
            placeholder="30"
            suffix="Menit"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            required
            min="1"
          />
        </div>

        <FormActions
          loading={loading}
          onCancel={() => router.back()}
          submitText="Simpan Layanan"
        />
      </FormCard>
    </div>
  );
}