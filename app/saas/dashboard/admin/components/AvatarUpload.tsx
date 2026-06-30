"use client";

import { useRef, ChangeEvent } from "react";
import { ImagePlus, UserCircle, RotateCcw } from "lucide-react";

interface AvatarUploadProps {
  preview: string | null;
  onFileChange: (file: File) => void;
  onReset?: () => void;
  size?: "sm" | "md" | "lg";
}

export function AvatarUpload({
  preview,
  onFileChange,
  onReset,
  size = "md",
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = "avatar-upload";

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-28 h-28",
  };

  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden bg-amber-50 dark:bg-amber-500/10 border-4 border-white shadow-md dark:border-neutral-800 flex-shrink-0`}>
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-amber-600/50 dark:text-amber-500/50">
            <UserCircle className={iconSizes[size]} />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
          Foto Profil
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={inputId}
            ref={fileInputRef}
          />
          <label
            htmlFor={inputId}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer transition-colors"
          >
            <ImagePlus className="w-4 h-4" />
            {preview ? "Ganti Foto" : "Pilih Foto"}
          </label>
          {preview && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Format yang disarankan: JPG, PNG. Ukuran maksimal 2MB.
        </p>
      </div>
    </div>
  );
}