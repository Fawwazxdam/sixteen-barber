"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "@/lib/api/onboarding";
import { ApiError } from "@/lib/api/client";
import toast from "react-hot-toast";
import { Mail, ArrowRight } from "lucide-react";
import Input from "@/components/barber/ui/Input";
import { Button } from "@/components/landing/ui/Button";
import Link from "next/link";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'memangkas.test';
  
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailParam) {
      toast.error("Email tidak ditemukan");
      return;
    }
    setLoading(true);
    try {
      await verifyEmail(emailParam, token);
      toast.success("Verifikasi berhasil! Silakan login.");
      router.push("/login");
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : "Verifikasi gagal";
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

      <div className="max-w-md mx-auto relative z-10 py-8">
        <div className="bg-white p-10 border border-gray-200 shadow-sm dark:bg-neutral-900 dark:border-gray-700">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-amber-50 flex items-center justify-center mb-6 dark:bg-neutral-800">
              <Mail className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight dark:text-white">
              Verifikasi Email
            </h1>
            <p className="text-gray-600 mt-3 text-center text-sm dark:text-gray-400">
              Masukkan 6 digit kode yang telah kami kirimkan ke <strong className="text-gray-900 dark:text-white">{emailParam}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Kode Verifikasi"
                placeholder="Contoh: 123456"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                maxLength={6}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading || token.length < 6}
                className="w-full py-4 text-sm flex items-center justify-center gap-2"
              >
                {loading ? "Memverifikasi..." : "Verifikasi Sekarang"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kembali ke{" "}
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
