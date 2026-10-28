"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { icons } from "@/constants/icons";
import { usePainelResumo } from "@/features/painel/hooks/use-painel-resumo";
import { dayOfWeek, formatDate } from "@/lib/utils";

/** Saudação do painel com atalho para a agenda. */
export function PainelHeader() {
  const { nome } = usePainelResumo();
  const CalendarIcon = icons.agenda;

  return (
    <PageHeader
      eyebrow="Visão geral"
      title={`Olá, ${nome}`}
      sub={`Um recorte do semestre ${siteConfig.period} · ${dayOfWeek(siteConfig.today)}, ${formatDate(siteConfig.today)}.`}
      actions={
        <ButtonLink href="/agenda">
          <CalendarIcon className="h-4 w-4" /> Agenda
        </ButtonLink>
      }
    />
  );
}