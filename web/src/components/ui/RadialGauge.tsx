"use client";

import { clampPercent, cn } from "@/lib/utils";

interface RadialGaugeProps {
  /** Valor em porcentagem (0–100); `null` exibe o traço "—". */
  value: number | null;
  /** Rótulo curto dentro do medidor (ex.: "frequência"). */
  label?: string;
  /** Mínimo aceitável: define a cor do arco (verde/âmbar/vermelho). */
  threshold?: number;
  size?: number;
  thickness?: number;
  className?: string;
}

const CORES = { ok: "#0f766e", atencao: "#d97706", risco: "#dc2626", vazio: "#d6d3d1" };

/** Cor do arco conforme a distância do mínimo exigido. */
function corDoArco(valor: number | null, minimo: number): string {
  if (valor === null) return CORES.vazio;
  if (valor >= minimo) return CORES.ok;
  if (valor >= minimo * 0.7) return CORES.atencao;
  return CORES.risco;
}

/**
 * Medidor radial em SVG puro, usado nos resumos. O arco muda de cor conforme o
 * indicador se aproxima ou fica abaixo do mínimo (ex.: frequência ≥ 75%).
 */
export function RadialGauge({
  value,
  label,
  threshold = 75,
  size = 108,
  thickness = 9,
  className,
}: RadialGaugeProps) {
  const raio = (size - thickness) / 2;
  const circunferencia = 2 * Math.PI * raio;
  const percentual = value === null ? 0 : clampPercent(value);
  const arco = (percentual / 100) * circunferencia;
  const cor = corDoArco(value, threshold);

  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="progressbar"
        aria-valuenow={value ?? undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <circle cx={size / 2} cy={size / 2} r={raio} fill="none" stroke="#f5f5f4" strokeWidth={thickness} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={raio}
          fill="none"
          stroke={cor}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${arco} ${circunferencia - arco}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dasharray .4s ease" }}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center leading-none">
        <div>
          <span
            className="block font-display text-[26px] text-slate-900"
            style={value !== null ? { color: cor } : undefined}
          >
            {value === null ? "—" : `${percentual}%`}
          </span>
          {label ? (
            <small className="mt-1 block text-[8.5px] font-bold uppercase tracking-[0.14em] text-stone-600">
              {label}
            </small>
          ) : null}
        </div>
      </div>
    </div>
  );
}

