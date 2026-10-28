"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DataTable, TableHeaderRow } from "@/components/ui/DataTable";
import { Progress } from "@/components/ui/Progress";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { icons } from "@/constants/icons";
import { usePresencaActions } from "@/features/presenca/hooks/use-presenca-actions";
import { frequenciaDaMatricula } from "@/features/presenca/selectors";
import { alunoById } from "@/features/core/selectors";
import { formatPercent } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";
import type { Matricula, PresencaStatus, RegistroPresenca, Sessao } from "@/types/domain";

interface ChamadaFormProps {
  sessao: Sessao;
  matriculas: Matricula[];
  registros: RegistroPresenca[];
}

interface LinhaChamada {
  status: PresencaStatus;
  justificativa: string;
}

const STATUS_OPCOES: PresencaStatus[] = ["PRESENTE", "AUSENTE", "JUSTIFICADO"];
const STATUS_ROTULOS: Record<PresencaStatus, string> = {
  PRESENTE: "Presente",
  AUSENTE: "Ausente",
  JUSTIFICADO: "Justificado",
};

/** Chamada da sessão: um status e uma justificativa por matrícula. */
export function ChamadaForm({ sessao, matriculas, registros }: ChamadaFormProps) {
  const viewer = useViewer();
  const { salvarChamada } = usePresencaActions();
  const CheckIcon = icons.check;

  const [linhas, setLinhas] = useState<Record<string, LinhaChamada>>(() =>
    Object.fromEntries(
      matriculas.map((matricula) => {
        const registro = registros.find((item) => item.matriculaId === matricula.id);
        return [
          matricula.id,
          {
            status: registro?.status ?? "PRESENTE",
            justificativa: registro?.justificativa ?? "",
          },
        ];
      }),
    ),
  );

  const somenteLeitura = sessao.status !== "ABERTA";

  const atualizar = (matriculaId: string, parcial: Partial<LinhaChamada>) => {
    setLinhas((atuais) => ({
      ...atuais,
      [matriculaId]: { ...atuais[matriculaId], ...parcial },
    }));
  };

  const salvar = () => {
    salvarChamada({
      sessaoId: sessao.id,
      usuarioId: viewer.user.id,
      registros: matriculas.map((matricula) => ({
        matriculaId: matricula.id,
        status: linhas[matricula.id]?.status ?? "PRESENTE",
        justificativa: linhas[matricula.id]?.justificativa ?? "",
      })),
    });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        salvar();
      }}
    >
      <DataTable label="Chamada da sessão">
        <thead>
          <TableHeaderRow>
            <th>Aluno</th>
            <th>RA</th>
            <th>Frequência</th>
            <th>Status</th>
            <th>Justificativa</th>
          </TableHeaderRow>
        </thead>
        <tbody>
          {matriculas.map((matricula) => {
            const aluno = alunoById(viewer.data, matricula.alunoId);
            const taxa = frequenciaDaMatricula(viewer.data, matricula.id);
            const linha = linhas[matricula.id];

            return (
              <tr key={matricula.id}>
                <td>
                  <div className="text-[14px] font-semibold text-slate-800">{aluno.nome}</div>
                  <div className="text-[12px] text-stone-600">{matricula.status}</div>
                </td>
                <td className="font-mono text-[12.5px]">{aluno.ra}</td>
                <td className="min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-[12px] text-stone-600">{formatPercent(taxa)}</span>
                    <Progress value={taxa} className="min-w-[60px] flex-1" />
                  </div>
                </td>
                <td>
                  <Select
                    aria-label={`Status de ${aluno.nome}`}
                    value={linha?.status ?? "PRESENTE"}
                    disabled={somenteLeitura}
                    onChange={(event) => atualizar(matricula.id, { status: event.target.value as PresencaStatus })}
                  >
                    {STATUS_OPCOES.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_ROTULOS[status]}
                      </option>
                    ))}
                  </Select>
                </td>
                <td>
                  <Input
                    aria-label={`Justificativa de ${aluno.nome}`}
                    value={linha?.justificativa ?? ""}
                    disabled={somenteLeitura}
                    placeholder="Obrigatória se justificado"
                    onChange={(event) => atualizar(matricula.id, { justificativa: event.target.value })}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </DataTable>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[12px] text-stone-600">
          {somenteLeitura
            ? "Sessão encerrada: reabra para editar os registros."
            : "A frequência é recalculada ao salvar."}
        </span>
        <Button variant="primary" type="submit" disabled={somenteLeitura}>
          <CheckIcon className="h-4 w-4" /> Salvar chamada
        </Button>
      </div>
    </form>
  );
}