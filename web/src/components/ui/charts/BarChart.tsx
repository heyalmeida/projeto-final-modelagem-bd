"use client";

import { cn } from "@/lib/utils";

export interface BarSeries {
  label: string;
  color: string;
}

export interface BarPoint {
  label: string;
  values: number[];
}

interface BarChartProps {
  points: BarPoint[];
  series: BarSeries[];
  /** Formata o valor exibido no tooltip e nas legendas. */
  format?: (value: number) => string;
  height?: number;
  className?: string;
  emptyMessage?: string;
}

/**
 * Gráfico de barras agrupadas feito com CSS (sem lib externa): cada coluna é um
 * item, cada série uma barra. O valor máximo define a escala de altura.
 */
export function BarChart({
  points,
  series,
  format = String,
  height = 150,
  className,
  emptyMessage = "Sem dados para exibir.",
}: BarChartProps) {
  const maximo = Math.max(0, ...points.flatMap((ponto) => ponto.values));

  if (!points.length || maximo <= 0) {
    return <p className="py-8 text-center text-[12.5px] text-stone-600">{emptyMessage}</p>;
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-end gap-4" style={{ height }}>
        {points.map((ponto) => (
          <div key={ponto.label} className="flex h-full min-w-0 flex-1 flex-col justify-end">
            <div className="flex h-full items-end justify-center gap-1">
              {ponto.values.map((valor, indice) => {
                const serie = series[indice];
                const altura = Math.round((valor / maximo) * 100);
                return (
                  <div
                    key={serie?.label ?? indice}
                    title={`${ponto.label} · ${serie?.label ?? ""}: ${format(valor)}`}
                    className="group relative flex w-full max-w-[26px] items-end justify-center rounded-t-md transition-opacity hover:opacity-80"
                    style={{ height: `${Math.max(altura, 2)}%` }}
                  >
                    <span
                      className="block h-full w-full rounded-t-md"
                      style={{ backgroundColor: serie?.color ?? "#0f766e" }}
                    />
                    <span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-950 px-1.5 py-0.5 text-[10.5px] font-semibold text-white group-hover:block">
                      {format(valor)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-4 border-t border-stone-200 pt-2">
        {points.map((ponto) => (
          <div key={ponto.label} className="min-w-0 flex-1 text-center">
            <span className="block truncate text-[11px] font-semibold uppercase tracking-wide text-stone-600">
              {ponto.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        {series.map((serie) => (
          <span key={serie.label} className="inline-flex items-center gap-1.5 text-[11.5px] text-stone-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: serie.color }} />
            {serie.label}
          </span>
        ))}
      </div>
    </div>
  );
}