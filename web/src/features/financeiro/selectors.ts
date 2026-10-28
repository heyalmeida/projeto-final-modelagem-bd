import { siteConfig } from "@/config/site";
import type { MensalidadeFiltro } from "@/features/financeiro/schemas";
import { alunoById, alunoDaMatricula, minhasMatriculas, turmaById } from "@/features/core/selectors";
import { isStudent } from "@/lib/auth";
import { formatCompetencia } from "@/lib/utils";
import type {
  Aluno,
  AppData,
  Matricula,
  Mensalidade,
  MensalidadeStatus,
  Pagamento,
  Viewer,
} from "@/types/domain";

/** Regras de cobrança: saldo, status derivado, totais e recortes para gráficos. */

const TODAY = new Date(siteConfig.today);
const TOLERANCIA = 0.009;

/** Baixas confirmadas: estornos não contam no saldo. */
export const pagamentosConfirmadosDa = (data: AppData, mensalidadeId: string): Pagamento[] =>
  data.pagamentos.filter(
    (pagamento) => pagamento.mensalidadeId === mensalidadeId && pagamento.status === "CONFIRMADO",
  );

export const pagamentosDa = (data: AppData, mensalidadeId: string): Pagamento[] =>
  data.pagamentos.filter((pagamento) => pagamento.mensalidadeId === mensalidadeId);

/** Saldo devedor considerando desconto e baixas confirmadas. */
export function saldoDa(data: AppData, mensalidade: Mensalidade): number {
  const pago = pagamentosConfirmadosDa(data, mensalidade.id).reduce((soma, pagamento) => soma + Number(pagamento.valor), 0);
  return Math.max(0, Number(mensalidade.valor) - Number(mensalidade.desconto) - pago);
}

/** Status efetivo: vencida/parcial são derivados do saldo e da data. */
export function statusMensalidade(data: AppData, mensalidade: Mensalidade): MensalidadeStatus {
  if (mensalidade.status === "CANCELADA") return "CANCELADA";
  const saldo = saldoDa(data, mensalidade);
  if (saldo <= TOLERANCIA) return "PAGA";
  if (pagamentosConfirmadosDa(data, mensalidade.id).length > 0) return "PARCIAL";
  return mensalidade.status === "VENCIDA" || new Date(`${mensalidade.vencimento}T23:59`) < TODAY
    ? "VENCIDA"
    : "ABERTA";
}

/** Aluno vê apenas as próprias mensalidades; equipes veem tudo. */
export function mensalidadesVisiveis(viewer: Viewer): Mensalidade[] {
  if (!isStudent(viewer.user)) return viewer.data.mensalidades;
  const ids = minhasMatriculas(viewer).map((matricula) => matricula.id);
  return viewer.data.mensalidades.filter((mensalidade) => ids.includes(mensalidade.matriculaId));
}

export function mensalidadeDetalhada(
  data: AppData,
  mensalidade: Mensalidade,
): { matricula: Matricula; aluno: Aluno } | null {
  return alunoDaMatricula(data, mensalidade.matriculaId);
}

export function alunoDaMensalidade(data: AppData, mensalidade: Mensalidade): Aluno {
  const detalhe = alunoDaMatricula(data, mensalidade.matriculaId);
  return detalhe ? detalhe.aluno : alunoById(data, "");
}

export interface ResumoFinanceiro {
  aberto: number;
  recebido: number;
  total: number;
  adimplencia: number;
  vencidas: number;
  cobrancas: number;
  pagamentos: number;
}

