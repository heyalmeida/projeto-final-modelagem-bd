"use client";

import { useMemo } from "react";
import * as acesso from "@/features/acesso/mutations";
import type { UsuarioInput } from "@/features/acesso/schemas";
import { useToast } from "@/providers/toast-provider";
import { useAppStore } from "@/store/app-store";
import type { AppData, ModuleId, MutationResult } from "@/types/domain";

/** Ações administrativas do núcleo de acesso. */
export function useAcessoActions() {
  const { mutate, resetData } = useAppStore();
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
      /** Liga/desliga um módulo para um grupo (matriz grupo × módulo). */
      alternarModulo: (grupoId: string, moduloId: ModuleId) =>
        aplicar((draft) => acesso.alternarModulo(draft, grupoId, moduloId), "Matriz de módulos atualizada."),
      /** Cria um usuário de demonstração vinculado a um grupo. */
      criarUsuario: (input: UsuarioInput) =>
        aplicar((draft) => acesso.criarUsuario(draft, input), "Usuário criado."),
      /** Volta a base de demonstração ao estado original. */
      restaurarDemo: () => {
        resetData();
        toast("Dados da demonstração restaurados.", "success");
      },
    };
  }, [mutate, resetData, toast]);
}