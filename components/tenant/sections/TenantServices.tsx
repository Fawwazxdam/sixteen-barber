"use client";

import { motion } from "framer-motion";
import { Scissors, Star, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { idrFormat } from "@/lib/utils";
import axios from "axios";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  isActive: boolean;
}

const getServiceIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("haircut") || lowerName.includes("cut"))
    return Scissors;
  if (lowerName.includes("shave")) return Star;
  if (lowerName.includes("beard")) return Clock;
  return Scissors;
};

interface TenantServicesProps {
  id?: string;
}

export default function TenantServices({ id }: TenantServicesProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get<Service[]>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/services`
        );
        setServices(response.data.filter((s) => s.isActive));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <section id={id} className="py-24 bg-neutral-950 relative z-30">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <p className="text-neutral-500">Memuat layanan...</p>
        </div>
      </section>
    );
  }

  if (services.length === 0) return null;

  return (
    <section id={id} className="py-24 bg-neutral-950 relative z-30">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
            Layanan
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Pilih <span className="text-amber-500">Layanan</span> Kami
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            Dari potongan klasik sampai modern, setiap detail dikerjakan dengan presisi
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => {
            const IconComponent = getServiceIcon(service.name);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group relative bg-neutral-900/50 border border-neutral-800/50 rounded-3xl p-7 hover:border-amber-500/30 transition-all duration-500 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <IconComponent className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      <span className="text-xs text-neutral-400 font-medium">
                        {service.duration} menit
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {service.name}
                  </h3>
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                    {idrFormat(service.price)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
