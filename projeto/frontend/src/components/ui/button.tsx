import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "icon";
}

export const Button = ({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kwak-blue-500 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-kwak-blue-600 text-white shadow-[0_12px_30px_rgba(36,110,233,0.28)] hover:bg-kwak-blue-500",
        variant === "secondary" &&
          "border border-kwak-border bg-kwak-surface-muted text-kwak-ice-50 hover:border-kwak-blue-500",
        variant === "ghost" &&
          "text-kwak-lavender-200 hover:bg-white/8 hover:text-kwak-ice-50",
        variant === "danger" &&
          "border border-red-500/40 bg-red-500/10 text-red-100 hover:bg-red-500/20",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-4 text-sm",
        size === "icon" && "h-10 w-10 p-0",
        className,
      )}
      type={type}
      {...props}
    />
  );
};
