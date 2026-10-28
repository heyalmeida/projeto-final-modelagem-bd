"use client";

import { Panel } from "@/components/ui/Card";
import { DataTable, TableHeaderRow } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { historicoVisivel } from "@/features/biblioteca/selectors";
import { usuarioById } from "@/features/core/selectors";
import { canManageLibrary } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

/** Histórico de buscas: completo para a equipe da biblioteca, próprio para os demais. */
export function HistoricoPanel() {
  const viewer = useViewer();
  const registros = historicoVisivel(viewer);
  const exibirUsuario = canManageLibrary(viewer.user, viewer.group);

  if (!registros.length) {
    return (
      <Panel>
        <EmptyState icon="search" title="Sem buscas" text="O histórico registra as consultas feitas no catálogo." />
      </Panel>
    );
  }

  return (
    <DataTable label="Histórico de buscas">
      <thead>
        <TableHeaderRow>
          <th>Termo</th>
          <th>Filtros</th>
          {exibirUsuario ? <th>Usuário</th> : null}
          <th>Data</th>
          <th className="text-right">Resultados</th>
        </TableHeaderRow>
      </thead>
      <tbody>
        {registros.map((registro) => (
          <tr key={registro.id}>
            <td>
              <span className="rounded-md bg-stone-100 px-1.5 py-0.5 font-mono text-[13px]">{registro.termo}</span>
            </td>
            <td>{registro.filtros}</td>
            {exibirUsuario ? <td>{usuarioById(viewer.data, registro.usuarioId).nome}</td> : null}
            <td className="whitespace-nowrap">{formatDateTime(registro.data)}</td>
            <td className="text-right">{registro.resultados}</td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}