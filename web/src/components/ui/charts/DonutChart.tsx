"use client";

import { cn } from "@/lib/utils";

export interface DonutSlice {
  label: string;
  value: number;
  /** Cor em hexadecimal (o gráfico é SVG puro). */
  color: string;
}

interface DonutChartProps {
  slices: DonutSlice[];
  /** Rótulo central (ex.: "frequência"). */
  centerLabel?: string;
  /** Formatação dos valores na legenda. */
  format?: (value: number) => string;
  size?: number;
  thickness?: number;
  className?: string;
}

/**
 * Rosca em SVG puro, sem dependência externa. Legenda com valor absoluto e
 * participação — legível mesmo em projeção.
 */
export function DonutChart({ slices, centerLabel, format = String, size = 168, thickness = 18, className }: DonutChartProps) {
  const total = slices.reduce((soma, fatia) => soma + fatia.value, 0);
  const raio = (size - thickness) / 2;
  const circunferencia = 2 * Math.PI * raio;
  let offset = 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-5", className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={centerLabel ?? "Distribuição"}>
          <circle cx={size / 2} cy={size / 2} r={raio} fill="none" stroke="#f5f5f4" strokeWidth={thickness} />
          {total > 0 &&
            slices.map((fatia) => {
              if (fatia.value <= 0) return null;
              const tamanho = (fatia.value / total) * circunferencia;
              const dash = `${tamanho} ${circunferencia - tamanho}`;
              const rotacao = (offset / circunferencia) * 360 - 90;
              offset += tamanho;
              return (
                <circle
                  key={fatia.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={raio}
                  fill="none"
                  stroke={fatia.color}
                  strokeWidth={thickness}
                  strokeDasharray={dash}
                  transform={`rotate(${rotacao} ${size / 2} ${size / 2})`}
                  strokeLinecap="butt"
                >
                  <title>{`${fatia.label}: ${format(fatia.value)}`}</title>
                </circle>
              );
            })}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="font-display text-[22px] leading-none text-slate-900">{format(total)}</div>
            {centerLabel ? <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-stone-600">{centerLabel}</div> : null}
          </div>
        </div>
      </div>

      <ul className="min-w-[150px] flex-1 space-y-2">
        {slices.map((fatia) => (
          <li key={fatia.label} className="flex items-center gap-2 text-[12.5px]">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: fatia.color }} />
            <span className="flex-1 text-stone-600">{fatia.label}</span>
            <span className="font-semibold text-slate-800">{format(fatia.value)}</span>
            <span className="w-10 text-right text-stone-600">
              {total ? `${Math.round((fatia.value / total) * 100)}%` : "—"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}