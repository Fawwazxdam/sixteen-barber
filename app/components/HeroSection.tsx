"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative px-6 py-36">
      <div className="mx-auto max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-amber-900 leading-tight font-playfair">
            Potongan Tepat. Gaya Meningkat.
            <br />
            <span className="text-amber-700">Percaya Diri Tanpa Ribet.</span>
          </h1>
          <p className="text-xl text-amber-800 max-w-2xl mx-auto leading-relaxed">
            Nikmati potongan rambut dan perawatan pria oleh barber
            berpengalaman, dengan teknik klasik, presisi modern, dan suasana
            barbershop autentik.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/booking"
              className="inline-flex items-center px-8 py-4 bg-amber-800 text-white text-lg font-semibold rounded-lg hover:bg-amber-900 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Booking Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="inline-flex items-center px-8 py-4 border-2 border-amber-800 text-amber-800 text-lg font-semibold rounded-lg hover:bg-amber-800 hover:text-white transition-all duration-300">
              Lihat Pricelist
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
