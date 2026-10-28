"use client";

import { useMemo } from "react";
import * as avaliacoes from "@/features/avaliacoes/mutations";
import type { AvaliacaoInput } from "@/features/avaliacoes/schemas";
import type { EnvioTentativaResult, RespostasTentativa } from "@/features/avaliacoes/types";
import { useToast } from "@/providers/toast-provider";
import { useAppStore } from "@/store/app-store";
import type { AppData, MutationResult } from "@/types/domain";

/**
 * Ações de escrita do módulo de avaliações. As regras estão em `mutations.ts`;
 * aqui apenas persistimos e avisamos.
 */
export function useAvaliacoesActions() {
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
      /** Cria a avaliação como rascunho (publicação é um passo separado). */
      criarAvaliacao: (input: AvaliacaoInput) =>
        aplicar((draft) => avaliacoes.criarAvaliacao(draft, input), "Avaliação criada como rascunho."),
      /** Edita um rascunho: dados, gestão e questões. */
      atualizarAvaliacao: (avaliacaoId: string, input: AvaliacaoInput) =>
        aplicar(
          (draft) => avaliacoes.atualizarAvaliacao(draft, avaliacaoId, input),
          "Avaliação atualizada.",
        ),
      excluirAvaliacao: (avaliacaoId: string) =>
        aplicar((draft) => avaliacoes.excluirAvaliacao(draft, avaliacaoId), "Rascunho excluído."),
      publicar: (avaliacaoId: string) =>
        aplicar((draft) => avaliacoes.publicarAvaliacao(draft, avaliacaoId), "Avaliação publicada."),
      encerrar: (avaliacaoId: string) =>
        aplicar((draft) => avaliacoes.encerrarAvaliacao(draft, avaliacaoId), "Avaliação encerrada."),

      enviarTentativa: ({
        avaliacaoId,
        matriculaId,
        respostas,
      }: {
        avaliacaoId: string;
        matriculaId: string;
        respostas: RespostasTentativa;
      }): EnvioTentativaResult => {
        const caixa: { valor: MutationResult & { pontuacao?: number } } = { valor: { ok: true } };
        mutate((draft) => {
          caixa.valor = avaliacoes.enviarTentativa(draft, { avaliacaoId, matriculaId, respostas });
        });

        if (!caixa.valor.ok) return { ok: false, error: caixa.valor.error };
        toast(`Tentativa enviada. Nota: ${(caixa.valor.pontuacao ?? 0).toFixed(1)}/10.`, "success");
        return { ok: true, pontuacao: caixa.valor.pontuacao ?? 0 };
      },
    };
  }, [mutate, toast]);
}