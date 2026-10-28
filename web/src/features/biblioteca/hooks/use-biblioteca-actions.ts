"use client";

import { useMemo } from "react";
import * as biblioteca from "@/features/biblioteca/mutations";
import type { AcervoInput, ExemplarStatusInput, LivroInput } from "@/features/biblioteca/schemas";
import { useToast } from "@/providers/toast-provider";
import { useAppStore } from "@/store/app-store";
import type { AppData, MutationResult } from "@/types/domain";

/** Ações de escrita da biblioteca. A regra vive em `mutations.ts`. */
export function useBibliotecaActions() {
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
      criarAcervo: (input: AcervoInput, responsavelId: string) =>
        aplicar((draft) => biblioteca.criarAcervo(draft, input, responsavelId), "Acervo criado."),
      criarLivro: (input: LivroInput) =>
        aplicar((draft) => biblioteca.criarLivro(draft, input), "Título catalogado com exemplares."),
      adicionarExemplar: (livroId: string) =>
        aplicar((draft) => biblioteca.adicionarExemplar(draft, livroId), "Exemplar tombado."),
      alternarStatusExemplar: (exemplarId: string, status: ExemplarStatusInput) =>
        aplicar((draft) => biblioteca.alternarStatusExemplar(draft, exemplarId, status), "Situação do exemplar atualizada."),
      /** Registra a busca no histórico (sem aviso quando não há termo). */
      registrarBusca: (input: { usuarioId: string; termo: string; area: string; resultados: number }) => {
        mutate((draft) => {
          biblioteca.registrarBusca(draft, input);
        });
      },
    };
  }, [mutate, toast]);
}