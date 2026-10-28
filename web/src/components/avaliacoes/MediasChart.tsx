"use client";

import { BarChart } from "@/components/ui/charts/BarChart";
import { Panel } from "@/components/ui/Card";
import { siteConfig } from "@/config/site";
import { mediasPorAvaliacao } from "@/features/avaliacoes/selectors";
import { formatGrade } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

/** Média das tentativas por avaliação, com a linha de aprovação indicada. */
export function MediasChart() {
  const viewer = useViewer();
  const dados = mediasPorAvaliacao(viewer);

  if (!dados.length) return null;

  return (
    <Panel className="mb-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-display text-lg text-slate-900">Média por avaliação</h2>
        <span className="text-[11.5px] text-stone-600">
          aprovação a partir de {siteConfig.approval.minGrade.toFixed(1)}
        </span>
      </div>
      <BarChart
        points={dados.map((item) => ({ label: item.label, values: [item.media] }))}
        series={[{ label: "Média das tentativas", color: "#7c3aed" }]}
        format={(valor) => formatGrade(valor)}
      />
    </Panel>
  );
}