import type { BadgeTone } from "@/types/ui";

/** Rótulos legíveis dos status persistidos no banco de demonstração. */
export const STATUS_LABELS = {
  ATIVA: "Ativa",
  TRANCADA: "Trancada",
  CANCELADA: "Cancelada",
  CONCLUIDA: "Concluída",
  PUBLICADA: "Publicada",
  RASCUNHO: "Rascunho",
  ENCERRADA: "Encerrada",
  PAGA: "Paga",
  PARCIAL: "Parcial",
  ABERTA: "Aberta",
  VENCIDA: "Vencida",
  PRESENTE: "Presente",
  AUSENTE: "Ausente",
  JUSTIFICADO: "Justificado",
  PENDENTE: "Pendente",
  APROVADA: "Aprovada",
  REJEITADA: "Rejeitada",
  CONFIRMADO: "Confirmado",
  ESTORNADO: "Estornado",
  DISPONIVEL: "Disponível",
  EMPRESTADO: "Emprestado",
  MANUTENCAO: "Manutenção",
  BAIXADO: "Baixado",
} as const;

export type StatusValue = keyof typeof STATUS_LABELS;

const STATUS_TONES: Record<StatusValue, BadgeTone> = {
  ATIVA: "ok",
  PUBLICADA: "ok",
  PAGA: "ok",
  PRESENTE: "ok",
  APROVADA: "ok",
  CONFIRMADO: "ok",
  DISPONIVEL: "ok",
  CONCLUIDA: "ok",
  RASCUNHO: "neutral",
  ABERTA: "info",
  EMPRESTADO: "info",
  PARCIAL: "warn",
  PENDENTE: "warn",
  JUSTIFICADO: "warn",
  MANUTENCAO: "warn",
  TRANCADA: "warn",
  VENCIDA: "danger",
  AUSENTE: "danger",
  REJEITADA: "danger",
  CANCELADA: "danger",
  ESTORNADO: "danger",
  ENCERRADA: "neutral",
  BAIXADO: "neutral",
};

/** Rótulo de um status; devolve o valor original quando não há tradução. */
export function statusLabel(status: string): string {
  return STATUS_LABELS[status as StatusValue] ?? status;
}

/** Tom visual de um status; "neutral" quando desconhecido. */
export function statusTone(status: string): BadgeTone {
  return STATUS_TONES[status as StatusValue] ?? "neutral";
}

/** Rótulos dos tipos de solicitação de agenda. */
export const SOLICITACAO_TIPO_LABELS = {
  NOVO_HORARIO: "Novo horário",
  SUBSTITUICAO: "Substituição",
  CANCELAMENTO: "Cancelamento",
} as const;