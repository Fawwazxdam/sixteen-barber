"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, required = false, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          ref={ref}
          className={`w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 px-4 py-3 text-gray-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none ${className}`}
          {...props}
        />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";