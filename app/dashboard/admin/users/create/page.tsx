"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBarber } from "@/lib/api/users";

export default function CreateBarberPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await createBarber({
        name: form.name,
        email: form.email,
        password: form.password,
        description: form.description || undefined,
      });
      router.push("/dashboard/admin/users");
    } catch (error) {
      console.error("Failed to create barber:", error);
      alert("Failed to create barber. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-amber-900">Add Barber</h1>
          <p className="text-sm text-gray-500">Buat akun barber baru</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {["name", "email", "password"].map((field) => (
            <div key={field} className="space-y-1">
              <label className="text-sm font-medium text-gray-700 capitalize">
                {field}
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                className="w-full rounded-lg border px-4 py-2 focus:border-amber-600 focus:ring-amber-600"
                value={(form as any)[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                required
              />
            </div>
          ))}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="w-full rounded-lg border px-4 py-2 focus:border-amber-600 focus:ring-amber-600 min-h-[100px]"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Deskripsi tentang barber..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg border text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Barber"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
