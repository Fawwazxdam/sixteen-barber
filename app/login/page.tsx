"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import toast from "react-hot-toast";
import Link from "next/link";
import { Scissors, ArrowLeft } from "lucide-react";
import Input from "@/components/barber/ui/Input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-yellow-50 to-orange-100 relative px-6">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      >
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-amber-200/50"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Scissors className="w-8 h-8 text-amber-800" />
            </div>
            <h1 className="text-3xl font-bold text-amber-900 font-playfair text-center">
              Login
            </h1>
            <p className="text-amber-700 mt-2 text-center">
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

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-800 hover:bg-amber-900 text-white text-lg py-6 rounded-xl font-medium shadow-md transition-all disabled:opacity-70"
              >
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
