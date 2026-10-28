"use client";

import { useState } from "react";
import { PagamentoModal } from "@/components/financeiro/PagamentoModal";
import { Button } from "@/components/ui/Button";
import { DataTable, TableHeaderRow } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Panel } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { icons } from "@/constants/icons";
import type { MensalidadeFiltro } from "@/features/financeiro/schemas";
import {
  alunoDaMensalidade,
  mensalidadesOrdenadas,
  mensalidadesVisiveis,
  saldoDa,
  statusMensalidade,
} from "@/features/financeiro/selectors";
import { turmaById } from "@/features/core/selectors";
import { isStudent } from "@/lib/auth";
import { formatCompetencia, formatDate, money } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

/** Lista de mensalidades com filtro de status e ação de baixa. */
export function MensalidadesPanel({ filtro }: { filtro: MensalidadeFiltro }) {
  const viewer = useViewer();
  const [pagando, setPagando] = useState<string | null>(null);
  const WalletIcon = icons.financeiro;

  const mensalidades = mensalidadesOrdenadas(viewer, mensalidadesVisiveis(viewer), filtro);
  const exibirAluno = !isStudent(viewer.user);

  if (!mensalidades.length) {
    return (
      <Panel>
        <EmptyState icon="financeiro" title="Nenhuma cobrança" text="Não há mensalidades para o filtro selecionado." />
      </Panel>
    );
  }

  return (
    <>
      <DataTable label="Mensalidades">
        <thead>
          <TableHeaderRow>
            {exibirAluno ? <th>Aluno</th> : null}
            <th>Competência</th>
            <th>Vencimento</th>
            <th className="text-right">Valor</th>
            <th className="text-right">Desconto</th>
            <th className="text-right">Saldo</th>
            <th>Status</th>
            <th />
          </TableHeaderRow>
        </thead>
        <tbody>
          {mensalidades.map((mensalidade) => {
            const saldo = saldoDa(viewer.data, mensalidade);
            const matricula = viewer.data.matriculas.find((item) => item.id === mensalidade.matriculaId);
            const aluno = alunoDaMensalidade(viewer.data, mensalidade);

            return (
              <tr key={mensalidade.id} className="hover:bg-brand-50/40">
                {exibirAluno ? (
                  <td>
                    <div className="text-[14px] font-semibold text-slate-800">{aluno.nome}</div>
                    <div className="text-[12px] text-stone-600">
                      {matricula ? turmaById(viewer.data, matricula.turmaId).codigo : "—"} · {aluno.ra}
                    </div>
                  </td>
                ) : null}
                <td className="whitespace-nowrap">{formatCompetencia(mensalidade.competencia)}</td>
                <td className="whitespace-nowrap">{formatDate(mensalidade.vencimento)}</td>
                <td className="text-right">{money(mensalidade.valor)}</td>
                <td className="text-right">{mensalidade.desconto ? money(mensalidade.desconto) : "—"}</td>
                <td className="text-right font-semibold">{money(saldo)}</td>
                <td>
                  <StatusBadge status={statusMensalidade(viewer.data, mensalidade)} />
                </td>
                <td className="text-right">
                  {saldo > 0 ? (
                    <Button variant="primary" onClick={() => setPagando(mensalidade.id)}>
                      <WalletIcon className="h-4 w-4" /> Pagar
                    </Button>
                  ) : (
                    <span className="text-[12px] text-stone-600">Quitada</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </DataTable>

      {pagando ? <PagamentoModal mensalidadeId={pagando} onClose={() => setPagando(null)} /> : null}
    </>
  );
}