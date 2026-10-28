import { z } from "zod";
import { money } from "@/lib/utils";

/** Filtros de status da lista de mensalidades. */
export type MensalidadeFiltro = "TODAS" | "ABERTA" | "VENCIDA" | "PAGA" | "PARCIAL";

export type PagamentoResult = { ok: true; valor: number } | { ok: false; error: string };

/** Novo lançamento de cobrança (mensalidade) para uma matrícula. */
export const lancamentoSchema = z
  .object({
    matriculaId: z.string().min(1, "Selecione o aluno e a turma."),
    competencia: z.string().regex(/^\d{4}-\d{2}$/, "Informe a competência (mês de referência)."),
    vencimento: z.string().min(10, "Informe a data de vencimento."),
    valor: z.number().positive("Informe o valor da cobrança."),
    desconto: z.number().min(0, "O desconto não pode ser negativo."),
  })
  .refine((valor) => valor.desconto < valor.valor, { message: "O desconto deve ser menor que o valor." });

export type LancamentoInput = z.infer<typeof lancamentoSchema>;

/**
 * Validação de uma baixa: aceita pagamento parcial, mas nunca acima do saldo.
 * O saldo entra no schema para gerar a mensagem com o valor exato.
 */
export const criarPagamentoSchema = (saldo: number) =>
  z.object({
    mensalidadeId: z.string().min(1),
    metodoId: z.string().min(1, "Selecione um método de pagamento."),
    valor: z
      .number()
      .positive("Informe um valor maior que zero.")
      .max(Number((saldo + 0.009).toFixed(2)), `O valor não pode exceder o saldo de ${money(saldo)}.`),
  });

export type PagamentoInput = z.infer<ReturnType<typeof criarPagamentoSchema>>;
