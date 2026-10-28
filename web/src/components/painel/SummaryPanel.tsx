"use client";

import { Panel } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { RadialGauge } from "@/components/ui/RadialGauge";
import { icons } from "@/constants/icons";
import { siteConfig } from "@/config/site";
import { usePainelResumo } from "@/features/painel/hooks/use-painel-resumo";
import { formatGrade, money } from "@/lib/utils";
import type { BadgeTone } from "@/types/ui";

interface SituacaoAcademica {
  tone: BadgeTone;
  label: string;
  descricao: string;
}

/** Situação do aluno perante as regras de aprovação do curso. */
function situacaoAcademica(frequencia: number | null, media: number | null): SituacaoAcademica {
  const { minGrade, minAttendance } = siteConfig.approval;
  const frequenciaOk = frequencia !== null && frequencia >= minAttendance;
  const mediaOk = media !== null && media >= minGrade;

  if (frequencia === null && media === null) {
    return { tone: "neutral", label: "Sem registros", descricao: "Sem notas e presenças no semestre." };
  }
  if (frequenciaOk && mediaOk) {
    return { tone: "ok", label: "No caminho", descricao: "Média e frequência dentro do mínimo." };
  }
  if (frequenciaOk || mediaOk) {
    return {
      tone: "warn",
      label: "Atenção",
      descricao: frequenciaOk
        ? "Média abaixo do mínimo exigido."
        : "Frequência abaixo do mínimo exigido.",
    };
  }
  return { tone: "danger", label: "Em risco", descricao: "Média e frequência abaixo do mínimo." };
}

/** Resumo lateral: acadêmico, financeiro ou do acervo, conforme o perfil. */
export function SummaryPanel() {
  const { resumoAcademico, resumoFinanceiro, resumoAcervo } = usePainelResumo();

  if (resumoAcademico) {
    const { frequencia, media, matriculasAtivas, tentativas } = resumoAcademico;
    const { minGrade, minAttendance } = siteConfig.approval;
    const situacao = situacaoAcademica(frequencia, media);
    const frequenciaTexto = frequencia === null ? "—" : `${frequencia}%`;

    return (
      <Panel>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-display text-lg text-slate-900">Resumo acadêmico</h2>
          <span className="text-[12.5px] font-semibold text-stone-600">{siteConfig.period}</span>
        </div>

        <Badge tone={situacao.tone} className="mb-3 w-full justify-between gap-2 text-[10.5px] font-bold">
          <span className="uppercase tracking-wide">{situacao.label}</span>
          <span className="font-semibold normal-case opacity-90">{situacao.descricao}</span>
        </Badge>

        <div className="flex items-center gap-5">
          <RadialGauge value={frequencia} label="frequência" threshold={minAttendance} size={104} thickness={9} />
          <div className="min-w-0 flex-1 space-y-2.5">
            <div>
              <div className="mb-1 flex items-baseline justify-between text-[12.5px]">
                <span className="font-semibold text-stone-600">Média ponderada</span>
                <strong className="font-display text-[18px] text-slate-900">
                  {formatGrade(media)}
                  <span className="text-[11.5px] font-semibold text-stone-600">/10</span>
                </strong>
              </div>
              <Progress value={media} max={10} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-2">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-stone-600">
                  <icons.users className="h-3 w-3" /> Matrículas
                </span>
                <strong className="font-display text-[20px] text-slate-900">{matriculasAtivas}</strong>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-2">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-stone-600">
                  <icons.file className="h-3 w-3" /> Tentativas
                </span>
                <strong className="font-display text-[20px] text-slate-900">{tentativas}</strong>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 border-t border-stone-100 pt-3 text-[11.5px] text-stone-600">
          Frequência <strong className="text-slate-800">{frequenciaTexto}</strong> · aprovação exige média ≥{" "}
          {minGrade.toFixed(1)} e frequência ≥ {minAttendance}%.
        </p>
      </Panel>
    );
  }

  if (resumoFinanceiro) {
    const { aberto, recebido, vencidas, percentual } = resumoFinanceiro;
    return (
      <Panel>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-display text-lg text-slate-900">Resumo financeiro</h2>
          <span className="text-[12.5px] text-stone-600">{siteConfig.period}</span>
        </div>
        <div className="flex items-baseline justify-between border-b border-dashed border-stone-200 py-2 text-[13.5px]">
          <span className="text-stone-600">Em aberto</span>
          <strong className="font-display text-[22.5px] text-slate-900">{money(aberto)}</strong>
        </div>
        <div className="flex items-baseline justify-between border-b border-dashed border-stone-200 py-2 text-[13.5px]">
          <span className="text-stone-600">Recebido</span>
          <strong className="font-display text-[22.5px] text-slate-900">{money(recebido)}</strong>
        </div>
        <div className="flex items-baseline justify-between py-2 text-[13.5px]">
          <span className="text-stone-600">Vencidas</span>
          <strong className="font-display text-[22.5px] text-slate-900">{vencidas}</strong>
        </div>
        <Progress className="mt-2" value={percentual} />
      </Panel>
    );
  }

  if (resumoAcervo) {
    const { titulos, exemplares, disponiveis, percentual } = resumoAcervo;
    return (
      <Panel>
        <div className="mb-2">
          <h2 className="font-display text-lg text-slate-900">Resumo do acervo</h2>
        </div>
        <div className="flex items-baseline justify-between border-b border-dashed border-stone-200 py-2 text-[13.5px]">
          <span className="text-stone-600">Títulos</span>
          <strong className="font-display text-[22.5px] text-slate-900">{titulos}</strong>
        </div>
        <div className="flex items-baseline justify-between border-b border-dashed border-stone-200 py-2 text-[13.5px]">
          <span className="text-stone-600">Exemplares</span>
          <strong className="font-display text-[22.5px] text-slate-900">{exemplares}</strong>
        </div>
        <div className="flex items-baseline justify-between py-2 text-[13.5px]">
          <span className="text-stone-600">Disponíveis</span>
          <strong className="font-display text-[22.5px] text-slate-900">{disponiveis}</strong>
        </div>
        <Progress className="mt-2" value={percentual} />
      </Panel>
    );
  }

  return null;
}