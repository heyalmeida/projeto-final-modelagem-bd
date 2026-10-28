import type { ReactNode } from "react";

interface PageHeaderProps {
  /** Sobretítulo curto: contexto da página. */
  eyebrow: string;
  title: string;
  sub?: string;
  /** Ações no canto direito (botões, badges, links). */
  actions?: ReactNode;
}

/** Cabeçalho padrão das páginas do dashboard. */
export function PageHeader({ eyebrow, title, sub, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">{eyebrow}</p>
        <h1 className="mt-1 font-display text-[33.5px] leading-tight tracking-tight text-slate-900 sm:text-[41.5px]">
          {title}
        </h1>
        {sub ? <p className="mt-1.5 max-w-3xl text-[14.5px] text-stone-600">{sub}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}