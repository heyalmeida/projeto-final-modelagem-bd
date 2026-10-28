import type { IconKey } from "@/constants/icons";
import type { Avaliacao, Evento, Livro, Modulo } from "@/types/domain";
import type { KpiTone } from "@/types/ui";

/** Indicador do topo do painel. */
export interface Indicador {
  id: string;
  label: string;
  value: string;
  /** Complemento numérico exibido em tom secundário (ex.: "/16"). */
  suffix?: string;
  hint: string;
  icon: IconKey;
  tone: KpiTone;
}

export type PendenciaTone = "danger" | "warn" | "info" | "ok";

/** Pendência acionável exibida na coluna lateral. */
export interface Pendencia {
  id: string;
  tone: PendenciaTone;
  icon: IconKey;
  titulo: string;
  texto: string;
  href: string;
  label: string;
}

/** Sessão de presença ou evento na lista de próximos compromissos. */
export interface Compromisso {
  id: string;
  tipo: "sessao" | "evento";
  /** Data ISO (YYYY-MM-DD) usada para ordenar. */
  data: string;
  titulo: string;
  descricao: string;
  horario: string;
  status: string;
}

export interface PagamentoRecente {
  id: string;
  aluno: string;
  competencia: string;
  data: string;
  valor: number;
}

/** Tipo de painel de destaque escolhido conforme os módulos do perfil. */
export type DestaqueTipo = "avaliacoes" | "biblioteca" | "financeiro" | "agenda" | null;

export interface ResumoAcademico {
  frequencia: number | null;
  media: number | null;
  matriculasAtivas: number;
  tentativas: number;
}

export interface ResumoFinanceiroPainel {
  aberto: number;
  recebido: number;
  vencidas: number;
  percentual: number;
}

export interface ResumoAcervoPainel {
  titulos: number;
  exemplares: number;
  disponiveis: number;
  percentual: number;
}

/** Tudo o que o painel precisa, já no recorte do usuário. */
export interface PainelResumo {
  /** Nome completo do usuário logado (usado na saudação e no cabeçalho). */
  nome: string;
  modulos: Modulo[];
  acesso: {
    avaliacoes: boolean;
    financeiro: boolean;
    presenca: boolean;
    agenda: boolean;
    biblioteca: boolean;
  };
  indicadores: Indicador[];
  pendencias: Pendencia[];
  compromissos: Compromisso[];
  destaque: DestaqueTipo;
  avaliacoesDestaque: Avaliacao[];
  livrosDestaque: Livro[];
  proximosEventos: Evento[];
  pagamentosRecentes: PagamentoRecente[];
  resumoAcademico: ResumoAcademico | null;
  resumoFinanceiro: ResumoFinanceiroPainel | null;
  resumoAcervo: ResumoAcervoPainel | null;
}