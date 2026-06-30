"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { registerTenant } from "@/lib/api/onboarding";
import { ApiError } from "@/lib/api/client";
import toast from "react-hot-toast";
import { Scissors, ArrowLeft, Building2, User, Clock } from "lucide-react";
import Input from "@/components/barber/ui/Input";
import Textarea from "@/components/barber/ui/Textarea";
import { Button } from "@/components/landing/ui/Button";
import Link from "next/link";

type TenantFormData = {
  name: string;
  slug: string;
  phone: string;
  address: string;
  openTime: string;
  closeTime: string;
};

type AdminFormData = {
  name: string;
  email: string;
  password: string;
};

const PLAN_DETAILS: Record<string, { name: string; price: string; description: string }> = {
  starter: {
    name: "Paket Starter",
    price: "Rp 99.000 / bulan",
    description: "Maksimal 2 Kapster, Link Booking Mandiri, Dashboard Admin Utama",
  },
  professional: {
    name: "Paket Professional",
    price: "Rp 199.000 / bulan",
    description: "Maksimal 5 Kapster, Notifikasi WhatsApp Otomatis, Dashboard Kapster Pribadi",
  },
  enterprise: {
    name: "Paket Enterprise",
    price: "Rp 399.000 / bulan",
    description: "Kapster Tanpa Batas, Dukungan Multi-Cabang, Custom Tema & Ekspor Laporan",
  },
};

function RegisterFormContent() {
  const router = useRouter();
  const [tenantData, setTenantData] = useState<TenantFormData>({
    name: "",
    slug: "",
    phone: "",
    address: "",
    openTime: "09:00",
    closeTime: "18:00",
  });
  const [adminData, setAdminData] = useState<AdminFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Sixteen Barber";
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'memangkas.test';

  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") || "starter";
  const selectedPlan = PLAN_DETAILS[planParam] || PLAN_DETAILS["starter"];

  const handleTenantChange = (field: keyof TenantFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTenantData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAdminChange = (field: keyof AdminFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerTenant({ tenant: tenantData, admin: adminData, planId: planParam });
      toast.success("Registrasi berhasil! Cek email untuk kode verifikasi.");
      router.push(`/verify-email?email=${encodeURIComponent(adminData.email)}`);
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : "Registrasi gagal";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 relative px-6">
      <div className="sticky top-0 w-full h-20 bg-white/90 backdrop-blur-md border-b border-gray-200 dark:bg-neutral-900/90 dark:border-gray-700 flex items-center px-8 z-10">
        <Link href={`https://${mainDomain}`} className="text-2xl font-black tracking-tighter text-gray-900 uppercase dark:text-white">
          MEMANGKAS
        </Link>
      </div>

      <div className="max-w-3xl mx-auto relative z-10 py-8">
        <Link
          href={`https://${mainDomain}`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-inter text-sm font-bold uppercase tracking-wide transition-colors dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        <div className="bg-white p-10 border border-gray-200 shadow-sm dark:bg-neutral-900 dark:border-gray-700">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-amber-50 flex items-center justify-center mb-6 dark:bg-neutral-800">
              <Scissors className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight dark:text-white">
              Daftar Barbershop
            </h1>
            <p className="text-gray-600 mt-3 text-center dark:text-gray-400">
              Buat akun admin untuk {appName}
            </p>
          </div>

          <div className="mb-8 p-6 bg-amber-50 border border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 dark:text-gray-400">Ringkasan Pesanan</h3>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg text-gray-900 dark:text-white">{selectedPlan.name}</p>
                <p className="text-sm text-gray-600 mt-1 dark:text-gray-400">{selectedPlan.description}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-600 text-lg dark:text-amber-400">{selectedPlan.price}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-6 flex items-center gap-2 dark:text-gray-400">
                <Building2 className="w-4 h-4" />
                Informasi Barbershop
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <Input
                    label="Nama Barbershop"
                    placeholder="Masukkan nama barbershop"
                    value={tenantData.name}
                    onChange={handleTenantChange("name")}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Slug URL"
                    placeholder="nama-barbershop"
                    value={tenantData.slug}
                    onChange={handleTenantChange("slug")}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Digunakan untuk URL: {appName.toLowerCase().replace(/\s+/g, '')}.com/{tenantData.slug || "nama-barbershop"}</p>
                </div>
                <div>
                  <Input
                    label="No. Telepon"
                    type="tel"
                    placeholder="+628123456789"
                    value={tenantData.phone}
                    onChange={handleTenantChange("phone")}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Textarea
                    label="Alamat"
                    placeholder="Masukkan alamat barbershop"
                    value={tenantData.address}
                    onChange={handleTenantChange("address")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">Jam Buka</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="time"
                      value={tenantData.openTime}
                      onChange={handleTenantChange("openTime")}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white text-gray-900 dark:bg-neutral-800 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">Jam Tutup</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="time"
                      value={tenantData.closeTime}
                      onChange={handleTenantChange("closeTime")}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white text-gray-900 dark:bg-neutral-800 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-6 flex items-center gap-2 dark:text-gray-400">
                <User className="w-4 h-4" />
                Informasi Admin
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Input
                    label="Nama Admin"
                    placeholder="Masukkan nama admin"
                    value={adminData.name}
                    onChange={handleAdminChange("name")}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Email"
                    type="email"
                    placeholder="admin@example.com"
                    value={adminData.email}
                    onChange={handleAdminChange("email")}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Masukkan password"
                    value={adminData.password}
                    onChange={handleAdminChange("password")}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-sm"
              >
                {loading ? "Mendaftarkan..." : planParam === "starter" ? "Daftar & Mulai Trial 14 Hari" : "Daftar & Lanjut Pembayaran"}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-amber-600 hover:text-amber-700 font-bold dark:text-amber-400 dark:hover:text-amber-300">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 blur-[120px] -z-10 rounded-full dark:bg-amber-500/5" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">Loading form...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
