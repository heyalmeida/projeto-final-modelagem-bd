"use client";

import { useState } from "react";
import { FinanceiroHeader } from "@/components/financeiro/FinanceiroHeader";
import { FinanceiroStats } from "@/components/financeiro/FinanceiroStats";
import { MensalidadesPanel } from "@/components/financeiro/MensalidadesPanel";
import { MetodosPanel } from "@/components/financeiro/MetodosPanel";
import { PagamentosPanel } from "@/components/financeiro/PagamentosPanel";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import type { MensalidadeFiltro } from "@/features/financeiro/schemas";
import { cn } from "@/lib/utils";

type FinanceiroTab = "mensalidades" | "pagamentos" | "metodos";

const TABS: ReadonlyArray<TabItem<FinanceiroTab>> = [
  { id: "mensalidades", label: "Mensalidades" },
  { id: "pagamentos", label: "Pagamentos" },
  { id: "metodos", label: "Métodos" },
];

const FILTROS: ReadonlyArray<{ id: MensalidadeFiltro; label: string }> = [
  { id: "TODAS", label: "Todas" },
  { id: "ABERTA", label: "Aberta" },
  { id: "VENCIDA", label: "Vencida" },
  { id: "PAGA", label: "Paga" },
];

/** Orquestra as abas do financeiro e o filtro de status das mensalidades. */
export function FinanceiroBoard() {
  const [tab, setTab] = useState<FinanceiroTab>("mensalidades");
  const [filtro, setFiltro] = useState<MensalidadeFiltro>("TODAS");

  return (
    <>
      <FinanceiroHeader />
      <FinanceiroStats />

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <Tabs items={TABS} value={tab} onChange={setTab} label="Seções do financeiro" />

        {tab === "mensalidades" ? (
          <div className="flex flex-wrap gap-1.5">
            {FILTROS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFiltro(item.id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[12px] font-semibold",
                  filtro === item.id
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-stone-300 bg-transparent text-stone-600 hover:text-slate-800",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {tab === "mensalidades" ? (
        <MensalidadesPanel filtro={filtro} />
      ) : tab === "pagamentos" ? (
        <PagamentosPanel />
      ) : (
        <MetodosPanel />
      )}
    </>
  );
}