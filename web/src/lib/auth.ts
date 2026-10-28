import type { AppData, Grupo, ModuleId, Modulo, Papel, Session, Usuario } from "@/types/domain";

/**
 * Autorização por grupo. As mesmas funções alimentam o menu, as guardas de rota
 * e cada tela — defesa em profundidade, como documentado em `docs/TEMA_E_REGRAS.md`.
 */

const ROLE_RANK: Record<Papel, number> = { ROOT: 0, ADMINISTRADOR: 1, USUARIO: 2 };

const ROLES_WITH_SCHEDULE_APPROVAL = ["g-coordenacao", "g-direcao"];
const ROLES_WITH_FINANCE_MANAGEMENT = ["g-financeiro", "g-secretaria", "g-direcao"];
const ROLES_WITH_LIBRARY_MANAGEMENT = ["g-biblioteca", "g-secretaria", "g-direcao"];

export function currentUser(data: AppData, session: Session | null): Usuario | null {
  if (!session) return null;
  return data.usuarios.find((usuario) => usuario.id === session.userId) ?? null;
}

export function currentGroup(data: AppData, user: Usuario | null): Grupo | null {
  if (!user) return null;
  return data.grupos.find((grupo) => grupo.id === user.grupoId) ?? null;
}

export const isRoot = (user: Usuario | null): boolean => user?.papel === "ROOT";
export const isAdmin = (user: Usuario | null): boolean => user?.papel === "ADMINISTRADOR";
export const isStudent = (user: Usuario | null): boolean => user?.perfil === "aluno";
export const isTeacher = (user: Usuario | null): boolean => user?.perfil === "professor";

export const isStaff = (user: Usuario | null): boolean =>
  Boolean(user) && (user?.perfil === "servidor" || isRoot(user) || isAdmin(user));

/** Módulos que o usuário enxerga (ROOT enxerga todos). */
export function allowedModules(data: AppData, user: Usuario | null): Modulo[] {
  if (!user) return [];
  if (isRoot(user)) return data.modulos;
  const group = currentGroup(data, user);
  return data.modulos.filter((modulo) => group?.modulos.includes(modulo.id));
}

export function canAccess(data: AppData, user: Usuario | null, moduleId: ModuleId): boolean {
  if (!user) return false;
  if (isRoot(user)) return true;
  const group = currentGroup(data, user);
  return Boolean(group?.modulos.includes(moduleId));
}

export const canApproveSchedule = (user: Usuario | null, group: Grupo | null): boolean =>
  isRoot(user) || Boolean(group && ROLES_WITH_SCHEDULE_APPROVAL.includes(group.id));

export const canManageFinance = (user: Usuario | null, group: Grupo | null): boolean =>
  isRoot(user) || Boolean(group && ROLES_WITH_FINANCE_MANAGEMENT.includes(group.id));

export const canManageLibrary = (user: Usuario | null, group: Grupo | null): boolean =>
  isRoot(user) || Boolean(group && ROLES_WITH_LIBRARY_MANAGEMENT.includes(group.id));

/** Perfis ordenados por privilégio para a tela de login. */
export function sortUsersForLogin(usuarios: Usuario[]): Usuario[] {
  return [...usuarios].sort(
    (a, b) => ROLE_RANK[a.papel] - ROLE_RANK[b.papel] || a.nome.localeCompare(b.nome),
  );
}

/** Rótulo do perfil exibido na lista de acesso. */
export function roleLabel(user: Usuario): string {
  if (user.papel === "ROOT") return "Root";
  if (user.papel === "ADMINISTRADOR") return "Administrador";
  if (user.perfil === "aluno") return "Aluno";
  if (user.perfil === "professor") return "Professor";
  return "Servidor";
}

export const roleBadgeLabel = (papel: Papel): string =>
  papel === "ROOT" ? "Root" : papel === "ADMINISTRADOR" ? "Administrador" : "Usuário";