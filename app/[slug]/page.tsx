import { notFound } from "next/navigation";
import { getTenantBySlug } from "@/lib/api/tenants";
import TenantNavbar from "@/components/tenant/layout/TenantNavbar";
import TenantHero from "@/components/tenant/sections/TenantHero";
import TenantServices from "@/components/tenant/sections/TenantServices";
import TenantGallery from "@/components/tenant/sections/TenantGallery";
import TenantInfo from "@/components/tenant/sections/TenantInfo";
import TenantCTA from "@/components/tenant/sections/TenantCTA";
import TenantFooter from "@/components/tenant/layout/TenantFooter";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TenantRootPage({ params }: PageProps) {
  const { slug } = await params;

  let tenant;
  try {
    tenant = await getTenantBySlug(slug);
  } catch {
    return notFound();
  }

  if (!tenant) {
    return notFound();
  }

  const hasActive = tenant.hasActiveSubscription ?? false;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-amber-500/30">
      <TenantNavbar
        slug={slug}
        name={tenant.name}
        hasActiveSubscription={hasActive}
      />

      <main>
        <TenantHero
          slug={slug}
          name={tenant.name}
          openTime={tenant.openTime}
          closeTime={tenant.closeTime}
          hasActiveSubscription={hasActive}
          heroImage={tenant.heroImage}
          heroTitle={tenant.heroTitle}
          heroDescription={tenant.heroDescription}
          tagline={tenant.tagline}
          aboutText={tenant.aboutText}
        />

        <TenantServices id="services" />

        <TenantGallery
          name={tenant.name}
          images={tenant.galleryImages}
        />

        <TenantInfo
          name={tenant.name}
          address={tenant.address}
          phone={tenant.phone}
          openTime={tenant.openTime}
          closeTime={tenant.closeTime}
          aboutText={tenant.aboutText}
        />

        <TenantCTA
          slug={slug}
          name={tenant.name}
          hasActiveSubscription={hasActive}
          ctaTitle={tenant.ctaTitle}
          ctaDescription={tenant.ctaDescription}
          ctaButtonText={tenant.ctaButtonText}
        />
      </main>

      <TenantFooter
        name={tenant.name}
        address={tenant.address}
        phone={tenant.phone}
        openTime={tenant.openTime}
        closeTime={tenant.closeTime}
      />
    </div>
  );
}
