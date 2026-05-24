import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const Select = ({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select
      className={cn(
        "h-10 rounded-lg border border-kwak-border bg-kwak-surface px-3 text-sm text-kwak-ice-50 outline-none transition focus:border-kwak-blue-500 focus:ring-2 focus:ring-kwak-blue-500/20",
        className,
      )}
      {...props}
    />
  );
};
