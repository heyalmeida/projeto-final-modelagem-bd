import { isAdmin, isRoot } from "@/lib/auth";
import type { AppData, Evento, GradeHoraria, SolicitacaoAlteracao, Viewer } from "@/types/domain";

/** Grade, eventos e solicitações de alteração. */

/** Todas as entradas da turma, incluindo as inativadas (histórico da grade). */
export const entradasDaTurma = (data: AppData, turmaId: string): GradeHoraria[] =>
  data.grade.filter((entrada) => entrada.turmaId === turmaId);

export const gradeDaTurma = (data: AppData, turmaId: string): GradeHoraria[] =>
  data.grade.filter((entrada) => entrada.turmaId === turmaId && entrada.status === "ATIVA");

export const gradeEntryById = (data: AppData, id: string): GradeHoraria | undefined =>
  data.grade.find((entrada) => entrada.id === id);

export const eventosOrdenados = (data: AppData): Evento[] =>
  [...data.eventos].sort((a, b) => String(a.inicio).localeCompare(String(b.inicio)));

export const solicitacoesPendentes = (data: AppData): SolicitacaoAlteracao[] =>
  data.solicitacoes.filter((solicitacao) => solicitacao.status === "PENDENTE");

/** Root e administradores veem todas as solicitações; os demais, apenas as próprias. */
export function solicitacoesVisiveis(viewer: Viewer): SolicitacaoAlteracao[] {
  if (isRoot(viewer.user) || isAdmin(viewer.user)) return viewer.data.solicitacoes;
  return viewer.data.solicitacoes.filter((solicitacao) => solicitacao.solicitanteId === viewer.user.id);
}

export const solicitacoesOrdenadas = (solicitacoes: SolicitacaoAlteracao[]): SolicitacaoAlteracao[] =>
  [...solicitacoes].sort((a, b) => String(b.data).localeCompare(String(a.data)));