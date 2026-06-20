import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Scissors } from "lucide-react";
const appName = process.env.NEXT_PUBLIC_APP_NAME;

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/scissors-icon.svg" },
      { url: "/scissors-icon.png", sizes: "192x192", type: "image/png" },
    ],
  },
  title: `${appName} - Barber Shop`,
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
        className={`antialiased font-inter bg-neutral-50 text-gray-900`}
      >
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
