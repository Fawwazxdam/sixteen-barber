"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBarbers, updateBarber, getBarberSchedule, updateBarberSchedule, BarberScheduleItem } from "@/lib/api/users";
import toast from "react-hot-toast";
import {
  PageHeader,
  FormCard,
  FormInput,
  FormActions,
} from "../../../components";

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function EditBarberPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    password: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<BarberScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    
    const loadData = async () => {
      try {
        const barbers = await getBarbers();
        const barber = barbers.find((b) => b.id === id);
        if (!barber) {
          router.push("/dashboard/admin/users");
          return;
        }
        setForm({ name: barber.name, password: "" });
        if (barber.media?.[0]?.url) {
          const imageUrl =
            process.env.NEXT_PUBLIC_API_BASE_URL + barber.media[0].url;
          setCurrentImage(imageUrl);
          setPreview(imageUrl);
        }

        // Fetch Schedule
        try {
          const scheduleData = await getBarberSchedule(id);
          if (!scheduleData || scheduleData.length === 0) {
            const defaultSchedules = Array.from({ length: 7 }, (_, i) => ({
              dayOfWeek: i,
              startTime: "09:00",
              endTime: "21:00",
              isActive: true,
            }));
            setSchedules(defaultSchedules);
          } else {
            const sorted = [...scheduleData].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
            const filled = Array.from({ length: 7 }, (_, i) => {
              const found = sorted.find((s) => s.dayOfWeek === i);
              return found || { dayOfWeek: i, startTime: "09:00", endTime: "21:00", isActive: true };
            });
            setSchedules(filled);
          }
        } catch (err) {
          console.error("Failed to load barber schedule", err);
          const defaultSchedules = Array.from({ length: 7 }, (_, i) => ({
            dayOfWeek: i,
            startTime: "09:00",
            endTime: "21:00",
            isActive: true,
          }));
          setSchedules(defaultSchedules);
        }
      } catch (err) {
        console.error("Failed to load barber profile", err);
        toast.error("Gagal memuat profil barber");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, router]);

  function handleImageChange(file: File) {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImage(null);
    setPreview(currentImage);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      // Update profile
      await updateBarber(id, {
        name: form.name || undefined,
        password: form.password || undefined,
        image: image || undefined,
      });

      // Update schedule
      await updateBarberSchedule(id, schedules);

      toast.success("Berhasil menyimpan profil dan jadwal!");
      setTimeout(() => router.push("/dashboard/admin/users"), 1000);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan perubahan";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl animate-in fade-in duration-300">
      <PageHeader
        title="Edit Barber"
        backHref="/dashboard/admin/users"
        backText="Kembali ke Daftar Barber"
      />

      <FormCard title="Edit Barber" description="Perbarui informasi barber ini." onSubmit={handleSubmit}>
        {/* Profile Image */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-amber-50 dark:bg-amber-500/10 border-4 border-white shadow-md dark:border-neutral-800 flex-shrink-0">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-amber-600/50 dark:text-amber-500/50">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
              Foto Profil
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageChange(file);
                }}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
              >
                {preview && preview !== currentImage ? "Ganti Foto" : "Pilih Foto"}
              </label>
              {preview && preview !== currentImage && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Format: JPG, PNG, max 2MB
            </p>
          </div>
        </div>

        <FormInput
          label="Nama Lengkap"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <FormInput
          label="Kata Sandi Baru (opsional)"
          type="password"
          placeholder="Kosongkan jika tidak ingin mengubah password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

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
          onCancel={() => router.back()}
          submitText="Simpan Perubahan"
        />
      </FormCard>
    </div>
  );
}