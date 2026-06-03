"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createBarber, BarberScheduleItem } from "@/lib/api/users";
import { getCurrentTenant } from "@/lib/api/tenants";
import type { Tenant } from "@/types/tenants";
import toast from "react-hot-toast";
import { AlertCircle } from "lucide-react";
import {
  PageHeader,
  FormCard,
  FormInput,
  FormTextarea,
  FormActions,
  AvatarUpload,
} from "../../components";

export default function CreateBarberPage() {
  const router = useRouter();

  const [tenant, setTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    getCurrentTenant().then(setTenant).catch(console.error);
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    description: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [schedules, setSchedules] = useState<BarberScheduleItem[]>(
    Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      startTime: "09:00",
      endTime: "21:00",
      isActive: true,
    }))
  );

  const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  function handleImageChange(file: File) {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImage(null);
    setPreview(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      await createBarber({
        name: form.name,
        email: form.email,
        password: form.password,
        description: form.description || undefined,
        image: image || undefined,
        schedules: schedules,
      });
      toast.success("Barber berhasil ditambahkan!");
      setTimeout(() => router.push("/dashboard/admin/users"), 1000);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gagal menambahkan barber";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-7xl animate-in fade-in duration-300">
      <PageHeader
        backHref="/dashboard/admin/users"
        backText="Kembali ke Daftar Barber"
      />

      {!tenant?.hasActiveSubscription && (
        <div className="mb-6 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-400 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold">Langganan Belum Aktif</h3>
            <p className="text-sm mt-1">
              Selesaikan pembayaran di menu <strong>Langganan</strong> untuk bisa menambahkan kapster baru.
            </p>
          </div>
        </div>
      )}

      <FormCard title="Tambah Barber Baru" description="Lengkapi informasi dasar untuk menambahkan barber baru." onSubmit={handleSubmit}>
        {/* Profile Image Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <AvatarUpload
            preview={preview}
            onFileChange={handleImageChange}
            onReset={clearImage}
            size="lg"
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <FormInput
            label="Nama Lengkap"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <FormInput
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <FormInput
            label="Kata Sandi"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <FormTextarea
            label="Deskripsi (opsional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </div>

        {/* Jadwal & Jam Operasional */}
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Jadwal Kerja & Jam Operasional
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Tentukan hari kerja dan jam operasional untuk kapster ini.
          </p>

          <div className="space-y-4">
            {schedules.map((sched, idx) => (
              <div
                key={sched.dayOfWeek}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                  sched.isActive
                    ? "bg-white dark:bg-neutral-900 border-gray-200 dark:border-gray-800 shadow-sm"
                    : "bg-gray-50/50 dark:bg-neutral-900/30 border-gray-100 dark:border-gray-900/50 opacity-60"
                }`}
              >
                {/* Day Checkbox & Name */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`day-${sched.dayOfWeek}`}
                    checked={sched.isActive}
                    onChange={(e) => {
                      const updated = [...schedules];
                      updated[idx].isActive = e.target.checked;
                      setSchedules(updated);
                    }}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300 dark:border-gray-700 bg-transparent"
                  />
                  <label
                    htmlFor={`day-${sched.dayOfWeek}`}
                    className="text-base font-bold text-gray-900 dark:text-white select-none cursor-pointer w-24"
                  >
                    {DAY_NAMES[sched.dayOfWeek]}
                  </label>
                </div>

                {/* Time Settings */}
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Mulai:</span>
                    <input
                      type="time"
                      value={sched.startTime}
                      disabled={!sched.isActive}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[idx].startTime = e.target.value;
                        setSchedules(updated);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 disabled:opacity-50 transition-all"
                    />
                  </div>

                  <span className="text-gray-400 dark:text-gray-600">–</span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Selesai:</span>
                    <input
                      type="time"
                      value={sched.endTime}
                      disabled={!sched.isActive}
                      onChange={(e) => {
                        const updated = [...schedules];
                        updated[idx].endTime = e.target.value;
                        setSchedules(updated);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-950 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 disabled:opacity-50 transition-all"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <FormActions
          loading={saving}
          disabled={tenant !== null && !tenant?.hasActiveSubscription}
          onCancel={() => router.back()}
          submitText="Tambah Barber"
        />
      </FormCard>
    </div>
  );
}