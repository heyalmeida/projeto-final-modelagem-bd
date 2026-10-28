import type { HorarioInput, EventoInput, RejeicaoInput, SolicitacaoInput } from "@/features/agenda/schemas";
import { eventoSchema, horarioSchema, rejeicaoSchema, solicitacaoSchema } from "@/features/agenda/schemas";
import { turmaById } from "@/features/core/selectors";
import { createId } from "@/lib/utils";
import type { AppData, GradeHoraria, MutationResult } from "@/types/domain";

/**
 * Mutações de agenda. Funções puras: recebem o rascunho do estado, validam a
 * regra e alteram o rascunho. Os hooks só persistem e exibem os avisos.
 */

interface AlvoHorario {
  turmaId: string;
  professorId: string;
  dia: string;
  inicio: string;
  fim: string;
  ignoreId?: string;
}

/** Choque de horário para a turma e para o professor na mesma janela. */
export function conflitosDeHorario(data: AppData, alvo: AlvoHorario): GradeHoraria[] {
  return data.grade.filter(
    (entrada) =>
      entrada.id !== alvo.ignoreId &&
      entrada.status === "ATIVA" &&
      entrada.dia === alvo.dia &&
      (entrada.turmaId === alvo.turmaId || entrada.professorId === alvo.professorId) &&
      alvo.inicio < entrada.fim &&
      entrada.inicio < alvo.fim,
  );
}

function descrever(data: AppData, entrada: GradeHoraria): string {
  const turma = turmaById(data, entrada.turmaId);
  return `${entrada.componente} (${turma.codigo}) ${entrada.dia} ${entrada.inicio}–${entrada.fim}`;
}

export function criarHorario(
  draft: AppData,
  input: HorarioInput,
  options: { ignoreId?: string } = {},
): MutationResult {
  const parsed = horarioSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Horário inválido." };

  const turma = draft.turmas.find((item) => item.id === input.turmaId);
  if (!turma) return { ok: false, error: "Turma não encontrada." };

  const conflitos = conflitosDeHorario(draft, {
    turmaId: input.turmaId,
    professorId: turma.professorId,
    dia: input.dia,
    inicio: input.inicio,
    fim: input.fim,
    ignoreId: options.ignoreId,
  });


  if (conflitos.length) {
    return { ok: false, error: `Choque de horário com ${descrever(draft, conflitos[0])}.` };
  }

  const horario: GradeHoraria = {
    id: options.ignoreId ?? createId("gr"),
    turmaId: input.turmaId,
    professorId: turma.professorId,
    dia: input.dia,
    inicio: input.inicio,
    fim: input.fim,
    componente: input.componente,
    sala: input.sala,
    vigenciaInicio: input.vigenciaInicio,
    vigenciaFim: input.vigenciaFim,
    status: "ATIVA",
  };

  if (options.ignoreId) {
    const indice = draft.grade.findIndex((entrada) => entrada.id === options.ignoreId);
    if (indice >= 0) draft.grade[indice] = horario;
    return { ok: true };
  }

  draft.grade.push(horario);
  return { ok: true };
}

/** Inativa ou reativa um horário (a grade mantém o histórico). */
export function alternarStatusHorario(draft: AppData, horarioId: string): MutationResult {
  const entrada = draft.grade.find((item) => item.id === horarioId);
  if (!entrada) return { ok: false, error: "Horário não encontrado." };
  entrada.status = entrada.status === "ATIVA" ? "INATIVA" : "ATIVA";
  return { ok: true };
}

export function criarEvento(draft: AppData, input: EventoInput, autorId: string): MutationResult {
  const parsed = eventoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Evento inválido." };

  draft.eventos.push({
    id: createId("ev"),
    turmaId: null,
    professorId: autorId,
    titulo: parsed.data.titulo,
    tipo: parsed.data.tipo,
    inicio: parsed.data.inicio,
    fim: parsed.data.fim,
    local: parsed.data.local,
    publico: parsed.data.publico,
    status: "PUBLICADO",
  });
  return { ok: true };
}

export function excluirEvento(draft: AppData, eventoId: string): MutationResult {
  const indice = draft.eventos.findIndex((item) => item.id === eventoId);
  if (indice < 0) return { ok: false, error: "Evento não encontrado." };
  draft.eventos.splice(indice, 1);
  return { ok: true };
}

/* ---------- solicitações de alteração ---------- */

export function solicitarAlteracao(draft: AppData, input: SolicitacaoInput, solicitanteId: string): MutationResult {
  const parsed = solicitacaoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Solicitação inválida." };

  draft.solicitacoes.push({
    id: createId("sol"),
    gradeId: parsed.data.gradeId,
    solicitanteId,
    aprovadorId: null,
    tipo: parsed.data.tipo,
    justificativa: parsed.data.justificativa,
    data: new Date().toISOString(),
    dataAprovacao: null,
    status: "PENDENTE",
    salaProposta: parsed.data.salaProposta || null,
  });
  return { ok: true };
}

/** Aprovar aplica a mudança na grade (sala proposta ou cancelamento). */
export function aprovarSolicitacao(draft: AppData, solicitacaoId: string, aprovadorId: string): MutationResult {
  const solicitacao = draft.solicitacoes.find((item) => item.id === solicitacaoId);
  if (!solicitacao) return { ok: false, error: "Solicitação não encontrada." };
  if (solicitacao.status !== "PENDENTE") return { ok: false, error: "Esta solicitação já foi analisada." };

  solicitacao.status = "APROVADA";
  solicitacao.aprovadorId = aprovadorId;
  solicitacao.dataAprovacao = new Date().toISOString();

  const entrada = draft.grade.find((item) => item.id === solicitacao.gradeId);
  if (entrada) {
    if (solicitacao.tipo === "NOVO_HORARIO" && solicitacao.salaProposta) entrada.sala = solicitacao.salaProposta;
    if (solicitacao.tipo === "CANCELAMENTO") entrada.status = "INATIVA";
  }
  return { ok: true };
}

export function rejeitarSolicitacao(draft: AppData, input: RejeicaoInput): MutationResult {
  const parsed = rejeicaoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Informe o motivo." };

  const solicitacao = draft.solicitacoes.find((item) => item.id === parsed.data.solicitacaoId);
  if (!solicitacao) return { ok: false, error: "Solicitação não encontrada." };
  if (solicitacao.status !== "PENDENTE") return { ok: false, error: "Esta solicitação já foi analisada." };

  solicitacao.status = "REJEITADA";
  solicitacao.aprovadorId = null;
  solicitacao.motivoRejeicao = parsed.data.motivo;
  solicitacao.dataAprovacao = new Date().toISOString();
  return { ok: true };
}