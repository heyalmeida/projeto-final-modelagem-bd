"use client";

import { KpiCard } from "@/components/ui/KpiCard";
import { resumoFinanceiro } from "@/features/financeiro/selectors";
import { money } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

/** Indicadores de cobrança, recebimento e adimplência. */
export function FinanceiroStats() {
  const viewer = useViewer();
  const resumo = resumoFinanceiro(viewer);

  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Em aberto"
        value={money(resumo.aberto)}
        hint={`${resumo.cobrancas} cobrança(s)`}
        icon="financeiro"
        tone="amber"
      />
      <KpiCard
        label="Recebido"
        value={money(resumo.recebido)}
        hint={`${resumo.pagamentos} pagamento(s)`}
        icon="check"
        tone="green"
      />
      <KpiCard
        label="Vencidas"
        value={String(resumo.vencidas)}
        hint={resumo.vencidas ? "regularize para liberar matrícula" : "nenhuma pendência"}
        icon="alert"
        tone="red"
      />
      <KpiCard
        label="Adimplência"
        value={`${resumo.adimplencia}%`}
        hint="do valor total do recorte"
        icon="chart"
        tone="brand"
      />
    </div>
  );
}