import type { LabelHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const Label = ({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) => {
  return (
    <label
      className={cn("text-sm font-medium text-kwak-ice-100", className)}
      {...props}
    />
  );
};
