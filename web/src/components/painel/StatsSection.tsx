"use client";

import { KpiCard } from "@/components/ui/KpiCard";
import { usePainelResumo } from "@/features/painel/hooks/use-painel-resumo";

/** Indicadores do topo: cada perfil vê apenas o que os seus módulos permitem. */
export function StatsSection() {
  const { indicadores } = usePainelResumo();

  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {indicadores.map(({ id, ...indicador }) => (
        <KpiCard key={id} {...indicador} />
      ))}
    </div>
  );
}