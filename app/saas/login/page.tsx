"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import toast from "react-hot-toast";
import Link from "next/link";
import { Scissors, ArrowLeft } from "lucide-react";
import Input from "@/components/barber/ui/Input";
import { Button } from "@/components/landing/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'memangkas.test';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success("Login berhasil");
      router.push("/dashboard");
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Login gagal";
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

      <div className="w-full max-w-md mx-auto relative z-10 py-8">
        <Link
          href={`https://${mainDomain}`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-inter text-sm font-bold uppercase tracking-wide transition-colors dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 border border-gray-200 shadow-sm dark:bg-neutral-900 dark:border-gray-700"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-amber-50 flex items-center justify-center mb-6 dark:bg-neutral-800">
              <Scissors className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight dark:text-white">
              Login
            </h1>
            <p className="text-gray-600 mt-3 text-center dark:text-gray-400">
              Masuk untuk mengelola {appName}
            </p>
          </div>

          <div className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-sm"
              >
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Belum punya akun?{" "}
              <Link href="/register" className="text-amber-600 hover:text-amber-700 font-bold dark:text-amber-400 dark:hover:text-amber-300">
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </form>
      </div>

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 blur-[120px] -z-10 rounded-full dark:bg-amber-500/5" />
    </div>
  );
}
