"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { setCookie, getCookie } from "@/lib/utils/cookies";

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
      console.log("[Login] Attempting login...");
      const res = await login({ email, password });
      console.log("[Login] Response keys:", Object.keys(res || {}));
      console.log("[Login] Response:", JSON.stringify(res, null, 2));
      console.log("[Login] document.cookie before set:", document.cookie);

      // Set cookie manual jika response ada accessToken (token-based auth)
      if (res && res.accessToken) {
        console.log("[Login] Setting accessToken cookie (token-based)...");
        setCookie("accessToken", res.accessToken, 7);
      } else {
        console.log("[Login] No accessToken in response - checking cookies...");
      }

      // Check cookies untuk verify
      console.log("[Login] All cookies after:", document.cookie);

      toast.success("Login berhasil");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("[Login] Error:", err);
      if (axios.isAxiosError(err)) {
        console.error("[Login] Response headers:", err.response?.headers);
        console.error("[Login] Set-Cookie header:", err.response?.headers?.["set-cookie"]);
        toast.error(err.response?.data?.message || "Login gagal");
      } else {
        toast.error(err.message || "Login gagal");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      >
        <h1 className="text-2xl font-bold text-amber-900 mb-2 font-playfair">
          Login Dashboard
        </h1>
        <p className="text-sm text-amber-700 mb-6">
          Masuk untuk mengelola {appName}
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-800 hover:bg-amber-900 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
          >
            {loading ? "Masuk..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
