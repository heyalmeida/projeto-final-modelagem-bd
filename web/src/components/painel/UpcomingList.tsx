"use client";

import { Panel } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { icons } from "@/constants/icons";
import { usePainelResumo } from "@/features/painel/hooks/use-painel-resumo";
import { cn } from "@/lib/utils";

/** Sessões de presença e eventos das próximas datas, em ordem cronológica. */
export function UpcomingList() {
  const { compromissos, acesso } = usePainelResumo();

  if (!acesso.presenca && !acesso.agenda) return null;

  const SessionIcon = icons.presenca;
  const EventIcon = icons.agenda;

  return (
    <Panel>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="font-display text-lg text-slate-900">Próximos compromissos</h2>
        <span className="text-[12.5px] text-stone-600">{compromissos.length} item(ns)</span>
      </div>

      {compromissos.length ? (
        <div>
          {compromissos.slice(0, 5).map((compromisso) => {
            const Icon = compromisso.tipo === "sessao" ? SessionIcon : EventIcon;
            return (
              <div
                key={`${compromisso.tipo}-${compromisso.id}`}
                className="flex items-center gap-3 border-b border-stone-100 py-2.5 last:border-0"
              >
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                    compromisso.tipo === "sessao" ? "bg-brand-50 text-brand-700" : "bg-blue-50 text-blue-700",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-semibold text-slate-800">{compromisso.titulo}</div>
                  <div className="truncate text-[12px] text-stone-600">{compromisso.descricao}</div>
                </div>
                <div className="text-right">
                  <div className="whitespace-nowrap text-[12px] font-semibold text-slate-700">{compromisso.horario}</div>
                  <div className="text-[11px] text-stone-500">{compromisso.status}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon="agenda" title="Agenda livre" text="Nenhum compromisso futuro nos seus módulos." />
      )}
    </Panel>
  );
}