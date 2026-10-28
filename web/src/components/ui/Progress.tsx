import { clampPercent, cn } from "@/lib/utils";

interface ProgressProps {
  value: number | null;
  /** Valor máximo da escala (100 por padrão; use 10 para notas, por exemplo). */
  max?: number;
  className?: string;
}

/** Barra de progresso fina; fica âmbar quando o indicador está abaixo de 75%. */
export function Progress({ value, max = 100, className }: ProgressProps) {
  const escala = max > 0 ? max : 100;
  const percentual = clampPercent((Number(value ?? 0) / escala) * 100);
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-stone-200", className)}>
      <span
        className={cn("block h-full rounded-full", percentual < 75 && percentual > 0 ? "bg-amber-500" : "bg-brand-600")}
        style={{ width: `${percentual}%` }}
      />
    </div>
  );
}