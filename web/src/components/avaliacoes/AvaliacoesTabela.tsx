"use client";

import { useState } from "react";
import { AvaliacaoModal } from "@/components/avaliacoes/AvaliacaoModal";
import { EstatisticasAvaliacaoModal } from "@/components/avaliacoes/EstatisticasAvaliacaoModal";
import { Button } from "@/components/ui/Button";
import { DataTable, TableHeaderRow } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Panel } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { icons } from "@/constants/icons";
import { avaliacoesVisiveis, mediaAvaliacao, tentativasDa } from "@/features/avaliacoes/selectors";
import { useAvaliacoesActions } from "@/features/avaliacoes/hooks/use-avaliacoes-actions";
import { professorById, turmaById } from "@/features/core/selectors";
import { formatDate, formatGrade } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";
import type { Avaliacao } from "@/types/domain";

/** Tabela de avaliações da visão de gestão, com publicação e encerramento. */
export function AvaliacoesTabela() {
  const viewer = useViewer();
  const { publicar, encerrar, excluirAvaliacao } = useAvaliacoesActions();
  const [estatisticas, setEstatisticas] = useState<string | null>(null);
  const [editando, setEditando] = useState<Avaliacao | null>(null);

  const avaliacoes = avaliacoesVisiveis(viewer);
  const ChartIcon = icons.chart;

  if (!avaliacoes.length) {
    return (
      <Panel>
        <EmptyState icon="avaliacoes" title="Nenhuma avaliação" text="Não há avaliações nas turmas do seu recorte." />
      </Panel>
    );
  }

  return (
    <>
      <DataTable label="Avaliações do recorte">
        <thead>
          <TableHeaderRow>
            <th>Avaliação</th>
            <th>Turma</th>
            <th>Professor</th>
            <th>Período</th>
            <th className="text-right">Peso</th>
            <th className="text-right">Tentativas</th>
            <th className="text-right">Média</th>
            <th>Status</th>
            <th />
          </TableHeaderRow>
        </thead>
        <tbody>
          {avaliacoes.map((avaliacao) => {
            const tentativas = tentativasDa(viewer.data, avaliacao.id);
            const media = mediaAvaliacao(viewer.data, avaliacao.id);
            const turma = turmaById(viewer.data, avaliacao.turmaId);

            return (
              <tr key={avaliacao.id} className="hover:bg-brand-50/40">
                <td>
                  <div className="text-[14px] font-semibold text-slate-800">{avaliacao.titulo}</div>
                  <div className="text-[12px] text-stone-600">
                    {avaliacao.tipo} · {avaliacao.questoes.length} questão(ões)
                  </div>
                </td>
                <td>
                  {turma.codigo}
                  <div className="text-[12px] text-stone-600">{turma.componente}</div>
                </td>
                <td>{professorById(viewer.data, avaliacao.professorId).nome}</td>
                <td className="whitespace-nowrap">
                  {formatDate(avaliacao.inicio)}
                  <div className="text-[12px] text-stone-600">até {formatDate(avaliacao.fim)}</div>
                </td>
                <td className="text-right">{avaliacao.peso}</td>
                <td className="text-right">{tentativas.length}</td>
                <td className="text-right">{formatGrade(media)}</td>
                <td>
                  <StatusBadge status={avaliacao.status} />
                </td>
                <td className="text-right">
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <Button onClick={() => setEstatisticas(avaliacao.id)}>
                      <ChartIcon className="h-4 w-4" /> Ver
                    </Button>
                    {avaliacao.status === "RASCUNHO" ? (
                      <>
                        <Button variant="primary" onClick={() => publicar(avaliacao.id)}>
                          Publicar
                        </Button>
                        <Button onClick={() => setEditando(avaliacao)}>Editar</Button>
                        <Button variant="danger" onClick={() => excluirAvaliacao(avaliacao.id)}>
                          Excluir
                        </Button>
                      </>
                    ) : null}
                    {avaliacao.status === "PUBLICADA" ? (
                      <Button onClick={() => encerrar(avaliacao.id)}>Encerrar</Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </DataTable>

      {estatisticas ? (
        <EstatisticasAvaliacaoModal avaliacaoId={estatisticas} onClose={() => setEstatisticas(null)} />
      ) : null}

      {editando ? <AvaliacaoModal avaliacao={editando} onClose={() => setEditando(null)} /> : null}
    </>
  );
}