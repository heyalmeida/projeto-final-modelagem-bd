import { cardStyles } from "@/components/ui/Card";
import { icons, type IconKey } from "@/constants/icons";
import { cn } from "@/lib/utils";
import type { KpiTone } from "@/types/ui";

/** Tons dos ícones de indicador — reaproveitados em listas e resumos. */
export const kpiToneClasses: Record<KpiTone, string> = {
  brand: "bg-brand-50 text-brand-700",
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-100 text-violet-700",
  blue: "bg-blue-50 text-blue-700",
  pink: "bg-pink-50 text-pink-700",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-700",
};

interface KpiCardProps {
  label: string;
  value: string;
  /** Complemento do número (ex.: "/16") em tom secundário. */
  suffix?: string;
  hint: string;
  icon: IconKey;
  tone?: KpiTone;
}

/** Indicador numérico do topo das páginas. */
export function KpiCard({ label, value, suffix, hint, icon, tone = "brand" }: KpiCardProps) {
  const Icon = icons[icon];
  return (
    <article className={cn(cardStyles, "relative overflow-hidden p-4")}>
      <div className="mb-3 flex items-start justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-stone-600">{label}</span>
        <span className={cn("grid h-9 w-9 place-items-center rounded-xl", kpiToneClasses[tone])}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </span>
      </div>
      <div className="font-display text-[32.5px] leading-none tracking-tight text-slate-900">
        {value}
        {suffix ? <span className="text-sm text-stone-500">{suffix}</span> : null}
      </div>
      <div className="mt-1.5 text-[13px] text-stone-600">{hint}</div>
    </article>
  );
}