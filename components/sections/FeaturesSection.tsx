// src/components/sections/FeaturesSection.tsx
"use client";
import { motion } from "framer-motion";
import { Calculator, CalendarCheck, Users } from "lucide-react";

const features = [
  {
    title: "POS & Kasir Cepat",
    description: "Transaksi cepat, catat komisi otomatis, dan cetak struk digital langsung ke WhatsApp pelanggan.",
    icon: Calculator,
  },
  {
    title: "Reservasi Online",
    description: "Pelanggan bisa booking sendiri melalui link khusus, bebas antrean menumpuk dan pengaturan jadwal real-time.",
    icon: CalendarCheck,
  },
  {
    title: "Manajemen Kapster",
    description: "Atur jadwal shift, pantau performa tiap kapster, dan hitung bagi hasil secara presisi tanpa repot.",
    icon: Users,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 bg-neutral-100 dark:bg-neutral-800">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight dark:text-white">Fitur Utama</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg dark:text-gray-400">
            Dirancang untuk kecepatan dan akurasi, memberikan kontrol penuh atas operasional toko Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className={`bg-white p-10 border border-gray-200 group hover:border-amber-500/50 transition-all duration-300 shadow-sm hover:shadow-xl ${index === 0 ? "border-t-amber-500 border-t-2" : ""} dark:bg-neutral-900 dark:border-gray-700 dark:hover:border-amber-500/50`}
            >
              <div className="w-16 h-16 bg-amber-50 flex items-center justify-center mb-8 group-hover:bg-amber-500 transition-colors dark:bg-neutral-800 dark:group-hover:bg-amber-500">
                <feature.icon className="w-8 h-8 text-amber-600 group-hover:text-white transition-colors dark:text-amber-400 dark:group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}