"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createService } from "@/lib/api/services";
import { getCurrentTenant } from "@/lib/api/tenants";
import type { Tenant } from "@/types/tenants";
import { PageHeader, FormCard, NumberInput, FormInput, FormActions } from "../../components";
import { AlertCircle } from "lucide-react";

export default function CreateServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tenant, setTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    getCurrentTenant().then(setTenant).catch(console.error);
  }, []);

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
        title="Tambah Layanan Baru"
        backHref="/dashboard/admin/services"
        backText="Kembali ke Daftar Layanan"
      />

      {!tenant?.hasActiveSubscription && (
        <div className="mb-6 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-400 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold">Langganan Belum Aktif</h3>
            <p className="text-sm mt-1">
              Selesaikan pembayaran di menu <strong>Langganan</strong> untuk bisa menambahkan layanan baru.
            </p>
          </div>
        </div>
      )}

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
          disabled={tenant !== null && !tenant?.hasActiveSubscription}
          onCancel={() => router.back()}
          submitText="Simpan Layanan"
        />
      </FormCard>
    </div>
  );
}