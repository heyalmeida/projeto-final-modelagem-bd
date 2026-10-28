"use client";

import { AlertNote } from "@/components/ui/AlertNote";
import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Card";
import { DataTable, TableHeaderRow } from "@/components/ui/DataTable";
import { useAcessoActions } from "@/features/acesso/hooks/use-acesso-actions";
import { cn } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

/** Matriz grupo × módulo: o interruptor liga e desliga o acesso. */
export function ModulosMatrix() {
  const { data } = useViewer();
  const { alternarModulo } = useAcessoActions();

  return (
    <Panel>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg text-slate-900">Matriz de módulos</h2>
          <p className="text-[13px] text-stone-600">Clique no interruptor para habilitar ou desabilitar.</p>
        </div>
        <Badge tone="neutral" className="text-[11px] font-bold">
          {data.grupos.length} grupos
        </Badge>
      </div>

      <DataTable tableClassName="min-w-[680px]" label="Matriz de módulos por grupo">
        <thead>
          <TableHeaderRow className="text-[11px]">
            <th>Grupo</th>
            {data.modulos.map((modulo) => (
              <th key={modulo.id} className="text-center">
                {modulo.nome}
              </th>
            ))}
          </TableHeaderRow>
        </thead>
        <tbody>
          {data.grupos.map((grupo) => (
            <tr key={grupo.id}>
              <td>
                <span className="text-[13.5px] font-semibold text-slate-800">{grupo.nome}</span>
                <span className="block text-[11px] text-stone-600">{grupo.papel}</span>
              </td>
              {data.modulos.map((modulo) => {
                const ativo = grupo.modulos.includes(modulo.id);
                return (
                  <td key={modulo.id} className="text-center">
                    <button
                      type="button"
                      aria-pressed={ativo}
                      aria-label={`${ativo ? "Desabilitar" : "Habilitar"} ${modulo.nome} para ${grupo.nome}`}
                      onClick={() => alternarModulo(grupo.id, modulo.id)}
                      className={cn(
                        "relative inline-flex h-[18px] w-[32px] items-center rounded-full border transition",
                        ativo ? "border-brand-700 bg-brand-700" : "border-stone-300 bg-stone-200",
                      )}
                    >
                      <span
                        className={cn(
                          "h-3 w-3 rounded-full bg-white shadow transition",
                          ativo ? "translate-x-[15px]" : "translate-x-[2px]",
                        )}
                      />
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </DataTable>

      <AlertNote title="Defesa em profundidade" className="mt-3">
        O menu esconde o módulo, a rota revalida o grupo e cada tela confirma o vínculo do usuário com o registro.
      </AlertNote>
    </Panel>
  );
}