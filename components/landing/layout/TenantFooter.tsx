"use client";

import { Share2, Globe, Mail } from "lucide-react";

interface TenantFooterProps {
  tenantName: string;
}

export function TenantFooter({ tenantName }: TenantFooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200 w-full py-12 px-8 dark:bg-neutral-900 dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <div className="text-lg font-bold text-gray-900 uppercase dark:text-white">
            {tenantName}
          </div>
          <p className="font-inter text-xs tracking-tight text-gray-500 uppercase dark:text-gray-400">
            © {new Date().getFullYear()} {tenantName}. PRECISION IN EVERY CUT.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <span className="font-inter text-xs tracking-tight text-gray-400 uppercase">
            Powered by MEMANGKAS
          </span>
        </div>

        <div className="flex gap-4">
          <a
            href="#"
            className="w-10 h-10 border border-gray-200 flex items-center justify-center rounded-lg hover:bg-amber-50 transition-all text-gray-600 hover:text-amber-600 dark:border-gray-700 dark:bg-transparent dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-amber-400"
          >
            <Share2 className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="w-10 h-10 border border-gray-200 flex items-center justify-center rounded-lg hover:bg-amber-50 transition-all text-gray-600 hover:text-amber-600 dark:border-gray-700 dark:bg-transparent dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-amber-400"
          >
            <Globe className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="w-10 h-10 border border-gray-200 flex items-center justify-center rounded-lg hover:bg-amber-50 transition-all text-gray-600 hover:text-amber-600 dark:border-gray-700 dark:bg-transparent dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-amber-400"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
