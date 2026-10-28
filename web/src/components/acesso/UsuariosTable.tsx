"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Card";
import { DataTable, TableHeaderRow } from "@/components/ui/DataTable";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { grupoById } from "@/features/core/selectors";
import { useViewer } from "@/store/viewer-context";

/** Usuários de demonstração, seus grupos e papéis. */
export function UsuariosTable() {
  const { data } = useViewer();

  return (
    <Panel>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg text-slate-900">Usuários</h2>
          <p className="text-[13px] text-stone-600">Credenciais de demonstração.</p>
        </div>
        <Badge tone="neutral" className="text-[11px] font-bold">
          {data.usuarios.length}
        </Badge>
      </div>

      <DataTable label="Usuários de demonstração">
        <thead>
          <TableHeaderRow>
            <th>Usuário</th>
            <th>Grupo</th>
            <th>Papel</th>
          </TableHeaderRow>
        </thead>
        <tbody>
          {data.usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>
                <div className="flex items-center gap-2">
                  <Avatar name={usuario.nome} size="sm" />
                  <div>
                    <div className="text-[13.5px] font-semibold text-slate-800">{usuario.nome}</div>
                    <div className="text-[11px] text-stone-600">{usuario.email}</div>
                  </div>
                </div>
              </td>
              <td>{grupoById(data, usuario.grupoId).nome}</td>
              <td>
                <RoleBadge papel={usuario.papel} />
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </Panel>
  );
}