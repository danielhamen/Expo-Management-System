import type { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helperText?: string;
};

export function InputField({ label, helperText, id, ...props }: InputFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="grid gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-[var(--theme-text-primary)]">
        {label}
      </label>
      <input
        id={inputId}
        className="h-11 rounded-[var(--theme-radius-md)] border border-[var(--theme-border)] bg-white px-3 text-sm text-[var(--theme-text-primary)] outline-none transition placeholder:text-slate-400 focus:border-[var(--theme-brand)] focus:ring-2 focus:ring-[var(--theme-brand-muted)]"
        {...props}
      />
      {helperText ? (
        <p className="text-xs text-[var(--theme-text-secondary)]">{helperText}</p>
      ) : null}
    </div>
  );
}
