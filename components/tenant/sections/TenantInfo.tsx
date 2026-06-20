"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ChevronRight } from "lucide-react";

interface TenantInfoProps {
  name: string;
  address: string;
  phone: string;
  openTime: string;
  closeTime: string;
  aboutText?: string;
}

const infoCards = [
  {
    key: "address",
    icon: MapPin,
    title: "Lokasi Kami",
  },
  {
    key: "hours",
    icon: Clock,
    title: "Jam Operasional",
  },
  {
    key: "contact",
    icon: Phone,
    title: "Hubungi Kami",
  },
];

export default function TenantInfo({
  name,
  address,
  phone,
  openTime,
  closeTime,
  aboutText,
}: TenantInfoProps) {
  return (
    <section id="info" className="py-24 bg-neutral-950 relative z-30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
            Informasi
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Kunjungi <span className="text-amber-500">{name}</span>
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            {aboutText || "Kami siap melayani Anda setiap hari dengan layanan terbaik"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            viewport={{ once: true }}
            className="group relative bg-neutral-900/50 border border-neutral-800/50 rounded-3xl p-8 hover:border-amber-500/30 transition-all duration-500 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <MapPin className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lokasi Kami</h3>
              <p className="text-neutral-400 leading-relaxed">
                {address || "Hubungi kami untuk informasi lokasi."}
              </p>
            </div>
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="group relative bg-neutral-900/50 border border-neutral-800/50 rounded-3xl p-8 hover:border-amber-500/30 transition-all duration-500 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Clock className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Jam Operasional
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-800/50">
                  <span className="text-neutral-400">Senin - Minggu</span>
                  <span className="text-white font-semibold px-3 py-1 bg-white/5 rounded-lg">
                    {openTime} - {closeTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Buka sekarang
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="group relative bg-neutral-900/50 border border-neutral-800/50 rounded-3xl p-8 hover:border-amber-500/30 transition-all duration-500 backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <Phone className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Hubungi Kami
              </h3>
              <p className="text-neutral-400 leading-relaxed mb-5">
                Ada pertanyaan? Kami siap membantu Anda.
              </p>
              <a
                href={`https://wa.me/${(phone || "").replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-amber-500 font-semibold hover:text-amber-400 group/link transition-colors"
              >
                {phone || "Tidak ada nomor"}
                <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
