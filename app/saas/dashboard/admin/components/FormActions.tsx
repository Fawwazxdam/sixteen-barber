"use client";

import { Loader2 } from "lucide-react";

interface FormActionsProps {
  loading?: boolean;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  loadingText?: string;
  disabled?: boolean;
}

export function FormActions({
  loading = false,
  onCancel,
  submitText = "Simpan",
  cancelText = "Batal",
  loadingText = "Menyimpan...",
  disabled = false,
}: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 transition-colors"
      >
        {cancelText}
      </button>
      <button
        type="submit"
        disabled={loading || disabled}
        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-medium transition-colors shadow-sm ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-amber-600 hover:bg-amber-700 disabled:opacity-70 disabled:cursor-not-allowed"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{loadingText}</span>
          </>
        ) : (
          <span>{submitText}</span>
        )}
      </button>
    </div>
  );
}