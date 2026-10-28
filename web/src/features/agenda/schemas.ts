import { z } from "zod";

export const solicitacaoSchema = z.object({
  gradeId: z.string().min(1, "Selecione um horário."),
  tipo: z.enum(["NOVO_HORARIO", "SUBSTITUICAO", "CANCELAMENTO"]),
  justificativa: z.string().trim().min(1, "Informe a justificativa."),
  salaProposta: z.string().trim(),
});

export type SolicitacaoInput = z.infer<typeof solicitacaoSchema>;

export const rejeicaoSchema = z.object({
  solicitacaoId: z.string().min(1),
  motivo: z.string().trim().min(1, "Informe o motivo."),
});

export type RejeicaoInput = z.infer<typeof rejeicaoSchema>;

export const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] as const;
export type DiaSemana = (typeof DIAS_SEMANA)[number];

/** Horário da grade: dia, janela, componente, sala e vigência. */
export const horarioSchema = z
  .object({
    turmaId: z.string().min(1, "Selecione a turma."),
    dia: z.enum(DIAS_SEMANA),
    inicio: z.string().regex(/^\d{2}:\d{2}$/, "Informe o horário de início."),
    fim: z.string().regex(/^\d{2}:\d{2}$/, "Informe o horário de término."),
    componente: z.string().trim().min(1, "Informe o componente curricular."),
    sala: z.string().trim().min(1, "Informe a sala."),
    vigenciaInicio: z.string().min(10, "Informe o início da vigência."),
    vigenciaFim: z.string().min(10, "Informe o fim da vigência."),
  })
  .refine((valor) => valor.fim > valor.inicio, { message: "O término deve ser depois do início." })
  .refine((valor) => valor.vigenciaFim >= valor.vigenciaInicio, {
    message: "A vigência final deve ser depois da inicial.",
  });

export type HorarioInput = z.infer<typeof horarioSchema>;

/** Evento acadêmico: título, janela, local e público. */
export const eventoSchema = z
  .object({
    titulo: z.string().trim().min(1, "Informe o título do evento."),
    tipo: z.string().trim().min(1, "Informe o tipo (palestra, workshop...)."),
    inicio: z.string().min(16, "Informe data e hora de início."),
    fim: z.string().min(16, "Informe data e hora de término."),
    local: z.string().trim().min(1, "Informe o local."),
    publico: z.string().trim().min(1, "Informe o público-alvo."),
  })
  .refine((valor) => valor.fim > valor.inicio, { message: "O término deve ser depois do início." });

export type EventoInput = z.infer<typeof eventoSchema>;

/** Primeira mensagem de erro de um `safeParse` com falha. */
export function primeiraMensagem(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Dados inválidos.";
}