import { usuarioSchema, type UsuarioInput } from "@/features/acesso/schemas";
import type { AppData, MutationResult, ModuleId } from "@/types/domain";

/** Mutações do núcleo de acesso: matriz grupo × módulo e usuários. */

/** Liga/desliga um módulo para um grupo. */
export function alternarModulo(draft: AppData, grupoId: string, moduloId: ModuleId): MutationResult {
  const grupo = draft.grupos.find((item) => item.id === grupoId);
  if (!grupo) return { ok: false, error: "Grupo não encontrado." };
  grupo.modulos = grupo.modulos.includes(moduloId)
    ? grupo.modulos.filter((modulo) => modulo !== moduloId)
    : [...grupo.modulos, moduloId];
  return { ok: true };
}

/** Cria usuário de perfil servidor; o papel vem do grupo escolhido. */
export function criarUsuario(draft: AppData, input: UsuarioInput): MutationResult {
  const parsed = usuarioSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Usuário inválido." };

  const grupo = draft.grupos.find((item) => item.id === parsed.data.grupoId);
  if (!grupo) return { ok: false, error: "Grupo não encontrado." };

  const login = parsed.data.login.toLowerCase();
  if (draft.usuarios.some((usuario) => usuario.login.toLowerCase() === login)) {
    return { ok: false, error: "Este login já está em uso." };
  }

  draft.usuarios.push({
    id: `u-${Date.now()}`,
    nome: parsed.data.nome,
    login,
    grupoId: grupo.id,
    papel: grupo.papel,
    perfil: "servidor",
    email: parsed.data.email,
  });
  return { ok: true };
}