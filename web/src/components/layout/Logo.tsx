import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Apenas o símbolo, sem o nome. */
  compact?: boolean;
  /** Variante para fundos escuros. */
  light?: boolean;
}

/** Marca do produto: símbolo + nome + assinatura. */
export function Logo({ compact = false, light = false }: LogoProps) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 shadow-[0_8px_22px_-12px_rgba(15,118,110,.9)]">
        <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden="true">
          <rect x="16" y="15" width="26" height="8" rx="4" fill="#ffffff" />
          <rect x="20" y="28" width="22" height="8" rx="4" fill="#99f6e4" />
          <rect x="16" y="41" width="26" height="8" rx="4" fill="#ffffff" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={cn("block font-display text-[23.5px] tracking-tight", light ? "text-white" : "text-slate-900")}>
            {siteConfig.name}
          </span>
          <span
            className={cn(
              "mt-1 block text-[11px] font-semibold uppercase tracking-[0.18em]",
              light ? "text-slate-400" : "text-stone-600",
            )}
          >
            {siteConfig.tagline}
          </span>
        </span>
      )}
    </span>
  );
}