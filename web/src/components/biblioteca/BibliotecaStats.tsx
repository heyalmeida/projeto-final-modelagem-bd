"use client";

import { KpiCard } from "@/components/ui/KpiCard";
import { resumoAcervo } from "@/features/biblioteca/selectors";
import { useViewer } from "@/store/viewer-context";

/** Indicadores do acervo. */
export function BibliotecaStats() {
  const { data } = useViewer();
  const resumo = resumoAcervo(data);

  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard label="Acervos" value={String(resumo.acervos)} hint="coleções ativas" icon="biblioteca" tone="pink" />
      <KpiCard label="Títulos" value={String(resumo.titulos)} hint="referências catalogadas" icon="biblioteca" tone="blue" />
      <KpiCard
        label="Exemplares"
        value={String(resumo.exemplares)}
        hint={`${resumo.disponiveis} disponíveis`}
        icon="painel"
        tone="brand"
      />
      <KpiCard label="Buscas" value={String(resumo.buscas)} hint="registradas no histórico" icon="search" tone="amber" />
    </div>
  );
}