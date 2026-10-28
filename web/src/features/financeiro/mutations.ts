import { criarPagamentoSchema, lancamentoSchema, type LancamentoInput } from "@/features/financeiro/schemas";
import { createId } from "@/lib/utils";
import type { AppData, MutationResult } from "@/types/domain";

/**
 * Mutações do financeiro: lançamento de cobrança, baixa (total ou parcial) e
 * estorno. Funções puras sobre o rascunho do estado.
 */

/** Lança uma nova mensalidade para uma matrícula (uma cobrança por competência). */
export function lancarMensalidade(draft: AppData, input: LancamentoInput): MutationResult {
  const parsed = lancamentoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Lançamento inválido." };

  const matricula = draft.matriculas.find((item) => item.id === parsed.data.matriculaId);
  if (!matricula) return { ok: false, error: "Matrícula não encontrada." };

  const duplicada = draft.mensalidades.some(
    (mensalidade) =>
      mensalidade.matriculaId === parsed.data.matriculaId && mensalidade.competencia === parsed.data.competencia,
  );
  if (duplicada) {
    return { ok: false, error: "Esta matrícula já possui cobrança nessa competência." };
  }

  draft.mensalidades.push({
    id: createId("mens"),
    matriculaId: parsed.data.matriculaId,
    competencia: parsed.data.competencia,
    vencimento: parsed.data.vencimento,
    valor: Number(parsed.data.valor.toFixed(2)),
    desconto: Number(parsed.data.desconto.toFixed(2)),
    status: "ABERTA",
  });
  return { ok: true };
}

export interface BaixaInput {
  mensalidadeId: string;
  metodoId: string;
  valor: number;
  usuarioId: string;
}

/** Registra a baixa (total ou parcial) de uma mensalidade. */
export function registrarPagamento(draft: AppData, input: BaixaInput): MutationResult {
  const mensalidade = draft.mensalidades.find((item) => item.id === input.mensalidadeId);
  if (!mensalidade) return { ok: false, error: "Mensalidade não encontrada." };

  const saldoAtual = saldoDevedor(draft, mensalidade.id);
  if (saldoAtual <= 0) return { ok: false, error: "Esta mensalidade já está quitada." };

  const parsed = criarPagamentoSchema(saldoAtual).safeParse({
    mensalidadeId: input.mensalidadeId,
    metodoId: input.metodoId,
    valor: input.valor,
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Pagamento inválido." };

  draft.pagamentos.push({
    id: createId("pag"),
    mensalidadeId: input.mensalidadeId,
    metodoId: parsed.data.metodoId,
    usuarioId: input.usuarioId,
    valor: parsed.data.valor,
    data: new Date().toISOString(),
    status: "CONFIRMADO",
    comprovante: `COMP-${Math.floor(2000 + Math.random() * 7999)}`,
  });

  atualizarStatus(draft, input.mensalidadeId);
  return { ok: true };
}

export interface EstornoInput {
  pagamentoId: string;
}

/** Estorno: o pagamento deixa de contar no saldo, mas permanece no histórico. */
export function estornarPagamento(draft: AppData, input: EstornoInput): MutationResult {
  const pagamento = draft.pagamentos.find((item) => item.id === input.pagamentoId);
  if (!pagamento) return { ok: false, error: "Pagamento não encontrado." };
  if (pagamento.status !== "CONFIRMADO") return { ok: false, error: "Este pagamento já está estornado." };

  pagamento.status = "ESTORNADO";
  atualizarStatus(draft, pagamento.mensalidadeId);
  return { ok: true };
}

/* ---------- auxiliares ---------- */

/** Saldo devedor considerando apenas baixas confirmadas. */
export function saldoDevedor(draft: AppData, mensalidadeId: string): number {
  const mensalidade = draft.mensalidades.find((item) => item.id === mensalidadeId);
  if (!mensalidade) return 0;
  const pago = draft.pagamentos
    .filter((pagamento) => pagamento.mensalidadeId === mensalidadeId && pagamento.status === "CONFIRMADO")
    .reduce((soma, pagamento) => soma + Number(pagamento.valor), 0);
  return Math.max(0, Number(mensalidade.valor) - Number(mensalidade.desconto) - pago);
}

/** Sincroniza o status armazenado com o saldo após baixas e estornos. */
function atualizarStatus(draft: AppData, mensalidadeId: string): void {
  const mensalidade = draft.mensalidades.find((item) => item.id === mensalidadeId);
  if (!mensalidade) return;
  const temBaixa = draft.pagamentos.some(
    (pagamento) => pagamento.mensalidadeId === mensalidadeId && pagamento.status === "CONFIRMADO",
  );
  mensalidade.status = saldoDevedor(draft, mensalidadeId) <= 0.009 ? "PAGA" : temBaixa ? "PARCIAL" : "ABERTA";
}