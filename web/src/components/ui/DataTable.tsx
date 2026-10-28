import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DataTableProps {
  children: ReactNode;
  /** Classes extras no contêiner com scroll. */
  className?: string;
  /** Classes extras na `<table>` (ex.: largura mínima). */
  tableClassName?: string;
  /** Rótulo acessível da tabela. */
  label?: string;
}

/** Contêiner de tabela com scroll horizontal e borda arredondada. */
export function DataTable({ children, className, tableClassName, label }: DataTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-xl border border-stone-200 bg-white", className)}>
      <table className={cn("table table-sm", tableClassName)} aria-label={label}>
        {children}
      </table>
    </div>
  );
}

/** Linha de cabeçalho com a tipografia usada em todas as tabelas. */
export function TableHeaderRow({ className, ...props }: ComponentPropsWithoutRef<"tr">) {
  return <tr className={cn("text-[11px] uppercase tracking-wide text-stone-600", className)} {...props} />;
}

/** Linha de "sem registros" que ocupa a tabela inteira. */
export function TableEmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-4 text-center text-stone-600">
        {children}
      </td>
    </tr>
  );
}