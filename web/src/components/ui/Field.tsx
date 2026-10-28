import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  /** Conecta o `<label>` ao controle pelo `htmlFor`. */
  htmlFor: string;
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

/** Rótulo + controle + dica, no padrão dos formulários em modal. */
export function Field({ htmlFor, label, hint, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1 block text-[12.5px] font-semibold text-slate-700">
        {label}
      </label>
      {children}
      {hint ? <span className="mt-1 block text-[11px] text-stone-600">{hint}</span> : null}
    </div>
  );
}

/** Mensagem de erro de formulário, alinhada abaixo dos campos. */
export function FormError({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-[13px] font-semibold text-red-600", className)}>{children}</p>;
}