"use client";

import { Panel } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { icons } from "@/constants/icons";
import { useViewer } from "@/store/viewer-context";

/** Métodos de pagamento aceitos e suas taxas. */
export function MetodosPanel() {
  const { data } = useViewer();
  const WalletIcon = icons.financeiro;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {data.metodos.map((metodo) => (
        <Panel key={metodo.id}>
          <div className="flex items-center justify-between">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-700">
              <WalletIcon className="h-4 w-4" />
            </span>
            <StatusBadge status={metodo.ativo ? "ATIVA" : "CANCELADA"} />
          </div>
          <h3 className="mt-2.5 font-display text-lg text-slate-900">{metodo.nome}</h3>
          <p className="text-[13px] text-stone-600">
            {metodo.tipo} · taxa de {metodo.taxa ? `${metodo.taxa}%` : "0%"}
          </p>
          <div className="my-3 h-px bg-stone-200" />
          <p className="text-[12px] text-stone-600">
            {metodo.taxa ? "Taxa aplicada no registro do pagamento." : "Sem taxa para a instituição."}
          </p>
        </Panel>
      ))}
    </div>
  );
}