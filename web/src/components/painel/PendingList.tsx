"use client";

import Link from "next/link";
import { Panel } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { icons } from "@/constants/icons";
import { usePainelResumo } from "@/features/painel/hooks/use-painel-resumo";
import { cn } from "@/lib/utils";
import type { PendenciaTone } from "@/features/painel/types";

const TONE_CLASSES: Record<PendenciaTone, string> = {
  danger: "border-red-200 bg-red-50 text-red-800",
  warn: "border-amber-200 bg-amber-50 text-amber-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
  ok: "border-blue-200 bg-blue-50 text-blue-800",
};

/** Pendências acionáveis do perfil logado. */
export function PendingList() {
  const { pendencias } = usePainelResumo();

  return (
    <Panel>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-lg text-slate-900">Pendências</h2>
        <Badge tone="warn" className="text-[11px] font-bold">
          {pendencias.length}
        </Badge>
      </div>
      <div className="flex flex-col gap-2.5">
        {pendencias.slice(0, 3).map((pendencia) => {
          const Icon = icons[pendencia.icon];
          return (
            <div
              key={pendencia.id}
              className={cn("flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-[13.5px]", TONE_CLASSES[pendencia.tone])}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <strong className="block text-[13.5px]">{pendencia.titulo}</strong>
                <span className="mt-0.5 block text-[12px] opacity-80">{pendencia.texto}</span>
                <Link
                  href={pendencia.href}
                  className="mt-1 inline-block text-[12px] font-bold underline-offset-2 hover:underline"
                >
                  {pendencia.label} →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}