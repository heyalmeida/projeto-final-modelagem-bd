"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { matriculaDaAvaliacao, ultimaTentativa } from "@/features/avaliacoes/selectors";
import { turmaById } from "@/features/core/selectors";
import { isStudent } from "@/lib/auth";
import { formatGrade } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";
import type { Avaliacao } from "@/types/domain";

/** Cartão compacto de avaliação usado no painel. */
export function MiniAssessmentCard({ avaliacao }: { avaliacao: Avaliacao }) {
  const viewer = useViewer();
  const matricula = isStudent(viewer.user) ? matriculaDaAvaliacao(viewer, avaliacao) : null;
  const tentativa = matricula ? ultimaTentativa(viewer.data, avaliacao.id, matricula.id) : null;
  const publicada = avaliacao.status === "PUBLICADA";

  return (
    <Card className="flex flex-col gap-3 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-[15px] font-bold leading-snug text-slate-800">{avaliacao.titulo}</h3>
          <div className="mt-1 flex flex-wrap gap-2 text-[12px] text-stone-600">
            <span>{turmaById(viewer.data, avaliacao.turmaId).codigo}</span>
            <span>peso {avaliacao.peso}</span>
          </div>
        </div>
        <StatusBadge status={publicada ? "PUBLICADA" : avaliacao.status} />
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-dashed border-stone-200 pt-2.5">
        {tentativa ? (
          <div className="font-display text-2xl leading-none text-slate-900">
            {formatGrade(tentativa.pontuacao)}
            <span className="text-[11px] text-stone-600">/10</span>
          </div>
        ) : (
          <span className="text-[12px] text-stone-600">Sem tentativa</span>
        )}
        <ButtonLink href="/avaliacoes" variant={publicada && !tentativa ? "primary" : "secondary"}>
          {tentativa ? "Ver resultado" : "Abrir"}
        </ButtonLink>
      </div>
    </Card>
  );
}