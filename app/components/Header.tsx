'use client';

import { Scissors, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-linear-to-r from-amber-950 via-amber-900 to-amber-950 backdrop-blur-sm border-b border-amber-200/50 shadow-sm">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Scissors className="h-8 w-8 text-amber-100" />
            <span className="text-2xl font-bold text-amber-50 font-playfair">Sixteen Barber</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-white/90 hover:text-amber-600 transition-colors font-medium">Beranda</a>
            <a href="#services" className="text-white/90 hover:text-amber-600 transition-colors font-medium">Layanan</a>
            <a href="#gallery" className="text-white/90 hover:text-amber-600 transition-colors font-medium">Galeri</a>
            <a href="#contact" className="text-white/90 hover:text-amber-600 transition-colors font-medium">Kontak</a>
          </nav>

          {/* CTA Button */}
          <Link
            href="/bookking"
            className="flex items-center space-x-2 bg-amber-700 hover:bg-amber-800 text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            <Calendar className="h-4 w-4" />
            <span>Booking Kursimu</span>
          </Link>
        </div>
      </div>
    </header>
  );
}