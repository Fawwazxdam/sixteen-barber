"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBarbers, updateBarber } from "@/lib/api/users";
import { Barber } from "@/types/users";
import toast from "react-hot-toast";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    getBarbers()
      .then((barbers: Barber[]) => {
        const barber = barbers.find((b: Barber) => b.id === id);
        if (!barber) {
          router.push("/dashboard/admin/users");
          return;
        }
        setForm({ name: barber.name, password: "" });
        // Set current image preview from media array
        if (barber.media?.[0]?.url) {
          const imageUrl = process.env.NEXT_PUBLIC_API_BASE_URL + barber.media[0].url;
          setCurrentImage(imageUrl);
          setPreview(imageUrl);
        }
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  function clearImage() {
    setImage(null);
    setPreview(currentImage);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      await updateBarber(id, {
        name: form.name || undefined,
        password: form.password || undefined,
        image: image || undefined,
      });
      toast.success("Berhasil menyimpan perubahan!");
      setTimeout(() => router.push("/dashboard/admin/users"), 1000);
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan perubahan");
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
    <div className="max-w-xl">
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-amber-900">Edit Barber</h1>

        <form onSubmit={submit} className="space-y-5">
          {/* Profile Image */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Foto Barber
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-neutral-100 border-2 border-amber-200">
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
                  className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-neutral-50 cursor-pointer"
                >
                  {preview && preview !== currentImage ? "Ganti Foto" : "Upload Foto"}
                </label>
                {preview && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="ml-2 inline-flex items-center px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100"
                  >
                    Reset
                  </button>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  Format: JPG, PNG, max 2MB
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              className="w-full rounded-lg border px-4 py-2"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              New Password (optional)
            </label>
            <input
              type="password"
              className="w-full rounded-lg border px-4 py-2"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
