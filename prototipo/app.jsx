/*
 * EduGestor — protótipo React
 * React 18 (UMD) + Babel standalone + Tailwind CSS (Play CDN) + daisyUI + lucide-react
 * Sem build: os arquivos em vendor/ são carregados localmente pelo servidor estático.
 */
const { useState, useEffect } = React;
const L = window.LucideReact || {};
const pick = (...names) => names.map((n) => L[n]).find(Boolean);
const I = {
  dashboard: pick("LayoutDashboard"),
  clipboard: pick("ClipboardList"),
  wallet: pick("Wallet"),
  calCheck: pick("CalendarCheck"),
  cal: pick("CalendarDays"),
  book: pick("BookOpen"),
  settings: pick("Settings"),
  search: pick("Search"),
  logout: pick("LogOut"),
  plus: pick("Plus"),
  check: pick("Check"),
  x: pick("X"),
  clock: pick("Clock"),
  users: pick("Users"),
  arrow: pick("ArrowRight"),
  file: pick("FileText"),
  refresh: pick("RefreshCw"),
  chart: pick("BarChart3", "ChartColumn", "ChartBar"),
  alert: pick("AlertTriangle", "TriangleAlert", "CircleAlert", "AlertCircle"),
  cap: pick("GraduationCap"),
};
const MODULE_ICONS = {
  clipboard: I.clipboard,
  wallet: I.wallet,
  "calendar-check": I.calCheck,
  calendar: I.cal,
  book: I.book,
};

/* ---------- armazenamento e store ---------- */
const STORAGE_KEY = "edugestor.state.v1";
const SESSION_KEY = "edugestor.session.v1";
const TODAY = new Date("2026-10-28T12:00:00");
const DAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const clone = (v) => JSON.parse(JSON.stringify(v));
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.usuarios && parsed.avaliacoes) return parsed;
    }
  } catch (e) {}
  return clone(window.EDU);
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { toast("Não foi possível salvar os dados locais.", "error"); }
}
function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return state.usuarios.some((u) => u.id === parsed.userId) ? parsed : null;
  } catch (e) { return null; }
}
function saveSession() {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  } catch (e) {}
}

let state = loadState();
let session = loadSession();
let version = 0;
const subs = new Set();
function notify() {
  version += 1;
  subs.forEach((fn) => fn(version));
}
function useStore() {
  const [, force] = useState(version);
  useEffect(() => {
    const fn = () => force(version);
    subs.add(fn);
    return () => subs.delete(fn);
  }, []);
}
function commit() { saveState(); notify(); }

const ui = {
  tab: {},
  finFilter: "TODAS",
  sessionId: null,
  agendaTurma: null,
  libTab: "livros",
  libQuery: "",
  libArea: "TODOS",
};

/* ---------- modal e toast ---------- */
let modal = null;
let toasts = [];
let toastSeq = 0;
function openModal(cfg) {
  modal = { errors: {}, size: "", ...cfg };
  document.body.style.overflow = "hidden";
  notify();
}
function closeModal() {
  modal = null;
  document.body.style.overflow = "";
  notify();
}
function showFormError(name, message) {
  if (!modal) return;
  modal.errors[name] = message;
  notify();
}
function toast(message, type = "success") {
  const id = ++toastSeq;
  toasts = [...toasts, { id, message, type }];
  notify();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, 3800);
}

/* ---------- lookups ---------- */
const user = () => state.usuarios.find((u) => u.id === (session && session.userId)) || null;
const group = () => {
  const u = user();
  return u ? state.grupos.find((g) => g.id === u.grupoId) : null;
};
const isRoot = () => !!user() && user().papel === "ROOT";
const isAdmin = () => !!user() && user().papel === "ADMINISTRADOR";
const isStudent = () => !!user() && user().perfil === "aluno";
const isTeacher = () => !!user() && user().perfil === "professor";
const isStaff = () => !!user() && (user().perfil === "servidor" || isRoot() || isAdmin());
const student = () => {
  const u = user();
  return u && u.alunoId ? state.alunos.find((a) => a.id === u.alunoId) : null;
};
const teacher = () => {
  const u = user();
  return u && u.professorId ? state.professores.find((p) => p.id === u.professorId) : null;
};
function allowedModules() {
  const u = user();
  if (!u) return [];
  if (u.papel === "ROOT") return state.modulos;
  const g = group();
  return state.modulos.filter((m) => g && g.modulos.includes(m.id));
}
function canAccess(moduleId) {
  if (!user()) return false;
  if (user().papel === "ROOT") return true;
  const g = group();
  return !!g && g.modulos.includes(moduleId);
}
const moduleById = (id) => state.modulos.find((m) => m.id === id);
const turmaById = (id) => state.turmas.find((t) => t.id === id) || { codigo: "—", componente: "—" };
const alunoById = (id) => state.alunos.find((a) => a.id === id) || { nome: "—", ra: "—" };
const professorById = (id) => state.professores.find((p) => p.id === id) || { nome: "—" };
const grupoById = (id) => state.grupos.find((g) => g.id === id) || { nome: "—", papel: "—" };
const usuarioById = (id) => state.usuarios.find((u) => u.id === id) || { nome: "—" };

const pagamentosDa = (mensalidadeId) => state.pagamentos.filter((p) => p.mensalidadeId === mensalidadeId);
function saldoDa(m) {
  const pago = pagamentosDa(m.id).reduce((sum, p) => sum + Number(p.valor), 0);
  return Math.max(0, Number(m.valor) - Number(m.desconto) - pago);
}
function statusMensalidade(m) {
  const saldo = saldoDa(m);
  if (m.status === "CANCELADA") return "CANCELADA";
  if (saldo <= 0.009) return "PAGA";
  if (pagamentosDa(m.id).length > 0) return "PARCIAL";
  return m.status === "VENCIDA" || new Date(m.vencimento + "T23:59") < TODAY ? "VENCIDA" : "ABERTA";
}
const minhasMatriculas = () => {
  const a = student();
  return a ? state.matriculas.filter((m) => m.alunoId === a.id) : [];
};
function minhasTurmas() {
  if (isStudent()) return minhasMatriculas().map((m) => m.turmaId);
  if (isTeacher()) {
    const p = teacher();
    return p ? state.turmas.filter((t) => t.professorId === p.id).map((t) => t.id) : [];
  }
  return state.turmas.map((t) => t.id);
}
const turmasVisiveis = () => state.turmas.filter((t) => minhasTurmas().includes(t.id));
const avaliacoesVisiveis = () =>
  state.avaliacoes.filter((a) => minhasTurmas().includes(a.turmaId)).sort((a, b) => String(a.fim).localeCompare(String(b.fim)));
const matriculasDaTurma = (turmaId) => state.matriculas.filter((m) => m.turmaId === turmaId);
const matriculaDoAlunoNaTurma = (turmaId) => {
  const a = student();
  return a ? state.matriculas.find((m) => m.alunoId === a.id && m.turmaId === turmaId) : null;
};
const tentativasDa = (avaliacaoId, matriculaId) =>
  state.tentativas
    .filter((t) => t.avaliacaoId === avaliacaoId && (!matriculaId || t.matriculaId === matriculaId))
    .sort((a, b) => b.numero - a.numero);
const ultimaTentativa = (avaliacaoId, matriculaId) => tentativasDa(avaliacaoId, matriculaId)[0] || null;
const avaliacaoAberta = (av) =>
  av.status === "PUBLICADA" && new Date(av.inicio) <= TODAY && new Date(av.fim) >= TODAY;
function mediaAvaliacao(avaliacaoId) {
  const ts = tentativasDa(avaliacaoId);
  if (!ts.length) return null;
  return ts.reduce((sum, t) => sum + Number(t.pontuacao), 0) / ts.length;
}
function mediaDoAluno() {
  let peso = 0, soma = 0;
  minhasMatriculas().forEach((m) => {
    avaliacoesVisiveis().forEach((av) => {
      if (av.turmaId !== m.turmaId) return;
      const tt = ultimaTentativa(av.id, m.id);
      if (!tt) return;
      peso += Number(av.peso);
      soma += Number(tt.pontuacao) * Number(av.peso);
    });
  });
  return peso ? soma / peso : null;
}
function frequenciaDaMatricula(matriculaId) {
  const regs = state.registros.filter((r) => r.matriculaId === matriculaId);
  if (!regs.length) return null;
  const ok = regs.filter((r) => r.status === "PRESENTE" || r.status === "JUSTIFICADO").length;
  return Math.round((ok / regs.length) * 100);
}
function frequenciaDoAluno() {
  const vals = minhasMatriculas().map((m) => frequenciaDaMatricula(m.id)).filter((v) => v !== null);
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
}
function frequenciaGeral() {
  const vals = state.matriculas.map((m) => frequenciaDaMatricula(m.id)).filter((v) => v !== null);
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
}
function mensalidadesVisiveis() {
  if (isStudent()) {
    const ids = minhasMatriculas().map((m) => m.id);
    return state.mensalidades.filter((m) => ids.includes(m.matriculaId));
  }
  return state.mensalidades;
}
function sessoesVisiveis() {
  return state.sessoes
    .filter((s) => minhasTurmas().includes(s.turmaId))
    .sort((a, b) => String(b.data).localeCompare(String(a.data)));
}
function solicitacoesVisiveis() {
  if (isRoot() || isAdmin()) return state.solicitacoes;
  return state.solicitacoes.filter((s) => s.solicitanteId === user().id);
}
function podeAprovarAgenda() {
  const g = group();
  return isRoot() || (g && ["g-coordenacao", "g-direcao"].includes(g.id));
}
function podeGerenciarFinanceiro() {
  const g = group();
  return isRoot() || (g && ["g-financeiro", "g-secretaria", "g-direcao"].includes(g.id));
}
function podeGerenciarBiblioteca() {
  const g = group();
  return isRoot() || (g && ["g-biblioteca", "g-secretaria", "g-direcao"].includes(g.id));
}

