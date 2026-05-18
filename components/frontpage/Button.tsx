// src/components/ui/Button.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-inter font-bold uppercase tracking-widest transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20 dark:bg-amber-400 dark:text-gray-900 dark:hover:bg-amber-300",
        outline: "border border-gray-300 text-gray-900 hover:bg-neutral-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-neutral-800",
        ghost: "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white",
      },
      size: {
        default: "px-6 py-2 text-sm",
        lg: "px-8 py-4 text-lg",
        icon: "w-10 h-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
