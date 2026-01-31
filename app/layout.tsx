import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const appName = process.env.NEXT_PUBLIC_APP_NAME;

export const metadata: Metadata = {
  title: `${appName} - Premium Barbershop Booking`,
  description: `Book your appointment at ${appName} for the best grooming experience. Classic cuts, modern styles, and exceptional service.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased font-inter`}
      >
        <Toaster position="top-right"/>
        {children}
      </body>
    </html>
  );
}
