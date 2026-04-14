import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <article
      className={cn(
        "rounded-[var(--theme-radius-lg)] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 shadow-[var(--theme-shadow-sm)]",
        className,
      )}
      {...props}
    />
  );
}
