/**
 * Contrato de dados do EduGestor.
 *
 * Espelha o modelo relacional documentado em `docs/MODELO_ER.md`: núcleo de
 * acesso (grupos, módulos, usuários), base acadêmica compartilhada (curso,
 * aluno, professor, turma, matrícula) e as entidades de cada módulo.
 */

export type Papel = "ROOT" | "ADMINISTRADOR" | "USUARIO";
export type Perfil = "aluno" | "professor" | "servidor";

export type ModuleId = "avaliacoes" | "financeiro" | "presenca" | "agenda" | "biblioteca";
export type ModuleIconKey = "clipboard" | "wallet" | "calendar-check" | "calendar" | "book";

export interface Modulo {
  id: ModuleId;
  nome: string;
  descricao: string;
  icone: ModuleIconKey;
  rota: string;
  cor: string;
  corSuave: string;
}

export interface Grupo {
  id: string;
  nome: string;
  papel: Papel;
  modulos: ModuleId[];
}

export interface Usuario {
  id: string;
  nome: string;
  login: string;
  grupoId: string;
  papel: Papel;
  perfil: Perfil;
  email: string;
  alunoId?: string;
  professorId?: string;
}

export interface Curso {
  id: string;
  nome: string;
  codigo: string;
  modalidade: string;
  cargaHoraria: number;
}

export interface Professor {
  id: string;
  nome: string;
  siape: string;
  titulacao: string;
  area: string;
  usuarioId: string | null;
}

export interface Aluno {
  id: string;
  nome: string;
  ra: string;
  cursoId: string;
  usuarioId: string | null;
  situacao: string;
}

export type TurmaStatus = "Ativa" | "Encerrada";

export interface Turma {
  id: string;
  codigo: string;
  cursoId: string;
  professorId: string;
  componente: string;
  periodo: string;
  turno: string;
  vagas: number;
  status: TurmaStatus;
}

export type MatriculaStatus = "ATIVA" | "TRANCADA" | "CANCELADA" | "CONCLUIDA";

export interface Matricula {
  id: string;
  alunoId: string;
  turmaId: string;
  status: MatriculaStatus;
  data: string;
  notaFinal: number | null;
  frequencia: number;
}

export interface Questao {
  id: string;
  enunciado: string;
  alternativas: string[];
  correta: number;
  pontos: number;
}

export interface GestaoAvaliacao {
  maxTentativas: number;
  permiteRecuperacao: boolean;
  pesoRecuperacao: number;
  divulgadaEm: string | null;
}

export type AvaliacaoStatus = "RASCUNHO" | "PUBLICADA" | "ENCERRADA";

export interface Avaliacao {
  id: string;
  turmaId: string;
  professorId: string;
  titulo: string;
  tipo: string;
  peso: number;
  status: AvaliacaoStatus;
  inicio: string;
  fim: string;
  gestao: GestaoAvaliacao;
  questoes: Questao[];
}

export type TentativaStatus = "FINALIZADA";

export interface Tentativa {
  id: string;
  avaliacaoId: string;
  matriculaId: string;
  numero: number;
  inicio: string;
  fim: string;
  status: TentativaStatus;
  pontuacao: number;
  respostas: Record<string, number>;
}

export interface MetodoPagamento {
  id: string;
  nome: string;
  tipo: string;
  taxa: number;
  ativo: boolean;
}

export type MensalidadeStatus = "ABERTA" | "VENCIDA" | "PAGA" | "PARCIAL" | "CANCELADA";

export interface Mensalidade {
  id: string;
  matriculaId: string;
  competencia: string;
  vencimento: string;
  valor: number;
  desconto: number;
  status: MensalidadeStatus;
}

export type PagamentoStatus = "CONFIRMADO" | "ESTORNADO";

export interface Pagamento {
  id: string;
  mensalidadeId: string;
  metodoId: string;
  usuarioId: string;
  valor: number;
  data: string;
  status: PagamentoStatus;
  comprovante: string;
}

