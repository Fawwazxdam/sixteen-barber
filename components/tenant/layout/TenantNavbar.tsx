"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Calendar, Menu, X } from "lucide-react";
import Link from "next/link";

interface TenantNavbarProps {
  slug: string;
  name: string;
  hasActiveSubscription: boolean;
}

export default function TenantNavbar({
  slug,
  name,
  hasActiveSubscription,
}: TenantNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Beranda", href: "#hero" },
    { label: "Layanan", href: "#services" },
    { label: "Galeri", href: "#gallery" },
    { label: "Kontak", href: "#info" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-neutral-950/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href={`/${slug}`} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              {name}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href={`/${slug}/booking/cek`}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-amber-500 border border-amber-500/30 rounded-full hover:bg-amber-500/10 transition-all"
            >
              <Calendar className="w-4 h-4" />
              Cek Booking
            </Link>
            {hasActiveSubscription ? (
              <Link
                href={`/${slug}/booking`}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-full hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40"
              >
                <Calendar className="w-4 h-4" />
                Reservasi
              </Link>
            ) : (
              <button
                disabled
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-neutral-500 bg-neutral-800 rounded-full cursor-not-allowed"
              >
                <Calendar className="w-4 h-4" />
                Ditutup
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-neutral-950/98 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-4 text-lg font-medium text-neutral-300 hover:text-white border-b border-white/5 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={`/${slug}/booking/cek`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-amber-500 border border-amber-500/30 rounded-xl hover:bg-amber-500/10 transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  Cek Booking
                </Link>
                {hasActiveSubscription ? (
                  <Link
                    href={`/${slug}/booking`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl transition-all"
                  >
                    <Calendar className="w-5 h-5" />
                    Reservasi Sekarang
                  </Link>
                ) : (
                  <button
                    disabled
                    className="flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-neutral-500 bg-neutral-800 rounded-xl cursor-not-allowed"
                  >
                    Reservasi Ditutup
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
