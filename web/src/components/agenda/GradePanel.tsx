"use client";

import { Fragment, useState } from "react";
import { HorarioModal } from "@/components/agenda/HorarioModal";
import { AlertNote } from "@/components/ui/AlertNote";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { entradasDaTurma } from "@/features/agenda/selectors";
import { professorById } from "@/features/core/selectors";
import { cn } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";
import type { GradeHoraria, Turma } from "@/types/domain";

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const HORARIOS = ["14:00", "19:00"];

interface GradePanelProps {
  turma: Turma | undefined;
}

/**
 * Grade semanal editável: cada aula é clicável para edição/inativação e o
 * cabeçalho inclui um novo horário. Horários inativos aparecem apagados.
 */
export function GradePanel({ turma }: GradePanelProps) {
  const viewer = useViewer();
  const [modal, setModal] = useState<{ entrada: GradeHoraria | null } | null>(null);

  if (!turma) {
    return (
      <Panel>
        <EmptyState icon="agenda" title="Sem turma" text="Não há turma vinculada ao seu perfil." />
      </Panel>
    );
  }

  const entradas = entradasDaTurma(viewer.data, turma.id);
  const ativas = entradas.filter((entrada) => entrada.status === "ATIVA").length;

  return (
    <>
      <Panel>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-lg text-slate-900">
              {turma.codigo} · {turma.componente}
            </h2>
            <p className="text-[12px] text-stone-600">
              {turma.periodo} · {turma.turno} · {professorById(viewer.data, turma.professorId).nome}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="info" className="text-[10.5px] font-bold">
              {ativas} ativo(s) de {entradas.length}
            </Badge>
            <Button variant="primary" onClick={() => setModal({ entrada: null })}>
              Novo horário
            </Button>
          </div>
        </div>

        {entradas.length ? (
          <div className="overflow-x-auto scroll-thin">
            <div className="grid min-w-[720px] grid-cols-[70px_repeat(5,minmax(0,1fr))] gap-1.5">
              <div />
              {DIAS.map((dia) => (
                <div
                  key={dia}
                  className="rounded-lg bg-stone-100 px-2 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-stone-600"
                >
                  {dia}
                </div>
              ))}

              {HORARIOS.map((horario) => (
                <Fragment key={horario}>
                  <div className="pr-2 pt-2 text-right text-[11px] tabular-nums text-stone-600">{horario}</div>
                  {DIAS.map((dia) => {
                    const aulas = entradas.filter((entrada) => entrada.dia === dia && entrada.inicio === horario);
                    return (
                      <div key={dia} className="min-h-[88px] rounded-lg border border-stone-200 bg-white p-1.5">
                        {aulas.map((aula) => {
                          const inativa = aula.status !== "ATIVA";
                          return (
                            <button
                              key={aula.id}
                              type="button"
                              onClick={() => setModal({ entrada: aula })}
                              title={
                                inativa
                                  ? `${aula.componente} — inativo. Clique para reativar.`
                                  : `${aula.componente} — clique para editar.`
                              }
                              className={cn(
                                "mb-1 block w-full rounded-md border-l-[3px] border-blue-600 bg-blue-50 px-2 py-1.5 text-left text-[11.5px] leading-snug transition hover:bg-blue-100",
                                inativa && "border-stone-300 bg-stone-100 opacity-70",
                              )}
                            >
                              <strong className="block text-[11.5px] text-slate-800">{aula.componente}</strong>
                              <small className="text-[10.5px] text-stone-600">
                                {aula.inicio}–{aula.fim} · {aula.sala}
                                {inativa ? " · inativo" : ""}
                              </small>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon="agenda"
            title="Grade vazia"
            text="Nenhum horário cadastrado para esta turma. Use “Novo horário” para começar."
          />
        )}

        <AlertNote title="Conflitos e alterações" icon="agenda" className="mt-3">
          A criação e a edição validam choque de horário para a turma e para o professor. Mudanças formais podem seguir
          por solicitação, com aprovação da coordenação.
        </AlertNote>
      </Panel>

      {modal ? <HorarioModal turmaId={turma.id} entrada={modal.entrada} onClose={() => setModal(null)} /> : null}
    </>
  );
}