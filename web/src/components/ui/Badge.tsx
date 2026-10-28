import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import type { BadgeTone } from "@/types/ui";

/** Cores semânticas reutilizadas por badges, ícones e destaques. */
export const badgeTones: Record<BadgeTone, string> = {
  ok: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warn: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  purple: "border-violet-200 bg-violet-100 text-violet-700",
  neutral: "border-stone-200 bg-stone-100 text-stone-600",
};

interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  tone?: BadgeTone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return <span className={cn("badge", badgeTones[tone], className)} {...props} />;
}