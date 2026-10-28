"use client";

import { useState } from "react";
import { ResultadoTentativaModal } from "@/components/avaliacoes/ResultadoTentativaModal";
import { Button } from "@/components/ui/Button";
import { DataTable, TableHeaderRow } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Panel } from "@/components/ui/Card";
import { tentativasDoRecorte } from "@/features/avaliacoes/selectors";
import { alunoById, turmaById } from "@/features/core/selectors";
import { formatDateTime, formatGrade } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

/** Tentativas de todos os alunos do recorte do professor/coordenação. */
export function TentativasPanel() {
  const viewer = useViewer();
  const tentativas = tentativasDoRecorte(viewer);
  const [detalhe, setDetalhe] = useState<string | null>(null);

  if (!tentativas.length) {
    return (
      <Panel>
        <EmptyState icon="file" title="Nenhuma tentativa" text="Ainda não há tentativas nas avaliações do seu recorte." />
      </Panel>
    );
  }

  return (
    <>
      <DataTable label="Tentativas do recorte">
        <thead>
          <TableHeaderRow>
            <th>Aluno</th>
            <th>Avaliação</th>
            <th>Turma</th>
            <th>Enviada em</th>
            <th className="text-right">Nota</th>
            <th />
          </TableHeaderRow>
        </thead>
        <tbody>
          {tentativas.map((tentativa) => {
            const avaliacao = viewer.data.avaliacoes.find((item) => item.id === tentativa.avaliacaoId);
            const matricula = viewer.data.matriculas.find((item) => item.id === tentativa.matriculaId);
            const aluno = matricula ? alunoById(viewer.data, matricula.alunoId) : null;

            return (
              <tr key={tentativa.id}>
                <td>
                  {aluno ? aluno.nome : "—"}
                  <div className="text-[12px] text-stone-600">{aluno ? aluno.ra : "—"}</div>
                </td>
                <td>{avaliacao ? avaliacao.titulo : "—"}</td>
                <td>{avaliacao ? turmaById(viewer.data, avaliacao.turmaId).codigo : "—"}</td>
                <td className="whitespace-nowrap">{formatDateTime(tentativa.fim)}</td>
                <td className="text-right font-semibold">{formatGrade(tentativa.pontuacao)}</td>
                <td className="text-right">
                  <Button onClick={() => setDetalhe(tentativa.id)}>Detalhes</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </DataTable>

      {detalhe ? <ResultadoTentativaModal tentativaId={detalhe} onClose={() => setDetalhe(null)} /> : null}
    </>
  );
}