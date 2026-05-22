"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/landing/ui/Button";

interface TenantNavbarProps {
  tenantName: string;
  tenantSlug: string;
}

export function TenantNavbar({ tenantName, tenantSlug }: TenantNavbarProps) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 h-20 px-8 dark:bg-neutral-900/90 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
        <Link
          href={`/${tenantSlug}`}
          className="text-2xl font-black tracking-tighter text-gray-900 uppercase dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          {tenantName}
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-amber-50 transition-colors text-gray-600 hover:text-amber-600 dark:border-gray-700 dark:bg-transparent dark:hover:bg-neutral-800 dark:hover:text-amber-400"
            aria-label="Toggle theme"
          >
            <svg
              className="w-5 h-5 hidden dark:block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              className="w-5 h-5 block dark:hidden"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>
          <Link href={`/${tenantSlug}/booking/cek`}>
            <Button variant="ghost">
              Cek Booking
            </Button>
          </Link>
          <Link href={`/${tenantSlug}/booking`}>
            <Button variant="outline">
              Booking
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
