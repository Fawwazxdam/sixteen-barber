'use client';

import { motion } from 'framer-motion';
import { Search, Menu } from 'lucide-react';

interface CrewMember {
  id: number;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
}

const crewData: CrewMember[] = [
  {
    id: 1,
    name: "Moh. Zulfikar",
    role: "Founder & Barber",
    description: "Dengan pengalaman lebih dari 10 tahun, saya berkomitmen memberikan potongan rambut terbaik untuk setiap pelanggan.",
    imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=500&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "John Doe",
    role: "Senior Barber",
    description: "Spesialis fade dan desain rambut modern. Selalu mengikuti tren terbaru dalam dunia barber.",
    imageUrl: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400&h=500&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Jane Smith",
    role: "Barber",
    description: "Passionate tentang memberikan pengalaman grooming yang nyaman dan santai untuk semua客户.",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Mike Johnson",
    role: "Barber",
    description: "Ahli dalam teknik shave dan trim. Memberikan pelayanan presisi untuk setiap kebutuhan.",
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=500&fit=crop&crop=face"
  }
];

interface CrewSectionProps {
  id?: string;
}

export default function CrewSection({ id }: CrewSectionProps) {
  return (
    <section id={id} className="px-6 md:px-12 lg:px-24 py-20 bg-[#E6E0D2] text-amber-950">
      <main>
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-amber-900 mb-4 font-playfair">Maestro Kami</h2>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto italic">
            Tim barber berpengalaman yang berdedikasi untuk seni potong rambut dan gaya pria.
          </p>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 pb-20">
          {crewData.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col"
            >
              {/* Image Container */}
              <div className="mb-6 overflow-hidden">
                <img 
                  src={member.imageUrl} 
                  alt={member.name} 
                  className="w-full aspect-4/5 object-cover grayscale contrast-125"
                />
              </div>
              
              {/* Content */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg leading-tight text-amber-900">
                  {member.name}
                </h3>
                <p className="text-xs uppercase tracking-wide text-amber-700">
                  {member.role}
                </p>
                <p className="text-sm leading-relaxed text-amber-800 font-light mt-4">
                  {member.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </section>
  );
}
