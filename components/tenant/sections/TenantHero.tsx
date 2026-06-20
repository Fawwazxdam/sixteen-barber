"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, ChevronRight, MapPin, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { resolveImageUrl } from "@/lib/utils";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop";

interface TenantHeroProps {
  slug: string;
  name: string;
  openTime: string;
  closeTime: string;
  hasActiveSubscription: boolean;
  heroImage?: string;
  heroTitle?: string;
  heroDescription?: string;
  tagline?: string;
  aboutText?: string;
}

export default function TenantHero({
  slug,
  name,
  openTime,
  closeTime,
  hasActiveSubscription,
  heroImage,
  heroTitle,
  heroDescription,
  tagline,
  aboutText,
}: TenantHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const displayTitle = heroTitle || "Gaya Rambut Terbaik.";
  const displayDescription =
    heroDescription ||
    `Selamat datang di ${name}. Pengalaman grooming premium dengan kapster profesional yang siap mewujudkan gaya impian Anda.`;
  const displayTagline = tagline || "";

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-neutral-950/70 z-10" />
        <img
          src={resolveImageUrl(heroImage) || DEFAULT_HERO_IMAGE}
          alt={`${name} Background`}
          className="w-full h-full object-cover grayscale opacity-40 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950 z-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/60 via-transparent to-neutral-950/60 z-20" />
      </motion.div>

      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        style={{ opacity }}
        className="container mx-auto px-6 relative z-30 max-w-7xl pt-24"
      >
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
            <span className="text-sm font-medium text-neutral-300">
              Buka Hari Ini:{" "}
              <strong className="text-white">
                {openTime} - {closeTime}
              </strong>
            </span>
          </motion.div>

          {!hasActiveSubscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8 inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-md"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span className="text-red-200 font-medium text-sm">
                Barbershop ini sedang tidak menerima jadwal reservasi online
              </span>
            </motion.div>
          )}

          {displayTagline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-amber-400 font-semibold text-lg mb-4"
            >
              {displayTagline}
            </motion.p>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.05] tracking-tight"
          >
            {displayTitle.split(" ").length > 2 ? (
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
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-neutral-400 mb-12 max-w-xl leading-relaxed"
          >
            {displayDescription.split("**").length > 1 ? (
              <>
                {displayDescription.split("**")[0]}
                <strong className="text-white font-semibold">
                  {displayDescription.split("**")[1]}
                </strong>
                {displayDescription.split("**").slice(2).join("")}
              </>
            ) : (
              <>
                Selamat datang di{" "}
                <strong className="text-white font-semibold">{name}</strong>.{" "}
                {displayDescription}
              </>
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            {hasActiveSubscription ? (
              <Link
                href={`/${slug}/booking`}
                className="group inline-flex justify-center items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_-5px_rgba(245,158,11,0.5)] active:scale-95 text-lg"
              >
                Buat Janji Sekarang
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <button
                disabled
                className="inline-flex justify-center items-center gap-3 px-8 py-4 bg-neutral-800 text-neutral-500 font-bold rounded-2xl cursor-not-allowed opacity-80 text-lg"
              >
                Reservasi Ditutup
              </button>
            )}
            <a
              href="#info"
              className="inline-flex justify-center items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-2xl border border-white/10 transition-all backdrop-blur-sm active:scale-95 text-lg"
            >
              Lihat Informasi
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-20 flex items-center gap-8 text-neutral-500"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{name}</span>
            </div>
            <div className="w-px h-4 bg-neutral-700" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {openTime} - {closeTime}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent z-30" />
    </section>
  );
}
