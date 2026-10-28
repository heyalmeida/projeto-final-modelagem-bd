"use client";

import { useState } from "react";
import { useAvaliacoesActions } from "@/features/avaliacoes/hooks/use-avaliacoes-actions";
import type { RespostasTentativa } from "@/features/avaliacoes/types";
import type { Avaliacao } from "@/types/domain";

interface UseTentativaFormArgs {
  avaliacao: Avaliacao;
  matriculaId: string;
  /** Chamado quando a tentativa é persistida com sucesso. */
  onSuccess: () => void;
}

/** Estado e envio do formulário de tentativa. */
export function useTentativaForm({ avaliacao, matriculaId, onSuccess }: UseTentativaFormArgs) {
  const { enviarTentativa } = useAvaliacoesActions();
  const [respostas, setRespostas] = useState<RespostasTentativa>({});
  const [erro, setErro] = useState<string | null>(null);

  const selecionar = (questaoId: string, alternativa: number) => {
    setErro(null);
    setRespostas((atuais) => ({ ...atuais, [questaoId]: alternativa }));
  };

  const enviar = () => {
    const resultado = enviarTentativa({ avaliacaoId: avaliacao.id, matriculaId, respostas });
    if (!resultado.ok) {
      setErro(resultado.error);
      return;
    }
    onSuccess();
  };

  return { respostas, erro, selecionar, enviar };
}