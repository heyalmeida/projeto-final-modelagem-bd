"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { icons } from "@/constants/icons";

/** Cabeçalho da agenda com a ação de solicitar alteração de horário. */
export function AgendaHeader({ onRequestChange }: { onRequestChange: () => void }) {
  const PlusIcon = icons.plus;

  return (
    <PageHeader
      eyebrow="Módulo Agenda"
      title="Grade, eventos e alterações"
      sub="Horários da turma, eventos acadêmicos e solicitações de mudança."
      actions={
        <Button variant="primary" onClick={onRequestChange}>
          <PlusIcon className="h-4 w-4" /> Solicitar alteração
        </Button>
      }
    />
  );
}