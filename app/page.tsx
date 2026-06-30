import { Navbar } from "@/components/landing/layout/Navbar";
import { HeroSection } from "@/components/landing/sections/HeroSection";
import { FeaturesSection } from "@/components/landing/sections/FeaturesSection";
import { PricingSection } from "@/components/landing/sections/PricingSection";
import { Footer } from "@/components/landing/layout/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-gray-900 font-sans selection:bg-amber-200">
      <Navbar />
      
      <main className="pt-20">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </main>

      <Footer />
    </div>
  );
}
