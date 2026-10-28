import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export const textareaClasses =
  "textarea textarea-bordered min-h-[86px] w-full rounded-lg border-stone-300 bg-white text-[14.5px] focus:border-brand-600 focus:outline-none";

export function Textarea({ className, ...props }: ComponentPropsWithoutRef<"textarea">) {
  return <textarea className={cn(textareaClasses, className)} {...props} />;
}