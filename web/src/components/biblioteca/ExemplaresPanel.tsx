"use client";

import { DataTable, TableHeaderRow } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

/** Inventário de exemplares com tombo, localização e status. */
export function ExemplaresPanel() {
  const { data } = useViewer();

  return (
    <DataTable label="Exemplares do acervo">
      <thead>
        <TableHeaderRow>
          <th>Tombo</th>
          <th>Livro</th>
          <th>Área</th>
          <th>Localização</th>
          <th>Aquisição</th>
          <th>Status</th>
        </TableHeaderRow>
      </thead>
      <tbody>
        {data.exemplares.map((exemplar) => {
          const livro = data.livros.find((item) => item.id === exemplar.livroId);
          return (
            <tr key={exemplar.id}>
              <td className="font-mono text-[12.5px]">{exemplar.tombo}</td>
              <td>
                <div className="text-[14px] font-semibold text-slate-800">{livro ? livro.titulo : "—"}</div>
                <div className="text-[12px] text-stone-600">{livro ? livro.autor : ""}</div>
              </td>
              <td>{livro ? livro.area : "—"}</td>
              <td>{exemplar.localizacao}</td>
              <td className="whitespace-nowrap">{formatDate(exemplar.dataAquisicao)}</td>
              <td>
                <StatusBadge status={exemplar.status} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </DataTable>
  );
}