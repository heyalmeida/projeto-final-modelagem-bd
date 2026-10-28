import { minhasMatriculas, minhasTurmas } from "@/features/core/selectors";
import type { AppData, RegistroPresenca, Sessao, Viewer } from "@/types/domain";

/** Frequência, chamadas e o recorte de sessões do usuário. */

export function sessoesVisiveis(viewer: Viewer): Sessao[] {
  const turmas = minhasTurmas(viewer);
  return viewer.data.sessoes
    .filter((sessao) => turmas.includes(sessao.turmaId))
    .sort((a, b) => String(b.data).localeCompare(String(a.data)));
}

export const registrosDaSessao = (data: AppData, sessaoId: string): RegistroPresenca[] =>
  data.registros.filter((registro) => registro.sessaoId === sessaoId);

/** Percentual de presença (presenças + justificativas) de uma matrícula. */
export function frequenciaDaMatricula(data: AppData, matriculaId: string): number | null {
  const registros = data.registros.filter((registro) => registro.matriculaId === matriculaId);
  if (!registros.length) return null;
  const validos = registros.filter(
    (registro) => registro.status === "PRESENTE" || registro.status === "JUSTIFICADO",
  ).length;
  return Math.round((validos / registros.length) * 100);
}

export function frequenciaDoAluno(viewer: Viewer): number | null {
  const valores = minhasMatriculas(viewer)
    .map((matricula) => frequenciaDaMatricula(viewer.data, matricula.id))
    .filter((valor): valor is number => valor !== null);
  if (!valores.length) return null;
  return Math.round(valores.reduce((a, b) => a + b, 0) / valores.length);
}

export function frequenciaGeral(data: AppData): number | null {
  const valores = data.matriculas
    .map((matricula) => frequenciaDaMatricula(data, matricula.id))
    .filter((valor): valor is number => valor !== null);
  if (!valores.length) return null;
  return Math.round(valores.reduce((a, b) => a + b, 0) / valores.length);
}

export interface ResumoSessao {
  presentes: number;
  ausentes: number;
  justificados: number;
  matriculas: number;
  mediaTurma: number | null;
}

export function resumoSessao(
  data: AppData,
  matriculas: Array<{ id: string }>,
  registros: RegistroPresenca[],
): ResumoSessao {
  const frequencias = matriculas
    .map((matricula) => frequenciaDaMatricula(data, matricula.id))
    .filter((valor): valor is number => valor !== null);

  return {
    presentes: registros.filter((registro) => registro.status === "PRESENTE").length,
    ausentes: registros.filter((registro) => registro.status === "AUSENTE").length,
    justificados: registros.filter((registro) => registro.status === "JUSTIFICADO").length,
    matriculas: matriculas.length,
    mediaTurma: frequencias.length
      ? Math.round(frequencias.reduce((a, b) => a + b, 0) / frequencias.length)
      : null,
  };
}

export interface RegistroDoAluno {
  registro: RegistroPresenca;
  sessao: Sessao | null;
}

/** Histórico do aluno, da sessão mais recente para a mais antiga. */
export function registrosDoAluno(viewer: Viewer): RegistroDoAluno[] {
  const matriculas = minhasMatriculas(viewer).map((matricula) => matricula.id);
  return viewer.data.registros
    .filter((registro) => matriculas.includes(registro.matriculaId))
    .map((registro) => ({
      registro,
      sessao: viewer.data.sessoes.find((sessao) => sessao.id === registro.sessaoId) ?? null,
    }))
    .sort((a, b) => String(b.sessao?.data ?? "").localeCompare(String(a.sessao?.data ?? "")));
}