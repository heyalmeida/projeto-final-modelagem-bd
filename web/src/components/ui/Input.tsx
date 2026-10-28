import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export const inputClasses =
  "input input-sm input-bordered h-9 w-full rounded-lg border-stone-300 bg-white text-[14.5px] focus:border-brand-600 focus:outline-none";

export function Input({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return <input className={cn(inputClasses, className)} {...props} />;
}