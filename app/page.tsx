// src/app/page.tsx
import { Navbar } from "@/components/layout/Navbar";
// Anggap komponen section lain sudah kamu buat memisahkan dari HTML
import { HeroSection } from "@/components/sections/HeroSection"; 
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { PricingSection } from "@/components/sections/PricingSection";
// import { CtaSection } from "@/components/sections/CtaSection";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-gray-900 font-sans selection:bg-amber-200">
      <Navbar />
      
      <main className="pt-20">
        <HeroSection />
        <FeaturesSection /> {/* Copas bagian <section> fitur dari HTML kesini */}
        <PricingSection />  {/* Copas bagian <section> harga dari HTML kesini */}
        {/* <CtaSection />      Copas bagian <section> CTA hitam dari HTML kesini */}
      </main>

      <Footer />
    </div>
  );
}