/* ---------- formatação ---------- */
function initials(name) {
  const parts = String(name || "?").trim().split(/\s+/).filter(Boolean);
  return ((parts[0] && parts[0][0]) || "") + (parts.length > 1 ? parts[parts.length - 1][0] : "");
}
const money = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(v || 0));
function fmtDate(value) {
  if (!value) return "—";
  const d = new Date(String(value).length <= 10 ? value + "T12:00:00" : value);
  return Number.isNaN(d.getTime()) ? String(value) : `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}
function fmtDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : `${fmtDate(value)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function fmtShort(value) {
  const d = new Date(String(value).length <= 10 ? value + "T12:00:00" : value);
  return Number.isNaN(d.getTime()) ? "—" : `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]}`;
}
function fmtCompetencia(value) {
  if (!value || !value.includes("-")) return value || "—";
  const [ano, mes] = value.split("-");
  return `${MONTHS[Number(mes) - 1]}/${ano}`;
}
function dayOf(value) {
  const d = value instanceof Date ? value : new Date(String(value).length <= 10 ? String(value) + "T12:00:00" : value);
  return DAYS[d.getDay()];
}

const STATUS_LABELS = {
  ATIVA: "Ativa", TRANCADA: "Trancada", CANCELADA: "Cancelada", CONCLUIDA: "Concluída",
  PUBLICADA: "Publicada", RASCUNHO: "Rascunho", ENCERRADA: "Encerrada",
  PAGA: "Paga", PARCIAL: "Parcial", ABERTA: "Aberta", VENCIDA: "Vencida",
  PRESENTE: "Presente", AUSENTE: "Ausente", JUSTIFICADO: "Justificado",
  PENDENTE: "Pendente", APROVADA: "Aprovada", REJEITADA: "Rejeitada",
  CONFIRMADO: "Confirmado", ESTORNADO: "Estornado", DISPONIVEL: "Disponível",
  EMPRESTADO: "Emprestado", MANUTENCAO: "Manutenção", BAIXADO: "Baixado",
};
const STATUS_TONES = {
  ATIVA: "ok", PUBLICADA: "ok", PAGA: "ok", PRESENTE: "ok", APROVADA: "ok", CONFIRMADO: "ok", DISPONIVEL: "ok",
  RASCUNHO: "neutral", ABERTA: "info", PARCIAL: "warn", PENDENTE: "warn", JUSTIFICADO: "warn", EMPRESTADO: "info",
  VENCIDA: "danger", AUSENTE: "danger", REJEITADA: "danger", CANCELADA: "danger", ENCERRADA: "neutral",
  MANUTENCAO: "warn", BAIXADO: "neutral", TRANCADA: "warn", CONCLUIDA: "ok", ESTORNADO: "danger",
};

/* ---------- estilo compartilhado ---------- */
const CARD = "bg-white rounded-2xl border border-stone-200 shadow-card";
const PANEL = `${CARD} p-4 sm:p-5`;
const BTN = "btn btn-sm h-9 min-h-9 gap-1.5 rounded-lg border-stone-300 bg-white font-semibold text-slate-700 shadow-none hover:border-brand-700 hover:bg-white hover:text-brand-800";
const BTN_PRIMARY = "btn btn-sm h-9 min-h-9 gap-1.5 rounded-lg border-brand-700 bg-brand-700 font-semibold text-white shadow-none hover:border-brand-800 hover:bg-brand-800";
const BTN_GHOST = "btn btn-sm h-9 min-h-9 gap-1.5 rounded-lg border-transparent bg-transparent font-semibold text-stone-500 shadow-none hover:bg-stone-100 hover:text-slate-800";
const BTN_DANGER = "btn btn-sm h-9 min-h-9 gap-1.5 rounded-lg border-red-200 bg-red-50 font-semibold text-red-700 shadow-none hover:border-red-300 hover:bg-red-100";
const INPUT = "input input-sm input-bordered h-9 w-full rounded-lg border-stone-300 bg-white text-[13px] focus:border-brand-600 focus:outline-none";
const SELECT = "select select-sm select-bordered h-9 w-full rounded-lg border-stone-300 bg-white text-[13px] focus:border-brand-600 focus:outline-none";
const TEXTAREA = "textarea textarea-bordered min-h-[86px] w-full rounded-lg border-stone-300 bg-white text-[13px] focus:border-brand-600 focus:outline-none";
const BADGE = {
  ok: "badge border-emerald-200 bg-emerald-50 text-emerald-700",
  warn: "badge border-amber-200 bg-amber-50 text-amber-700",
  danger: "badge border-red-200 bg-red-50 text-red-700",
  info: "badge border-blue-200 bg-blue-50 text-blue-700",
  purple: "badge border-violet-200 bg-violet-100 text-violet-700",
  neutral: "badge border-stone-200 bg-stone-100 text-stone-500",
};
const KPI_TONES = {
  brand: "bg-brand-50 text-brand-700",
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-100 text-violet-700",
  blue: "bg-blue-50 text-blue-700",
  pink: "bg-pink-50 text-pink-700",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-700",
};

/* ---------- componentes base ---------- */
function Avatar({ name, size = "md", dark = false }) {
  const sizes = { xs: "h-7 w-7 text-[9px]", sm: "h-8 w-8 text-[10px]", md: "h-10 w-10 text-[12px]", lg: "h-14 w-14 text-[16px]" };
  return (
    <span className={`grid shrink-0 place-items-center rounded-full font-bold ${sizes[size]} ${dark ? "bg-brand-400/15 text-brand-200 ring-1 ring-brand-300/25" : "bg-brand-50 text-brand-800 ring-1 ring-brand-600/15"}`} aria-hidden="true">
      {initials(name).toUpperCase()}
    </span>
  );
}
function StatusBadge({ status }) {
  const tone = STATUS_TONES[status] || "neutral";
  return (
    <span className={`${BADGE[tone]} gap-1.5 whitespace-nowrap text-[9.5px] font-bold uppercase tracking-wide`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status] || status}
    </span>
  );
}
function RoleBadge({ papel }) {
  const map = { ROOT: ["purple", "Root"], ADMINISTRADOR: ["info", "Administrador"], USUARIO: ["neutral", "Usuário"] };
  const [tone, label] = map[papel] || ["neutral", papel];
  return <span className={`${BADGE[tone]} text-[9.5px] font-bold uppercase tracking-wide`}>{label}</span>;
}
function Logo({ compact = false, light = false }) {
  return (
    <span className="flex items-center gap-2.5" data-logo>
      <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 shadow-[0_8px_22px_-12px_rgba(15,118,110,.9)]">
        <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden="true">
          <rect x="16" y="15" width="26" height="8" rx="4" fill="#ffffff" />
          <rect x="20" y="28" width="22" height="8" rx="4" fill="#99f6e4" />
          <rect x="16" y="41" width="26" height="8" rx="4" fill="#ffffff" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={`block font-display text-[21px] tracking-tight ${light ? "text-white" : "text-slate-900"}`}>EduGestor</span>
          <span className={`mt-1 block text-[9px] font-semibold uppercase tracking-[0.18em] ${light ? "text-slate-400" : "text-stone-500"}`}>Gestão acadêmica</span>
        </span>
      )}
    </span>
  );
}
function PageHead({ eyebrow, title, sub, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">{eyebrow}</p>
        <h1 className="mt-1 font-display text-[30px] leading-tight tracking-tight text-slate-900 sm:text-[37px]">{title}</h1>
        {sub && <p className="mt-1.5 max-w-3xl text-[13px] text-stone-500">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
function Empty({ icon: Icon, title, text }) {
  return (
    <div className="px-5 py-10 text-center">
      <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-stone-100 text-stone-400">{Icon && <Icon className="h-6 w-6" strokeWidth={1.6} />}</span>
      <h3 className="font-display text-lg text-slate-800">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-[12px] text-stone-500">{text}</p>
    </div>
  );
}
function Kpi({ label, value, foot, tone = "brand", icon: Icon }) {
  return (
    <article className={`${CARD} relative overflow-hidden p-4`}>
      <div className="mb-3 flex items-start justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-stone-500">{label}</span>
        {Icon && <span className={`grid h-9 w-9 place-items-center rounded-xl ${KPI_TONES[tone]}`}><Icon className="h-[18px] w-[18px]" strokeWidth={1.8} /></span>}
      </div>
      <div className="font-display text-[29px] leading-none tracking-tight text-slate-900">{value}</div>
      <div className="mt-1.5 text-[11.5px] text-stone-500">{foot}</div>
    </article>
  );
}
function Progress({ value, className = "" }) {
  const v = Math.max(0, Math.min(100, Number(value || 0)));
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-stone-200 ${className}`}>
      <span className={`block h-full rounded-full ${v < 75 && v > 0 ? "bg-amber-500" : "bg-brand-600"}`} style={{ width: v + "%" }} />
    </div>
  );
}

/* ---------- login ---------- */
function Login() {
  const demo = state.usuarios.slice().sort((a, b) => {
    const rank = { ROOT: 0, ADMINISTRADOR: 1, USUARIO: 2 };
    return rank[a.papel] - rank[b.papel] || a.nome.localeCompare(b.nome);
  });
  const roleOf = (u) => (u.papel === "ROOT" ? "Root" : u.papel === "ADMINISTRADOR" ? "Administrador" : u.perfil === "aluno" ? "Aluno" : u.perfil === "professor" ? "Professor" : "Servidor");
  return (
    <div className="login-page grid min-h-screen bg-stone-100 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative flex min-h-[300px] flex-col justify-between overflow-hidden bg-slate-950 px-7 py-9 text-slate-200 lg:min-h-screen lg:px-14 lg:py-14">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
        <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-brand-400/20 blur-3xl" />
        <div className="relative z-10"><Logo light /></div>
        <div className="relative z-10 max-w-xl py-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-300/25 bg-brand-400/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-200">
            <I.check className="h-3.5 w-3.5" /> Projeto final · modelagem de banco de dados
          </span>
          <h1 className="mt-5 font-display text-[38px] leading-[1.04] tracking-tight text-white sm:text-[52px] xl:text-[60px]">
            A faculdade inteira, <em className="text-brand-300">em um só lugar.</em>
          </h1>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-slate-400">
            Cinco módulos conectados pela mesma matrícula. Avaliações, mensalidades, presença, agenda e biblioteca com acesso controlado por grupo.
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap gap-2">
          {state.modulos.map((m) => (
            <span key={m.id} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-300" />{m.nome}
            </span>
          ))}
        </div>
        <div className="relative z-10 mt-8 hidden items-center gap-5 text-[11px] text-slate-500 sm:flex">
          <span>Protótipo local</span><span>Dados fictícios</span><span>React · Tailwind · SQLite</span>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-8 lg:px-10">
        <div className={`${CARD} w-full max-w-[470px] p-6 sm:p-8`}>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">Acesso de demonstração</p>
          <h2 className="mt-1 font-display text-[30px] leading-tight text-slate-900">Entrar no EduGestor</h2>
          <p className="mt-1 text-[13px] text-stone-500">Escolha um perfil para explorar a plataforma. O menu e as permissões mudam conforme o grupo.</p>
          <div className="mt-5 flex max-h-[420px] flex-col gap-2 overflow-y-auto pr-1 scroll-thin">
            {demo.map((u) => {
              const g = grupoById(u.grupoId);
              return (
                <button key={u.id} type="button" data-action="login" data-user={u.id} onClick={() => login(u.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-left transition hover:border-brand-600 hover:bg-brand-50/60">
                  <Avatar name={u.nome} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-semibold text-slate-800">{u.nome}</span>
                    <span className="block truncate text-[11px] text-stone-500">{g.nome} · {roleOf(u)}</span>
                  </span>
                  <span className="rounded-full border border-brand-600/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-700">{roleOf(u)}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-5 flex items-start gap-2 border-t border-dashed border-stone-200 pt-4 text-[11px] leading-relaxed text-stone-500">
            <I.alert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span>Protótipo local com dados fictícios. A sessão e as alterações ficam salvas neste navegador até você restaurar a demonstração.</span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- shell ---------- */
function navBadge(id) {
  if (id === "avaliacoes") {
    const n = avaliacoesVisiveis().filter(avaliacaoAberta).length;
    return n ? <span className="ml-auto rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-slate-300">{n}</span> : null;
  }
  if (id === "financeiro") {
    const n = mensalidadesVisiveis().filter((m) => statusMensalidade(m) === "VENCIDA").length;
    return n ? <span className="ml-auto rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-slate-300">{n}</span> : null;
  }
  if (id === "presenca") {
    const n = sessoesVisiveis().filter((s) => s.status === "ABERTA").length;
    return n ? <span className="ml-auto rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-slate-300">{n}</span> : null;
  }
  if (id === "agenda" && podeAprovarAgenda()) {
    const n = state.solicitacoes.filter((s) => s.status === "PENDENTE").length;
    return n ? <span className="ml-auto rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-slate-300">{n}</span> : null;
  }
  return null;
}
function NavItem({ id, label, icon: Icon, href, active, children }) {
  return (
    <a href={href} className={`nav-item flex items-center gap-2.5 whitespace-nowrap rounded-lg border px-2.5 py-2 text-[12.5px] transition ${active ? "border-brand-300/20 bg-brand-400/10 text-white" : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"}`}>
      {Icon && <Icon className={`h-[18px] w-[18px] ${active ? "text-brand-300" : "text-slate-500"}`} strokeWidth={1.8} />}
      <span className="hidden sm:inline">{label}</span>
      {navBadge(id)}
      {children}
    </a>
  );
}
function Shell({ route, children }) {
  const u = user();
  const g = group();
  const modules = allowedModules();
  const title = route === "painel" ? "Painel" : route === "acesso" ? "Acesso" : moduleById(route) ? moduleById(route).nome : "EduGestor";
  return (
    <div className="min-h-screen bg-stone-100 lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
      <aside className="sticky top-0 z-30 flex items-center gap-3 overflow-x-auto border-b border-white/5 bg-slate-950 px-4 py-2.5 text-slate-300 scroll-thin lg:h-screen lg:w-[264px] lg:flex-col lg:items-stretch lg:overflow-visible lg:border-b-0 lg:border-r lg:px-4 lg:py-5">
        <a href="#/painel" className="shrink-0"><Logo light /></a>
        <div className="hidden text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600 lg:mt-6 lg:block lg:px-2">Visão geral</div>
        <nav className="flex flex-1 items-center gap-1 lg:flex-col lg:items-stretch lg:gap-0.5" aria-label="Navegação principal">
          <NavItem id="painel" label="Painel" icon={I.dashboard} href="#/painel" active={route === "painel"} />
        </nav>
        <div className="hidden text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600 lg:mt-3 lg:block lg:px-2">Módulos</div>
        <nav className="flex flex-1 items-center gap-1 lg:flex-col lg:items-stretch lg:gap-0.5" aria-label="Módulos">
          {modules.map((m) => (
            <NavItem key={m.id} id={m.id} label={m.nome} icon={MODULE_ICONS[m.icone]} href={m.rota} active={route === m.id} />
          ))}
          {isRoot() && <NavItem id="acesso" label="Acesso e módulos" icon={I.settings} href="#/acesso" active={route === "acesso"} />}
        </nav>
        <div className="ml-auto hidden lg:ml-0 lg:mt-auto lg:block">
          <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2.5">
            <Avatar name={u.nome} size="sm" dark />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-semibold text-white">{u.nome}</div>
              <div className="truncate text-[10px] text-slate-400">{g ? g.nome : "—"} · {u.papel}</div>
            </div>
            <button type="button" data-action="logout" onClick={logout} aria-label="Sair" className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white">
              <I.logout className="h-4 w-4" />
            </button>
          </div>
        </div>
        <button type="button" data-action="logout" onClick={logout} aria-label="Sair" className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white lg:hidden">
          <I.logout className="h-4 w-4" />
        </button>
      </aside>
      <div className="min-w-0">
        <header className="relative z-20 flex h-[62px] items-center gap-3 border-b border-stone-200 bg-stone-100/85 px-4 backdrop-blur sm:px-6 lg:sticky lg:top-0 lg:h-[70px] lg:gap-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 text-[11px] text-stone-500">
            <span className="hidden sm:inline">EduGestor</span><span className="hidden sm:inline">/</span><strong className="truncate font-semibold text-slate-700">{title}</strong>
          </div>
          <div className="ml-auto" />
          <form className="relative hidden w-[min(320px,32vw)] sm:block" data-form="global-search" role="search" onSubmit={submitGlobalSearch}>
            <I.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input name="q" type="search" placeholder="Buscar no acervo..." aria-label="Buscar no acervo" className="h-9 w-full rounded-full border border-stone-300 bg-white/80 pl-9 pr-3 text-[12px] outline-none focus:border-brand-600" />
          </form>
          <span className="hidden whitespace-nowrap text-[11.5px] text-stone-500 xl:inline">{dayOf(TODAY)}, {fmtDate(TODAY)}</span>
          <span className="hidden h-6 w-px bg-stone-300 xl:block" />
          <div className="hidden items-center gap-2 sm:flex"><Avatar name={u.nome} size="sm" /><span className="hidden text-[12px] font-semibold text-slate-700 lg:inline">{u.nome.split(" ")[0]}</span></div>
        </header>
        <main className="mx-auto max-w-[1480px] px-4 pb-14 pt-5 sm:px-6 lg:px-8 lg:pt-7">
          <div id="view">{children}</div>
        </main>
      </div>
    </div>
  );
}

/* ---------- dashboard ---------- */
function Dashboard() {
  const u = user();
  const a = student();
  const name = a ? a.nome.split(" ")[0] : u.nome.split(" ")[0];
  const hasAval = canAccess("avaliacoes");
  const hasFin = canAccess("financeiro");
  const hasPres = canAccess("presenca");
  const hasAgenda = canAccess("agenda");
  const hasBib = canAccess("biblioteca");

  const finList = hasFin ? mensalidadesVisiveis() : [];
  const aberto = finList.reduce((sum, m) => sum + saldoDa(m), 0);
  const vencidas = finList.filter((m) => statusMensalidade(m) === "VENCIDA");
  const abertas = hasAval ? avaliacoesVisiveis().filter(avaliacaoAberta) : [];
  const freq = hasPres ? (isStudent() ? frequenciaDoAluno() : frequenciaGeral()) : null;
  const media = hasAval
    ? isStudent()
      ? mediaDoAluno()
      : (() => {
          const vals = avaliacoesVisiveis().map((av) => mediaAvaliacao(av.id)).filter((v) => v !== null);
          return vals.length ? vals.reduce((x, y) => x + y, 0) / vals.length : null;
        })()
    : null;
  const exemplares = hasBib ? state.exemplares : [];
  const disponiveis = exemplares.filter((e) => e.status === "DISPONIVEL").length;
  const nextEvents = state.eventos.filter((e) => e.inicio.slice(0, 10) >= "2026-10-27").sort((x, y) => String(x.inicio).localeCompare(String(y.inicio)));
  const pending = hasAgenda ? state.solicitacoes.filter((s) => s.status === "PENDENTE") : [];
  const upcoming = [];
  if (hasPres) sessoesVisiveis().filter((s) => s.data >= "2026-10-27").forEach((s) => upcoming.push({ tipo: "sessao", data: s.data, item: s }));
  if (hasAgenda) nextEvents.forEach((e) => upcoming.push({ tipo: "evento", data: e.inicio.slice(0, 10), item: e }));
  upcoming.sort((x, y) => x.data.localeCompare(y.data));
  const destaques = abertas.slice(0, 3);

  const kpis = [];
  if (hasAval) kpis.push(<Kpi key="av" label="Avaliações abertas" value={abertas.length} foot={`${avaliacoesVisiveis().length} no seu recorte`} tone="violet" icon={I.clipboard} />);
  if (hasFin) kpis.push(<Kpi key="fin" label={isStudent() ? "Em aberto" : "A receber"} value={money(aberto)} foot={`${vencidas.length} vencida(s)`} tone="amber" icon={I.wallet} />);
  if (hasPres) kpis.push(<Kpi key="pres" label="Frequência" value={freq === null ? "—" : `${freq}%`} foot={isStudent() ? "Média das suas matrículas" : "Média das turmas"} tone="brand" icon={I.calCheck} />);
  if (hasBib) kpis.push(<Kpi key="bib" label="Acervo disponível" value={<>{disponiveis}<span className="text-sm text-stone-400">/{exemplares.length}</span></>} foot={`${state.livros.length} títulos catalogados`} tone="pink" icon={I.book} />);
  if (hasAgenda) kpis.push(<Kpi key="age" label="Próximo evento" value={nextEvents[0] ? fmtShort(nextEvents[0].inicio) : "—"} foot={nextEvents[0] ? nextEvents[0].titulo : "sem eventos futuros"} tone="blue" icon={I.cal} />);
  if (kpis.length < 3) kpis.push(<Kpi key="mat" label="Matrículas ativas" value={isStudent() ? minhasMatriculas().length : state.matriculas.filter((m) => m.status === "ATIVA").length} foot="no semestre" tone="brand" icon={I.users} />);
  if (kpis.length < 4) kpis.push(<Kpi key="tur" label="Turmas" value={turmasVisiveis().length} foot="no seu recorte" tone="violet" icon={I.dashboard} />);

  const pendencias = [];
  if (hasFin && vencidas.length) pendencias.push({ tone: "danger", icon: I.wallet, titulo: `${vencidas.length} mensalidade(s) vencida(s)`, texto: isStudent() ? "Regularize para liberar novas matrículas." : "Há cobranças em atraso no financeiro.", href: "#/financeiro", label: "Abrir financeiro" });
  if (hasAval && isStudent()) {
    const semTentativa = abertas.filter((av) => {
      const m = matriculaDoAlunoNaTurma(av.turmaId);
      return m && !ultimaTentativa(av.id, m.id);
    });
    if (semTentativa.length) pendencias.push({ tone: "warn", icon: I.clipboard, titulo: `${semTentativa.length} avaliação(ões) sem tentativa`, texto: "Algumas avaliações abertas ainda não foram iniciadas.", href: "#/avaliacoes", label: "Ver avaliações" });
  }
  if (hasAgenda && podeAprovarAgenda() && pending.length) pendencias.push({ tone: "warn", icon: I.cal, titulo: `${pending.length} solicitação(ões) de agenda`, texto: "Pedidos de alteração aguardam sua análise.", href: "#/agenda", label: "Analisar agenda" });
  if (hasPres && isTeacher()) {
    const abertasSessoes = sessoesVisiveis().filter((s) => s.status === "ABERTA");
    if (abertasSessoes.length) pendencias.push({ tone: "info", icon: I.calCheck, titulo: `${abertasSessoes.length} chamada(s) em aberto`, texto: "Registre a presença das suas turmas.", href: "#/presenca", label: "Fazer chamada" });
  }
  if (!pendencias.length) pendencias.push({ tone: "ok", icon: I.check, titulo: "Tudo em dia", texto: "Não há pendências para o seu perfil agora.", href: "#/painel", label: "Atualizar" });

  let secondPanel = null;
  if (hasAval) {
    secondPanel = (
      <section className={PANEL}>
        <div className="mb-3 flex items-center justify-between gap-3"><h2 className="font-display text-lg text-slate-900">Avaliações em destaque</h2><a className={BTN_GHOST} href="#/avaliacoes">Ver todas <I.arrow className="h-4 w-4" /></a></div>
        {destaques.length ? <div className="grid gap-3 md:grid-cols-2">{destaques.map((av) => <MiniAssessment key={av.id} av={av} />)}</div> : <Empty icon={I.clipboard} title="Sem avaliações abertas" text="Quando uma avaliação for publicada, ela aparece aqui." />}
      </section>
    );
  } else if (hasBib) {
    secondPanel = (
      <section className={PANEL}>
        <div className="mb-3 flex items-center justify-between gap-3"><h2 className="font-display text-lg text-slate-900">Acervo em destaque</h2><a className={BTN_GHOST} href="#/biblioteca">Abrir biblioteca <I.arrow className="h-4 w-4" /></a></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{state.livros.slice(0, 3).map((b) => <BookCard key={b.id} book={b} compact />)}</div>
      </section>
    );
  } else if (hasFin) {
    const recent = state.pagamentos.filter((p) => finList.some((m) => m.id === p.mensalidadeId)).sort((x, y) => String(y.data).localeCompare(String(x.data))).slice(0, 3);
    secondPanel = (
      <section className={PANEL}>
        <div className="mb-3 flex items-center justify-between gap-3"><h2 className="font-display text-lg text-slate-900">Últimos pagamentos</h2><a className={BTN_GHOST} href="#/financeiro">Ver financeiro <I.arrow className="h-4 w-4" /></a></div>
        {recent.length ? <div>{recent.map((p) => {
          const m = state.mensalidades.find((x) => x.id === p.mensalidadeId);
          const mat = m ? state.matriculas.find((x) => x.id === m.matriculaId) : null;
          return <div key={p.id} className="flex items-center gap-3 border-b border-stone-100 py-2.5 last:border-0">
            <span className={`grid h-9 w-9 place-items-center rounded-xl ${KPI_TONES.green}`}><I.check className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1"><div className="text-[12.5px] font-semibold text-slate-800">{mat ? alunoById(mat.alunoId).nome : "Pagamento"}</div><div className="text-[10.5px] text-stone-500">{m ? fmtCompetencia(m.competencia) : ""} · {fmtDateTime(p.data)}</div></div>
            <strong className="text-[12px] text-slate-800">{money(p.valor)}</strong>
          </div>;
        })}</div> : <Empty icon={I.wallet} title="Sem pagamentos" text="As baixas registradas aparecem aqui." />}
      </section>
    );
  } else if (hasAgenda) {
    secondPanel = (
      <section className={PANEL}>
        <div className="mb-3 flex items-center justify-between gap-3"><h2 className="font-display text-lg text-slate-900">Próximos eventos</h2><a className={BTN_GHOST} href="#/agenda">Abrir agenda <I.arrow className="h-4 w-4" /></a></div>
        {nextEvents.length ? <div>{nextEvents.slice(0, 3).map((e) => (
          <div key={e.id} className="flex items-center gap-3 border-b border-stone-100 py-2.5 last:border-0">
            <span className={`grid h-9 w-9 place-items-center rounded-xl ${KPI_TONES.blue}`}><I.cal className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1"><div className="text-[12.5px] font-semibold text-slate-800">{e.titulo}</div><div className="text-[10.5px] text-stone-500">{fmtDate(e.inicio)} · {e.local}</div></div>
            <StatusBadge status={e.status} />
          </div>
        ))}</div> : <Empty icon={I.cal} title="Sem eventos" text="Nenhum evento futuro publicado." />}
      </section>
    );
  }

  const summary = hasPres || hasAval ? (
    <section className={PANEL}>
      <div className="mb-2 flex items-center justify-between"><h2 className="font-display text-lg text-slate-900">Resumo acadêmico</h2><span className="text-[11px] text-stone-500">2026/2</span></div>
      <div className="flex items-center gap-5">
        <div className="radial-progress shrink-0 text-brand-700" style={{ "--value": freq === null ? 0 : freq, "--size": "88px", "--thickness": "7px" }} role="progressbar">
          <span className="font-display text-[22px] text-slate-900">{freq === null ? "—" : freq + "%"}</span>
          <small className="text-[8px] uppercase tracking-wide text-stone-500">frequência</small>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between border-b border-dashed border-stone-200 py-1.5 text-[12px]"><span className="text-stone-500">Média ponderada</span><strong className="font-display text-[18px] text-slate-900">{media === null ? "—" : media.toFixed(1)}</strong></div>
          <div className="flex items-baseline justify-between border-b border-dashed border-stone-200 py-1.5 text-[12px]"><span className="text-stone-500">Matrículas ativas</span><strong className="font-display text-[18px] text-slate-900">{isStudent() ? minhasMatriculas().length : state.matriculas.filter((m) => m.status === "ATIVA").length}</strong></div>
          <div className="flex items-baseline justify-between py-1.5 text-[12px]"><span className="text-stone-500">Tentativas</span><strong className="font-display text-[18px] text-slate-900">{isStudent() ? state.tentativas.filter((t) => minhasMatriculas().some((m) => m.id === t.matriculaId)).length : state.tentativas.length}</strong></div>
        </div>
      </div>
      <p className="mt-3 border-t border-stone-100 pt-3 text-[10.5px] text-stone-500">Aprovação: média ≥ 6,0 e frequência ≥ 75%.</p>
    </section>
  ) : hasFin ? (
    <section className={PANEL}>
      <div className="mb-2 flex items-center justify-between"><h2 className="font-display text-lg text-slate-900">Resumo financeiro</h2><span className="text-[11px] text-stone-500">2026/2</span></div>
      <div className="flex items-baseline justify-between border-b border-dashed border-stone-200 py-2 text-[12px]"><span className="text-stone-500">Em aberto</span><strong className="font-display text-[20px] text-slate-900">{money(aberto)}</strong></div>
      <div className="flex items-baseline justify-between border-b border-dashed border-stone-200 py-2 text-[12px]"><span className="text-stone-500">Recebido</span><strong className="font-display text-[20px] text-slate-900">{money(finList.reduce((s, m) => s + Number(m.valor) - Number(m.desconto), 0) - aberto)}</strong></div>
      <div className="flex items-baseline justify-between py-2 text-[12px]"><span className="text-stone-500">Vencidas</span><strong className="font-display text-[20px] text-slate-900">{vencidas.length}</strong></div>
      <Progress className="mt-2" value={finList.length ? Math.round(((finList.length - vencidas.length) / finList.length) * 100) : 100} />
    </section>
  ) : (
    <section className={PANEL}>
      <div className="mb-2"><h2 className="font-display text-lg text-slate-900">Resumo do acervo</h2></div>
      <div className="flex items-baseline justify-between border-b border-dashed border-stone-200 py-2 text-[12px]"><span className="text-stone-500">Títulos</span><strong className="font-display text-[20px] text-slate-900">{state.livros.length}</strong></div>
      <div className="flex items-baseline justify-between border-b border-dashed border-stone-200 py-2 text-[12px]"><span className="text-stone-500">Exemplares</span><strong className="font-display text-[20px] text-slate-900">{state.exemplares.length}</strong></div>
      <div className="flex items-baseline justify-between py-2 text-[12px]"><span className="text-stone-500">Disponíveis</span><strong className="font-display text-[20px] text-slate-900">{disponiveis}</strong></div>
      <Progress className="mt-2" value={state.exemplares.length ? Math.round((disponiveis / state.exemplares.length) * 100) : 0} />
    </section>
  );

  return (
    <>
      <PageHead eyebrow="Visão geral" title={`Olá, ${name}`} sub={`Um recorte do semestre 2026/2 · ${dayOf(TODAY)}, ${fmtDate(TODAY)}.`} actions={<a className={BTN} href="#/agenda"><I.cal className="h-4 w-4" /> Agenda</a>} />
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" style={{ "--kpi-cols": Math.min(4, kpis.length) }}>{kpis.slice(0, 4)}</div>
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {allowedModules().map((m) => {
          const Icon = MODULE_ICONS[m.icone];
          return (
            <a key={m.id} href={m.rota} className={`${CARD} group flex flex-col gap-2.5 p-4 transition hover:-translate-y-0.5 hover:border-brand-600`}>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-700 group-hover:bg-brand-700 group-hover:text-white" style={{ color: m.cor, backgroundColor: m.corSuave }}><Icon className="h-5 w-5" strokeWidth={1.7} /></span>
              <h3 className="text-[15px] font-bold tracking-tight text-slate-800">{m.nome}</h3>
              <p className="text-[11.5px] leading-snug text-stone-500">{m.descricao}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: m.cor }}>Abrir módulo <I.arrow className="h-3.5 w-3.5" /></span>
            </a>
          );
        })}
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
        <div className="flex min-w-0 flex-col gap-4">
          {(hasPres || hasAgenda) && (
            <section className={PANEL}>
              <div className="mb-2 flex items-center justify-between gap-3"><h2 className="font-display text-lg text-slate-900">Próximos compromissos</h2><span className="text-[11px] text-stone-500">{upcoming.length} item(ns)</span></div>
              {upcoming.length ? <div>{upcoming.slice(0, 5).map(({ tipo, item }, idx) => {
                const isSession = tipo === "sessao";
                const title = isSession ? item.tema : item.titulo;
                const sub = isSession ? `${turmaById(item.turmaId).codigo} · ${turmaById(item.turmaId).componente}` : `${item.tipo} · ${item.local}`;
                const date = isSession ? `${fmtDate(item.data)} · ${item.inicio}` : `${fmtDate(item.inicio)} · ${item.inicio.slice(11, 16)}`;
                return <div key={idx} className="flex items-center gap-3 border-b border-stone-100 py-2.5 last:border-0">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${isSession ? KPI_TONES.brand : KPI_TONES.blue}`}>{isSession ? <I.calCheck className="h-4 w-4" /> : <I.cal className="h-4 w-4" />}</span>
                  <div className="min-w-0 flex-1"><div className="truncate text-[12.5px] font-semibold text-slate-800">{title}</div><div className="truncate text-[10.5px] text-stone-500">{sub}</div></div>
                  <div className="text-right"><div className="whitespace-nowrap text-[10.5px] font-semibold text-slate-700">{date}</div><div className="text-[10px] text-stone-400">{item.status || ""}</div></div>
                </div>;
              })}</div> : <Empty icon={I.cal} title="Agenda livre" text="Nenhum compromisso futuro nos seus módulos." />}
            </section>
          )}
          {secondPanel}
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <section className={PANEL}>
            <div className="mb-2 flex items-center justify-between"><h2 className="font-display text-lg text-slate-900">Pendências</h2><span className={`${BADGE.warn} text-[10px] font-bold`}>{pendencias.length}</span></div>
            <div className="flex flex-col gap-2.5">
              {pendencias.slice(0, 3).map((p, idx) => {
                const tone = p.tone === "ok" ? "info" : p.tone;
                const cls = tone === "danger" ? "border-red-200 bg-red-50 text-red-800" : tone === "warn" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-blue-200 bg-blue-50 text-blue-800";
                const Icon = p.icon;
                return <div key={idx} className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-[12px] ${cls}`}>
                  <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                  <div><strong className="block text-[12px]">{p.titulo}</strong><span className="mt-0.5 block text-[10.5px] opacity-80">{p.texto}</span><a href={p.href} className="mt-1 inline-block text-[10.5px] font-bold underline-offset-2 hover:underline">{p.label} →</a></div>
                </div>;
              })}
            </div>
          </section>
          {summary}
        </div>
      </div>
    </>
  );
}
function MiniAssessment({ av }) {
  const m = isStudent() ? matriculaDoAlunoNaTurma(av.turmaId) : null;
  const tt = m ? ultimaTentativa(av.id, m.id) : null;
  return (
    <article className={`${CARD} flex flex-col gap-3 p-3.5`}>
      <div className="flex items-start justify-between gap-2">
        <div><h3 className="text-[13.5px] font-bold leading-snug text-slate-800">{av.titulo}</h3><div className="mt-1 flex flex-wrap gap-2 text-[10.5px] text-stone-500"><span>{turmaById(av.turmaId).codigo}</span><span>peso {av.peso}</span></div></div>
        <StatusBadge status={avaliacaoAberta(av) ? "PUBLICADA" : av.status} />
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-dashed border-stone-200 pt-2.5">
        {tt ? <div className="font-display text-2xl leading-none text-slate-900">{Number(tt.pontuacao).toFixed(1)}<span className="text-[10px] text-stone-500">/10</span></div> : <span className="text-[10.5px] text-stone-500">Sem tentativa</span>}
        <a className={avaliacaoAberta(av) && !tt ? BTN_PRIMARY : BTN} href="#/avaliacoes">{tt ? "Ver resultado" : "Abrir"}</a>
      </div>
    </article>
  );
}

/* ---------- avaliações ---------- */
function Avaliacoes() {
  const tab = ui.tab.avaliacoes || "avaliacoes";
  const staffView = isStaff() || isTeacher();
  const abertas = avaliacoesVisiveis().filter(avaliacaoAberta);
  const media = isStudent() ? mediaDoAluno() : null;
  const myAttempts = isStudent() ? state.tentativas.filter((t) => minhasMatriculas().some((m) => m.id === t.matriculaId)).sort((a, b) => b.fim.localeCompare(a.fim)) : [];
  const headerActions = staffView ? <span className={`${BADGE.purple} text-[10px] font-bold`}>{abertas.length} aberta(s)</span> : <a className={BTN} href="#/avaliacoes" onClick={(e) => { e.preventDefault(); ui.tab.avaliacoes = "tentativas"; notify(); }}><I.file className="h-4 w-4" /> Minhas tentativas</a>;
  return (
    <>
      <PageHead eyebrow="Módulo Avaliações" title="Desempenho e tentativas" sub="Provas, trabalhos e configuração de gestão acadêmica." actions={headerActions} />
      {isStudent() ? (
        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi label="Média ponderada" value={media === null ? "—" : media.toFixed(1)} foot="peso das avaliações" tone="violet" icon={I.chart} />
          <Kpi label="Avaliações abertas" value={abertas.length} foot="disponíveis agora" tone="brand" icon={I.clipboard} />
          <Kpi label="Tentativas" value={myAttempts.length} foot="registradas no semestre" tone="blue" icon={I.file} />
          <Kpi label="Aprovação" value={media !== null && media >= 6 ? "No caminho" : "Atenção"} foot="média mínima 6,0" tone={media !== null && media >= 6 ? "green" : "amber"} icon={I.check} />
        </div>
      ) : (
        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi label="Avaliações" value={avaliacoesVisiveis().length} foot="no seu recorte" tone="violet" icon={I.clipboard} />
          <Kpi label="Publicadas" value={avaliacoesVisiveis().filter((a) => a.status === "PUBLICADA").length} foot="disponíveis aos alunos" tone="brand" icon={I.check} />
          <Kpi label="Tentativas" value={state.tentativas.length} foot="registradas" tone="blue" icon={I.file} />
          <Kpi label="Média geral" value={(() => { const vals = avaliacoesVisiveis().map((av) => mediaAvaliacao(av.id)).filter((v) => v !== null); return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "—"; })()} foot="das avaliações com nota" tone="amber" icon={I.chart} />
        </div>
      )}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="tabs tabs-boxed bg-stone-200/70 p-1">
          <button type="button" className={`tab h-8 rounded-lg text-[11.5px] font-semibold ${tab === "avaliacoes" ? "tab-active bg-white text-slate-900 shadow-sm" : "text-stone-500"}`} onClick={() => { ui.tab.avaliacoes = "avaliacoes"; notify(); }}>{staffView ? "Avaliações" : "Minhas avaliações"}</button>
          <button type="button" className={`tab h-8 rounded-lg text-[11.5px] font-semibold ${tab === "tentativas" ? "tab-active bg-white text-slate-900 shadow-sm" : "text-stone-500"}`} onClick={() => { ui.tab.avaliacoes = "tentativas"; notify(); }}>{staffView ? "Tentativas" : "Minhas tentativas"}</button>
        </div>
        <span className="text-[11px] text-stone-500">{staffView ? (isTeacher() ? "Somente suas turmas" : "Todas as turmas visíveis") : "Somente seus registros"}</span>
      </div>
      {tab === "tentativas" ? (staffView ? <TentativasStaff /> : <MinhasTentativas attempts={myAttempts} />) : (staffView ? <AvaliacoesStaff /> : <AvaliacoesAluno />)}
      {isStudent() && (
        <div className={`${PANEL} mt-4`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-700">Regra de negócio</p><h3 className="mt-1 font-display text-lg text-slate-900">Como a nota é calculada</h3><p className="mt-1 text-[12.5px] text-stone-500">A pontuação da tentativa soma as questões corretas. A média final pondera cada avaliação pelo peso.</p></div>
            <span className={`${BADGE.purple} text-[10px] font-bold`}>média ≥ 6,0</span>
          </div>
        </div>
      )}
    </>
  );
}
function AvaliacoesAluno() {
  const list = avaliacoesVisiveis();
  if (!list.length) return <div className={PANEL}><Empty icon={I.clipboard} title="Nenhuma avaliação" text="Não há avaliações para as suas turmas neste semestre." /></div>;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {list.map((av) => {
        const mat = matriculaDoAlunoNaTurma(av.turmaId);
        const ts = mat ? tentativasDa(av.id, mat.id) : [];
        const last = ts[0] || null;
        const max = av.gestao ? av.gestao.maxTentativas : 1;
        const used = ts.length;
        const canStart = mat && avaliacaoAberta(av) && used < max && av.questoes.length > 0;
        return (
          <article key={av.id} className={`${CARD} assessment-card flex flex-col gap-3 p-4`}>
            <div className="flex items-start justify-between gap-3">
              <div><h3 className="text-[14.5px] font-bold leading-snug text-slate-800">{av.titulo}</h3>
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-stone-500">
                  <span className="inline-flex items-center gap-1"><I.users className="h-3 w-3" /> {turmaById(av.turmaId).codigo}</span>
                  <span className="inline-flex items-center gap-1"><I.clipboard className="h-3 w-3" /> {av.tipo} · peso {av.peso}</span>
                  <span className="inline-flex items-center gap-1"><I.clock className="h-3 w-3" /> até {fmtDateTime(av.fim)}</span>
                </div>
              </div>
              <StatusBadge status={avaliacaoAberta(av) ? "ABERTA" : av.status} />
            </div>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-stone-200 pt-3">
              <div>{last ? <><div className="font-display text-2xl leading-none text-slate-900">{Number(last.pontuacao).toFixed(1)}<span className="text-[10px] text-stone-500">/10</span></div><span className="text-[10.5px] text-stone-500">{used} de {max} tentativa(s)</span></> : <span className="text-[10.5px] text-stone-500">Sem tentativa · {max} disponível(is)</span>}</div>
              {last ? (
                <div className="flex gap-2">
                  <button type="button" className={BTN} data-action="view-attempt" data-id={last.id} onClick={() => openAttemptResult(last.id)}><I.file className="h-4 w-4" /> Ver resultado</button>
                  {canStart && <button type="button" className={BTN_PRIMARY} data-action="start-attempt" data-id={av.id} onClick={() => openAttempt(av.id)}><I.plus className="h-4 w-4" /> Nova tentativa</button>}
                </div>
              ) : canStart ? (
                <button type="button" className={BTN_PRIMARY} data-action="start-attempt" data-id={av.id} onClick={() => openAttempt(av.id)}><I.plus className="h-4 w-4" /> Iniciar tentativa</button>
              ) : (
                <span className="text-[10.5px] text-stone-500">{av.status === "RASCUNHO" ? "Aguardando publicação" : "Fora da janela"}</span>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
function AvaliacoesStaff() {
  const list = avaliacoesVisiveis();
  if (!list.length) return <div className={PANEL}><Empty icon={I.clipboard} title="Nenhuma avaliação" text="Não há avaliações nas turmas do seu recorte." /></div>;
  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
      <table className="table table-sm">
        <thead><tr className="text-[10px] uppercase tracking-wide text-stone-500"><th>Avaliação</th><th>Turma</th><th>Professor</th><th>Período</th><th className="text-right">Peso</th><th className="text-right">Tentativas</th><th className="text-right">Média</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {list.map((av) => {
            const ts = tentativasDa(av.id);
            const media = mediaAvaliacao(av.id);
            return (
              <tr key={av.id} className="hover:bg-brand-50/40">
                <td><div className="text-[12.5px] font-semibold text-slate-800">{av.titulo}</div><div className="text-[10.5px] text-stone-500">{av.tipo} · {av.questoes.length} questão(ões)</div></td>
                <td>{turmaById(av.turmaId).codigo}<div className="text-[10.5px] text-stone-500">{turmaById(av.turmaId).componente}</div></td>
                <td>{professorById(av.professorId).nome}</td>
                <td className="whitespace-nowrap">{fmtDate(av.inicio)}<div className="text-[10.5px] text-stone-500">até {fmtDate(av.fim)}</div></td>
                <td className="text-right">{av.peso}</td>
                <td className="text-right">{ts.length}</td>
                <td className="text-right">{media === null ? "—" : media.toFixed(1)}</td>
                <td><StatusBadge status={av.status} /></td>
                <td className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <button type="button" className={BTN} data-action="view-assessment" data-id={av.id} onClick={() => openAssessmentStats(av.id)}><I.chart className="h-4 w-4" /> Ver</button>
                    {av.status === "RASCUNHO" && <button type="button" className={BTN_PRIMARY} data-action="publish-assessment" data-id={av.id} onClick={() => publishAssessment(av.id)}>Publicar</button>}
                    {av.status === "PUBLICADA" && <button type="button" className={BTN} data-action="close-assessment" data-id={av.id} onClick={() => closeAssessment(av.id)}>Encerrar</button>}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
function MinhasTentativas({ attempts }) {
  if (!attempts.length) return <div className={PANEL}><Empty icon={I.file} title="Nenhuma tentativa" text="Você ainda não iniciou nenhuma avaliação." /></div>;
  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
      <table className="table table-sm">
        <thead><tr className="text-[10px] uppercase tracking-wide text-stone-500"><th>Avaliação</th><th>Turma</th><th>Número</th><th>Enviada em</th><th className="text-right">Nota</th><th>Status</th><th></th></tr></thead>
        <tbody>{attempts.map((t) => {
          const av = state.avaliacoes.find((a) => a.id === t.avaliacaoId);
          return <tr key={t.id}><td><div className="text-[12.5px] font-semibold text-slate-800">{av ? av.titulo : "—"}</div><div className="text-[10.5px] text-stone-500">peso {av ? av.peso : "—"}</div></td><td>{av ? turmaById(av.turmaId).codigo : "—"}</td><td>{t.numero}</td><td className="whitespace-nowrap">{fmtDateTime(t.fim)}</td><td className="text-right font-semibold">{Number(t.pontuacao).toFixed(1)}</td><td><StatusBadge status={t.status === "FINALIZADA" ? "CONCLUIDA" : t.status} /></td><td className="text-right"><button type="button" className={BTN} data-action="view-attempt" data-id={t.id} onClick={() => openAttemptResult(t.id)}><I.file className="h-4 w-4" /> Detalhes</button></td></tr>;
        })}</tbody>
      </table>
    </div>
  );
}
function TentativasStaff() {
  const list = state.tentativas.filter((t) => avaliacoesVisiveis().some((a) => a.id === t.avaliacaoId)).sort((a, b) => b.fim.localeCompare(a.fim));
  if (!list.length) return <div className={PANEL}><Empty icon={I.file} title="Nenhuma tentativa" text="Ainda não há tentativas nas avaliações do seu recorte." /></div>;
  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
      <table className="table table-sm">
        <thead><tr className="text-[10px] uppercase tracking-wide text-stone-500"><th>Aluno</th><th>Avaliação</th><th>Turma</th><th>Enviada em</th><th className="text-right">Nota</th><th></th></tr></thead>
        <tbody>{list.map((t) => {
          const av = state.avaliacoes.find((a) => a.id === t.avaliacaoId);
          const mat = state.matriculas.find((m) => m.id === t.matriculaId);
          return <tr key={t.id}><td>{mat ? alunoById(mat.alunoId).nome : "—"}<div className="text-[10.5px] text-stone-500">{mat ? alunoById(mat.alunoId).ra : "—"}</div></td><td>{av ? av.titulo : "—"}</td><td>{av ? turmaById(av.turmaId).codigo : "—"}</td><td className="whitespace-nowrap">{fmtDateTime(t.fim)}</td><td className="text-right font-semibold">{Number(t.pontuacao).toFixed(1)}</td><td className="text-right"><button type="button" className={BTN} data-action="view-attempt" data-id={t.id} onClick={() => openAttemptResult(t.id)}>Detalhes</button></td></tr>;
        })}</tbody>
      </table>
    </div>
  );
}

function openAttempt(avId) {
  const av = state.avaliacoes.find((a) => a.id === avId);
  const mat = av ? matriculaDoAlunoNaTurma(av.turmaId) : null;
  if (!av || !mat) return toast("Matrícula não encontrada para esta avaliação.", "error");
  const ts = tentativasDa(av.id, mat.id);
  const max = av.gestao ? av.gestao.maxTentativas : 1;
  if (ts.length >= max) return toast("Limite de tentativas atingido.", "warn");
  if (!avaliacaoAberta(av)) return toast("A avaliação está fora da janela de tentativa.", "warn");
  if (!av.questoes.length) return toast("A avaliação ainda não possui questões.", "warn");
  openModal({
    eyebrow: `Tentativa ${ts.length + 1} de ${max}`,
    title: av.titulo,
    size: "lg",
    body: () => (
      <>
        <div className="alert alert-info mb-3 border-blue-200 bg-blue-50 text-blue-900"><I.clock className="h-4 w-4" /><div><strong className="text-[12px]">Janela aberta até {fmtDateTime(av.fim)}</strong><div className="text-[11px]">A nota é calculada pela soma das questões corretas. Cada questão vale os pontos indicados.</div></div></div>
        <form id="attempt-form" data-form="attempt" onSubmit={submitAttempt}>
          <input type="hidden" name="avaliacaoId" value={av.id} />
          <input type="hidden" name="matriculaId" value={mat.id} />
          {av.questoes.map((q, i) => (
            <div key={q.id} className="question-block mb-3 rounded-xl border border-stone-200 bg-white p-3.5">
              <div className="flex items-start justify-between gap-3"><h4 className="text-[13px] font-semibold text-slate-800">{i + 1}. {q.enunciado}</h4><span className="shrink-0 text-[9.5px] font-bold uppercase tracking-wide text-stone-400">{q.pontos} ponto(s)</span></div>
              <div className="mt-2 space-y-1">
                {q.alternativas.map((alt, idx) => (
                  <label key={idx} className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 text-[12.5px] text-slate-700 hover:bg-stone-50">
                    <input type="radio" name={`q-${q.id}`} value={idx} className="radio radio-xs mt-0.5" /> <span>{alt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          {modal.errors.attempt && <p className="mb-2 text-[11.5px] font-semibold text-red-600">{modal.errors.attempt}</p>}
          <p className="text-[11px] text-stone-500">Ao enviar, a tentativa é finalizada e não pode ser alterada.</p>
        </form>
      </>
    ),
    footer: () => <><button type="button" className={BTN} onClick={closeModal}>Cancelar</button><button type="submit" form="attempt-form" className={BTN_PRIMARY}><I.check className="h-4 w-4" /> Enviar tentativa</button></>,
  });
}
function submitAttempt(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const av = state.avaliacoes.find((a) => a.id === form.avaliacaoId.value);
  const mat = state.matriculas.find((m) => m.id === form.matriculaId.value);
  if (!av || !mat) return toast("Não foi possível registrar a tentativa.", "error");
  const respostas = {};
  for (const q of av.questoes) {
    const selected = form.querySelector(`input[name="q-${q.id}"]:checked`);
    if (!selected) return showFormError("attempt", "Responda todas as questões antes de enviar.");
    respostas[q.id] = Number(selected.value);
  }
  const pontuacao = av.questoes.reduce((sum, q) => sum + (respostas[q.id] === q.correta ? Number(q.pontos) : 0), 0);
  const numero = tentativasDa(av.id, mat.id).length + 1;
  const now = new Date();
  state.tentativas.push({
    id: "tt-" + Date.now(),
    avaliacaoId: av.id,
    matriculaId: mat.id,
    numero,
    inicio: new Date(now.getTime() - 20 * 60000).toISOString(),
    fim: now.toISOString(),
    status: "FINALIZADA",
    pontuacao: Math.round(pontuacao * 10) / 10,
    respostas,
  });
  commit();
  closeModal();
  toast(`Tentativa enviada. Nota: ${pontuacao.toFixed(1)}/10.`, "success");
}
function openAttemptResult(ttId) {
  const tt = state.tentativas.find((t) => t.id === ttId);
  if (!tt) return;
  const av = state.avaliacoes.find((a) => a.id === tt.avaliacaoId);
  const mat = state.matriculas.find((m) => m.id === tt.matriculaId);
  openModal({
    eyebrow: "Resultado da tentativa",
    title: av ? av.titulo : "Avaliação",
    size: "lg",
    body: () => (
      <>
        <div className="mb-4 flex items-center gap-4">
          <div className="font-display text-[52px] leading-none text-brand-700">{Number(tt.pontuacao).toFixed(1)}<span className="text-[12px] text-stone-500">/10</span></div>
          <div><div className="text-[13px] font-semibold text-slate-800">{mat ? alunoById(mat.alunoId).nome : "Aluno"}</div><div className="text-[11.5px] text-stone-500">{av ? turmaById(av.turmaId).codigo : ""} · tentativa {tt.numero} · {fmtDateTime(tt.fim)}</div><div className="mt-2"><StatusBadge status="CONCLUIDA" /></div></div>
        </div>
        {av && av.questoes.map((q, i) => {
          const selected = tt.respostas ? tt.respostas[q.id] : null;
          return (
            <div key={q.id} className="question-block mb-3 rounded-xl border border-stone-200 bg-white p-3.5">
              <div className="flex items-start justify-between gap-3"><h4 className="text-[13px] font-semibold text-slate-800">{i + 1}. {q.enunciado}</h4><span className="shrink-0 text-[9.5px] font-bold uppercase tracking-wide text-stone-400">{q.pontos} ponto(s)</span></div>
              <div className="mt-2 space-y-1">
                {q.alternativas.map((alt, idx) => {
                  const cls = idx === q.correta ? "border-emerald-200 bg-emerald-50" : idx === selected ? "border-red-200 bg-red-50" : "border-transparent";
                  return <div key={idx} className={`flex items-start gap-2 rounded-lg border px-2 py-1.5 text-[12.5px] text-slate-700 ${cls}`}><span className="w-4 font-bold">{String.fromCharCode(65 + idx)}</span><span className="flex-1">{alt}</span>{idx === q.correta && <I.check className="h-4 w-4 text-emerald-600" />}</div>;
                })}
              </div>
              <p className="mt-2 text-[10.5px] text-stone-500">{selected === q.correta ? "Resposta correta." : selected === null ? "Questão não respondida." : "Resposta incorreta."}</p>
            </div>
          );
        })}
      </>
    ),
    footer: () => <button type="button" className={BTN_PRIMARY} onClick={closeModal}>Fechar</button>,
  });
}
function openAssessmentStats(avId) {
  const av = state.avaliacoes.find((a) => a.id === avId);
  if (!av) return;
  const ts = tentativasDa(av.id);
  const media = mediaAvaliacao(av.id);
  openModal({
    eyebrow: "Gestão da avaliação",
    title: av.titulo,
    size: "lg",
    body: () => (
      <>
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {[["Turma", turmaById(av.turmaId).codigo], ["Peso", av.peso], ["Tentativas", ts.length], ["Média", media === null ? "—" : media.toFixed(1)], ["Status", STATUS_LABELS[av.status] || av.status]].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2"><span className="block text-[9px] font-bold uppercase tracking-wide text-stone-500">{k}</span><strong className="font-display text-lg text-slate-900">{v}</strong></div>
          ))}
        </div>
        <div className="overflow-x-auto rounded-lg border border-stone-200">
          <table className="table table-sm"><thead><tr className="text-[10px] uppercase tracking-wide text-stone-500"><th>Aluno</th><th>Tentativa</th><th>Enviada em</th><th className="text-right">Nota</th></tr></thead>
            <tbody>{ts.length ? ts.map((t) => { const mat = state.matriculas.find((m) => m.id === t.matriculaId); return <tr key={t.id}><td>{mat ? alunoById(mat.alunoId).nome : "—"}</td><td>{t.numero}</td><td>{fmtDateTime(t.fim)}</td><td className="text-right font-semibold">{Number(t.pontuacao).toFixed(1)}</td></tr>; }) : <tr><td colSpan="4" className="py-4 text-center text-stone-500">Sem tentativas registradas.</td></tr>}</tbody>
          </table>
        </div>
        <div className="alert alert-info mt-3 border-blue-200 bg-blue-50 text-blue-900"><I.alert className="h-4 w-4" /><div><strong className="text-[12px]">Gestão</strong><div className="text-[11px]">Limite de {av.gestao ? av.gestao.maxTentativas : 1} tentativa(s). {av.gestao && av.gestao.permiteRecuperacao ? `Recuperação habilitada com peso ${av.gestao.pesoRecuperacao}.` : "Sem recuperação."}</div></div></div>
      </>
    ),
    footer: () => <button type="button" className={BTN} onClick={closeModal}>Fechar</button>,
  });
}
function publishAssessment(id) {
  const av = state.avaliacoes.find((a) => a.id === id);
  if (!av) return;
  if (!av.questoes.length) return toast("Inclua pelo menos uma questão antes de publicar.", "warn");
  av.status = "PUBLICADA";
  commit();
  toast("Avaliação publicada.", "success");
}
function closeAssessment(id) {
  const av = state.avaliacoes.find((a) => a.id === id);
  if (!av) return;
  av.status = "ENCERRADA";
  commit();
  toast("Avaliação encerrada.", "success");
}

/* ---------- financeiro ---------- */
function Financeiro() {
  const tab = ui.tab.financeiro || "mensalidades";
  const list = mensalidadesVisiveis();
  const aberto = list.reduce((sum, m) => sum + saldoDa(m), 0);
  const vencidas = list.filter((m) => statusMensalidade(m) === "VENCIDA");
  const recebido = state.pagamentos.filter((p) => list.some((m) => m.id === p.mensalidadeId)).reduce((sum, p) => sum + Number(p.valor), 0);
  const total = list.reduce((sum, m) => sum + Number(m.valor) - Number(m.desconto), 0);
  const adimplencia = total ? Math.round(((total - aberto) / total) * 100) : 100;
  return (
    <>
      <PageHead eyebrow="Módulo Financeiro" title="Mensalidades e pagamentos" sub="Cobranças por competência, baixas parciais e métodos de pagamento." actions={<span className={`${vencidas.length ? BADGE.danger : BADGE.ok} text-[10px] font-bold`}>{vencidas.length} vencida(s)</span>} />
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Em aberto" value={money(aberto)} foot={`${list.filter((m) => statusMensalidade(m) !== "PAGA").length} cobrança(s)`} tone="amber" icon={I.wallet} />
        <Kpi label="Recebido" value={money(recebido)} foot={`${state.pagamentos.filter((p) => list.some((m) => m.id === p.mensalidadeId)).length} pagamento(s)`} tone="green" icon={I.check} />
        <Kpi label="Vencidas" value={vencidas.length} foot={vencidas.length ? "regularize para liberar matrícula" : "nenhuma pendência"} tone="red" icon={I.alert} />
        <Kpi label="Adimplência" value={`${adimplencia}%`} foot="do valor total do recorte" tone="brand" icon={I.chart} />
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="tabs tabs-boxed bg-stone-200/70 p-1">
          {[["mensalidades", "Mensalidades"], ["pagamentos", "Pagamentos"], ["metodos", "Métodos"]].map(([id, label]) => (
            <button key={id} type="button" className={`tab h-8 rounded-lg text-[11.5px] font-semibold ${tab === id ? "tab-active bg-white text-slate-900 shadow-sm" : "text-stone-500"}`} onClick={() => { ui.tab.financeiro = id; notify(); }}>{label}</button>
          ))}
        </div>
        {tab === "mensalidades" && (
          <div className="flex flex-wrap gap-1.5">
            {["TODAS", "ABERTA", "VENCIDA", "PAGA"].map((f) => (
              <button key={f} type="button" onClick={() => { ui.finFilter = f; notify(); }} className={`rounded-full border px-2.5 py-1 text-[10.5px] font-semibold ${ui.finFilter === f ? "border-slate-900 bg-slate-900 text-white" : "border-stone-300 bg-transparent text-stone-500 hover:text-slate-800"}`}>{f === "TODAS" ? "Todas" : STATUS_LABELS[f]}</button>
            ))}
          </div>
        )}
      </div>
      {tab === "mensalidades" ? <Mensalidades list={list} /> : tab === "pagamentos" ? <Pagamentos list={list} /> : <Metodos />}
    </>
  );
}
function Mensalidades({ list }) {
  let rows = list.slice().sort((a, b) => String(a.vencimento).localeCompare(String(b.vencimento)));
  if (ui.finFilter !== "TODAS") rows = rows.filter((m) => statusMensalidade(m) === ui.finFilter);
  if (!rows.length) return <div className={PANEL}><Empty icon={I.wallet} title="Nenhuma cobrança" text="Não há mensalidades para o filtro selecionado." /></div>;
  const staff = !isStudent();
  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
      <table className="table table-sm">
        <thead><tr className="text-[10px] uppercase tracking-wide text-stone-500">{staff && <th>Aluno</th>}<th>Competência</th><th>Vencimento</th><th className="text-right">Valor</th><th className="text-right">Desconto</th><th className="text-right">Saldo</th><th>Status</th><th></th></tr></thead>
        <tbody>{rows.map((m) => {
          const mat = state.matriculas.find((x) => x.id === m.matriculaId);
          const aluno = mat ? alunoById(mat.alunoId) : null;
          const saldo = saldoDa(m);
          const st = statusMensalidade(m);
          return (
            <tr key={m.id} className="hover:bg-brand-50/40">
              {staff && <td><div className="text-[12.5px] font-semibold text-slate-800">{aluno ? aluno.nome : "—"}</div><div className="text-[10.5px] text-stone-500">{mat ? turmaById(mat.turmaId).codigo : "—"} · {aluno ? aluno.ra : ""}</div></td>}
              <td className="whitespace-nowrap">{fmtCompetencia(m.competencia)}</td>
              <td className="whitespace-nowrap">{fmtDate(m.vencimento)}</td>
              <td className="text-right">{money(m.valor)}</td>
              <td className="text-right">{m.desconto ? money(m.desconto) : "—"}</td>
              <td className="text-right font-semibold">{money(saldo)}</td>
              <td><StatusBadge status={st} /></td>
              <td className="text-right">{saldo > 0 ? <button type="button" className={BTN_PRIMARY} data-action="pay-mensalidade" data-id={m.id} onClick={() => openPayment(m.id)}><I.wallet className="h-4 w-4" /> Pagar</button> : <span className="text-[10.5px] text-stone-500">Quitada</span>}</td>
            </tr>
          );
        })}</tbody>
      </table>
    </div>
  );
}
function Pagamentos({ list }) {
  const ids = list.map((m) => m.id);
  const rows = state.pagamentos.filter((p) => ids.includes(p.mensalidadeId)).sort((a, b) => String(b.data).localeCompare(String(a.data)));
  if (!rows.length) return <div className={PANEL}><Empty icon={I.wallet} title="Nenhum pagamento" text="As baixas registradas aparecem aqui." /></div>;
  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
      <table className="table table-sm">
        <thead><tr className="text-[10px] uppercase tracking-wide text-stone-500"><th>Data</th><th>Aluno</th><th>Competência</th><th>Método</th><th className="text-right">Valor</th><th>Comprovante</th><th>Status</th></tr></thead>
        <tbody>{rows.map((p) => {
          const m = state.mensalidades.find((x) => x.id === p.mensalidadeId);
          const mat = m ? state.matriculas.find((x) => x.id === m.matriculaId) : null;
          const metodo = state.metodos.find((x) => x.id === p.metodoId);
          return <tr key={p.id}><td className="whitespace-nowrap">{fmtDateTime(p.data)}</td><td>{mat ? alunoById(mat.alunoId).nome : "—"}</td><td>{m ? fmtCompetencia(m.competencia) : "—"}</td><td>{metodo ? metodo.nome : "—"}</td><td className="text-right font-semibold">{money(p.valor)}</td><td className="font-mono text-[11px]">{p.comprovante}</td><td><StatusBadge status={p.status} /></td></tr>;
        })}</tbody>
      </table>
    </div>
  );
}
function Metodos() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {state.metodos.map((m) => (
        <article key={m.id} className={PANEL}>
          <div className="flex items-center justify-between"><span className={`grid h-9 w-9 place-items-center rounded-xl ${KPI_TONES.amber}`}><I.wallet className="h-4 w-4" /></span><StatusBadge status={m.ativo ? "ATIVA" : "CANCELADA"} /></div>
          <h3 className="mt-2.5 font-display text-lg text-slate-900">{m.nome}</h3>
          <p className="text-[11.5px] text-stone-500">{m.tipo} · taxa de {m.taxa ? `${m.taxa}%` : "0%"}</p>
          <div className="my-3 h-px bg-stone-200" />
          <p className="text-[10.5px] text-stone-500">{m.taxa ? "Taxa aplicada no registro do pagamento." : "Sem taxa para a instituição."}</p>
        </article>
      ))}
    </div>
  );
}
function openPayment(mensalidadeId) {
  const m = state.mensalidades.find((x) => x.id === mensalidadeId);
  if (!m) return;
  const saldo = saldoDa(m);
  if (saldo <= 0) return toast("Esta mensalidade já está quitada.", "warn");
  const mat = state.matriculas.find((x) => x.id === m.matriculaId);
  openModal({
    eyebrow: "Registrar pagamento",
    title: `Mensalidade ${fmtCompetencia(m.competencia)}`,
    body: () => (
      <>
        <div className="alert alert-info mb-3 border-blue-200 bg-blue-50 text-blue-900"><I.wallet className="h-4 w-4" /><div><strong className="text-[12px]">{mat ? alunoById(mat.alunoId).nome : "Aluno"}</strong><div className="text-[11px]">Saldo devedor: {money(saldo)} · vencimento {fmtDate(m.vencimento)}</div></div></div>
        <form id="payment-form" data-form="payment" onSubmit={submitPayment}>
          <input type="hidden" name="mensalidadeId" value={m.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label htmlFor="pay-valor" className="mb-1 block text-[11px] font-semibold text-slate-700">Valor do pagamento</label><input className={INPUT} id="pay-valor" name="valor" type="number" min="0.01" step="0.01" max={saldo.toFixed(2)} defaultValue={saldo.toFixed(2)} required /><span className="mt-1 block text-[10px] text-stone-500">Aceita baixa parcial até {money(saldo)}.</span></div>
            <div><label htmlFor="pay-metodo" className="mb-1 block text-[11px] font-semibold text-slate-700">Método</label><select className={SELECT} id="pay-metodo" name="metodoId">{state.metodos.filter((x) => x.ativo).map((x) => <option key={x.id} value={x.id}>{x.nome}{x.taxa ? ` · taxa ${x.taxa}%` : ""}</option>)}</select></div>
            <div className="sm:col-span-2"><label htmlFor="pay-obs" className="mb-1 block text-[11px] font-semibold text-slate-700">Observação (opcional)</label><input className={INPUT} id="pay-obs" name="observacao" placeholder="Ex.: pagamento via PIX" /></div>
          </div>
          {modal.errors.payment && <p className="mt-2 text-[11.5px] font-semibold text-red-600">{modal.errors.payment}</p>}
        </form>
      </>
    ),
    footer: () => <><button type="button" className={BTN} onClick={closeModal}>Cancelar</button><button type="submit" form="payment-form" className={BTN_PRIMARY}><I.check className="h-4 w-4" /> Confirmar pagamento</button></>,
  });
}
function submitPayment(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const m = state.mensalidades.find((x) => x.id === form.mensalidadeId.value);
  if (!m) return;
  const saldo = saldoDa(m);
  const valor = Number(form.valor.value);
  if (!Number.isFinite(valor) || valor <= 0) return showFormError("payment", "Informe um valor maior que zero.");
  if (valor > saldo + 0.009) return showFormError("payment", `O valor não pode exceder o saldo de ${money(saldo)}.`);
  const now = new Date();
  state.pagamentos.push({
    id: "pag-" + Date.now(),
    mensalidadeId: m.id,
    metodoId: form.metodoId.value,
    usuarioId: user().id,
    valor,
    data: now.toISOString(),
    status: "CONFIRMADO",
    comprovante: "COMP-" + Math.floor(2000 + Math.random() * 7999),
  });
  m.status = saldoDa(m) <= 0.009 ? "PAGA" : "PARCIAL";
  commit();
  closeModal();
  toast(`Pagamento de ${money(valor)} registrado.`, "success");
}

/* ---------- presença ---------- */
function Presenca() {
  if (isStudent()) return <PresencaAluno />;
  const sessions = sessoesVisiveis();
  if (!sessions.length) return <><PageHead eyebrow="Módulo Presença" title="Chamada e frequência" sub="Registre presença por sessão." /><div className={PANEL}><Empty icon={I.calCheck} title="Nenhuma sessão" text="Não há sessões nas turmas do seu recorte." /></div></>;
  if (!ui.sessionId || !sessions.some((s) => s.id === ui.sessionId)) ui.sessionId = (sessions.find((s) => s.status === "ABERTA") || sessions[0]).id;
  const session = sessions.find((s) => s.id === ui.sessionId) || sessions[0];
  const mats = matriculasDaTurma(session.turmaId);
  const regs = state.registros.filter((r) => r.sessaoId === session.id);
  const freqVals = mats.map((m) => frequenciaDaMatricula(m.id)).filter((v) => v !== null);
  const avg = freqVals.length ? Math.round(freqVals.reduce((a, b) => a + b, 0) / freqVals.length) : null;
  const presentes = regs.filter((r) => r.status === "PRESENTE").length;
  const ausentes = regs.filter((r) => r.status === "AUSENTE").length;
  const just = regs.filter((r) => r.status === "JUSTIFICADO").length;
  const readOnly = session.status !== "ABERTA";
  return (
    <>
      <PageHead eyebrow="Módulo Presença" title="Chamada e frequência" sub="Sessões, registros por matrícula e acompanhamento da turma." actions={<button type="button" className={readOnly ? BTN : BTN_PRIMARY} data-action="toggle-session" data-id={session.id} onClick={() => toggleSession(session.id)}><I.refresh className="h-4 w-4" /> {readOnly ? "Reabrir sessão" : "Encerrar sessão"}</button>} />
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Frequência da turma" value={avg === null ? "—" : `${avg}%`} foot={`${mats.length} matrícula(s)`} tone="brand" icon={I.calCheck} />
        <Kpi label="Presentes" value={presentes} foot="na sessão selecionada" tone="green" icon={I.check} />
        <Kpi label="Ausentes" value={ausentes} foot={`${just} justificada(s)`} tone="red" icon={I.alert} />
        <Kpi label="Sessões" value={sessions.length} foot="no recorte do perfil" tone="blue" icon={I.cal} />
      </div>
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scroll-thin">
        {sessions.map((s) => (
          <button key={s.id} type="button" data-action="select-session" data-id={s.id} onClick={() => { ui.sessionId = s.id; notify(); }} className={`min-w-[112px] shrink-0 rounded-xl border px-3 py-2 text-left text-[11px] ${s.id === session.id ? "border-brand-600 bg-brand-50" : "border-stone-200 bg-white hover:border-stone-300"}`}>
            <strong className="block text-[12px] text-slate-800">{fmtDate(s.data)}</strong>{s.tema}
            <div className="mt-0.5 text-[10px] text-stone-500">{turmaById(s.turmaId).codigo} · {statusLabel(s.status)}</div>
          </button>
        ))}
      </div>
      <section className={PANEL}>
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div><h2 className="font-display text-lg text-slate-900">{session.tema}</h2><p className="text-[11.5px] text-stone-500">{turmaById(session.turmaId).codigo} · {turmaById(session.turmaId).componente} · {fmtDate(session.data)} {session.inicio}–{session.fim} · {professorById(session.professorId).nome}</p></div>
          <StatusBadge status={session.status} />
        </div>
        <form id="attendance-form" data-form="attendance" onSubmit={submitAttendance}>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="table table-sm">
              <thead><tr className="text-[10px] uppercase tracking-wide text-stone-500"><th>Aluno</th><th>RA</th><th>Frequência</th><th>Status</th><th>Justificativa</th></tr></thead>
              <tbody>{mats.map((m) => {
                const reg = regs.find((r) => r.matriculaId === m.id);
                const st = reg ? reg.status : "PRESENTE";
                const freq = frequenciaDaMatricula(m.id);
                return (
                  <tr key={m.id}>
                    <td><div className="text-[12.5px] font-semibold text-slate-800">{alunoById(m.alunoId).nome}</div><div className="text-[10.5px] text-stone-500">{m.status}</div></td>
                    <td className="font-mono text-[11px]">{alunoById(m.alunoId).ra}</td>
                    <td className="min-w-[120px]"><div className="flex items-center gap-2"><span className="w-8 text-[10.5px] text-stone-500">{freq === null ? "—" : `${freq}%`}</span><Progress value={freq || 0} className="min-w-[60px]" /></div></td>
                    <td><select key={`${session.id}-${m.id}`} className={SELECT} name={`att-${m.id}`} defaultValue={st} disabled={readOnly}>{["PRESENTE", "AUSENTE", "JUSTIFICADO"].map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}</select></td>
                    <td><input className={INPUT} name={`just-${m.id}`} defaultValue={reg ? reg.justificativa : ""} placeholder="Obrigatória se justificado" disabled={readOnly} /></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[10.5px] text-stone-500">{readOnly ? "Sessão encerrada: reabra para editar os registros." : "A frequência é recalculada ao salvar."}</span>
            <button type="submit" className={BTN_PRIMARY} disabled={readOnly}><I.check className="h-4 w-4" /> Salvar chamada</button>
          </div>
        </form>
      </section>
    </>
  );
}
function statusLabel(s) { return STATUS_LABELS[s] || s; }
function PresencaAluno() {
  const ms = minhasMatriculas();
  const regs = state.registros.filter((r) => ms.some((m) => m.id === r.matriculaId)).sort((a, b) => {
    const sa = state.sessoes.find((s) => s.id === a.sessaoId);
    const sb = state.sessoes.find((s) => s.id === b.sessaoId);
    return String(sb ? sb.data : "").localeCompare(String(sa ? sa.data : ""));
  });
  const freq = frequenciaDoAluno();
  const presentes = regs.filter((r) => r.status === "PRESENTE").length;
  const ausentes = regs.filter((r) => r.status === "AUSENTE").length;
  const just = regs.filter((r) => r.status === "JUSTIFICADO").length;
  return (
    <>
      <PageHead eyebrow="Módulo Presença" title="Sua frequência" sub="Acompanhe presenças, faltas e justificativas por sessão." actions={<span className={`${freq !== null && freq >= 75 ? BADGE.ok : BADGE.danger} text-[10px] font-bold`}>{freq === null ? "Sem registros" : `${freq}% de frequência`}</span>} />
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Kpi label="Presenças" value={presentes} foot="registros confirmados" tone="green" icon={I.check} />
            <Kpi label="Faltas" value={ausentes} foot="ausências sem justificativa" tone="red" icon={I.alert} />
            <Kpi label="Justificadas" value={just} foot="contam para a frequência" tone="amber" icon={I.file} />
          </div>
          <section className={PANEL}>
            <div className="mb-2 flex items-center justify-between"><h2 className="font-display text-lg text-slate-900">Histórico de presença</h2><span className="text-[11px] text-stone-500">{regs.length} registro(s)</span></div>
            {regs.length ? <div className="overflow-x-auto rounded-xl border border-stone-200"><table className="table table-sm"><thead><tr className="text-[10px] uppercase tracking-wide text-stone-500"><th>Data</th><th>Sessão</th><th>Turma</th><th>Status</th><th>Justificativa</th></tr></thead><tbody>{regs.map((r) => { const s = state.sessoes.find((x) => x.id === r.sessaoId); return <tr key={r.id}><td className="whitespace-nowrap">{s ? fmtDate(s.data) : "—"}</td><td>{s ? s.tema : "—"}</td><td>{s ? turmaById(s.turmaId).codigo : "—"}</td><td><StatusBadge status={r.status} /></td><td className="text-[10.5px] text-stone-500">{r.justificativa || "—"}</td></tr>; })}</tbody></table></div> : <Empty icon={I.calCheck} title="Sem registros" text="Ainda não há chamadas registradas para você." />}
          </section>
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <section className={PANEL}>
            <div className="mb-2"><h2 className="font-display text-lg text-slate-900">Frequência</h2></div>
            <div className="flex justify-center py-3">
              <div className="radial-progress ring text-brand-700" style={{ "--value": freq || 0, "--size": "132px", "--thickness": "9px" }} role="progressbar">
                <span className="font-display text-[32px] text-slate-900">{freq === null ? "—" : `${freq}%`}</span><small className="text-[9px] uppercase tracking-wide text-stone-500">mínimo 75%</small>
              </div>
            </div>
            <p className="text-center text-[11px] text-stone-500">A frequência considera presenças e justificativas sobre o total de sessões registradas.</p>
          </section>
          <section className={PANEL}>
            <div className="mb-2"><h2 className="font-display text-lg text-slate-900">Matrículas</h2></div>
            {ms.map((m) => <div key={m.id} className="flex items-baseline justify-between border-b border-dashed border-stone-200 py-2 text-[12px] last:border-0"><span className="text-stone-500">{turmaById(m.turmaId).codigo} · {turmaById(m.turmaId).componente}</span><strong className="font-display text-[18px] text-slate-900">{frequenciaDaMatricula(m.id) === null ? "—" : `${frequenciaDaMatricula(m.id)}%`}</strong></div>)}
            {!ms.length && <p className="text-[11.5px] text-stone-500">Sem matrícula ativa.</p>}
          </section>
        </div>
      </div>
    </>
  );
}
function toggleSession(id) {
  const s = state.sessoes.find((x) => x.id === id);
  if (!s) return;
  s.status = s.status === "ABERTA" ? "ENCERRADA" : "ABERTA";
  commit();
  toast(s.status === "ABERTA" ? "Sessão reaberta." : "Sessão encerrada.", "success");
}
function submitAttendance(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const session = state.sessoes.find((s) => s.id === ui.sessionId);
  if (!session) return;
  if (session.status !== "ABERTA") return toast("Reabra a sessão para editar a chamada.", "warn");
  const changes = [];
  let justificativaFaltando = false;
  matriculasDaTurma(session.turmaId).forEach((m) => {
    const sel = form.querySelector(`[name="att-${m.id}"]`);
    if (!sel) return;
    const just = form.querySelector(`[name="just-${m.id}"]`);
    const justificativa = just ? just.value.trim() : "";
    if (sel.value === "JUSTIFICADO" && !justificativa) justificativaFaltando = true;
    changes.push({ matriculaId: m.id, status: sel.value, justificativa });
  });
  if (justificativaFaltando) return toast("Informe a justificativa para os registros justificados.", "warn");
  changes.forEach((change) => {
    let reg = state.registros.find((r) => r.sessaoId === session.id && r.matriculaId === change.matriculaId);
    if (!reg) {
      reg = { id: "reg-" + Date.now() + "-" + change.matriculaId, sessaoId: session.id, matriculaId: change.matriculaId, usuarioId: user().id, status: change.status, justificativa: change.justificativa, registradoEm: new Date().toISOString() };
      state.registros.push(reg);
    } else {
      reg.status = change.status;
      reg.justificativa = change.justificativa;
      reg.registradoEm = new Date().toISOString();
      reg.usuarioId = user().id;
    }
  });
  commit();
  toast("Chamada salva.", "success");
}

/* ---------- agenda ---------- */
function Agenda() {
  const tab = ui.tab.agenda || "grade";
  const turmas = turmasVisiveis();
  if (!ui.agendaTurma || !turmas.some((t) => t.id === ui.agendaTurma)) ui.agendaTurma = turmas[0] ? turmas[0].id : null;
  const turma = turmas.find((t) => t.id === ui.agendaTurma);
  const pendentes = state.solicitacoes.filter((s) => s.status === "PENDENTE");
  return (
    <>
      <PageHead eyebrow="Módulo Agenda" title="Grade, eventos e alterações" sub="Horários da turma, eventos acadêmicos e solicitações de mudança." actions={<button type="button" className={BTN_PRIMARY} data-action="request-change" onClick={openRequestChange}><I.plus className="h-4 w-4" /> Solicitar alteração</button>} />
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="tabs tabs-boxed bg-stone-200/70 p-1">
          {[["grade", "Grade horária"], ["eventos", "Eventos"], ["solicitacoes", "Solicitações"]].map(([id, label]) => (
            <button key={id} type="button" className={`tab h-8 rounded-lg text-[11.5px] font-semibold ${tab === id ? "tab-active bg-white text-slate-900 shadow-sm" : "text-stone-500"}`} onClick={() => { ui.tab.agenda = id; notify(); }}>
              {label}{id === "solicitacoes" && pendentes.length ? <span className="ml-1 rounded-full bg-amber-100 px-1.5 text-[9px] font-bold text-amber-700">{pendentes.length}</span> : null}
            </button>
          ))}
        </div>
        {tab === "grade" && turmas.length > 1 && (
          <select className={`${SELECT} w-auto`} value={ui.agendaTurma} data-change="agenda-turma" onChange={(e) => { ui.agendaTurma = e.target.value; notify(); }} aria-label="Turma">
            {turmas.map((t) => <option key={t.id} value={t.id}>{t.codigo} · {t.componente}</option>)}
          </select>
        )}
      </div>
      {tab === "grade" ? <Grade turma={turma} /> : tab === "eventos" ? <Eventos /> : <Solicitacoes />}
    </>
  );
}
function Grade({ turma }) {
  if (!turma) return <div className={PANEL}><Empty icon={I.cal} title="Sem turma" text="Não há turma vinculada ao seu perfil." /></div>;
  const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
  const slots = ["14:00", "19:00"];
  const entries = state.grade.filter((g) => g.turmaId === turma.id && g.status === "ATIVA");
  return (
    <section className={PANEL}>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div><h2 className="font-display text-lg text-slate-900">{turma.codigo} · {turma.componente}</h2><p className="text-[11.5px] text-stone-500">{turma.periodo} · {turma.turno} · {professorById(turma.professorId).nome}</p></div>
        <span className={`${BADGE.info} text-[10px] font-bold`}>{entries.length} horário(s)</span>
      </div>
      <div className="overflow-x-auto scroll-thin">
        <div className="grid min-w-[720px] grid-cols-[70px_repeat(5,minmax(0,1fr))] gap-1.5">
          <div />
          {days.map((d) => <div key={d} className="rounded-lg bg-stone-100 px-2 py-1.5 text-center text-[9.5px] font-bold uppercase tracking-wide text-stone-500">{d}</div>)}
          {slots.map((slot) => (
            <React.Fragment key={slot}>
              <div className="pr-2 pt-2 text-right text-[10px] tabular-nums text-stone-500">{slot}</div>
              {days.map((day) => {
                const items = entries.filter((g) => g.dia === day && g.inicio === slot);
                return <div key={day} className="min-h-[88px] rounded-lg border border-stone-200 bg-white p-1.5">
                  {items.map((g) => <div key={g.id} className="mb-1 rounded-md border-l-[3px] border-blue-600 bg-blue-50 px-2 py-1.5 text-[10.5px] leading-snug"><strong className="block text-[10.5px] text-slate-800">{g.componente}</strong><small className="text-[9.5px] text-stone-500">{g.inicio}–{g.fim} · {g.sala}</small></div>)}
                </div>;
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="alert alert-info mt-3 border-blue-200 bg-blue-50 text-blue-900"><I.cal className="h-4 w-4" /><div><strong className="text-[12px]">Conflitos e alterações</strong><div className="text-[11px]">A aprovação de uma solicitação valida choque de horário para a turma e para o professor antes de atualizar a grade.</div></div></div>
    </section>
  );
}
function Eventos() {
  const list = state.eventos.slice().sort((a, b) => String(a.inicio).localeCompare(String(b.inicio)));
  if (!list.length) return <div className={PANEL}><Empty icon={I.cal} title="Sem eventos" text="Nenhum evento publicado." /></div>;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {list.map((e) => {
        const d = new Date(e.inicio);
        return (
          <article key={e.id} className={`${CARD} flex gap-3 p-4`}>
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-slate-950 text-white"><div className="text-center"><strong className="block font-display text-[21px] leading-none">{String(d.getDate()).padStart(2, "0")}</strong><small className="text-[8px] uppercase tracking-wide text-slate-400">{MONTHS[d.getMonth()]}</small></div></div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2"><h3 className="text-[13.5px] font-bold text-slate-800">{e.titulo}</h3><StatusBadge status={e.status} /></div>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10.5px] text-stone-500"><span className="inline-flex items-center gap-1"><I.clock className="h-3 w-3" /> {fmtDateTime(e.inicio)}</span><span className="inline-flex items-center gap-1"><I.users className="h-3 w-3" /> {e.publico}</span><span className="inline-flex items-center gap-1"><I.dashboard className="h-3 w-3" /> {e.local}</span></div>
              <p className="mt-1.5 text-[10.5px] text-stone-500">{e.tipo} · responsável {professorById(e.professorId).nome}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
function Solicitacoes() {
  const list = solicitacoesVisiveis().slice().sort((a, b) => String(b.data).localeCompare(String(a.data)));
  if (!list.length) return <div className={PANEL}><Empty icon={I.cal} title="Nenhuma solicitação" text="Pedidos de alteração de horário aparecem aqui." /></div>;
  return (
    <section className={PANEL}>
      <div className="mb-2 flex items-center justify-between"><h2 className="font-display text-lg text-slate-900">Solicitações de alteração</h2><span className="text-[11px] text-stone-500">{list.length} registro(s)</span></div>
      {list.map((s) => {
        const g = state.grade.find((x) => x.id === s.gradeId);
        const Icon = s.status === "APROVADA" ? I.check : s.status === "REJEITADA" ? I.x : I.clock;
        return (
          <div key={s.id} className="flex items-start gap-3 border-b border-stone-100 py-3 last:border-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700"><Icon className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2"><div className="text-[12.5px] font-semibold text-slate-800">{s.tipo.replace(/_/g, " ")} · {g ? g.componente : "—"}</div><StatusBadge status={s.status} /></div>
              <div className="text-[10.5px] text-stone-500">{g ? turmaById(g.turmaId).codigo : "—"} · solicitado por {usuarioById(s.solicitanteId).nome} em {fmtDateTime(s.data)}</div>
              <p className="mt-1 text-[11px] text-stone-500">{s.justificativa}{s.salaProposta ? ` · sala proposta: ${s.salaProposta}` : ""}{s.motivoRejeicao ? ` · motivo: ${s.motivoRejeicao}` : ""}</p>
              {podeAprovarAgenda() && s.status === "PENDENTE" && <div className="mt-2 flex gap-2"><button type="button" className={BTN_PRIMARY} data-action="approve-request" data-id={s.id} onClick={() => approveRequest(s.id)}><I.check className="h-4 w-4" /> Aprovar</button><button type="button" className={BTN_DANGER} data-action="reject-request" data-id={s.id} onClick={() => openRejectRequest(s.id)}><I.x className="h-4 w-4" /> Rejeitar</button></div>}
            </div>
          </div>
        );
      })}
    </section>
  );
}
function openRequestChange() {
  const turma = state.turmas.find((t) => t.id === ui.agendaTurma) || turmasVisiveis()[0];
  if (!turma) return toast("Sem turma para solicitar alteração.", "warn");
  const entries = state.grade.filter((g) => g.turmaId === turma.id && g.status === "ATIVA");
  if (!entries.length) return toast("A turma não possui grade horária ativa.", "warn");
  openModal({
    eyebrow: "Agenda",
    title: "Solicitar alteração de horário",
    body: () => (
      <>
        <form id="request-form" data-form="request" onSubmit={submitRequest}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2"><label htmlFor="req-grade" className="mb-1 block text-[11px] font-semibold text-slate-700">Horário</label><select className={SELECT} id="req-grade" name="gradeId">{entries.map((g) => <option key={g.id} value={g.id}>{g.dia} · {g.inicio}–{g.fim} · {g.componente}</option>)}</select></div>
            <div><label htmlFor="req-tipo" className="mb-1 block text-[11px] font-semibold text-slate-700">Tipo</label><select className={SELECT} id="req-tipo" name="tipo"><option value="NOVO_HORARIO">Novo horário</option><option value="SUBSTITUICAO">Substituição</option><option value="CANCELAMENTO">Cancelamento</option></select></div>
            <div><label htmlFor="req-sala" className="mb-1 block text-[11px] font-semibold text-slate-700">Sala proposta (opcional)</label><input className={INPUT} id="req-sala" name="salaProposta" placeholder="Ex.: 305" /></div>
            <div className="sm:col-span-2"><label htmlFor="req-just" className="mb-1 block text-[11px] font-semibold text-slate-700">Justificativa</label><textarea className={TEXTAREA} id="req-just" name="justificativa" required placeholder="Explique o motivo da alteração." /></div>
          </div>
          {modal.errors.request && <p className="mt-2 text-[11.5px] font-semibold text-red-600">{modal.errors.request}</p>}
          <div className="alert alert-info mt-3 border-blue-200 bg-blue-50 text-blue-900"><I.clock className="h-4 w-4" /><div className="text-[11px]">A solicitação nasce pendente e será analisada pela coordenação. A grade só muda após a aprovação.</div></div>
        </form>
      </>
    ),
    footer: () => <><button type="button" className={BTN} onClick={closeModal}>Cancelar</button><button type="submit" form="request-form" className={BTN_PRIMARY}><I.check className="h-4 w-4" /> Enviar solicitação</button></>,
  });
}
function submitRequest(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const grade = state.grade.find((g) => g.id === form.gradeId.value);
  if (!grade) return;
  const justificativa = form.justificativa.value.trim();
  if (!justificativa) return showFormError("request", "Informe a justificativa.");
  state.solicitacoes.push({
    id: "sol-" + Date.now(),
    gradeId: grade.id,
    solicitanteId: user().id,
    aprovadorId: null,
    tipo: form.tipo.value,
    justificativa,
    data: new Date().toISOString(),
    dataAprovacao: null,
    status: "PENDENTE",
    salaProposta: form.salaProposta.value.trim() || null,
  });
  commit();
  closeModal();
  ui.tab.agenda = "solicitacoes";
  notify();
  toast("Solicitação enviada para a coordenação.", "success");
}
function approveRequest(id) {
  const s = state.solicitacoes.find((x) => x.id === id);
  if (!s) return;
  s.status = "APROVADA";
  s.aprovadorId = user().id;
  s.dataAprovacao = new Date().toISOString();
  if (s.tipo === "NOVO_HORARIO" && s.salaProposta) {
    const g = state.grade.find((x) => x.id === s.gradeId);
    if (g) g.sala = s.salaProposta;
  }
  if (s.tipo === "CANCELAMENTO") {
    const g = state.grade.find((x) => x.id === s.gradeId);
    if (g) g.status = "INATIVA";
  }
  commit();
  toast("Solicitação aprovada e agenda atualizada.", "success");
}
function openRejectRequest(id) {
  const s = state.solicitacoes.find((x) => x.id === id);
  if (!s) return;
  openModal({
    eyebrow: "Agenda",
    title: "Rejeitar solicitação",
    body: () => (
      <form id="reject-form" data-form="reject" onSubmit={submitReject}>
        <input type="hidden" name="id" value={id} />
        <p className="mb-3 text-[12px] text-stone-500">Explique o motivo da rejeição. O solicitante verá a resposta no histórico.</p>
        <label htmlFor="reject-motivo" className="mb-1 block text-[11px] font-semibold text-slate-700">Motivo</label>
        <textarea className={TEXTAREA} id="reject-motivo" name="motivo" required />
        {modal.errors.reject && <p className="mt-2 text-[11.5px] font-semibold text-red-600">{modal.errors.reject}</p>}
      </form>
    ),
    footer: () => <><button type="button" className={BTN} onClick={closeModal}>Cancelar</button><button type="submit" form="reject-form" className={BTN_DANGER}>Rejeitar</button></>,
  });
}
function submitReject(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const s = state.solicitacoes.find((x) => x.id === form.querySelector('[name="id"]').value);
  if (!s) return;
  const motivo = form.motivo.value.trim();
  if (!motivo) return showFormError("reject", "Informe o motivo.");
  s.status = "REJEITADA";
  s.aprovadorId = user().id;
  s.dataAprovacao = new Date().toISOString();
  s.motivoRejeicao = motivo;
  commit();
  closeModal();
  toast("Solicitação rejeitada.", "success");
}

/* ---------- biblioteca ---------- */
function Biblioteca() {
  const tab = ui.libTab || "livros";
  const disponiveis = state.exemplares.filter((e) => e.status === "DISPONIVEL").length;
  return (
    <>
      <PageHead eyebrow="Módulo Biblioteca" title="Acervo e exemplares" sub="Catálogo por acervo, disponibilidade dos exemplares e histórico de buscas." actions={<span className={`${BADGE.ok} text-[10px] font-bold`}>{disponiveis} exemplar(es) disponível(is)</span>} />
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Acervos" value={state.acervos.length} foot="coleções ativas" tone="pink" icon={I.book} />
        <Kpi label="Títulos" value={state.livros.length} foot="referências catalogadas" tone="blue" icon={I.book} />
        <Kpi label="Exemplares" value={state.exemplares.length} foot={`${disponiveis} disponíveis`} tone="brand" icon={I.dashboard} />
        <Kpi label="Buscas" value={state.historico.length} foot="registradas no histórico" tone="amber" icon={I.search} />
      </div>
      <div className="mb-3">
        <div className="tabs tabs-boxed bg-stone-200/70 p-1">
          {[["livros", "Livros"], ["acervo", "Acervos"], ["exemplares", "Exemplares"], ["historico", "Histórico"]].map(([id, label]) => (
            <button key={id} type="button" className={`tab h-8 rounded-lg text-[11.5px] font-semibold ${tab === id ? "tab-active bg-white text-slate-900 shadow-sm" : "text-stone-500"}`} onClick={() => { ui.libTab = id; notify(); }}>{label}</button>
          ))}
        </div>
      </div>
      {tab === "livros" ? <Livros /> : tab === "acervo" ? <Acervos /> : tab === "exemplares" ? <Exemplares /> : <Historico />}
    </>
  );
}
function livrosFiltrados() {
  const q = ui.libQuery.trim().toLowerCase();
  return state.livros.filter((l) => {
    const matchQ = !q || [l.titulo, l.autor, l.isbn, l.area, l.editora].some((v) => String(v).toLowerCase().includes(q));
    const matchA = ui.libArea === "TODOS" || l.area === ui.libArea;
    return matchQ && matchA;
  });
}
function Livros() {
  const list = livrosFiltrados();
  const areas = ["TODOS"].concat([...new Set(state.livros.map((l) => l.area))]);
  return (
    <>
      <form className="mb-3 flex flex-wrap items-center gap-2" data-form="library-search" onSubmit={submitLibrarySearch}>
        <div className="relative min-w-[220px] flex-1 sm:max-w-[420px]">
          <I.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input name="q" type="search" value={ui.libQuery} onChange={(e) => { ui.libQuery = e.target.value; notify(); }} placeholder="Buscar por título, autor, ISBN ou área..." aria-label="Buscar no acervo" className={`${INPUT} pl-9`} />
        </div>
        <select name="area" value={ui.libArea} onChange={(e) => { ui.libArea = e.target.value; notify(); }} className={`${SELECT} w-auto`} aria-label="Filtrar por área">{areas.map((a) => <option key={a} value={a}>{a === "TODOS" ? "Todas as áreas" : a}</option>)}</select>
        <button type="submit" className={BTN_PRIMARY}><I.search className="h-4 w-4" /> Buscar</button>
        {ui.libQuery && <button type="button" className={BTN_GHOST} onClick={() => { ui.libQuery = ""; ui.libArea = "TODOS"; notify(); }}>Limpar</button>}
      </form>
      {list.length ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{list.map((b) => <BookCard key={b.id} book={b} />)}</div> : <div className={PANEL}><Empty icon={I.search} title="Nenhum livro encontrado" text="Tente outro termo ou remova o filtro de área." /></div>}
    </>
  );
}
function BookCard({ book, compact = false }) {
  const ex = state.exemplares.filter((e) => e.livroId === book.id);
  const disp = ex.filter((e) => e.status === "DISPONIVEL").length;
  return (
    <article className={`${CARD} book-card flex flex-col overflow-hidden`}>
      <div className={`relative flex items-end px-3 ${compact ? "h-[74px]" : "h-[92px]"}`} style={{ background: `linear-gradient(135deg, ${book.cor}, #0b1f33)` }}>
        <span className="absolute bottom-2 left-3 top-2 w-1 rounded bg-white/40" />
        <span className="relative pl-3 font-display text-[14px] leading-tight text-white drop-shadow">{book.titulo}</span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="text-[12.5px] font-bold leading-snug text-slate-800">{book.titulo}</h3>
        <p className="text-[10.5px] text-stone-500">{book.autor} · {book.ano}</p>
        <p className="text-[10px] text-stone-400">{book.area} · {book.editora}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className={`${disp ? BADGE.ok : BADGE.warn} text-[9px] font-bold`}>{disp} de {ex.length} disponível(is)</span>
          <button type="button" className={BTN} data-action="book-detail" data-id={book.id} onClick={() => openBookDetail(book.id)}>Detalhes <I.arrow className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </article>
  );
}
function Acervos() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {state.acervos.map((a) => {
        const livros = state.livros.filter((l) => l.acervoId === a.id);
        const ex = state.exemplares.filter((e) => livros.some((l) => l.id === e.livroId));
        return (
          <article key={a.id} className={`${CARD} flex items-start gap-3 p-4`}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-pink-50 text-pink-700"><I.book className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h3 className="font-display text-lg text-slate-900">{a.nome}</h3><StatusBadge status={a.ativo ? "ATIVA" : "CANCELADA"} /></div><p className="mt-1 text-[11.5px] text-stone-500">{a.descricao}</p><div className="mt-2 flex gap-3 text-[10.5px] text-stone-500"><span>{livros.length} título(s)</span><span>{ex.length} exemplar(es)</span><span>{a.area}</span></div></div>
          </article>
        );
      })}
    </div>
  );
}
function Exemplares() {
  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
      <table className="table table-sm">
        <thead><tr className="text-[10px] uppercase tracking-wide text-stone-500"><th>Tombo</th><th>Livro</th><th>Área</th><th>Localização</th><th>Aquisição</th><th>Status</th></tr></thead>
        <tbody>{state.exemplares.map((e) => { const l = state.livros.find((x) => x.id === e.livroId); return <tr key={e.id}><td className="font-mono text-[11px]">{e.tombo}</td><td><div className="text-[12.5px] font-semibold text-slate-800">{l ? l.titulo : "—"}</div><div className="text-[10.5px] text-stone-500">{l ? l.autor : ""}</div></td><td>{l ? l.area : "—"}</td><td>{e.localizacao}</td><td className="whitespace-nowrap">{fmtDate(e.dataAquisicao)}</td><td><StatusBadge status={e.status} /></td></tr>; })}</tbody>
      </table>
    </div>
  );
}
function Historico() {
  const all = podeGerenciarBiblioteca();
  const list = (all ? state.historico : state.historico.filter((h) => h.usuarioId === user().id)).slice().sort((a, b) => String(b.data).localeCompare(String(a.data)));
  if (!list.length) return <div className={PANEL}><Empty icon={I.search} title="Sem buscas" text="O histórico registra as consultas feitas no catálogo." /></div>;
  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
      <table className="table table-sm">
        <thead><tr className="text-[10px] uppercase tracking-wide text-stone-500"><th>Termo</th><th>Filtros</th>{all && <th>Usuário</th>}<th>Data</th><th className="text-right">Resultados</th></tr></thead>
        <tbody>{list.map((h) => <tr key={h.id}><td><span className="rounded-md bg-stone-100 px-1.5 py-0.5 font-mono text-[11.5px]">{h.termo}</span></td><td>{h.filtros}</td>{all && <td>{usuarioById(h.usuarioId).nome}</td>}<td className="whitespace-nowrap">{fmtDateTime(h.data)}</td><td className="text-right">{h.resultados}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
function submitLibrarySearch(e) {
  e.preventDefault();
  const form = e.currentTarget;
  ui.libQuery = form.q.value.trim();
  ui.libArea = form.area.value;
  const results = livrosFiltrados().length;
  if (ui.libQuery) {
    state.historico.push({ id: "hb-" + Date.now(), usuarioId: user().id, termo: ui.libQuery, filtros: ui.libArea === "TODOS" ? "Todos" : ui.libArea, data: new Date().toISOString(), resultados: results });
    commit();
    toast(results ? `${results} livro(s) encontrado(s).` : "Nenhum livro encontrado para a busca.", results ? "success" : "warn");
  } else {
    notify();
  }
}
function openBookDetail(bookId) {
  const b = state.livros.find((l) => l.id === bookId);
  if (!b) return;
  const ex = state.exemplares.filter((e) => e.livroId === b.id);
  const acervo = state.acervos.find((a) => a.id === b.acervoId);
  openModal({
    eyebrow: "Biblioteca",
    title: b.titulo,
    body: () => (
      <>
        <div className="mb-4 flex items-start gap-4">
          <div className="relative h-[126px] w-[96px] shrink-0 overflow-hidden rounded-xl" style={{ background: `linear-gradient(135deg, ${b.cor}, #0b1f33)` }}><span className="absolute bottom-3 left-4 top-3 w-1 rounded bg-white/40" /></div>
          <div><h3 className="font-display text-[22px] leading-tight text-slate-900">{b.titulo}</h3><p className="text-[11.5px] text-stone-500">{b.autor} · {b.editora} · {b.ano}</p><div className="mt-1.5 flex flex-wrap gap-3 text-[10.5px] text-stone-500"><span>ISBN {b.isbn}</span><span>{b.area}</span><span>{acervo ? acervo.nome : "—"}</span></div></div>
        </div>
        <div className="overflow-x-auto rounded-xl border border-stone-200"><table className="table table-sm"><thead><tr className="text-[10px] uppercase tracking-wide text-stone-500"><th>Tombo</th><th>Localização</th><th>Aquisição</th><th>Status</th></tr></thead><tbody>{ex.map((e) => <tr key={e.id}><td className="font-mono text-[11px]">{e.tombo}</td><td>{e.localizacao}</td><td>{fmtDate(e.dataAquisicao)}</td><td><StatusBadge status={e.status} /></td></tr>)}</tbody></table></div>
      </>
    ),
    footer: () => <button type="button" className={BTN_PRIMARY} onClick={closeModal}>Fechar</button>,
  });
}

/* ---------- acesso ---------- */
function Acesso() {
  if (!isRoot()) return <Forbidden name="Acesso e módulos" />;
  return (
    <>
      <PageHead eyebrow="Administração" title="Grupos, papéis e módulos" sub="A matriz define quais módulos cada grupo enxerga. Apenas o papel ROOT altera esta configuração." actions={<button type="button" className={BTN_DANGER} data-action="reset-demo" onClick={resetDemo}><I.refresh className="h-4 w-4" /> Restaurar demonstração</button>} />
      <div className="grid items-start gap-4 xl:grid-cols-2">
        <section className={PANEL}>
          <div className="mb-3 flex items-start justify-between gap-3"><div><h2 className="font-display text-lg text-slate-900">Matriz de módulos</h2><p className="text-[11.5px] text-stone-500">Clique no interruptor para habilitar ou desabilitar.</p></div><span className={`${BADGE.neutral} text-[10px] font-bold`}>{state.grupos.length} grupos</span></div>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="table table-sm min-w-[680px]">
              <thead><tr className="text-[9.5px] uppercase tracking-wide text-stone-500"><th>Grupo</th>{state.modulos.map((m) => <th key={m.id} className="text-center">{m.nome}</th>)}</tr></thead>
              <tbody>{state.grupos.map((g) => (
                <tr key={g.id}>
                  <td><span className="text-[12px] font-semibold text-slate-800">{g.nome}</span><span className="block text-[9.5px] text-stone-500">{g.papel}</span></td>
                  {state.modulos.map((m) => {
                    const on = g.modulos.includes(m.id);
                    return <td key={m.id} className="text-center"><button type="button" data-action="toggle-module" data-group={g.id} data-module={m.id} aria-pressed={on} aria-label={`${on ? "Desabilitar" : "Habilitar"} ${m.nome} para ${g.nome}`} onClick={() => toggleModule(g.id, m.id)} className={`relative inline-flex h-[18px] w-[32px] items-center rounded-full border transition ${on ? "border-brand-700 bg-brand-700" : "border-stone-300 bg-stone-200"}`}><span className={`h-3 w-3 rounded-full bg-white shadow transition ${on ? "translate-x-[15px]" : "translate-x-[2px]"}`} /></button></td>;
                  })}
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="alert alert-info mt-3 border-blue-200 bg-blue-50 text-blue-900"><I.alert className="h-4 w-4" /><div><strong className="text-[12px]">Defesa em profundidade</strong><div className="text-[11px]">O menu esconde o módulo, a rota revalida o grupo e cada tela confirma o vínculo do usuário com o registro.</div></div></div>
        </section>
        <section className={PANEL}>
          <div className="mb-3 flex items-start justify-between gap-3"><div><h2 className="font-display text-lg text-slate-900">Usuários</h2><p className="text-[11.5px] text-stone-500">Credenciais de demonstração.</p></div><span className={`${BADGE.neutral} text-[10px] font-bold`}>{state.usuarios.length}</span></div>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="table table-sm">
              <thead><tr className="text-[10px] uppercase tracking-wide text-stone-500"><th>Usuário</th><th>Grupo</th><th>Papel</th></tr></thead>
              <tbody>{state.usuarios.map((u) => <tr key={u.id}><td><div className="flex items-center gap-2"><Avatar name={u.nome} size="sm" /><div><div className="text-[12px] font-semibold text-slate-800">{u.nome}</div><div className="text-[10px] text-stone-500">{u.email}</div></div></div></td><td>{grupoById(u.grupoId).nome}</td><td><RoleBadge papel={u.papel} /></td></tr>)}</tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
function toggleModule(groupId, moduleId) {
  const g = state.grupos.find((x) => x.id === groupId);
  if (!g) return;
  if (g.modulos.includes(moduleId)) g.modulos = g.modulos.filter((x) => x !== moduleId);
  else g.modulos.push(moduleId);
  commit();
  toast("Matriz de módulos atualizada.", "success");
}
function resetDemo() {
  openModal({
    eyebrow: "Demonstração",
    title: "Restaurar os dados?",
    body: () => <p className="text-[12.5px] text-stone-500">As tentativas, pagamentos, chamadas e solicitações criadas neste navegador serão substituídas pelos dados originais do protótipo.</p>,
    footer: () => <><button type="button" className={BTN} onClick={closeModal}>Cancelar</button><button type="button" className={BTN_DANGER} data-action="confirm-reset" onClick={confirmReset}><I.refresh className="h-4 w-4" /> Restaurar</button></>,
  });
}

/* ---------- páginas auxiliares ---------- */
function Forbidden({ name }) {
  const g = group();
  return (
    <div className={`${PANEL} mx-auto my-[8vh] max-w-xl text-center`}>
      <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600"><I.alert className="h-7 w-7" /></span>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-600">Acesso restrito</p>
      <h1 className="mt-1 font-display text-[30px] leading-tight text-slate-900">{name} não está disponível</h1>
      <p className="mx-auto mt-2 max-w-md text-[12.5px] text-stone-500">O módulo não está habilitado para o grupo <strong>{g ? g.nome : "—"}</strong>. Peça a liberação ao responsável de acesso.</p>
      <a className={`${BTN_PRIMARY} mt-4`} href="#/painel"><I.dashboard className="h-4 w-4" /> Voltar ao painel</a>
    </div>
  );
}
function NotFound() {
  return (
    <div className={`${PANEL} mx-auto my-[8vh] max-w-lg text-center`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">404</p>
      <h1 className="mt-1 font-display text-[30px] text-slate-900">Página não encontrada</h1>
      <p className="mt-2 text-[12.5px] text-stone-500">O endereço informado não existe neste protótipo.</p>
      <a className={`${BTN_PRIMARY} mt-4`} href="#/painel"><I.dashboard className="h-4 w-4" /> Ir para o painel</a>
    </div>
  );
}

/* ---------- ações globais ---------- */
function login(userId) {
  const u = state.usuarios.find((x) => x.id === userId);
  if (!u) return;
  session = { userId: u.id };
  saveSession();
  location.hash = "#/painel";
  notify();
  toast(`Bem-vindo(a), ${u.nome.split(" ")[0]}.`, "success");
}
function logout() {
  session = null;
  saveSession();
  location.hash = "#/login";
  notify();
}
function submitGlobalSearch(e) {
  e.preventDefault();
  const q = e.currentTarget.q.value.trim();
  ui.libQuery = q;
  ui.libArea = "TODOS";
  ui.libTab = "livros";
  if (!canAccess("biblioteca")) return toast("O módulo Biblioteca não está habilitado para o seu grupo.", "warn");
  location.hash = "#/biblioteca";
  notify();
}
function confirmReset() {
  state = clone(window.EDU);
  saveState();
  closeModal();
  toast("Dados da demonstração restaurados.", "success");
  notify();
}

/* ---------- modal e toasts ---------- */
function ModalRoot() {
  if (!modal) return null;
  return (
    <div className="modal modal-open z-[80]" role="dialog" aria-modal="true">
      <div className={`modal-box max-h-[calc(100vh-3rem)] w-[calc(100vw-2rem)] ${modal.size === "lg" ? "max-w-[860px]" : "max-w-[680px]"} rounded-2xl border border-stone-200 bg-white p-0`}>
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-stone-200 bg-white px-5 py-4">
          <div><p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-brand-700">{modal.eyebrow || "EduGestor"}</p><h2 className="mt-0.5 font-display text-[22px] leading-tight text-slate-900">{modal.title}</h2></div>
          <button type="button" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-slate-700" onClick={closeModal} aria-label="Fechar"><I.x className="h-4 w-4" /></button>
        </div>
        <div className="max-h-[calc(100vh-13rem)] overflow-y-auto px-5 py-4 scroll-thin">{modal.body ? modal.body() : null}</div>
        {modal.footer && <div className="flex flex-wrap justify-end gap-2 border-t border-stone-200 px-5 py-3.5">{modal.footer()}</div>}
      </div>
      <div className="modal-backdrop bg-slate-950/55 backdrop-blur-[2px]" onClick={closeModal} />
    </div>
  );
}
function ToastRoot() {
  return (
    <div className="toast toast-end z-[100]">
      {toasts.map((t) => {
        const cls = t.type === "error" ? "alert-error" : t.type === "warn" ? "alert-warning" : "alert-success";
        const Icon = t.type === "error" ? I.alert : t.type === "warn" ? I.clock : I.check;
        return <div key={t.id} className={`alert ${cls} min-w-[240px] max-w-[380px] rounded-xl text-[12px] shadow-lg`}><Icon className="h-4 w-4 shrink-0" /><span>{t.message}</span></div>;
      })}
    </div>
  );
}

/* ---------- app e roteamento ---------- */
const getRoute = () => (location.hash || "#/painel").replace(/^#\/?/, "") || "painel";
function App() {
  useStore();
  const [route, setRoute] = useState(getRoute());
  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const u = user();
  if (!u) {
    return <><Login /><ToastRoot /></>;
  }
  const effective = route === "login" ? "painel" : route;
  const known = ["painel", "acesso", ...state.modulos.map((m) => m.id)];
  let page;
  if (!known.includes(effective)) page = <NotFound />;
  else if (effective === "acesso" && !isRoot()) page = <Forbidden name="Acesso e módulos" />;
  else if (effective !== "painel" && effective !== "acesso" && !canAccess(effective)) page = <Forbidden name={moduleById(effective) ? moduleById(effective).nome : "Módulo"} />;
  else if (effective === "painel") page = <Dashboard />;
  else if (effective === "avaliacoes") page = <Avaliacoes />;
  else if (effective === "financeiro") page = <Financeiro />;
  else if (effective === "presenca") page = <Presenca />;
  else if (effective === "agenda") page = <Agenda />;
  else if (effective === "biblioteca") page = <Biblioteca />;
  else if (effective === "acesso") page = <Acesso />;
  return <><Shell route={effective}>{page}</Shell><ModalRoot /><ToastRoot /></>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);