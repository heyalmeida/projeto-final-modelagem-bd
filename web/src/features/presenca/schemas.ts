import { z } from "zod";

/** Registro de chamada por matrícula; justificativa é obrigatória quando justificado. */
export const chamadaSchema = z
  .object({
    sessaoId: z.string().min(1),
    registros: z
      .array(
        z.object({
          matriculaId: z.string().min(1),
          status: z.enum(["PRESENTE", "AUSENTE", "JUSTIFICADO"]),
          justificativa: z.string(),
        }),
      )
      .min(1),
  })
  .superRefine((valor, ctx) => {
    const semJustificativa = valor.registros.some(
      (registro) => registro.status === "JUSTIFICADO" && !registro.justificativa.trim(),
    );
    if (semJustificativa) {
      ctx.addIssue({
        code: "custom",
        message: "Informe a justificativa para os registros justificados.",
      });
    }
  });

export type ChamadaInput = z.infer<typeof chamadaSchema>;

export type ChamadaResult = { ok: true } | { ok: false; error: string };

export const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] as const;

/** Nova sessão de aula (chamada nasce aberta). */
export const sessaoSchema = z
  .object({
    turmaId: z.string().min(1, "Selecione a turma."),
    data: z.string().min(10, "Informe a data da sessão."),
    inicio: z.string().regex(/^\d{2}:\d{2}$/, "Informe o horário de início."),
    fim: z.string().regex(/^\d{2}:\d{2}$/, "Informe o horário de término."),
    tema: z.string().trim().min(1, "Informe o tema da sessão."),
  })
  .refine((valor) => valor.fim > valor.inicio, { message: "O término deve ser depois do início." });

export type SessaoInput = z.infer<typeof sessaoSchema>;