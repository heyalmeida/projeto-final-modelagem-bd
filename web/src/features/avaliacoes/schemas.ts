import { z } from "zod";

/** Validação do envio de uma tentativa: questão respondida é índice inteiro ≥ 0. */
export const tentativaSchema = z.object({
  avaliacaoId: z.string().min(1),
  matriculaId: z.string().min(1),
  respostas: z.record(z.string(), z.number().int().min(0)),
});

export type TentativaInput = z.infer<typeof tentativaSchema>;

export const TIPOS_AVALIACAO = ["Prova", "Trabalho", "Projeto", "Seminário"] as const;
export type TipoAvaliacao = (typeof TIPOS_AVALIACAO)[number];

/** Questão objetiva: enunciado, alternativas, correta e pontuação. */
export const questaoSchema = z.object({
  enunciado: z.string().trim().min(1, "Informe o enunciado da questão."),
  alternativas: z
    .array(z.string().trim().min(1, "Preencha o texto da alternativa."))
    .min(2, "Cadastre ao menos duas alternativas."),
  correta: z.number().int().min(0),
  pontos: z.number().positive("Informe os pontos da questão."),
});

export type QuestaoInput = z.infer<typeof questaoSchema>;

/** Avaliação completa, criada como rascunho e publicada pela coordenação. */
export const avaliacaoSchema = z
  .object({
    turmaId: z.string().min(1, "Selecione a turma."),
    titulo: z.string().trim().min(1, "Informe o título da avaliação."),
    tipo: z.enum(TIPOS_AVALIACAO),
    peso: z.number().min(1, "O peso mínimo é 1.").max(10, "O peso máximo é 10."),
    inicio: z.string().min(16, "Informe o início da janela."),
    fim: z.string().min(16, "Informe o fim da janela."),
    maxTentativas: z.number().int().min(1, "Ao menos uma tentativa.").max(5, "Máximo de cinco tentativas."),
    permiteRecuperacao: z.boolean(),
    pesoRecuperacao: z.number().min(0),
    questoes: z.array(questaoSchema).min(1, "Cadastre ao menos uma questão."),
  })
  .refine((valor) => valor.fim > valor.inicio, { message: "O fim da janela deve ser depois do início." })
  .refine((valor) => !valor.permiteRecuperacao || valor.pesoRecuperacao > 0, {
    message: "Informe o peso da recuperação.",
  });

export type AvaliacaoInput = z.infer<typeof avaliacaoSchema>;

/** Primeira mensagem de erro de um `safeParse` com falha. */
export function firstIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Dados inválidos.";
}