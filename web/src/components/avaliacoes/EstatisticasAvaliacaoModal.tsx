"use client";

import { AlertNote } from "@/components/ui/AlertNote";
import { Button } from "@/components/ui/Button";
import { DataTable, TableEmptyRow, TableHeaderRow } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { alunoById } from "@/features/core/selectors";
import { limiteTentativas, mediaAvaliacao, tentativasDa } from "@/features/avaliacoes/selectors";
import { statusLabel } from "@/constants/status";
import { formatDateTime, formatGrade } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

interface EstatisticasAvaliacaoModalProps {
  avaliacaoId: string;
  onClose: () => void;
}

/** Gestão da avaliação: resumo, tentativas registradas e regras de tentativa. */
export function EstatisticasAvaliacaoModal({ avaliacaoId, onClose }: EstatisticasAvaliacaoModalProps) {
  const viewer = useViewer();
  const avaliacao = viewer.data.avaliacoes.find((item) => item.id === avaliacaoId);

  if (!avaliacao) return null;

  const turma = viewer.data.turmas.find((item) => item.id === avaliacao.turmaId);
  const tentativas = tentativasDa(viewer.data, avaliacao.id);
  const media = mediaAvaliacao(viewer.data, avaliacao.id);
  const maximo = limiteTentativas(avaliacao);

  const resumo: Array<[string, string]> = [
    ["Turma", turma ? turma.codigo : "—"],
    ["Peso", String(avaliacao.peso)],
    ["Tentativas", String(tentativas.length)],
    ["Média", formatGrade(media)],
    ["Status", statusLabel(avaliacao.status)],
  ];

  return (
    <Modal
      open
      onClose={onClose}
      eyebrow="Gestão da avaliação"
      title={avaliacao.titulo}
      size="lg"
      footer={<Button onClick={onClose}>Fechar</Button>}
    >
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {resumo.map(([rotulo, valor]) => (
          <div key={rotulo} className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2">
            <span className="block text-[11px] font-bold uppercase tracking-wide text-stone-600">{rotulo}</span>
            <strong className="font-display text-lg text-slate-900">{valor}</strong>
          </div>
        ))}
      </div>

      <DataTable label={`Tentativas de ${avaliacao.titulo}`}>
        <thead>
          <TableHeaderRow>
            <th>Aluno</th>
            <th>Tentativa</th>
            <th>Enviada em</th>
            <th className="text-right">Nota</th>
          </TableHeaderRow>
        </thead>
        <tbody>
          {tentativas.length ? (
            tentativas.map((tentativa) => {
              const matricula = viewer.data.matriculas.find((item) => item.id === tentativa.matriculaId);
              return (
                <tr key={tentativa.id}>
                  <td>{matricula ? alunoById(viewer.data, matricula.alunoId).nome : "—"}</td>
                  <td>{tentativa.numero}</td>
                  <td>{formatDateTime(tentativa.fim)}</td>
                  <td className="text-right font-semibold">{formatGrade(tentativa.pontuacao)}</td>
                </tr>
              );
            })
          ) : (
            <TableEmptyRow colSpan={4}>Sem tentativas registradas.</TableEmptyRow>
          )}
        </tbody>
      </DataTable>

      <AlertNote title="Gestão" className="mt-3">
        Limite de {maximo} tentativa(s).{" "}
        {avaliacao.gestao?.permiteRecuperacao
          ? `Recuperação habilitada com peso ${avaliacao.gestao.pesoRecuperacao}.`
          : "Sem recuperação."}
      </AlertNote>
    </Modal>
  );
}