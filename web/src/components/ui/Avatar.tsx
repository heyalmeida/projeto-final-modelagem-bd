import { cn, initials } from "@/lib/utils";
import type { AvatarSize } from "@/types/ui";

const SIZES: Record<AvatarSize, string> = {
  xs: "h-7 w-7 text-[11px]",
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-[13.5px]",
  lg: "h-14 w-14 text-[18px]",
};

interface AvatarProps {
  name: string;
  size?: AvatarSize;
  /** Variante para fundos escuros (sidebar). */
  dark?: boolean;
  className?: string;
}

export function Avatar({ name, size = "md", dark = false, className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-bold",
        SIZES[size],
        dark
          ? "bg-brand-400/15 text-brand-200 ring-1 ring-brand-300/25"
          : "bg-brand-50 text-brand-800 ring-1 ring-brand-600/15",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}