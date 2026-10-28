import {
  avaliacaoSchema,
  tentativaSchema,
  type AvaliacaoInput,
} from "@/features/avaliacoes/schemas";
import { avaliacaoAberta, limiteTentativas, tentativasDa } from "@/features/avaliacoes/selectors";
import { createId } from "@/lib/utils";
import type { AppData, Avaliacao, MutationResult } from "@/types/domain";

/**
 * Mutações do módulo de avaliações: criação/edição de avaliações, ciclo de
 * publicação e registro de tentativas. Funções puras sobre o rascunho.
 */

function montar(draft: AppData, input: AvaliacaoInput, id: string): Avaliacao {
  const turma = draft.turmas.find((item) => item.id === input.turmaId);
  return {
    id,
    turmaId: input.turmaId,
    professorId: turma?.professorId ?? "",
    titulo: input.titulo,
    tipo: input.tipo,
    peso: input.peso,
    status: "RASCUNHO",
    inicio: input.inicio,
    fim: input.fim,
    gestao: {
      maxTentativas: input.maxTentativas,
      permiteRecuperacao: input.permiteRecuperacao,
      pesoRecuperacao: input.permiteRecuperacao ? input.pesoRecuperacao : 0,
      divulgadaEm: null,
    },
    questoes: input.questoes.map((questao, indice) => ({
      id: `q-${id}-${indice + 1}`,
      enunciado: questao.enunciado,
      alternativas: questao.alternativas,
      correta: questao.correta,
      pontos: questao.pontos,
    })),
  };
}

export function criarAvaliacao(draft: AppData, input: AvaliacaoInput): MutationResult {
  const parsed = avaliacaoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Avaliação inválida." };

  const turma = draft.turmas.find((item) => item.id === parsed.data.turmaId);
  if (!turma) return { ok: false, error: "Turma não encontrada." };

  const id = createId("av");
  draft.avaliacoes.push(montar(draft, parsed.data, id));
  return { ok: true };
}

/** Só rascunhos podem ser editados: publicadas e encerradas são imutáveis. */
export function atualizarAvaliacao(draft: AppData, avaliacaoId: string, input: AvaliacaoInput): MutationResult {
  const atual = draft.avaliacoes.find((item) => item.id === avaliacaoId);
  if (!atual) return { ok: false, error: "Avaliação não encontrada." };
  if (atual.status !== "RASCUNHO") return { ok: false, error: "Somente rascunhos podem ser editados." };

  const parsed = avaliacaoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Avaliação inválida." };

  const turma = draft.turmas.find((item) => item.id === parsed.data.turmaId);
  if (!turma) return { ok: false, error: "Turma não encontrada." };

  const novo = montar(draft, parsed.data, avaliacaoId);
  novo.status = "RASCUNHO";
  novo.gestao.divulgadaEm = atual.gestao.divulgadaEm;

  const indice = draft.avaliacoes.findIndex((item) => item.id === avaliacaoId);
  if (indice >= 0) draft.avaliacoes[indice] = novo;
  return { ok: true };
}

/** Exclusão restrita a rascunhos, que não possuem tentativas. */
export function excluirAvaliacao(draft: AppData, avaliacaoId: string): MutationResult {
  const avaliacao = draft.avaliacoes.find((item) => item.id === avaliacaoId);
  if (!avaliacao) return { ok: false, error: "Avaliação não encontrada." };
  if (avaliacao.status !== "RASCUNHO") return { ok: false, error: "Somente rascunhos podem ser excluídos." };

  draft.avaliacoes = draft.avaliacoes.filter((item) => item.id !== avaliacaoId);
  return { ok: true };
}

export function publicarAvaliacao(draft: AppData, avaliacaoId: string): MutationResult {
  const avaliacao = draft.avaliacoes.find((item) => item.id === avaliacaoId);
  if (!avaliacao) return { ok: false, error: "Avaliação não encontrada." };
  if (!avaliacao.questoes.length) {
    return { ok: false, error: "Inclua pelo menos uma questão antes de publicar." };
  }
  avaliacao.status = "PUBLICADA";
  return { ok: true };
}

export function encerrarAvaliacao(draft: AppData, avaliacaoId: string): MutationResult {
  const avaliacao = draft.avaliacoes.find((item) => item.id === avaliacaoId);
  if (!avaliacao) return { ok: false, error: "Avaliação não encontrada." };
  avaliacao.status = "ENCERRADA";
  return { ok: true };
}

export interface EnvioTentativaInput {
  avaliacaoId: string;
  matriculaId: string;
  respostas: Record<string, number>;
}

/** Registra a tentativa do aluno e calcula a nota pelas questões corretas. */
export function enviarTentativa(draft: AppData, input: EnvioTentativaInput): MutationResult & { pontuacao?: number } {
  const parsed = tentativaSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Tentativa inválida." };

  const avaliacao = draft.avaliacoes.find((item) => item.id === input.avaliacaoId);
  const matricula = draft.matriculas.find((item) => item.id === input.matriculaId);
  if (!avaliacao || !matricula) return { ok: false, error: "Não foi possível registrar a tentativa." };

  const semResposta = avaliacao.questoes.some((questao) => parsed.data.respostas[questao.id] === undefined);
  if (semResposta) return { ok: false, error: "Responda todas as questões antes de enviar." };

  const anteriores = tentativasDa(draft, avaliacao.id, input.matriculaId);
  const maximo = limiteTentativas(avaliacao);
  if (anteriores.length >= maximo) return { ok: false, error: "Limite de tentativas atingido." };
  if (!avaliacaoAberta(avaliacao)) return { ok: false, error: "A avaliação está fora da janela de tentativa." };

  const pontuacao = avaliacao.questoes.reduce(
    (soma, questao) => soma + (parsed.data.respostas[questao.id] === questao.correta ? Number(questao.pontos) : 0),
    0,
  );
  const agora = new Date();

  draft.tentativas.push({
    id: createId("tt"),
    avaliacaoId: avaliacao.id,
    matriculaId: input.matriculaId,
    numero: anteriores.length + 1,
    inicio: new Date(agora.getTime() - 20 * 60000).toISOString(),
    fim: agora.toISOString(),
    status: "FINALIZADA",
    pontuacao: Math.round(pontuacao * 10) / 10,
    respostas: parsed.data.respostas,
  });

  return { ok: true, pontuacao };
}