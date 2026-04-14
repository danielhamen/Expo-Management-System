import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  leadingIcon?: ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--theme-brand)] text-white hover:bg-[color-mix(in_oklab,var(--theme-brand)_88%,black)]",
  secondary:
    "border border-[var(--theme-border)] bg-white text-[var(--theme-text-primary)] hover:bg-[var(--theme-surface-muted)]",
  ghost:
    "text-[var(--theme-text-secondary)] hover:bg-[var(--theme-brand-muted)]",
};

export function Button({
  className,
  variant = "primary",
  leadingIcon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--theme-radius-pill)] px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-brand)] disabled:cursor-not-allowed disabled:opacity-55",
        variants[variant],
        className,
      )}
      {...props}
    >
      {leadingIcon}
      <span>{children}</span>
    </button>
  );
}
