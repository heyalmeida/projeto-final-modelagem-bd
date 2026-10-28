"use client";

import { useMemo } from "react";
import * as financeiro from "@/features/financeiro/mutations";
import type { LancamentoInput } from "@/features/financeiro/schemas";
import type { PagamentoResult } from "@/features/financeiro/schemas";
import { useToast } from "@/providers/toast-provider";
import { useAppStore } from "@/store/app-store";
import type { AppData, MutationResult } from "@/types/domain";

interface RegistrarPagamentoInput {
  mensalidadeId: string;
  metodoId: string;
  /** Valor informado no formulário (string do input number). */
  valor: string;
  usuarioId: string;
}

/** Ações de escrita do financeiro. A regra vive em `mutations.ts`. */
export function useFinanceiroActions() {
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
      /** Lança uma cobrança nova para uma matrícula. */
      lancarMensalidade: (input: LancamentoInput) =>
        aplicar((draft) => financeiro.lancarMensalidade(draft, input), "Cobrança lançada."),

      /** Registra baixa total ou parcial de uma mensalidade. */
      registrarPagamento: ({
        mensalidadeId,
        metodoId,
        valor,
        usuarioId,
      }: RegistrarPagamentoInput): PagamentoResult => {
        const valorNumerico = Number(valor);
        if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
          return { ok: false, error: "Informe um valor maior que zero." };
        }

        const caixa: { valor: MutationResult } = { valor: { ok: true } };
        mutate((draft) => {
          caixa.valor = financeiro.registrarPagamento(draft, {
            mensalidadeId,
            metodoId,
            valor: valorNumerico,
            usuarioId,
          });
        });

        if (!caixa.valor.ok) {
          toast(caixa.valor.error, "warn");
          return { ok: false, error: caixa.valor.error };
        }

        toast(`Pagamento registrado com sucesso.`, "success");
        return { ok: true, valor: valorNumerico };
      },

      /** Estorna uma baixa confirmada; o saldo volta a ficar em aberto. */
      estornarPagamento: (pagamentoId: string) =>
        aplicar((draft) => financeiro.estornarPagamento(draft, { pagamentoId }), "Pagamento estornado."),
    };
  }, [mutate, toast]);
}