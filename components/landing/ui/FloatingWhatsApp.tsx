import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  tenantName?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ phoneNumber, tenantName }) => {
  if (!phoneNumber) return null;

  const formatWhatsAppNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) {
      return `62${cleanPhone.slice(1)}`;
    }
    return cleanPhone;
  };

  const waNumber = formatWhatsAppNumber(phoneNumber);
  const message = encodeURIComponent(`Halo admin ${tenantName ? tenantName : ''}, saya ingin bertanya tentang layanan Anda.`);
  const waLink = `https://wa.me/${waNumber}?text=${message}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all duration-300 group"
      aria-label="Chat with admin on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute right-16 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm font-bold py-2 px-4 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-gray-100 dark:border-gray-700">
        Chat Admin
      </span>
    </a>
  );
};
