"use client";

import { motion } from "framer-motion";
import { Calendar, Sparkles } from "lucide-react";
import Link from "next/link";

interface TenantCTAProps {
  slug: string;
  name: string;
  hasActiveSubscription: boolean;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
}

export default function TenantCTA({
  slug,
  name,
  hasActiveSubscription,
  ctaTitle,
  ctaDescription,
  ctaButtonText,
}: TenantCTAProps) {
  const displayTitle = ctaTitle || "Jangan Biarkan Antrian Merusak Harimu";
  const displayDescription =
    ctaDescription ||
    `Buat jadwal potong rambut sekarang dan nikmati layanan tanpa antre di ${name}.`;
  const displayButtonText = ctaButtonText || "Reservasi Jadwal Sekarang";

  return (
    <section className="py-28 bg-neutral-950 relative z-30 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">
              Siap Tampil Beda?
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            {displayTitle.split(" ").length > 3 ? (
              <>
                {displayTitle.split(" ").slice(0, Math.ceil(displayTitle.split(" ").length / 2)).join(" ")}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                  {displayTitle.split(" ").slice(Math.ceil(displayTitle.split(" ").length / 2)).join(" ")}
                </span>
              </>
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                {displayTitle}
              </span>
            )}
          </h2>

          <p className="text-lg text-neutral-400 mb-12 max-w-xl mx-auto leading-relaxed">
            {displayDescription}
          </p>

          {hasActiveSubscription ? (
            <Link
              href={`/${slug}/booking`}
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-[0_0_60px_-10px_rgba(245,158,11,0.5)] active:scale-95 text-xl"
            >
              <Calendar className="w-6 h-6" />
              {displayButtonText}
            </Link>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-3 px-10 py-5 bg-neutral-800 text-neutral-500 font-bold rounded-2xl cursor-not-allowed opacity-80 text-xl"
            >
              Reservasi Ditutup
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
