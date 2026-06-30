"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  required?: boolean;
  prefix?: string;
  suffix?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ label, required = false, prefix, suffix, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            type="number"
            className={`w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 px-4 py-3 text-gray-900 dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all outline-none ${
              prefix ? "pl-12" : ""
            } ${suffix ? "pr-16" : ""} ${className}`}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">
              {suffix}
            </span>
          )}
        </div>
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";