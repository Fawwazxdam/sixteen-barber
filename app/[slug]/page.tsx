import { notFound } from "next/navigation";
import { getTenantBySlug } from "@/lib/api/tenants";
import Link from "next/link";
import { MapPin, Phone, Clock, Calendar, Scissors, ChevronRight } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TenantRootPage({ params }: PageProps) {
  const { slug } = await params;

  let tenant;
  try {
    tenant = await getTenantBySlug(slug);
  } catch (error) {
    return notFound();
  }

  if (!tenant) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-amber-500/30">
      {/* Navigation / Header */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-2">
          <Scissors className="w-8 h-8 text-amber-500" />
          <span className="text-2xl font-black tracking-tighter text-white">{tenant.name}</span>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/${slug}/booking/cek`}
            className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 bg-transparent border border-amber-600 hover:bg-amber-700 text-amber-600 hover:text-white font-semibold rounded-full transition-all hover:scale-105 active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            Cek Booking
          </Link>
          <Link
            href={`/${slug}/booking`}
            className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-all hover:scale-105 active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            Reservasi Sekarang
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-neutral-950/85 z-10" />
          <img
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop"
            alt={`${tenant.name} Background`}
            className="w-full h-full object-cover grayscale opacity-50"
          />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-neutral-950 to-transparent z-20" />
        </div>

        <div className="container mx-auto px-6 relative z-30 max-w-7xl">
          <div className="max-w-3xl animate-in slide-in-from-bottom-8 duration-700 fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-neutral-300">
                Buka Hari Ini: <strong className="text-white">{tenant.openTime} - {tenant.closeTime}</strong>
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              Gaya Rambut Terbaik,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                Kepercayaan Diri Penuh.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl leading-relaxed">
              Selamat datang di <strong>{tenant.name}</strong>. Kami menghadirkan pengalaman grooming premium dengan kapster profesional yang siap mewujudkan gaya impian Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${slug}/booking`}
                className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_30px_-5px_rgba(217,119,6,0.5)] active:scale-95 text-lg"
              >
                Buat Janji Sekarang
                <ChevronRight className="w-5 h-5" />
              </Link>
              <a
                href="#info"
                className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all backdrop-blur-sm active:scale-95 text-lg"
              >
                Lihat Informasi
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="info" className="py-20 bg-neutral-950 relative z-30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Address */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-amber-500/30 transition-colors group">
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                <MapPin className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lokasi Kami</h3>
              <p className="text-neutral-400 leading-relaxed">
                {tenant.address || "Hubungi kami untuk informasi lokasi."}
              </p>
            </div>

            {/* Hours */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-amber-500/30 transition-colors group">
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                <Clock className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Jam Operasional</h3>
              <div className="space-y-2 text-neutral-400">
                <div className="flex justify-between border-b border-neutral-800 pb-2">
                  <span>Senin - Minggu</span>
                  <span className="text-white font-medium">{tenant.openTime} - {tenant.closeTime}</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-amber-500/30 transition-colors group">
              <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                <Phone className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Hubungi Kami</h3>
              <p className="text-neutral-400 leading-relaxed mb-4">
                Ada pertanyaan atau butuh bantuan untuk reservasi?
              </p>
              <a href={`https://wa.me/${(tenant.phone || "").replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-amber-500 font-medium hover:text-amber-400 flex items-center gap-2">
                {tenant.phone || "Tidak ada nomor"}
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Action CTA Section */}
      <section className="py-24 bg-neutral-900 relative z-30 border-y border-neutral-800">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Siap untuk Tampil Beda?
          </h2>
          <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
            Jangan biarkan antrian merusak harimu. Buat jadwal potong rambut sekarang juga dan nikmati layanan tanpa antre di <strong>{tenant.name}</strong>.
          </p>
          <Link
            href={`/${slug}/booking`}
            className="inline-flex justify-center items-center gap-2 px-10 py-5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_40px_-5px_rgba(217,119,6,0.6)] active:scale-95 text-xl"
          >
            Reservasi Jadwal Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 py-10 relative z-30">
        <div className="container mx-auto px-6 max-w-7xl text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Scissors className="w-6 h-6 text-amber-500" />
            <span className="text-xl font-bold text-white">{tenant.name}</span>
          </div>
          <p className="text-neutral-500 text-sm">
            &copy; {new Date().getFullYear()} {tenant.name}. All rights reserved. Powered by Barber Express.
          </p>
        </div>
      </footer>
    </div>
  );
}
