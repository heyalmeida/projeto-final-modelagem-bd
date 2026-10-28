"use client";

import { useState } from "react";
import { ResultadoTentativaModal } from "@/components/avaliacoes/ResultadoTentativaModal";
import { Button } from "@/components/ui/Button";
import { DataTable, TableHeaderRow } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Panel } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { icons } from "@/constants/icons";
import { minhasTentativas } from "@/features/avaliacoes/selectors";
import { turmaById } from "@/features/core/selectors";
import { formatDateTime, formatGrade } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

/** Tentativas do próprio aluno. */
export function MinhasTentativasPanel() {
  const viewer = useViewer();
  const tentativas = minhasTentativas(viewer);
  const [detalhe, setDetalhe] = useState<string | null>(null);
  const FileIcon = icons.file;

  if (!tentativas.length) {
    return (
      <Panel>
        <EmptyState icon="file" title="Nenhuma tentativa" text="Você ainda não iniciou nenhuma avaliação." />
      </Panel>
    );
  }

  return (
    <>
      <DataTable label="Minhas tentativas">
        <thead>
          <TableHeaderRow>
            <th>Avaliação</th>
            <th>Turma</th>
            <th>Número</th>
            <th>Enviada em</th>
            <th className="text-right">Nota</th>
            <th>Status</th>
            <th />
          </TableHeaderRow>
        </thead>
        <tbody>
          {tentativas.map((tentativa) => {
            const avaliacao = viewer.data.avaliacoes.find((item) => item.id === tentativa.avaliacaoId);
            return (
              <tr key={tentativa.id}>
                <td>
                  <div className="text-[14px] font-semibold text-slate-800">
                    {avaliacao ? avaliacao.titulo : "—"}
                  </div>
                  <div className="text-[12px] text-stone-600">peso {avaliacao ? avaliacao.peso : "—"}</div>
                </td>
                <td>{avaliacao ? turmaById(viewer.data, avaliacao.turmaId).codigo : "—"}</td>
                <td>{tentativa.numero}</td>
                <td className="whitespace-nowrap">{formatDateTime(tentativa.fim)}</td>
                <td className="text-right font-semibold">{formatGrade(tentativa.pontuacao)}</td>
                <td>
                  <StatusBadge status="CONCLUIDA" />
                </td>
                <td className="text-right">
                  <Button onClick={() => setDetalhe(tentativa.id)}>
                    <FileIcon className="h-4 w-4" /> Detalhes
                  </Button>
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