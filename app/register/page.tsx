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
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-yellow-50 to-orange-100 relative px-6 py-12">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      >
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-amber-200/50">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Scissors className="w-8 h-8 text-amber-800" />
            </div>
            <h1 className="text-3xl font-bold text-amber-900 font-playfair text-center">
              Daftar Barbershop
            </h1>
            <p className="text-amber-700 mt-2 text-center">
              Buat akun admin untuk {appName}
            </p>
          </div>

          {/* Plan Summary Section */}
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <h3 className="text-sm font-semibold text-amber-900 uppercase tracking-wider mb-2">Ringkasan Pesanan</h3>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg text-gray-900">{selectedPlan.name}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedPlan.description}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-700 text-lg">{selectedPlan.price}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Informasi Barbershop
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <p className="text-xs text-gray-500 mt-1">Digunakan untuk URL: {appName.toLowerCase().replace(/\s+/g, '')}.com/{tenantData.slug || "nama-barbershop"}</p>
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
                  <label className="block text-sm font-medium text-amber-900 mb-1">Jam Buka</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                    <input
                      type="time"
                      value={tenantData.openTime}
                      onChange={handleTenantChange("openTime")}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white text-amber-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">Jam Tutup</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                    <input
                      type="time"
                      value={tenantData.closeTime}
                      onChange={handleTenantChange("closeTime")}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white text-amber-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informasi Admin
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="w-full bg-amber-800 hover:bg-amber-900 text-white text-lg py-6 rounded-xl font-medium shadow-md transition-all disabled:opacity-70"
              >
                {loading ? "Mendaftarkan..." : planParam === "starter" ? "Daftar & Mulai Trial 14 Hari" : "Daftar & Lanjut Pembayaran"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-amber-50">Loading form...</div>}>
      <RegisterFormContent />
    </Suspense>
  );
}