// src/components/sections/HeroSection.tsx
"use client"; // Wajib untuk framer-motion di Next.js App Router
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/frontpage/Button";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden py-32 bg-neutral-100 dark:bg-neutral-800">
      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10"
        >
          <span className="inline-block text-amber-600 font-semibold text-xs uppercase tracking-widest mb-4 dark:text-amber-400">
            Solusi Manajemen Barbershop
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight tracking-tight dark:text-white">
            Fokus Cukur Rambutnya, Biar Kami yang Urus Manajemennya.
          </h1>
          <p className="text-gray-600 text-lg mb-10 max-w-lg leading-relaxed dark:text-gray-400">
            Sistem kasir, reservasi online, dan manajemen kapster dalam satu aplikasi praktis untuk barbershop modern.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg">Mulai Coba Gratis 14 Hari</Button>
            <Button variant="outline" size="lg">Lihat Demo</Button>
          </div>
        </motion.div>

        <div className="relative lg:h-[600px] flex items-center justify-center">
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="relative w-full max-w-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700 z-10"
          >
            <div className="aspect-square bg-white rounded-lg shadow-2xl border border-gray-200 flex items-center justify-center text-gray-400 dark:bg-neutral-800 dark:border-gray-700 dark:text-gray-500">
               [Area Ilustrasi Isometrik / Gambar]
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 blur-[120px] -z-10 rounded-full" />
    </section>
  );
}