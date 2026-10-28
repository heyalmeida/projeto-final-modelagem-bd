"use client";

import { useState } from "react";
import { ChamadaForm } from "@/components/presenca/ChamadaForm";
import { NovaSessaoModal } from "@/components/presenca/NovaSessaoModal";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { KpiCard } from "@/components/ui/KpiCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { icons } from "@/constants/icons";
import { matriculasDaTurma, professorById, turmaById } from "@/features/core/selectors";
import {
  registrosDaSessao,
  resumoSessao,
  sessoesVisiveis,
} from "@/features/presenca/selectors";
import { usePresencaActions } from "@/features/presenca/hooks/use-presenca-actions";
import { statusLabel } from "@/constants/status";
import { cn, formatDate } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

/** Visão da equipe: seleção de sessão, indicadores e chamada. */
export function PresencaStaff() {
  const viewer = useViewer();
  const { alternarSessao } = usePresencaActions();
  const sessoes = sessoesVisiveis(viewer);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<string | null>(null);
  const [criando, setCriando] = useState(false);

  const RefreshIcon = icons.refresh;
  const PlusIcon = icons.plus;

  if (!sessoes.length) {
    return (
      <>
        <PageHeader
          eyebrow="Módulo Presença"
          title="Chamada e frequência"
          sub="Registre presença por sessão."
          actions={
            <Button variant="primary" onClick={() => setCriando(true)}>
              <PlusIcon className="h-4 w-4" /> Nova sessão
            </Button>
          }
        />
        <Panel>
          <EmptyState icon="presenca" title="Nenhuma sessão" text="Não há sessões nas turmas do seu recorte." />
        </Panel>
        {criando ? <NovaSessaoModal onClose={() => setCriando(false)} /> : null}
      </>
    );
  }

  const sessao =
    sessoes.find((item) => item.id === sessaoSelecionada) ??
    sessoes.find((item) => item.status === "ABERTA") ??
    sessoes[0];

  const matriculas = matriculasDaTurma(viewer.data, sessao.turmaId);
  const registros = registrosDaSessao(viewer.data, sessao.id);
  const resumo = resumoSessao(viewer.data, matriculas, registros);
  const turma = turmaById(viewer.data, sessao.turmaId);
  const somenteLeitura = sessao.status !== "ABERTA";

  return (
    <>
      <PageHeader
        eyebrow="Módulo Presença"
        title="Chamada e frequência"
        sub="Sessões, registros por matrícula e acompanhamento da turma."
        actions={
          <>
            <Button variant="primary" onClick={() => setCriando(true)}>
              <PlusIcon className="h-4 w-4" /> Nova sessão
            </Button>
            <Button variant={somenteLeitura ? "secondary" : "primary"} onClick={() => alternarSessao(sessao.id)}>
              <RefreshIcon className="h-4 w-4" /> {somenteLeitura ? "Reabrir sessão" : "Encerrar sessão"}
            </Button>
          </>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Frequência da turma"
          value={resumo.mediaTurma === null ? "—" : `${resumo.mediaTurma}%`}
          hint={`${resumo.matriculas} matrícula(s)`}
          icon="presenca"
          tone="brand"
        />
        <KpiCard label="Presentes" value={String(resumo.presentes)} hint="na sessão selecionada" icon="check" tone="green" />
        <KpiCard
          label="Ausentes"
          value={String(resumo.ausentes)}
          hint={`${resumo.justificados} justificada(s)`}
          icon="alert"
          tone="red"
        />
        <KpiCard label="Sessões" value={String(sessoes.length)} hint="no recorte do perfil" icon="agenda" tone="blue" />
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scroll-thin">
        {sessoes.map((item) => {
          const turmaDaSessao = turmaById(viewer.data, item.turmaId);
          const ativa = item.id === sessao.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSessaoSelecionada(item.id)}
              className={cn(
                "min-w-[112px] shrink-0 rounded-xl border px-3 py-2 text-left text-[12.5px]",
                ativa ? "border-brand-600 bg-brand-50" : "border-stone-200 bg-white hover:border-stone-300",
              )}
            >
              <strong className="block text-[13.5px] text-slate-800">{formatDate(item.data)}</strong>
              {item.tema}
              <div className="mt-0.5 text-[11px] text-stone-600">
                {turmaDaSessao.codigo} · {statusLabel(item.status)}
              </div>
            </button>
          );
        })}
      </div>

      <Panel>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-lg text-slate-900">{sessao.tema}</h2>
            <p className="text-[13px] text-stone-600">
              {turma.codigo} · {turma.componente} · {formatDate(sessao.data)} {sessao.inicio}–{sessao.fim} ·{" "}
              {professorById(viewer.data, sessao.professorId).nome}
            </p>
          </div>
          <StatusBadge status={sessao.status} />
        </div>

        <ChamadaForm key={sessao.id} sessao={sessao} matriculas={matriculas} registros={registros} />
      </Panel>

      {criando ? <NovaSessaoModal onClose={() => setCriando(false)} /> : null}
    </>
  );
}