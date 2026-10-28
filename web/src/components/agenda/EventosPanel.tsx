"use client";

import { useState } from "react";
import { EventoModal } from "@/components/agenda/EventoModal";
import { Card, Panel } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { icons } from "@/constants/icons";
import { eventosOrdenados } from "@/features/agenda/selectors";
import { useAgendaActions } from "@/features/agenda/hooks/use-agenda-actions";
import { professorById } from "@/features/core/selectors";
import { canApproveSchedule } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** Eventos acadêmicos publicados, com criação e remoção pela coordenação. */
export function EventosPanel() {
  const viewer = useViewer();
  const { excluirEventoAcademico } = useAgendaActions();
  const eventos = eventosOrdenados(viewer.data);
  const podeGerenciar = canApproveSchedule(viewer.user, viewer.group);
  const [criando, setCriando] = useState(false);

  const ClockIcon = icons.clock;
  const UsersIcon = icons.users;
  const PlaceIcon = icons.painel;
  const CloseIcon = icons.close;

  if (!eventos.length) {
    return (
      <>
        <Panel className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg text-slate-900">Eventos</h2>
          <Button variant="primary" onClick={() => setCriando(true)}>
            Novo evento
          </Button>
        </Panel>
        <Panel>
          <EmptyState icon="agenda" title="Sem eventos" text="Nenhum evento publicado. Use “Novo evento” para criar." />
        </Panel>
        {criando ? <EventoModal onClose={() => setCriando(false)} /> : null}
      </>
    );
  }

  return (
    <>
      <Panel className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg text-slate-900">Eventos</h2>
          <p className="text-[11.5px] text-stone-600">
            {eventos.length} evento(s) publicado(s)
            {podeGerenciar ? " · a coordenação pode remover" : ""}
          </p>
        </div>
        <Button variant="primary" onClick={() => setCriando(true)}>
          Novo evento
        </Button>
      </Panel>

      <div className="grid gap-3 md:grid-cols-2">
        {eventos.map((evento) => {
          const data = new Date(evento.inicio);
          return (
            <Card key={evento.id} className="flex gap-3 p-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-slate-950 text-white">
                <div className="text-center">
                  <strong className="block font-display text-[21px] leading-none">
                    {String(data.getDate()).padStart(2, "0")}
                  </strong>
                  <small className="text-[9px] uppercase tracking-wide text-slate-400">{MESES[data.getMonth()]}</small>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[13.5px] font-bold text-slate-800">{evento.titulo}</h3>
                  <StatusBadge status={evento.status} />
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-stone-600">
                  <span className="inline-flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" /> {formatDateTime(evento.inicio)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <UsersIcon className="h-3 w-3" /> {evento.publico}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <PlaceIcon className="h-3 w-3" /> {evento.local}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-stone-600">
                  {evento.tipo} · responsável {professorById(viewer.data, evento.professorId).nome}
                </p>
                {podeGerenciar ? (
                  <div className="mt-2 flex justify-end">
                    <Button variant="ghost" onClick={() => excluirEventoAcademico(evento.id)}>
                      <CloseIcon className="h-3.5 w-3.5" /> Remover
                    </Button>
                  </div>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>

      {criando ? <EventoModal onClose={() => setCriando(false)} /> : null}
    </>
  );
}