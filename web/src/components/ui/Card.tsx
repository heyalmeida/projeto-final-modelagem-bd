import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/** Superfície base do produto (sem padding). */
export const cardStyles = "bg-white rounded-2xl border border-stone-200 shadow-card";

export type CardProps = ComponentPropsWithoutRef<"div">;

export function Card({ className, ...props }: CardProps) {
  return <div className={cn(cardStyles, className)} {...props} />;
}

/** Cartão já com o padding padrão dos painéis e seções. */
export function Panel({ className, ...props }: CardProps) {
  return <div className={cn(cardStyles, "p-4 sm:p-5", className)} {...props} />;
}