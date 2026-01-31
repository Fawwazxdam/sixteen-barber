'use client';

import { motion } from 'framer-motion';

const galleryImages = [
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1622296089863-9a57ba4c6d3d?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&h=300&fit=crop&crop=face"
];

export default function GallerySection() {
  return (
    <section className="px-6 py-20 bg-amber-50/50 border-t border-amber-200/30">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-amber-900 mb-4 font-playfair">Karya Kami</h2>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto italic">
            Potongan yang bikin balik lagi
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-amber-200/30"
            >
              <img
                src={image}
                alt={`Barber work ${index + 1}`}
                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}