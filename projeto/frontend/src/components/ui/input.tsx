import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg border border-kwak-border bg-kwak-navy-900/80 px-3 text-sm text-kwak-ice-50 outline-none transition placeholder:text-kwak-lavender-400 focus:border-kwak-blue-500 focus:ring-2 focus:ring-kwak-blue-500/20",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";
