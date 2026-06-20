"use client";

import { Scissors, MapPin, Phone, Clock } from "lucide-react";

interface TenantFooterProps {
  name: string;
  address: string;
  phone: string;
  openTime: string;
  closeTime: string;
}

export default function TenantFooter({
  name,
  address,
  phone,
  openTime,
  closeTime,
}: TenantFooterProps) {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800/50 relative z-30">
      <div className="container mx-auto px-6 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                {name}
              </span>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Potongan rambut berkualitas dengan layanan premium. Kepuasan Anda
              adalah prioritas kami.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Jam Operasional
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-neutral-400">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-sm">
                  Senin - Minggu: {openTime} - {closeTime}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Kontak
            </h4>
            <div className="space-y-3">
              {phone && (
                <div className="flex items-center gap-3 text-neutral-400">
                  <Phone className="w-4 h-4 text-amber-500" />
                  <span className="text-sm">{phone}</span>
                </div>
              )}
              {address && (
                <div className="flex items-start gap-3 text-neutral-400">
                  <MapPin className="w-4 h-4 text-amber-500 mt-0.5" />
                  <span className="text-sm">{address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800/50">
        <div className="container mx-auto px-6 max-w-7xl py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-600 text-sm">
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <p className="text-neutral-600 text-sm">
            Powered by{" "}
            <span className="text-amber-500/80 font-medium">
              Barber Express
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
