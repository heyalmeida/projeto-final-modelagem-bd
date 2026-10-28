"use client";

import { useState } from "react";
import { AvaliacoesHeader } from "@/components/avaliacoes/AvaliacoesHeader";
import { MediasChart } from "@/components/avaliacoes/MediasChart";
import { AvaliacoesLista } from "@/components/avaliacoes/AvaliacoesLista";
import { AvaliacoesStats } from "@/components/avaliacoes/AvaliacoesStats";
import { AvaliacoesTabela } from "@/components/avaliacoes/AvaliacoesTabela";
import { MinhasTentativasPanel } from "@/components/avaliacoes/MinhasTentativasPanel";
import { TentativasPanel } from "@/components/avaliacoes/TentativasPanel";
import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Card";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { siteConfig } from "@/config/site";
import { resumoAvaliacoes } from "@/features/avaliacoes/selectors";
import type { AvaliacoesTab } from "@/features/avaliacoes/types";
import { isStudent, isTeacher } from "@/lib/auth";
import { useViewer } from "@/store/viewer-context";

/**
 * Orquestra as duas visões do módulo (avaliações e tentativas) e alterna entre a
 * apresentação do aluno e a da gestão acadêmica.
 */
export function AvaliacoesBoard() {
  const viewer = useViewer();
  const resumo = resumoAvaliacoes(viewer);
  const [tab, setTab] = useState<AvaliacoesTab>("avaliacoes");

  const abas: ReadonlyArray<TabItem<AvaliacoesTab>> = [
    { id: "avaliacoes", label: resumo.modoGestao ? "Avaliações" : "Minhas avaliações" },
    { id: "tentativas", label: resumo.modoGestao ? "Tentativas" : "Minhas tentativas" },
  ];

  const legenda = resumo.modoGestao
    ? isTeacher(viewer.user)
      ? "Somente suas turmas"
      : "Todas as turmas visíveis"
    : "Somente seus registros";

  return (
    <>
      <AvaliacoesHeader
        modoGestao={resumo.modoGestao}
        abertas={resumo.abertas}
        onShowAttempts={() => setTab("tentativas")}
      />
      <AvaliacoesStats />
      {resumo.modoGestao ? <MediasChart /> : null}

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <Tabs items={abas} value={tab} onChange={setTab} label="Visões de avaliações" />
        <span className="text-[12.5px] text-stone-600">{legenda}</span>
      </div>

      {resumo.modoGestao ? (
        tab === "tentativas" ? (
          <TentativasPanel />
        ) : (
          <AvaliacoesTabela />
        )
      ) : tab === "tentativas" ? (
        <MinhasTentativasPanel />
      ) : (
        <AvaliacoesLista />
      )}

      {isStudent(viewer.user) ? (
        <Panel className="mt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-700">Regra de negócio</p>
              <h3 className="mt-1 font-display text-lg text-slate-900">Como a nota é calculada</h3>
              <p className="mt-1 text-[14px] text-stone-600">
                A pontuação da tentativa soma as questões corretas. A média final pondera cada avaliação pelo peso.
              </p>
            </div>
            <Badge tone="purple" className="text-[11px] font-bold">
              média ≥ {siteConfig.approval.minGrade.toFixed(1)}
            </Badge>
          </div>
        </Panel>
      ) : null}
    </>
  );
}