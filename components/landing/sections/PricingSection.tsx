// src/components/sections/PricingSection.tsx
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/landing/ui/Button";
import Link from "next/link";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "99rb",
    features: [
      "Maksimal 2 Kapster",
      "Link Booking Mandiri",
      "Dashboard Admin Utama",
    ],
    buttonVariant: "outline" as const,
    buttonText: "Pilih Starter",
    isPopular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: "199rb",
    features: [
      "Maksimal 5 Kapster",
      "Notifikasi WhatsApp",
      "Dashboard Kapster Pribadi",
      "Laporan Pendapatan Harian",
    ],
    buttonVariant: "default" as const,
    buttonText: "Mulai Langganan",
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "399rb",
    features: [
      "Kapster Tanpa Batas",
      "Dukungan Multi-Cabang",
      "Custom Logo & Tema",
      "Ekspor Laporan Excel/CSV",
    ],
    buttonVariant: "outline" as const,
    buttonText: "Pilih Enterprise",
    isPopular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-32 bg-neutral-100 dark:bg-neutral-800">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight dark:text-white">
            Pilih Paket Bisnis Anda
          </h2>
          <p className="text-gray-600 text-lg dark:text-gray-400">
            Investasi cerdas untuk pertumbuhan jangka panjang barbershop Anda.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white p-8 flex flex-col shadow-sm relative
                transition-all duration-300
                ${
                  plan.isPopular
                    ? "border-2 border-amber-500 md:-translate-y-4 shadow-2xl hover:-translate-y-5 hover:shadow-[0_28px_50px_rgba(217,119,6,0.2)] dark:border-amber-400"
                    : "border border-gray-200 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:hover:border-amber-500/40"
                }
                dark:bg-neutral-900`}
            >
              {plan.isPopular && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white
                  text-[10px] font-black uppercase px-4 py-1 tracking-widest
                  dark:bg-amber-400 dark:text-gray-900"
                >
                  Paling Populer
                </div>
              )}

              <div className="mb-8">
                <h5
                  className={`font-bold uppercase tracking-widest text-sm mb-2
                  ${
                    plan.isPopular
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {plan.name}
                </h5>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    Rp {plan.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">/bln</span>
                </div>
              </div>

              <ul className="space-y-4 mb-12 flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <li
                    key={fIndex}
                    className={`flex items-center gap-3 text-sm
                      ${
                        plan.isPopular
                          ? "font-bold text-gray-900 dark:text-white"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                  >
                    <CheckCircle2 className="text-amber-600 w-5 h-5 shrink-0 dark:text-amber-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Tombol outline hover seragam dengan warna amber */}
              <Link href={`/register?plan=${plan.id}`} className="block w-full mt-auto">
                <Button
                  variant={plan.buttonVariant}
                  className={`w-full py-4 transition-all duration-300
                    ${
                      plan.buttonVariant === "outline"
                        ? "hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:border-amber-400 dark:hover:text-amber-400 dark:hover:bg-amber-500/10"
                        : ""
                    }`}
                >
                  {plan.buttonText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
