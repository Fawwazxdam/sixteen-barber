// src/components/sections/HeroSection.tsx
"use client"; // Wajib untuk framer-motion di Next.js App Router
import { motion } from "framer-motion";
import { Button } from "@/components/landing/ui/Button";
import Link from "next/link";

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
             <Link href="/register">
               <Button size="lg">Mulai Coba Gratis 14 Hari</Button>
             </Link>
             <Button variant="outline" size="lg">Lihat Demo</Button>
           </div>
        </motion.div>

        <div className="relative lg:h-[600px] flex items-center justify-center">
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="relative w-full max-w-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700 z-10"
          >
            <div className="w-full aspect-[4/3] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col dark:bg-neutral-900 dark:border-neutral-700">
              {/* Mockup Top Bar */}
              <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2 dark:bg-neutral-800 dark:border-neutral-700">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              {/* Mockup Content */}
              <div className="flex-1 p-6 grid grid-cols-3 gap-4 bg-gray-50/50 dark:bg-neutral-900/50">
                <div className="col-span-1 flex flex-col gap-4">
                  <div className="h-20 bg-amber-100 rounded-lg border border-amber-200 dark:bg-amber-900/30 dark:border-amber-800"></div>
                  <div className="h-32 bg-white rounded-lg border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700"></div>
                  <div className="h-20 bg-white rounded-lg border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700"></div>
                </div>
                <div className="col-span-2 flex flex-col gap-4">
                  <div className="h-32 bg-white rounded-lg border border-gray-200 p-4 dark:bg-neutral-800 dark:border-neutral-700">
                    <div className="w-1/3 h-4 bg-gray-200 rounded mb-4 dark:bg-neutral-700"></div>
                    <div className="w-full h-2 bg-gray-100 rounded mb-2 dark:bg-neutral-700"></div>
                    <div className="w-4/5 h-2 bg-gray-100 rounded mb-2 dark:bg-neutral-700"></div>
                    <div className="w-2/3 h-2 bg-gray-100 rounded dark:bg-neutral-700"></div>
                  </div>
                  <div className="h-full bg-white rounded-lg border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 blur-[120px] -z-10 rounded-full" />
    </section>
  );
}