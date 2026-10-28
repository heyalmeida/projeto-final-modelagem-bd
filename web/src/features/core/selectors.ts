import { isStudent, isTeacher } from "@/lib/auth";
import type { Aluno, AppData, Grupo, Matricula, Modulo, Professor, Turma, Usuario, Viewer } from "@/types/domain";

/**
 * Núcleo acadêmico compartilhado: lookups e o recorte de turmas/matrículas
 * visíveis para o usuário logado. Todo módulo parte daqui.
 */

const TURMA_VAZIA: Turma = {
  id: "",
  codigo: "—",
  cursoId: "",
  professorId: "",
  componente: "—",
  periodo: "—",
  turno: "—",
  vagas: 0,
  status: "Ativa",
};

const ALUNO_VAZIO: Aluno = { id: "", nome: "—", ra: "—", cursoId: "", usuarioId: null, situacao: "—" };
const PROFESSOR_VAZIO: Professor = { id: "", nome: "—", siape: "—", titulacao: "—", area: "—", usuarioId: null };
const GRUPO_VAZIO: Grupo = { id: "", nome: "—", papel: "USUARIO", modulos: [] };
const USUARIO_VAZIO: Usuario = {
  id: "",
  nome: "—",
  login: "—",
  grupoId: "",
  papel: "USUARIO",
  perfil: "servidor",
  email: "—",
};

export const moduleById = (data: AppData, id: string): Modulo | undefined =>
  data.modulos.find((modulo) => modulo.id === id);

export const turmaById = (data: AppData, id: string): Turma =>
  data.turmas.find((turma) => turma.id === id) ?? TURMA_VAZIA;

export const alunoById = (data: AppData, id: string): Aluno =>
  data.alunos.find((aluno) => aluno.id === id) ?? ALUNO_VAZIO;

export const professorById = (data: AppData, id: string): Professor =>
  data.professores.find((professor) => professor.id === id) ?? PROFESSOR_VAZIO;

export const grupoById = (data: AppData, id: string): Grupo =>
  data.grupos.find((grupo) => grupo.id === id) ?? GRUPO_VAZIO;

export const usuarioById = (data: AppData, id: string): Usuario =>
  data.usuarios.find((usuario) => usuario.id === id) ?? USUARIO_VAZIO;

/** Aluno vinculado ao usuário logado (apenas perfis de aluno). */
export function studentOf(viewer: Viewer): Aluno | null {
  const { data, user } = viewer;
  return user.alunoId ? (data.alunos.find((aluno) => aluno.id === user.alunoId) ?? null) : null;
}

/** Professor vinculado ao usuário logado (apenas perfis de professor). */
export function teacherOf(viewer: Viewer): Professor | null {
  const { data, user } = viewer;
  return user.professorId ? (data.professores.find((professor) => professor.id === user.professorId) ?? null) : null;
}

export function minhasMatriculas(viewer: Viewer): Matricula[] {
  const aluno = studentOf(viewer);
  if (!aluno) return [];
  return viewer.data.matriculas.filter((matricula) => matricula.alunoId === aluno.id);
}

/**
 * IDs das turmas no recorte do usuário:
 * aluno → turmas em que está matriculado; professor → turmas que leciona;
 * servidores/root → todas.
 */
export function minhasTurmas(viewer: Viewer): string[] {
  const { data } = viewer;
  if (isStudent(viewer.user)) return minhasMatriculas(viewer).map((matricula) => matricula.turmaId);
  if (isTeacher(viewer.user)) {
    const professor = teacherOf(viewer);
    return professor
      ? data.turmas.filter((turma) => turma.professorId === professor.id).map((turma) => turma.id)
      : [];
  }
  return data.turmas.map((turma) => turma.id);
}

export const turmasVisiveis = (viewer: Viewer): Turma[] => {
  const ids = minhasTurmas(viewer);
  return viewer.data.turmas.filter((turma) => ids.includes(turma.id));
};

export const matriculasDaTurma = (data: AppData, turmaId: string): Matricula[] =>
  data.matriculas.filter((matricula) => matricula.turmaId === turmaId);

/** Matrícula do aluno logado em uma turma específica. */
export function matriculaDoAlunoNaTurma(viewer: Viewer, turmaId: string): Matricula | null {
  const aluno = studentOf(viewer);
  if (!aluno) return null;
  return (
    viewer.data.matriculas.find((matricula) => matricula.alunoId === aluno.id && matricula.turmaId === turmaId) ??
    null
  );
}

/** Matrícula + aluno para tabelas que exibem o nome do estudante. */
export function alunoDaMatricula(data: AppData, matriculaId: string): { matricula: Matricula; aluno: Aluno } | null {
  const matricula = data.matriculas.find((item) => item.id === matriculaId);
  if (!matricula) return null;
  return { matricula, aluno: alunoById(data, matricula.alunoId) };
}