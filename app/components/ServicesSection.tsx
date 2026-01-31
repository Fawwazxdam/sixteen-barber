"use client";

import { motion } from "framer-motion";
import { Scissors, Star, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { idrFormat } from "../../lib/utils";

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
  return Scissors; // default
};

const getServiceDescription = (name: string, duration: number) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("haircut") || lowerName.includes("cut")) {
    return `Layanan potong rambut profesional selama ${duration} menit`;
  }
  if (lowerName.includes("shave")) {
    return `Pengalaman cukur mewah selama ${duration} menit`;
  }
  if (lowerName.includes("beard")) {
    return `Perawatan jenggot ahli selama ${duration} menit`;
  }
  return `Layanan cukur berkualitas selama ${duration} menit`;
};

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/services`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const data: Service[] = await response.json();
        const activeServices = data.filter((service) => service.isActive);
        setServices(activeServices);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="px-6 py-20 bg-white/60 backdrop-blur-sm relative">
        <div className="relative z-10 text-center">
          <p className="text-lg text-amber-700">Memuat layanan...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 py-20 bg-white/60 backdrop-blur-sm relative">
        <div className="relative z-10 text-center">
          <p className="text-lg text-red-600">
            Kesalahan memuat layanan: {error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-20 bg-white/60 backdrop-blur-sm relative">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.03'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-amber-900 mb-4 font-playfair">
            Dirancang untuk Pria yang Peduli Penampilan
          </h2>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto">
            Dari potongan klasik sampai modern, setiap detail dikerjakan dengan
            fokus. Tanpa buru-buru. Tanpa asal cepat. Karena gaya yang bagus
            butuh presisi.
          </p>
        </motion.div>

        {services.length <= 3 ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full ">
              {services.map((service, index) => {
                const IconComponent = getServiceIcon(service.name);
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <IconComponent className="h-12 w-12 text-amber-800 mb-4" />
                    <h3 className="text-xl font-semibold text-amber-900 mb-2 font-playfair">
                      {service.name}
                    </h3>
                    <p className="text-2xl font-bold text-amber-800">
                      {idrFormat(service.price)}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-8 snap-x snap-mandatory min-w-max px-4">
              {services.map((service, index) => {
                const IconComponent = getServiceIcon(service.name);
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 snap-center shrink-0 w-80"
                  >
                    <IconComponent className="h-12 w-12 text-amber-800 mb-4" />
                    <h3 className="text-xl font-semibold text-amber-900 mb-2 font-playfair">
                      {service.name}
                    </h3>
                    <p className="text-2xl font-bold text-amber-800">
                      {idrFormat(service.price)}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
