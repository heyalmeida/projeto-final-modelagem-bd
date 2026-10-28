"use client";

import { useMemo } from "react";
import * as agenda from "@/features/agenda/mutations";
import type { EventoInput, HorarioInput, RejeicaoInput, SolicitacaoInput } from "@/features/agenda/schemas";
import { useToast } from "@/providers/toast-provider";
import { useAppStore } from "@/store/app-store";
import type { AppData, MutationResult } from "@/types/domain";

/**
 * Ações de escrita da agenda. A regra vive em `mutations.ts` (funções puras);
 * aqui só persistimos o rascunho e comunicamos o resultado ao usuário.
 */
export function useAgendaActions() {
  const { mutate } = useAppStore();
  const { toast } = useToast();

  return useMemo(() => {
    const aplicar = (executar: (draft: AppData) => MutationResult, sucesso: string): MutationResult => {
      const caixa: { valor: MutationResult } = { valor: { ok: true } };
      mutate((draft) => {
        caixa.valor = executar(draft);
      });
      if (caixa.valor.ok) {
        toast(sucesso, "success");
      } else {
        toast(caixa.valor.error, "warn");
      }
      return caixa.valor;
    };

    return {
      /** Cria um horário novo na grade, validando choque de horário. */
      criarHorario: (input: HorarioInput) => aplicar((draft) => agenda.criarHorario(draft, input), "Horário incluído na grade."),
      /** Atualiza um horário existente (turma, dia, janela, componente ou sala). */
      atualizarHorario: (horarioId: string, input: HorarioInput) =>
        aplicar((draft) => agenda.criarHorario(draft, input, { ignoreId: horarioId }), "Horário atualizado."),
      /** Inativa ou reativa um horário, mantendo o histórico. */
      alternarHorario: (horarioId: string) =>
        aplicar((draft) => agenda.alternarStatusHorario(draft, horarioId), "Situação do horário atualizada."),
      criarEventoAcademico: (input: EventoInput, autorId: string) =>
        aplicar((draft) => agenda.criarEvento(draft, input, autorId), "Evento publicado na agenda."),
      excluirEventoAcademico: (eventoId: string) =>
        aplicar((draft) => agenda.excluirEvento(draft, eventoId), "Evento removido da agenda."),
      solicitarAlteracao: (input: SolicitacaoInput, solicitanteId: string) =>
        aplicar((draft) => agenda.solicitarAlteracao(draft, input, solicitanteId), "Solicitação enviada para a coordenação."),
      aprovarSolicitacao: (solicitacaoId: string, aprovadorId: string) =>
        aplicar(
          (draft) => agenda.aprovarSolicitacao(draft, solicitacaoId, aprovadorId),
          "Solicitação aprovada e agenda atualizada.",
        ),
      rejeitarSolicitacao: (input: RejeicaoInput) =>
        aplicar((draft) => agenda.rejeitarSolicitacao(draft, input), "Solicitação rejeitada."),
    };
  }, [mutate, toast]);
}