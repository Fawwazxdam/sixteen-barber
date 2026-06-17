"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "@/lib/api/onboarding";
import { ApiError } from "@/lib/api/client";
import toast from "react-hot-toast";
import { Mail, ArrowRight } from "lucide-react";
import Input from "@/components/barber/ui/Input";
import { Button } from "@/components/ui/button";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  
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
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-yellow-50 to-orange-100 flex items-center justify-center p-6 relative">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-amber-200/50 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-amber-800" />
          </div>
          <h1 className="text-2xl font-bold text-amber-900 font-playfair text-center">
            Verifikasi Email
          </h1>
          <p className="text-amber-700 mt-2 text-center text-sm">
            Masukkan 6 digit kode yang telah kami kirimkan ke <strong>{emailParam}</strong>
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

          <Button
            type="submit"
            disabled={loading || token.length < 6}
            className="w-full bg-amber-800 hover:bg-amber-900 text-white py-6 rounded-xl font-medium shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Memverifikasi..." : "Verifikasi Sekarang"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-amber-50">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
