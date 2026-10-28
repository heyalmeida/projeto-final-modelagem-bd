"use client";

import { useState } from "react";
import { AvaliacaoModal } from "@/components/avaliacoes/AvaliacaoModal";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { icons } from "@/constants/icons";

interface AvaliacoesHeaderProps {
  modoGestao: boolean;
  abertas: number;
  onShowAttempts: () => void;
}

/** Cabeçalho do módulo: atalhos de tentativa (aluno) e criação (gestão). */
export function AvaliacoesHeader({ modoGestao, abertas, onShowAttempts }: AvaliacoesHeaderProps) {
  const [criando, setCriando] = useState(false);
  const FileIcon = icons.file;
  const PlusIcon = icons.plus;

  return (
    <>
      <PageHeader
        eyebrow="Módulo Avaliações"
        title="Desempenho e tentativas"
        sub="Provas, trabalhos, questões e configuração de gestão acadêmica."
        actions={
          modoGestao ? (
            <>
              <Badge tone="purple" className="text-[10.5px] font-bold">
                {abertas} aberta(s)
              </Badge>
              <Button variant="primary" onClick={() => setCriando(true)}>
                <PlusIcon className="h-4 w-4" /> Nova avaliação
              </Button>
            </>
          ) : (
            <Button onClick={onShowAttempts}>
              <FileIcon className="h-4 w-4" /> Minhas tentativas
            </Button>
          )
        }
      />

      {criando ? <AvaliacaoModal avaliacao={null} onClose={() => setCriando(false)} /> : null}
    </>
  );
}