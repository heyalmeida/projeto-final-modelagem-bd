import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export const selectClasses =
  "select select-sm select-bordered h-9 w-full rounded-lg border-stone-300 bg-white text-[14.5px] focus:border-brand-600 focus:outline-none";

export function Select({ className, ...props }: ComponentPropsWithoutRef<"select">) {
  return <select className={cn(selectClasses, className)} {...props} />;
}