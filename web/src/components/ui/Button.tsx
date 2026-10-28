import Link from "next/link";
import type { ComponentProps, ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Estilos de ação do produto. `ButtonLink` compartilha a mesma receita para que
 * navegação e comando tenham aparência idêntica.
 */
export const buttonStyles = cva("btn btn-sm h-9 min-h-9 gap-1.5 rounded-lg font-semibold shadow-none", {
  variants: {
    variant: {
      secondary:
        "border-stone-300 bg-white text-slate-700 hover:border-brand-700 hover:bg-white hover:text-brand-800",
      primary:
        "border-brand-700 bg-brand-700 text-white hover:border-brand-800 hover:bg-brand-800",
      ghost:
        "border-transparent bg-transparent text-stone-600 hover:bg-stone-100 hover:text-slate-800",
      danger:
        "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100",
    },
  },
  defaultVariants: { variant: "secondary" },
});

type ButtonVariantProps = VariantProps<typeof buttonStyles>;

export type ButtonProps = ComponentPropsWithoutRef<"button"> & ButtonVariantProps;

export function Button({ variant, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonStyles({ variant }), className)} {...props} />;
}

export type ButtonLinkProps = ComponentProps<typeof Link> & ButtonVariantProps;

export function ButtonLink({ variant, className, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonStyles({ variant }), className)} {...props} />;
}