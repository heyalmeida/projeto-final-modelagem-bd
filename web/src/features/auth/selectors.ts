import { grupoById } from "@/features/core/selectors";
import { roleLabel, sortUsersForLogin } from "@/lib/auth";
import type { AppData, Grupo, Usuario } from "@/types/domain";

/** Perfil pronto para a lista de acesso de demonstração. */
export interface LoginProfile {
  user: Usuario;
  group: Grupo;
  role: string;
}

export function loginProfiles(data: AppData): LoginProfile[] {
  return sortUsersForLogin(data.usuarios).map((user) => ({
    user,
    group: grupoById(data, user.grupoId),
    role: roleLabel(user),
  }));
}