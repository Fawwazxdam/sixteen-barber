"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backText?: string;
  action?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  backHref, 
  backText = "Kembali",
  action 
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-amber-600 transition-colors mb-3 dark:text-gray-400 dark:hover:text-amber-400"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backText}</span>
          </Link>
        )}
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}