"use client";

import { useState, useEffect, useRef } from "react";
import { getCurrentTenant, updateLandingPage, uploadLandingImage } from "@/lib/api/tenants";
import { resolveImageUrl } from "@/lib/utils";
import type { Tenant, LandingPageContent } from "@/types/tenants";
import {
  PageHeader,
  FormCard,
  FormInput,
  FormTextarea,
  FormActions,
} from "../components";
import {
  ImagePlus,
  Trash2,
  GripVertical,
  Plus,
  Eye,
  Upload,
  X,
  Loader2,
} from "lucide-react";

export default function LandingPageSettingsPage() {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [form, setForm] = useState<LandingPageContent>({
    heroImage: "",
    heroTitle: "",
    heroDescription: "",
    tagline: "",
    aboutText: "",
    galleryImages: [],
    ctaTitle: "",
    ctaDescription: "",
    ctaButtonText: "",
  });

  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const t = await getCurrentTenant();
        setTenant(t);
        setForm({
          heroImage: t.heroImage || "",
          heroTitle: t.heroTitle || "",
          heroDescription: t.heroDescription || "",
          tagline: t.tagline || "",
          aboutText: t.aboutText || "",
          galleryImages: t.galleryImages || [],
          ctaTitle: t.ctaTitle || "",
          ctaDescription: t.ctaDescription || "",
          ctaButtonText: t.ctaButtonText || "",
        });
      } catch (err) {
        console.error("Failed to load tenant:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    if (!tenant) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateLandingPage(tenant.id, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleHeroImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true);
    try {
      const result = await uploadLandingImage(file, "tenant-hero");
      setForm((prev) => ({ ...prev, heroImage: result.url }));
    } catch (err) {
      console.error("Failed to upload hero image:", err);
    } finally {
      setUploadingHero(false);
      if (heroInputRef.current) heroInputRef.current.value = "";
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGallery(true);
    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadLandingImage(file, "tenant-gallery")
      );
      const results = await Promise.all(uploadPromises);
      const urls = results.map((r) => r.url);
      setForm((prev) => ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), ...urls],
      }));
    } catch (err) {
      console.error("Failed to upload gallery images:", err);
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  }

  function removeGalleryImage(index: number) {
    setForm((prev) => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, i) => i !== index),
    }));
  }

  function addGalleryImageUrl() {
    const url = prompt("Masukkan URL gambar:");
    if (url && url.trim()) {
      setForm((prev) => ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), url.trim()],
      }));
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 dark:text-gray-400">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-medium animate-pulse">Memuat pengaturan landing page...</p>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="p-8">
        <p className="text-red-500">Gagal memuat data toko</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Landing Page"
        description="Kelola konten dan tampilan halaman landing page barbershop Anda."
        backHref="/dashboard/admin"
        backText="Kembali ke Dashboard"
      />

      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <Eye className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Pratinjau live landing page Anda:{" "}
            <a
              href={`/${tenant.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline hover:text-amber-600 dark:hover:text-amber-200 transition-colors"
            >
              /{tenant.slug}
            </a>
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <FormCard
        title="Hero Section"
        description="Gambar utama dan teks yang ditampilkan di bagian atas landing page."
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        {/* Hero Image */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Gambar Hero
          </label>
          <div className="relative group">
            <div className="w-full h-56 md:h-72 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-500 transition-colors">
              {uploadingHero ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-amber-500">
                  <Loader2 className="w-10 h-10 animate-spin mb-2" />
                  <p className="text-sm font-medium">Mengupload gambar...</p>
                </div>
              ) : form.heroImage ? (
                <img
                  src={resolveImageUrl(form.heroImage)}
                  alt="Hero preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                  <ImagePlus className="w-12 h-12 mb-2" />
                  <p className="text-sm">Belum ada gambar</p>
                </div>
              )}
            </div>
            <div className="absolute bottom-3 right-3 flex gap-2">
              <input
                type="file"
                accept="image/*"
                ref={heroInputRef}
                onChange={handleHeroImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => heroInputRef.current?.click()}
                disabled={uploadingHero}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-white dark:hover:bg-neutral-800 transition-colors shadow-lg disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {form.heroImage ? "Ganti" : "Upload"}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Atau masukkan URL gambar secara langsung:
          </p>
          <input
            type="url"
            value={form.heroImage || ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, heroImage: e.target.value }))
            }
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 px-4 py-3 text-gray-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm"
          />
        </div>

        {/* Hero Title */}
        <FormInput
          label="Judul Hero"
          placeholder="Gaya Rambut Terbaik."
          value={form.heroTitle || ""}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, heroTitle: e.target.value }))
          }
        />

        {/* Hero Description */}
        <FormTextarea
          label="Deskripsi Hero"
          placeholder="Selamat datang di barbershop kami. Pengalaman grooming premium..."
          rows={3}
          value={form.heroDescription || ""}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, heroDescription: e.target.value }))
          }
        />

        {/* Tagline */}
        <FormInput
          label="Tagline"
          placeholder="Potongan Tepat. Gaya Meningkat."
          value={form.tagline || ""}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, tagline: e.target.value }))
          }
        />

        {/* About Text */}
        <FormTextarea
          label="Tentang Kami"
          placeholder="Deskripsi singkat tentang barbershop Anda..."
          rows={4}
          value={form.aboutText || ""}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, aboutText: e.target.value }))
          }
        />

        <FormActions
          loading={saving}
          onCancel={() => {
            if (tenant) {
              setForm({
                heroImage: tenant.heroImage || "",
                heroTitle: tenant.heroTitle || "",
                heroDescription: tenant.heroDescription || "",
                tagline: tenant.tagline || "",
                aboutText: tenant.aboutText || "",
                galleryImages: tenant.galleryImages || [],
                ctaTitle: tenant.ctaTitle || "",
                ctaDescription: tenant.ctaDescription || "",
                ctaButtonText: tenant.ctaButtonText || "",
              });
            }
          }}
          submitText={saved ? "Tersimpan!" : "Simpan Semua"}
        />
      </FormCard>

      {/* Gallery Section */}
      <FormCard
        title="Galeri"
        description="Kelola gambar yang ditampilkan di bagian galeri landing page."
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Gambar Galeri ({(form.galleryImages || []).length} gambar)
            </label>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                multiple
                ref={galleryInputRef}
                onChange={handleGalleryUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploadingGallery}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors disabled:opacity-50"
              >
                {uploadingGallery ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploadingGallery ? "Mengupload..." : "Upload"}
              </button>
              <button
                type="button"
                onClick={addGalleryImageUrl}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah URL
              </button>
            </div>
          </div>

          {(form.galleryImages || []).length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-neutral-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <ImagePlus className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Belum ada gambar galeri
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Klik &quot;Upload&quot; atau &quot;Tambah URL&quot; untuk menambah gambar
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(form.galleryImages || []).map((img, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-gray-700"
                >
                  <img
                    src={resolveImageUrl(img)}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <GripVertical className="w-4 h-4 text-white/50" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Gallery URL list */}
          {(form.galleryImages || []).length > 0 && (
            <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                URL Gambar
              </p>
              {(form.galleryImages || []).map((img, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-6 text-right shrink-0">
                    {index + 1}.
                  </span>
                  <input
                    type="url"
                    value={img}
                    onChange={(e) => {
                      const newImages = [...(form.galleryImages || [])];
                      newImages[index] = e.target.value;
                      setForm((prev) => ({ ...prev, galleryImages: newImages }));
                    }}
                    className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <FormActions
          loading={saving}
          onCancel={() => {
            if (tenant) {
              setForm((prev) => ({
                ...prev,
                galleryImages: tenant.galleryImages || [],
              }));
            }
          }}
          submitText={saved ? "Tersimpan!" : "Simpan Galeri"}
        />
      </FormCard>

      {/* CTA Section */}
      <FormCard
        title="Call to Action"
        description="Tombol dan teks ajakan di bagian bawah landing page."
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <FormInput
          label="Judul CTA"
          placeholder="Siap untuk Tampil Beda?"
          value={form.ctaTitle || ""}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, ctaTitle: e.target.value }))
          }
        />

        <FormTextarea
          label="Deskripsi CTA"
          placeholder="Jangan biarkan antrian merusak harimu..."
          rows={3}
          value={form.ctaDescription || ""}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, ctaDescription: e.target.value }))
          }
        />

        <FormInput
          label="Teks Tombol CTA"
          placeholder="Reservasi Sekarang"
          value={form.ctaButtonText || ""}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, ctaButtonText: e.target.value }))
          }
        />

        {/* Preview */}
        <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">
            Pratinjau CTA
          </p>
          <div className="text-center">
            <h3 className="text-2xl font-black text-white mb-2">
              {form.ctaTitle || "Siap untuk Tampil Beda?"}
            </h3>
            <p className="text-neutral-400 mb-4 text-sm">
              {form.ctaDescription ||
                "Jangan biarkan antrian merusak harimu. Buat jadwal potong rambut sekarang."}
            </p>
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-bold rounded-xl text-sm">
              {form.ctaButtonText || "Reservasi Sekarang"}
            </span>
          </div>
        </div>

        <FormActions
          loading={saving}
          onCancel={() => {
            if (tenant) {
              setForm((prev) => ({
                ...prev,
                ctaTitle: tenant.ctaTitle || "",
                ctaDescription: tenant.ctaDescription || "",
                ctaButtonText: tenant.ctaButtonText || "",
              }));
            }
          }}
          submitText={saved ? "Tersimpan!" : "Simpan CTA"}
        />
      </FormCard>

      {/* Quick Save All */}
      <div className="sticky bottom-6 z-10">
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-4 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {saved ? (
              <span className="text-green-600 dark:text-green-400 font-medium">
                Semua perubahan tersimpan!
              </span>
            ) : (
              "Ada perubahan yang belum disimpan"
            )}
          </p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 shadow-sm"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Semua"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
