"use client";

import { useMemo } from "react";
import * as presenca from "@/features/presenca/mutations";
import type { SessaoInput } from "@/features/presenca/schemas";
import type { ChamadaResult } from "@/features/presenca/schemas";
import { useToast } from "@/providers/toast-provider";
import { useAppStore } from "@/store/app-store";
import type { AppData, MutationResult } from "@/types/domain";

/** Ações de escrita do módulo de presença. A regra vive em `mutations.ts`. */
export function usePresencaActions() {
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
      /** Cria uma sessão de aula com a chamada já aberta. */
      criarSessao: (input: SessaoInput) =>
        aplicar((draft) => presenca.criarSessao(draft, input), "Sessão criada com chamada aberta."),
      /** Reabre ou encerra a sessão selecionada. */
      alternarSessao: (sessaoId: string) => {
        const caixa: { valor: MutationResult; status: "ABERTA" | "ENCERRADA" } = {
          valor: { ok: true },
          status: "ABERTA",
        };
        mutate((draft) => {
          caixa.valor = presenca.alternarSessao(draft, sessaoId);
          const sessao = draft.sessoes.find((item) => item.id === sessaoId);
          if (sessao) caixa.status = sessao.status;
        });
        if (caixa.valor.ok) {
          toast(caixa.status === "ABERTA" ? "Sessão reaberta." : "Sessão encerrada.", "success");
        } else {
          toast(caixa.valor.error, "warn");
        }
        return caixa.valor;
      },
      /** Salva a chamada com status e justificativa por matrícula. */
      salvarChamada: ({
        sessaoId,
        registros,
        usuarioId,
      }: {
        sessaoId: string;
        registros: Array<{ matriculaId: string; status: "PRESENTE" | "AUSENTE" | "JUSTIFICADO"; justificativa: string }>;
        usuarioId: string;
      }): ChamadaResult => {
        const caixa: { valor: MutationResult } = { valor: { ok: true } };
        mutate((draft) => {
          caixa.valor = presenca.salvarChamada(draft, { sessaoId, registros, usuarioId });
        });
        if (caixa.valor.ok) {
          toast("Chamada salva.", "success");
          return { ok: true };
        }
        toast(caixa.valor.error, "warn");
        return { ok: false, error: caixa.valor.error };
      },
    };
  }, [mutate, toast]);
}