export type SessaoStatus = "ABERTA" | "ENCERRADA";

export interface Sessao {
  id: string;
  turmaId: string;
  professorId: string;
  data: string;
  inicio: string;
  fim: string;
  tema: string;
  status: SessaoStatus;
}

export type PresencaStatus = "PRESENTE" | "AUSENTE" | "JUSTIFICADO";

export interface RegistroPresenca {
  id: string;
  sessaoId: string;
  matriculaId: string;
  usuarioId: string;
  status: PresencaStatus;
  justificativa: string;
  registradoEm: string;
}

export type GradeStatus = "ATIVA" | "INATIVA";

export interface GradeHoraria {
  id: string;
  turmaId: string;
  professorId: string;
  dia: string;
  inicio: string;
  fim: string;
  componente: string;
  sala: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  status: GradeStatus;
}

export type EventoStatus = "PUBLICADO" | "RASCUNHO" | "CANCELADO";

export interface Evento {
  id: string;
  turmaId: string | null;
  professorId: string;
  titulo: string;
  tipo: string;
  inicio: string;
  fim: string;
  local: string;
  publico: string;
  status: EventoStatus;
}

export type SolicitacaoStatus = "PENDENTE" | "APROVADA" | "REJEITADA";
export type SolicitacaoTipo = "NOVO_HORARIO" | "SUBSTITUICAO" | "CANCELAMENTO";

export interface SolicitacaoAlteracao {
  id: string;
  gradeId: string;
  solicitanteId: string;
  aprovadorId: string | null;
  tipo: SolicitacaoTipo;
  justificativa: string;
  data: string;
  dataAprovacao: string | null;
  status: SolicitacaoStatus;
  salaProposta: string | null;
  motivoRejeicao?: string;
}

export interface Acervo {
  id: string;
  nome: string;
  descricao: string;
  area: string;
  responsavelId: string;
  ativo: boolean;
}

export interface Livro {
  id: string;
  acervoId: string;
  titulo: string;
  autor: string;
  isbn: string;
  editora: string;
  ano: number;
  area: string;
  cor: string;
}

export type ExemplarStatus = "DISPONIVEL" | "EMPRESTADO" | "MANUTENCAO" | "BAIXADO";

export interface Exemplar {
  id: string;
  livroId: string;
  tombo: string;
  status: ExemplarStatus;
  localizacao: string;
  dataAquisicao: string;
}

export interface HistoricoBusca {
  id: string;
  usuarioId: string;
  termo: string;
  filtros: string;
  data: string;
  resultados: number;
}

/** Estado completo da demonstração (equivalente ao banco local do protótipo). */
export interface AppData {
  modulos: Modulo[];
  grupos: Grupo[];
  usuarios: Usuario[];
  cursos: Curso[];
  professores: Professor[];
  alunos: Aluno[];
  turmas: Turma[];
  matriculas: Matricula[];
  avaliacoes: Avaliacao[];
  tentativas: Tentativa[];
  metodos: MetodoPagamento[];
  mensalidades: Mensalidade[];
  pagamentos: Pagamento[];
  sessoes: Sessao[];
  registros: RegistroPresenca[];
  grade: GradeHoraria[];
  eventos: Evento[];
  solicitacoes: SolicitacaoAlteracao[];
  acervos: Acervo[];
  livros: Livro[];
  exemplares: Exemplar[];
  historico: HistoricoBusca[];
}

/** Sessão de demonstração: quem está logado, sem credenciais reais. */
export interface Session {
  userId: string;
}

/**
 * Resultado padrão das mutações de domínio: erro de regra é dado, não exceção,
 * então os formulários conseguem exibir a mensagem no lugar certo.
 */
export type MutationResult = { ok: true } | { ok: false; error: string };

/**
 * Contexto de leitura usado pelas camadas de domínio: os dados e o usuário
 * autenticado. Toda regra de visibilidade parte daqui.
 */
export interface Viewer {
  data: AppData;
  user: Usuario;
}