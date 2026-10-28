"use client";

import { DonutChart } from "@/components/ui/charts/DonutChart";
import { BarChart } from "@/components/ui/charts/BarChart";
import { Panel } from "@/components/ui/Card";
import { distribuicaoMensalidades, financeiroPorCompetencia, resumoFinanceiro } from "@/features/financeiro/selectors";
import { usePainelResumo } from "@/features/painel/hooks/use-painel-resumo";
import { money } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

/**
 * Painel gráfico do semestre: previsto × recebido por competência e a
 * distribuição das cobranças por status — sempre no recorte do usuário.
 */
export function FinanceiroChart() {
  const viewer = useViewer();
  const resumo = usePainelResumo();

  if (!resumo.acesso.financeiro) return null;

  const porCompetencia = financeiroPorCompetencia(viewer);
  const totalizadores = resumoFinanceiro(viewer);
  const fatias = distribuicaoMensalidades(viewer);

  return (
    <Panel className="mb-4">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-lg text-slate-900">Financeiro do semestre</h2>
        <span className="text-[11.5px] text-stone-600">
          {totalizadores.adimplencia}% de adimplência · {money(totalizadores.aberto)} em aberto
        </span>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-stone-600">Previsto × recebido</p>
          <BarChart
            points={porCompetencia.map((item) => ({ label: item.label, values: [item.total, item.recebido] }))}
            series={[
              { label: "Previsto", color: "#94a3b8" },
              { label: "Recebido", color: "#0f766e" },
            ]}
            format={(valor) => money(valor)}
          />
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-stone-600">Cobranças por status</p>
          <DonutChart slices={fatias} centerLabel="cobranças" size={150} thickness={16} />
        </div>
      </div>
    </Panel>
  );
}