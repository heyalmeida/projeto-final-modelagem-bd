"use client";

import Link from "next/link";
import { cardStyles } from "@/components/ui/Card";
import { moduleIconKeys, icons } from "@/constants/icons";
import { usePainelResumo } from "@/features/painel/hooks/use-painel-resumo";
import { cn } from "@/lib/utils";

/** Atalhos para os módulos liberados ao grupo. */
export function ModuleGrid() {
  const { modulos } = usePainelResumo();
  const ArrowIcon = icons.arrowRight;

  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {modulos.map((modulo) => {
        const Icon = icons[moduleIconKeys[modulo.icone]];
        return (
          <Link
            key={modulo.id}
            href={modulo.rota}
            className={cn(cardStyles, "group flex flex-col gap-2.5 p-4 transition hover:-translate-y-0.5 hover:border-brand-600")}
          >
            <span
              className="grid h-9 w-9 place-items-center rounded-xl"
              style={{ color: modulo.cor, backgroundColor: modulo.corSuave }}
            >
              <Icon className="h-5 w-5" strokeWidth={1.7} />
            </span>
            <h3 className="text-[17px] font-bold tracking-tight text-slate-800">{modulo.nome}</h3>
            <p className="text-[13px] leading-snug text-stone-600">{modulo.descricao}</p>
            <span className="mt-auto inline-flex items-center gap-1 text-[12.5px] font-bold" style={{ color: modulo.cor }}>
              Abrir módulo <ArrowIcon className="h-3.5 w-3.5" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}