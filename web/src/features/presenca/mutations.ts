import { chamadaSchema, sessaoSchema, type SessaoInput } from "@/features/presenca/schemas";
import type { ChamadaInput } from "@/features/presenca/schemas";
import { createId } from "@/lib/utils";
import type { AppData, MutationResult } from "@/types/domain";

/**
 * Mutações do módulo de presença: criação de sessões, abertura/encerramento e
 * gravação da chamada.
 */

export function criarSessao(draft: AppData, input: SessaoInput): MutationResult {
  const parsed = sessaoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Sessão inválida." };

  const turma = draft.turmas.find((item) => item.id === parsed.data.turmaId);
  if (!turma) return { ok: false, error: "Turma não encontrada." };

  const duplicada = draft.sessoes.some(
    (sessao) =>
      sessao.turmaId === parsed.data.turmaId &&
      sessao.data === parsed.data.data &&
      sessao.inicio === parsed.data.inicio,
  );
  if (duplicada) return { ok: false, error: "Já existe sessão desta turma nessa data e horário." };

  draft.sessoes.push({
    id: createId("s"),
    turmaId: parsed.data.turmaId,
    professorId: turma.professorId,
    data: parsed.data.data,
    inicio: parsed.data.inicio,
    fim: parsed.data.fim,
    tema: parsed.data.tema,
    status: "ABERTA",
  });
  return { ok: true };
}

/** Reabre ou encerra a sessão. */
export function alternarSessao(draft: AppData, sessaoId: string): MutationResult {
  const sessao = draft.sessoes.find((item) => item.id === sessaoId);
  if (!sessao) return { ok: false, error: "Sessão não encontrada." };
  sessao.status = sessao.status === "ABERTA" ? "ENCERRADA" : "ABERTA";
  return { ok: true };
}

export interface ChamadaEntrada {
  matriculaId: string;
  status: "PRESENTE" | "AUSENTE" | "JUSTIFICADO";
  justificativa: string;
}

/** Grava a chamada de uma sessão aberta, com justificativa obrigatória. */
export function salvarChamada(
  draft: AppData,
  input: ChamadaInput & { usuarioId: string },
): MutationResult {
  const parsed = chamadaSchema.safeParse({ sessaoId: input.sessaoId, registros: input.registros });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Chamada inválida." };

  const sessao = draft.sessoes.find((item) => item.id === input.sessaoId);
  if (!sessao) return { ok: false, error: "Sessão não encontrada." };
  if (sessao.status !== "ABERTA") return { ok: false, error: "Reabra a sessão para editar a chamada." };

  const agora = new Date().toISOString();
  parsed.data.registros.forEach((entrada) => {
    const existente = draft.registros.find(
      (registro) => registro.sessaoId === input.sessaoId && registro.matriculaId === entrada.matriculaId,
    );
    if (existente) {
      existente.status = entrada.status;
      existente.justificativa = entrada.justificativa;
      existente.registradoEm = agora;
      existente.usuarioId = input.usuarioId;
      return;
    }
    draft.registros.push({
      id: `reg-${Date.now()}-${entrada.matriculaId}`,
      sessaoId: input.sessaoId,
      matriculaId: entrada.matriculaId,
      usuarioId: input.usuarioId,
      status: entrada.status,
      justificativa: entrada.justificativa,
      registradoEm: agora,
    });
  });

  return { ok: true };
}