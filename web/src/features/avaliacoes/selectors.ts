import { siteConfig } from "@/config/site";
import { matriculaDoAlunoNaTurma, minhasMatriculas, minhasTurmas } from "@/features/core/selectors";
import { isStudent, isStaff, isTeacher } from "@/lib/auth";
import type { Avaliacao, AppData, Tentativa, Viewer } from "@/types/domain";

/** Regras de visibilidade, janela de tentativa e cálculo de notas. */

const TODAY = new Date(siteConfig.today);

export function avaliacoesVisiveis(viewer: Viewer): Avaliacao[] {
  const turmas = minhasTurmas(viewer);
  return viewer.data.avaliacoes
    .filter((avaliacao) => turmas.includes(avaliacao.turmaId))
    .sort((a, b) => String(a.fim).localeCompare(String(b.fim)));
}

/** Avaliação publicada e dentro da janela de tentativa. */
export function avaliacaoAberta(avaliacao: Avaliacao): boolean {
  return (
    avaliacao.status === "PUBLICADA" &&
    new Date(avaliacao.inicio) <= TODAY &&
    new Date(avaliacao.fim) >= TODAY
  );
}

export const avaliacoesAbertas = (viewer: Viewer): Avaliacao[] =>
  avaliacoesVisiveis(viewer).filter(avaliacaoAberta);

export function tentativasDa(data: AppData, avaliacaoId: string, matriculaId?: string | null): Tentativa[] {
  return data.tentativas
    .filter((tentativa) => tentativa.avaliacaoId === avaliacaoId && (!matriculaId || tentativa.matriculaId === matriculaId))
    .sort((a, b) => b.numero - a.numero);
}

export function ultimaTentativa(data: AppData, avaliacaoId: string, matriculaId: string): Tentativa | null {
  return tentativasDa(data, avaliacaoId, matriculaId)[0] ?? null;
}

export function mediaAvaliacao(data: AppData, avaliacaoId: string): number | null {
  const tentativas = tentativasDa(data, avaliacaoId);
  if (!tentativas.length) return null;
  return tentativas.reduce((soma, tentativa) => soma + Number(tentativa.pontuacao), 0) / tentativas.length;
}

/** Média ponderada do aluno: nota da última tentativa × peso da avaliação. */
export function mediaDoAluno(viewer: Viewer): number | null {
  let peso = 0;
  let soma = 0;
  minhasMatriculas(viewer).forEach((matricula) => {
    avaliacoesVisiveis(viewer).forEach((avaliacao) => {
      if (avaliacao.turmaId !== matricula.turmaId) return;
      const tentativa = ultimaTentativa(viewer.data, avaliacao.id, matricula.id);
      if (!tentativa) return;
      peso += Number(avaliacao.peso);
      soma += Number(tentativa.pontuacao) * Number(avaliacao.peso);
    });
  });
  return peso ? soma / peso : null;
}

/** Média das médias das avaliações do recorte (visão de gestão). */
export function mediaGeral(viewer: Viewer): number | null {
  const valores = avaliacoesVisiveis(viewer)
    .map((avaliacao) => mediaAvaliacao(viewer.data, avaliacao.id))
    .filter((valor): valor is number => valor !== null);
  if (!valores.length) return null;
  return valores.reduce((a, b) => a + b, 0) / valores.length;
}

/** Tentativas do próprio aluno, da mais recente para a mais antiga. */
export function minhasTentativas(viewer: Viewer): Tentativa[] {
  const matriculas = minhasMatriculas(viewer).map((matricula) => matricula.id);
  return viewer.data.tentativas
    .filter((tentativa) => matriculas.includes(tentativa.matriculaId))
    .sort((a, b) => String(b.fim).localeCompare(String(a.fim)));
}

/** Tentativas das avaliações no recorte do professor/coordenação. */
export function tentativasDoRecorte(viewer: Viewer): Tentativa[] {
  const avaliacoes = avaliacoesVisiveis(viewer).map((avaliacao) => avaliacao.id);
  return viewer.data.tentativas
    .filter((tentativa) => avaliacoes.includes(tentativa.avaliacaoId))
    .sort((a, b) => String(b.fim).localeCompare(String(a.fim)));
}

export const limiteTentativas = (avaliacao: Avaliacao): number => avaliacao.gestao?.maxTentativas ?? 1;

export interface MediaPorAvaliacao {
  id: string;
  label: string;
  media: number;
}

/** Média das tentativas por avaliação (gráfico da visão de gestão). */
export function mediasPorAvaliacao(viewer: Viewer): MediaPorAvaliacao[] {
  return avaliacoesVisiveis(viewer)
    .map((avaliacao) => ({
      id: avaliacao.id,
      label: viewer.data.turmas.find((turma) => turma.id === avaliacao.turmaId)?.codigo ?? avaliacao.titulo,
      media: mediaAvaliacao(viewer.data, avaliacao.id),
    }))
    .filter((item): item is MediaPorAvaliacao & { media: number } => item.media !== null)
    .slice(0, 6);
}

/** Matrícula do aluno na turma da avaliação (null quando não se aplica). */
export function matriculaDaAvaliacao(viewer: Viewer, avaliacao: Avaliacao) {
  return matriculaDoAlunoNaTurma(viewer, avaliacao.turmaId);
}

export interface ResumoAvaliacoes {
  /** Visão de gestão (professor, coordenação, secretaria, root). */
  modoGestao: boolean;
  total: number;
  abertas: number;
  publicadas: number;
  tentativas: number;
  media: number | null;
  minhasTentativas: number;
  minhaMedia: number | null;
}

export function resumoAvaliacoes(viewer: Viewer): ResumoAvaliacoes {
  const visiveis = avaliacoesVisiveis(viewer);
  const modoGestao = isStaff(viewer.user) || isTeacher(viewer.user);
  return {
    modoGestao,
    total: visiveis.length,
    abertas: visiveis.filter(avaliacaoAberta).length,
    publicadas: visiveis.filter((avaliacao) => avaliacao.status === "PUBLICADA").length,
    tentativas: viewer.data.tentativas.length,
    media: modoGestao ? mediaGeral(viewer) : null,
    minhasTentativas: minhasTentativas(viewer).length,
    minhaMedia: isStudent(viewer.user) ? mediaDoAluno(viewer) : null,
  };
}