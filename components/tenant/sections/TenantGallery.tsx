"use client";

import { motion } from "framer-motion";
import { resolveImageUrl } from "@/lib/utils";

const DEFAULT_GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=500&fit=crop&crop=face",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400&h=300&fit=crop&crop=face",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop&crop=face",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1622296089863-9a57ba4c6d3d?w=400&h=300&fit=crop&crop=face",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop&crop=face",
    span: "md:col-span-2",
  },
];

interface TenantGalleryProps {
  name: string;
  images?: string[];
}

export default function TenantGallery({ name, images }: TenantGalleryProps) {
  const galleryImages =
    images && images.length > 0
      ? images.map((src, i) => ({
          src,
          span: i === 0 ? "md:col-span-2 md:row-span-2" : "",
        }))
      : DEFAULT_GALLERY_IMAGES;

  return (
    <section
      id="gallery"
      className="py-24 bg-neutral-950 relative z-30 overflow-hidden"
    >
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
            Galeri
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Karya <span className="text-amber-500">Terbaik</span> Kami
          </h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            Potongan yang bikin balik lagi
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${image.span}`}
            >
              <img
                src={resolveImageUrl(image.src)}
                alt={`${name} gallery ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-sm font-medium text-white/80">
                  {name} #{index + 1}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
