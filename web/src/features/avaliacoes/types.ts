/** Abas da página de avaliações. */
export type AvaliacoesTab = "avaliacoes" | "tentativas";

/** Resultado de uma submissão de tentativa — erro de regra é dado, não exceção. */
export type EnvioTentativaResult =
  | { ok: true; pontuacao: number }
  | { ok: false; error: string };

/** Respostas por questão, no formato enviado pelo formulário. */
export type RespostasTentativa = Record<string, number>;