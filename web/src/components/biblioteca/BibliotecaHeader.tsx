"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { resumoAcervo } from "@/features/biblioteca/selectors";
import { useViewer } from "@/store/viewer-context";

/** Cabeçalho da biblioteca com o total de exemplares disponíveis. */
export function BibliotecaHeader() {
  const { data } = useViewer();
  const resumo = resumoAcervo(data);

  return (
    <PageHeader
      eyebrow="Módulo Biblioteca"
      title="Acervo e exemplares"
      sub="Catálogo por acervo, disponibilidade dos exemplares e histórico de buscas."
      actions={
        <Badge tone="ok" className="text-[11px] font-bold">
          {resumo.disponiveis} exemplar(es) disponível(is)
        </Badge>
      }
    />
  );
}