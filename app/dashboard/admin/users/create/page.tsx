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
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  function clearImage() {
    setImage(null);
    setPreview(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await createBarber({
        name: form.name,
        email: form.email,
        password: form.password,
        image,
      });
      router.push("/dashboard/admin/users");
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
          {/* Profile Image */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Foto Barber
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-amber-200">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
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
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Upload Foto
                </label>
                {preview && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="ml-2 inline-flex items-center px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100"
                  >
                    Hapus
                  </button>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  Format: JPG, PNG, max 2MB
                </p>
              </div>
            </div>
          </div>

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
