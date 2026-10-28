"use client";

import { Button } from "@/components/ui/Button";
import { DataTable, TableHeaderRow } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Panel } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  alunoDaMensalidade,
  mensalidadesVisiveis,
  pagamentosDoRecorte,
} from "@/features/financeiro/selectors";
import { useFinanceiroActions } from "@/features/financeiro/hooks/use-financeiro-actions";
import { canManageFinance } from "@/lib/auth";
import { formatCompetencia, formatDateTime, money } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

/** Baixas registradas no recorte do usuário, com estorno para a equipe. */
export function PagamentosPanel() {
  const viewer = useViewer();
  const { estornarPagamento } = useFinanceiroActions();
  const mensalidades = mensalidadesVisiveis(viewer);
  const pagamentos = pagamentosDoRecorte(viewer, mensalidades);
  const podeEstornar = canManageFinance(viewer.user, viewer.group);

  if (!pagamentos.length) {
    return (
      <Panel>
        <EmptyState icon="financeiro" title="Nenhum pagamento" text="As baixas registradas aparecem aqui." />
      </Panel>
    );
  }

  return (
    <DataTable label="Pagamentos registrados">
      <thead>
        <TableHeaderRow>
          <th>Data</th>
          <th>Aluno</th>
          <th>Competência</th>
          <th>Método</th>
          <th className="text-right">Valor</th>
          <th>Comprovante</th>
          <th>Status</th>
          <th />
        </TableHeaderRow>
      </thead>
      <tbody>
        {pagamentos.map((pagamento) => {
          const mensalidade = viewer.data.mensalidades.find((item) => item.id === pagamento.mensalidadeId);
          const metodo = viewer.data.metodos.find((item) => item.id === pagamento.metodoId);

          return (
            <tr key={pagamento.id}>
              <td className="whitespace-nowrap">{formatDateTime(pagamento.data)}</td>
              <td>{mensalidade ? alunoDaMensalidade(viewer.data, mensalidade).nome : "—"}</td>
              <td>{mensalidade ? formatCompetencia(mensalidade.competencia) : "—"}</td>
              <td>{metodo ? metodo.nome : "—"}</td>
              <td className="text-right font-semibold">{money(pagamento.valor)}</td>
              <td className="font-mono text-[12.5px]">{pagamento.comprovante}</td>
              <td>
                <StatusBadge status={pagamento.status} />
              </td>
              <td className="text-right">
                {podeEstornar && pagamento.status === "CONFIRMADO" ? (
                  <Button variant="ghost" onClick={() => estornarPagamento(pagamento.id)}>
                    Estornar
                  </Button>
                ) : null}
              </td>
            </tr>
          );
        })}
      </tbody>
    </DataTable>
  );
}