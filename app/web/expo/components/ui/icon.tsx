import { cn } from "@/lib/cn";

type IconProps = {
  name: string;
  className?: string;
  filled?: boolean;
  title?: string;
};

export function Icon({ name, className, filled = false, title }: IconProps) {
  return (
    <span
      aria-hidden={!title}
      title={title}
      className={cn(
        "material-symbols-rounded align-middle leading-none",
        filled && "icon-filled",
        className,
      )}
    >
      {name}
    </span>
  );
}
