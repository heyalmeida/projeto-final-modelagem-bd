"use client";

import { KpiCard } from "@/components/ui/KpiCard";
import { resumoAvaliacoes } from "@/features/avaliacoes/selectors";
import { siteConfig } from "@/config/site";
import { formatGrade } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

/** Indicadores de avaliações: visão do aluno ou da gestão. */
export function AvaliacoesStats() {
  const viewer = useViewer();
  const resumo = resumoAvaliacoes(viewer);

  if (resumo.modoGestao) {
    return (
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Avaliações" value={String(resumo.total)} hint="no seu recorte" icon="avaliacoes" tone="violet" />
        <KpiCard label="Publicadas" value={String(resumo.publicadas)} hint="disponíveis aos alunos" icon="check" tone="brand" />
        <KpiCard label="Tentativas" value={String(resumo.tentativas)} hint="registradas" icon="file" tone="blue" />
        <KpiCard label="Média geral" value={formatGrade(resumo.media)} hint="das avaliações com nota" icon="chart" tone="amber" />
      </div>
    );
  }

  const aprovado = resumo.minhaMedia !== null && resumo.minhaMedia >= siteConfig.approval.minGrade;

  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="Média ponderada" value={formatGrade(resumo.minhaMedia)} hint="peso das avaliações" icon="chart" tone="violet" />
      <KpiCard label="Avaliações abertas" value={String(resumo.abertas)} hint="disponíveis agora" icon="avaliacoes" tone="brand" />
      <KpiCard label="Tentativas" value={String(resumo.minhasTentativas)} hint="registradas no semestre" icon="file" tone="blue" />
      <KpiCard
        label="Aprovação"
        value={aprovado ? "No caminho" : "Atenção"}
        hint={`média mínima ${siteConfig.approval.minGrade.toFixed(1)}`}
        icon="check"
        tone={aprovado ? "green" : "amber"}
      />
    </div>
  );
}