import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function idrFormat(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatIndonesianDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(date);
}

export function formatIndonesianDateShort(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(date);
}


export function appProfile() {
  return {
    "name": process.env.NEXT_PUBLIC_APP_NAME,
    "email": `${process.env.NEXT_PUBLIC_APP_NAME}@barber.com`,
    "address": "Jl. Jend. Sudirman No. 123, Jakarta Selatan",
    "phone": "08123456789",
  }
}

export function formatWhatsAppNumber(phone: string): string {
  if (!phone) return "";
  let cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "62" + cleanPhone.substring(1);
  }
  return cleanPhone;
}

export function generateWhatsAppLink(phone: string, text: string): string {
  const waNumber = formatWhatsAppNumber(phone);
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
}

export function resolveImageUrl(url: string | undefined | null): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`;
}