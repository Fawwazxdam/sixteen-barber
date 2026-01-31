"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="px-6 py-20 bg-linear-to-r from-amber-900 via-amber-800 to-amber-900 relative">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.05'%3E%3Cpath d='M50 50c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm20 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zM30 30c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mx-auto max-w-4xl text-center text-white relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
          <h2 className="text-4xl font-bold mb-4 font-playfair">
            Siap Tampil Lebih Rapi Hari Ini?
          </h2>
          <p className="text-xl mb-8 text-amber-100 italic">
            Pilih barber, pilih jam, duduk santai. Sisanya biar kami yang urus.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center px-8 py-4 bg-white text-amber-800 text-lg font-semibold rounded-lg hover:bg-amber-50 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Booking Kursimu
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
