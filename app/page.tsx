// src/app/page.tsx
import { Navbar } from "@/components/landing/layout/Navbar";
// Anggap komponen section lain sudah kamu buat memisahkan dari HTML
import { HeroSection } from "@/components/landing/sections/HeroSection"; 
import { FeaturesSection } from "@/components/landing/sections/FeaturesSection";
import { PricingSection } from "@/components/landing/sections/PricingSection";
// import { CtaSection } from "@/components/sections/CtaSection";
import { Footer } from "@/components/landing/layout/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-gray-900 font-sans selection:bg-amber-200">
      <Navbar />
      
      <main className="pt-20">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        {/* <CtaSection /> */}
      </main>

      <Footer />
    </div>
  );
}