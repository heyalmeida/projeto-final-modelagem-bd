import { z } from "zod";

/** Novo usuário de demonstração (perfil servidor, vinculado a um grupo). */
export const usuarioSchema = z.object({
  nome: z.string().trim().min(3, "Informe o nome completo."),
  login: z
    .string()
    .trim()
    .min(3, "O login precisa ter ao menos 3 caracteres.")
    .regex(/^[a-zA-Z0-9.]+$/, "Use apenas letras, números e pontos no login."),
  email: z.string().trim().email("Informe um e-mail válido."),
  grupoId: z.string().min(1, "Selecione o grupo de acesso."),
});

export type UsuarioInput = z.infer<typeof usuarioSchema>;