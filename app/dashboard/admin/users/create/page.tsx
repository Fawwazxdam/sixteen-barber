"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createBarber } from "@/lib/api/users";
import toast from "react-hot-toast";
import {
  PageHeader,
  FormCard,
  FormInput,
  FormTextarea,
  FormActions,
  AvatarUpload,
} from "../../components";

export default function CreateBarberPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    description: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleImageChange(file: File) {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImage(null);
    setPreview(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      await createBarber({
        name: form.name,
        email: form.email,
        password: form.password,
        description: form.description || undefined,
        image: image || undefined,
      });
      toast.success("Barber berhasil ditambahkan!");
      setTimeout(() => router.push("/dashboard/admin/users"), 1000);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gagal menambahkan barber";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-7xl animate-in fade-in duration-300">
      <PageHeader
        backHref="/dashboard/admin/users"
        backText="Kembali ke Daftar Barber"
      />

      <FormCard title="Tambah Barber Baru" description="Lengkapi informasi dasar untuk menambahkan barber baru." onSubmit={handleSubmit}>
        {/* Profile Image Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <AvatarUpload
            preview={preview}
            onFileChange={handleImageChange}
            onReset={clearImage}
            size="lg"
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <FormInput
            label="Nama Lengkap"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <FormInput
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <FormInput
            label="Kata Sandi"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <FormTextarea
            label="Deskripsi (opsional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </div>

        <FormActions
          loading={saving}
          onCancel={() => router.back()}
          submitText="Tambah Barber"
        />
      </FormCard>
    </div>
  );
}