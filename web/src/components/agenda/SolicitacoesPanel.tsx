"use client";

import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SOLICITACAO_TIPO_LABELS } from "@/constants/status";
import { icons } from "@/constants/icons";
import { gradeEntryById, solicitacoesOrdenadas, solicitacoesVisiveis } from "@/features/agenda/selectors";
import { useAgendaActions } from "@/features/agenda/hooks/use-agenda-actions";
import { turmaById, usuarioById } from "@/features/core/selectors";
import { canApproveSchedule } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

interface SolicitacoesPanelProps {
  /** Abre o modal de rejeição com o motivo obrigatório. */
  onReject: (solicitacaoId: string) => void;
}

/** Solicitações de alteração de horário e a aprovação da coordenação. */
export function SolicitacoesPanel({ onReject }: SolicitacoesPanelProps) {
  const viewer = useViewer();
  const { aprovarSolicitacao } = useAgendaActions();
  const solicitacoes = solicitacoesOrdenadas(solicitacoesVisiveis(viewer));
  const podeAprovar = canApproveSchedule(viewer.user, viewer.group);

  const CheckIcon = icons.check;
  const CloseIcon = icons.close;
  const ClockIcon = icons.clock;

  if (!solicitacoes.length) {
    return (
      <Panel>
        <EmptyState icon="agenda" title="Nenhuma solicitação" text="Pedidos de alteração de horário aparecem aqui." />
      </Panel>
    );
  }

  return (
    <Panel>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-lg text-slate-900">Solicitações de alteração</h2>
        <span className="text-[12.5px] text-stone-600">{solicitacoes.length} registro(s)</span>
      </div>

      {solicitacoes.map((solicitacao) => {
        const entrada = gradeEntryById(viewer.data, solicitacao.gradeId);
        const Icon =
          solicitacao.status === "APROVADA" ? CheckIcon : solicitacao.status === "REJEITADA" ? CloseIcon : ClockIcon;

        return (
          <div key={solicitacao.id} className="flex items-start gap-3 border-b border-stone-100 py-3 last:border-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="text-[14px] font-semibold text-slate-800">
                  {SOLICITACAO_TIPO_LABELS[solicitacao.tipo]} · {entrada ? entrada.componente : "—"}
                </div>
                <StatusBadge status={solicitacao.status} />
              </div>
              <div className="text-[12px] text-stone-600">
                {entrada ? turmaById(viewer.data, entrada.turmaId).codigo : "—"} · solicitado por{" "}
                {usuarioById(viewer.data, solicitacao.solicitanteId).nome} em {formatDateTime(solicitacao.data)}
              </div>
              <p className="mt-1 text-[12.5px] text-stone-600">
                {solicitacao.justificativa}
                {solicitacao.salaProposta ? ` · sala proposta: ${solicitacao.salaProposta}` : ""}
                {solicitacao.motivoRejeicao ? ` · motivo: ${solicitacao.motivoRejeicao}` : ""}
              </p>

              {podeAprovar && solicitacao.status === "PENDENTE" ? (
                <div className="mt-2 flex gap-2">
                  <Button variant="primary" onClick={() => aprovarSolicitacao(solicitacao.id, viewer.user.id)}>
                    <CheckIcon className="h-4 w-4" /> Aprovar
                  </Button>
                  <Button variant="danger" onClick={() => onReject(solicitacao.id)}>
                    <CloseIcon className="h-4 w-4" /> Rejeitar
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </Panel>
  );
}