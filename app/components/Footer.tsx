"use client";

import { LogIn, Scissors, UserCheck } from "lucide-react";
import Link from "next/link";
import { appProfile } from "@/lib/utils";

export default function Footer() {
  const profile = appProfile();

  return (
    <footer className="bg-linear-to-r from-amber-950 via-amber-900 to-amber-950 text-white px-6 py-12 border-t border-amber-800/50 relative">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.03'%3E%3Cpath d='M40 40c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm30 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <Scissors className="h-8 w-8" />
              <span className="text-2xl font-bold text-amber-50 font-playfair">
                {process.env.NEXT_PUBLIC_APP_NAME}
              </span>
              <span className="text-xs text-amber-200 tracking-wide">
                Est. 2020
              </span>
            </div>
            <div className="space-y-1 text-amber-200">
              <p></p>
            </div>
          </div>
          <div className="text-center">
            <h4 className="font-semibold mb-4 font-playfair">
              Jam Operasional
            </h4>
            <div className="space-y-1 text-amber-200">
              <p>Everyday: 8AM - 10PM</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <h4 className="font-semibold mb-4 font-playfair">Kontak</h4>
            <div className="space-y-1 text-amber-200">
              <p>{profile.phone}</p>
              <p>{profile.email}</p>
              <p>{profile.address}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-amber-800/50 pt-8 text-center">
          <p className="text-amber-300 italic">
            © 2024 {process.env.NEXT_PUBLIC_APP_NAME}. Karena potongan yang baik tidak pernah lekang oleh waktu..
          </p>
          {/* Hidden admin login link - for internal use only */}
          <Link
            href="/login"
            className="inline-block mt-2 text-amber-500 hover:text-amber-700 text-xs transition-colors"
          >
            <LogIn className="inline-block mr-1" /> - <UserCheck className="inline-block mr-1" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