export function resumoFinanceiro(viewer: Viewer): ResumoFinanceiro {
  const lista = mensalidadesVisiveis(viewer);
  const ids = new Set(lista.map((mensalidade) => mensalidade.id));
  const pagamentos = viewer.data.pagamentos.filter(
    (pagamento) => ids.has(pagamento.mensalidadeId) && pagamento.status === "CONFIRMADO",
  );
  const aberto = lista.reduce((soma, mensalidade) => soma + saldoDa(viewer.data, mensalidade), 0);
  const total = lista.reduce((soma, mensalidade) => soma + Number(mensalidade.valor) - Number(mensalidade.desconto), 0);
  const vencidas = lista.filter((mensalidade) => statusMensalidade(viewer.data, mensalidade) === "VENCIDA").length;

  return {
    aberto,
    recebido: pagamentos.reduce((soma, pagamento) => soma + Number(pagamento.valor), 0),
    total,
    adimplencia: total ? Math.round(((total - aberto) / total) * 100) : 100,
    vencidas,
    cobrancas: lista.filter((mensalidade) => statusMensalidade(viewer.data, mensalidade) !== "PAGA").length,
    pagamentos: pagamentos.length,
  };
}

export function pagamentosDoRecorte(viewer: Viewer, lista: Mensalidade[]): Pagamento[] {
  const ids = lista.map((mensalidade) => mensalidade.id);
  return viewer.data.pagamentos
    .filter((pagamento) => ids.includes(pagamento.mensalidadeId))
    .sort((a, b) => String(b.data).localeCompare(String(a.data)));
}

/** Mensalidades ordenadas por vencimento, opcionalmente filtradas por status. */
export function mensalidadesOrdenadas(viewer: Viewer, lista: Mensalidade[], filtro: MensalidadeFiltro | "TODAS") {
  const ordenadas = [...lista].sort((a, b) => String(a.vencimento).localeCompare(String(b.vencimento)));
  if (filtro === "TODAS") return ordenadas;
  return ordenadas.filter((mensalidade) => statusMensalidade(viewer.data, mensalidade) === filtro);
}

/** Opções de matrícula para lançar cobranças: "Aluno · Turma". */
export function opcoesDeMatricula(data: AppData): Array<{ id: string; label: string }> {
  return data.matriculas
    .map((matricula) => ({
      id: matricula.id,
      label: `${alunoById(data, matricula.alunoId).nome} · ${turmaById(data, matricula.turmaId).codigo}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export interface FinanceiroPorCompetencia {
  competencia: string;
  label: string;
  total: number;
  recebido: number;
}

/** Previsto × recebido por competência (dados do gráfico do painel). */
export function financeiroPorCompetencia(viewer: Viewer): FinanceiroPorCompetencia[] {
  const lista = mensalidadesVisiveis(viewer);
  const mapa = new Map<string, FinanceiroPorCompetencia>();

  lista.forEach((mensalidade) => {
    const chave = mensalidade.competencia;
    const atual =
      mapa.get(chave) ?? { competencia: chave, label: formatCompetencia(chave), total: 0, recebido: 0 };
    atual.total += Number(mensalidade.valor) - Number(mensalidade.desconto);
    atual.recebido += pagamentosConfirmadosDa(viewer.data, mensalidade.id).reduce(
      (soma, pagamento) => soma + Number(pagamento.valor),
      0,
    );
    mapa.set(chave, atual);
  });

  return [...mapa.values()].sort((a, b) => a.competencia.localeCompare(b.competencia));
}

export interface FatiaStatus {
  label: string;
  value: number;
  color: string;
}

/** Distribuição das mensalidades do recorte por status (rosca do painel). */
export function distribuicaoMensalidades(viewer: Viewer): FatiaStatus[] {
  const cores: Record<string, string> = {
    PAGA: "#0f766e",
    PARCIAL: "#d97706",
    ABERTA: "#2563eb",
    VENCIDA: "#dc2626",
    CANCELADA: "#78716c",
  };

  const contagem = new Map<string, number>();
  mensalidadesVisiveis(viewer).forEach((mensalidade) => {
    const status = statusMensalidade(viewer.data, mensalidade);
    contagem.set(status, (contagem.get(status) ?? 0) + 1);
  });

  return [...contagem.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([status, value]) => ({ label: rotuloDeStatus(status), value, color: cores[status] ?? "#78716c" }));
}

const ROTULOS: Record<string, string> = {
  PAGA: "Pagas",
  PARCIAL: "Parciais",
  ABERTA: "Abertas",
  VENCIDA: "Vencidas",
  CANCELADA: "Canceladas",
};

const rotuloDeStatus = (status: string): string => ROTULOS[status] ?? status;