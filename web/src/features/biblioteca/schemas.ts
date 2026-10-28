import { z } from "zod";

/** Novo acervo (coleção da biblioteca). */
export const acervoSchema = z.object({
  nome: z.string().trim().min(1, "Informe o nome do acervo."),
  descricao: z.string().trim().min(1, "Informe a descrição do acervo."),
  area: z.string().trim().min(1, "Informe a área do conhecimento."),
});

export type AcervoInput = z.infer<typeof acervoSchema>;

/** Novo título com a quantidade de exemplares a serem tombados. */
export const livroSchema = z.object({
  acervoId: z.string().min(1, "Selecione o acervo."),
  titulo: z.string().trim().min(1, "Informe o título."),
  autor: z.string().trim().min(1, "Informe o autor."),
  isbn: z.string().trim().min(10, "Informe o ISBN (10 ou 13 dígitos)."),
  editora: z.string().trim().min(1, "Informe a editora."),
  ano: z.number().int().min(1900, "Ano inválido.").max(2100, "Ano inválido."),
  area: z.string().trim().min(1, "Informe a área do conhecimento."),
  exemplares: z.number().int().min(0, "A quantidade não pode ser negativa.").max(6, "Até seis exemplares por vez."),
});

export type LivroInput = z.infer<typeof livroSchema>;

export const EXEMPLAR_STATUSES = ["DISPONIVEL", "EMPRESTADO", "MANUTENCAO", "BAIXADO"] as const;
export type ExemplarStatusInput = (typeof EXEMPLAR_STATUSES)[number];

/** Primeira mensagem de erro de um `safeParse` com falha. */
export function primeiraMensagem(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Dados inválidos.";
}