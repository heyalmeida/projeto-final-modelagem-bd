"use client";

import { useState } from "react";
import { AgendaHeader } from "@/components/agenda/AgendaHeader";
import { EventosPanel } from "@/components/agenda/EventosPanel";
import { GradePanel } from "@/components/agenda/GradePanel";
import { RejeicaoModal } from "@/components/agenda/RejeicaoModal";
import { SolicitacaoModal } from "@/components/agenda/SolicitacaoModal";
import { SolicitacoesPanel } from "@/components/agenda/SolicitacoesPanel";
import { Select } from "@/components/ui/Select";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { gradeDaTurma, solicitacoesPendentes } from "@/features/agenda/selectors";
import { turmasVisiveis } from "@/features/core/selectors";
import { useToast } from "@/providers/toast-provider";
import { useViewer } from "@/store/viewer-context";

type AgendaTab = "grade" | "eventos" | "solicitacoes";

/** Orquestra abas, turma selecionada e os modais de alteração de horário. */
export function AgendaBoard() {
  const viewer = useViewer();
  const { toast } = useToast();

  const turmas = turmasVisiveis(viewer);
  const pendentes = solicitacoesPendentes(viewer.data);

  const [tab, setTab] = useState<AgendaTab>("grade");
  const [turmaSelecionada, setTurmaSelecionada] = useState<string | null>(null);
  const [solicitando, setSolicitando] = useState(false);
  const [rejeitando, setRejeitando] = useState<string | null>(null);

  const turma = turmas.find((item) => item.id === turmaSelecionada) ?? turmas[0];

  const abas: ReadonlyArray<TabItem<AgendaTab>> = [
    { id: "grade", label: "Grade horária" },
    { id: "eventos", label: "Eventos" },
    { id: "solicitacoes", label: "Solicitações", count: pendentes.length },
  ];

  const abrirSolicitacao = () => {
    if (!turma) {
      toast("Sem turma para solicitar alteração.", "warn");
      return;
    }
    if (!gradeDaTurma(viewer.data, turma.id).length) {
      toast("A turma não possui grade horária ativa.", "warn");
      return;
    }
    setSolicitando(true);
  };

  return (
    <>
      <AgendaHeader onRequestChange={abrirSolicitacao} />

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <Tabs items={abas} value={tab} onChange={setTab} label="Seções da agenda" />

        {tab === "grade" && turmas.length > 1 ? (
          <Select
            aria-label="Turma"
            className="w-auto"
            value={turma?.id ?? ""}
            onChange={(event) => setTurmaSelecionada(event.target.value)}
          >
            {turmas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.codigo} · {item.componente}
              </option>
            ))}
          </Select>
        ) : null}
      </div>

      {tab === "grade" ? (
        <GradePanel turma={turma} />
      ) : tab === "eventos" ? (
        <EventosPanel />
      ) : (
        <SolicitacoesPanel onReject={setRejeitando} />
      )}

      {solicitando && turma ? (
        <SolicitacaoModal
          turmaId={turma.id}
          onClose={() => setSolicitando(false)}
          onSuccess={() => {
            setSolicitando(false);
            setTab("solicitacoes");
          }}
        />
      ) : null}

      {rejeitando ? <RejeicaoModal solicitacaoId={rejeitando} onClose={() => setRejeitando(null)} /> : null}
    </>
  );
}