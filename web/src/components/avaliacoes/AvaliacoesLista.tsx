"use client";

import { useState } from "react";
import { ResultadoTentativaModal } from "@/components/avaliacoes/ResultadoTentativaModal";
import { TentativaModal } from "@/components/avaliacoes/TentativaModal";
import { Button } from "@/components/ui/Button";
import { Card, Panel } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { icons } from "@/constants/icons";
import {
  avaliacaoAberta,
  avaliacoesVisiveis,
  limiteTentativas,
  matriculaDaAvaliacao,
  tentativasDa,
} from "@/features/avaliacoes/selectors";
import { turmaById } from "@/features/core/selectors";
import { formatDateTime, formatGrade } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

/** Lista de avaliações do aluno, com tentativa em modal e resultado corrigido. */
export function AvaliacoesLista() {
  const viewer = useViewer();
  const avaliacoes = avaliacoesVisiveis(viewer);

  const [tentando, setTentando] = useState<{ avaliacaoId: string; matriculaId: string } | null>(null);
  const [resultado, setResultado] = useState<string | null>(null);

  const UsersIcon = icons.users;
  const ClipboardIcon = icons.avaliacoes;
  const ClockIcon = icons.clock;
  const FileIcon = icons.file;
  const PlusIcon = icons.plus;

  if (!avaliacoes.length) {
    return (
      <Panel>
        <EmptyState icon="avaliacoes" title="Nenhuma avaliação" text="Não há avaliações para as suas turmas neste semestre." />
      </Panel>
    );
  }

  const avaliacaoSelecionada = tentando ? avaliacoes.find((item) => item.id === tentando.avaliacaoId) : undefined;

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2">
        {avaliacoes.map((avaliacao) => {
          const matricula = matriculaDaAvaliacao(viewer, avaliacao);
          const tentativas = matricula ? tentativasDa(viewer.data, avaliacao.id, matricula.id) : [];
          const ultima = tentativas[0] ?? null;
          const maximo = limiteTentativas(avaliacao);
          const podeIniciar =
            Boolean(matricula) && avaliacaoAberta(avaliacao) && tentativas.length < maximo && avaliacao.questoes.length > 0;
          const turma = turmaById(viewer.data, avaliacao.turmaId);

          return (
            <Card key={avaliacao.id} className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[16px] font-bold leading-snug text-slate-800">{avaliacao.titulo}</h3>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-stone-600">
                    <span className="inline-flex items-center gap-1">
                      <UsersIcon className="h-3 w-3" /> {turma.codigo}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ClipboardIcon className="h-3 w-3" /> {avaliacao.tipo} · peso {avaliacao.peso}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" /> até {formatDateTime(avaliacao.fim)}
                    </span>
                  </div>
                </div>
                <StatusBadge status={avaliacaoAberta(avaliacao) ? "ABERTA" : avaliacao.status} />
              </div>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-stone-200 pt-3">
                {ultima ? (
                  <div>
                    <div className="font-display text-2xl leading-none text-slate-900">
                      {formatGrade(ultima.pontuacao)}
                      <span className="text-[11px] text-stone-600">/10</span>
                    </div>
                    <span className="text-[12px] text-stone-600">
                      {tentativas.length} de {maximo} tentativa(s)
                    </span>
                  </div>
                ) : (
                  <span className="text-[12px] text-stone-600">
                    Sem tentativa · {maximo} disponível(is)
                  </span>
                )}

                {ultima ? (
                  <div className="flex gap-2">
                    <Button onClick={() => setResultado(ultima.id)}>
                      <FileIcon className="h-4 w-4" /> Ver resultado
                    </Button>
                    {podeIniciar && matricula ? (
                      <Button
                        variant="primary"
                        onClick={() => setTentando({ avaliacaoId: avaliacao.id, matriculaId: matricula.id })}
                      >
                        <PlusIcon className="h-4 w-4" /> Nova tentativa
                      </Button>
                    ) : null}
                  </div>
                ) : podeIniciar && matricula ? (
                  <Button
                    variant="primary"
                    onClick={() => setTentando({ avaliacaoId: avaliacao.id, matriculaId: matricula.id })}
                  >
                    <PlusIcon className="h-4 w-4" /> Iniciar tentativa
                  </Button>
                ) : (
                  <span className="text-[12px] text-stone-600">
                    {avaliacao.status === "RASCUNHO" ? "Aguardando publicação" : "Fora da janela"}
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {tentando && avaliacaoSelecionada ? (
        <TentativaModal
          avaliacao={avaliacaoSelecionada}
          matriculaId={tentando.matriculaId}
          onClose={() => setTentando(null)}
        />
      ) : null}

      {resultado ? <ResultadoTentativaModal tentativaId={resultado} onClose={() => setResultado(null)} /> : null}
    </>
  );
}