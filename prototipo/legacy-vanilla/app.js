(function () {
  "use strict";

  const STORAGE_KEY = "edugestor.state.v1";
  const SESSION_KEY = "edugestor.session.v1";
  const TODAY = new Date("2026-10-27T12:00:00");
  const DAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

  const app = document.getElementById("app");
  const modalRoot = document.getElementById("modal-root");
  const toastRoot = document.getElementById("toast-root");

  let state = loadState();
  let session = loadSession();
  let ui = {
    tab: {},
    finFilter: "TODAS",
    sessionId: null,
    agendaTurma: null,
    libTab: "livros",
    libQuery: "",
    libArea: "TODOS",
    attempt: null
  };

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.usuarios && parsed.avaliacoes) return parsed;
      }
    } catch (err) { /* usa a semente */ }
    return clone(window.EDU);
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (err) { toast("Não foi possível salvar os dados locais.", "error"); }
  }

  function loadSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const user = (state.usuarios || []).find(u => u.id === parsed.userId);
      return user ? { userId: user.id } : null;
    } catch (err) { return null; }
  }

  function saveSession() {
    try {
      if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      else localStorage.removeItem(SESSION_KEY);
    } catch (err) { /* ignora */ }
  }

  const user = () => state.usuarios.find(u => u.id === (session && session.userId)) || null;
  const group = () => {
    const u = user();
    return u ? state.grupos.find(g => g.id === u.grupoId) : null;
  };
  const isRoot = () => !!user() && user().papel === "ROOT";
  const isAdmin = () => !!user() && user().papel === "ADMINISTRADOR";
  const isStudent = () => !!user() && user().perfil === "aluno";
  const isTeacher = () => !!user() && user().perfil === "professor";
  const isStaff = () => !!user() && (user().perfil === "servidor" || isRoot() || isAdmin());
  const student = () => {
    const u = user();
    return u && u.alunoId ? state.alunos.find(a => a.id === u.alunoId) : null;
  };
  const teacher = () => {
    const u = user();
    return u && u.professorId ? state.professores.find(p => p.id === u.professorId) : null;
  };

  function allowedModules() {
    const u = user();
    if (!u) return [];
    if (u.papel === "ROOT") return state.modulos;
    const g = group();
    return state.modulos.filter(m => g && g.modulos.includes(m.id));
  }
  function canAccess(moduleId) {
    if (!user()) return false;
    if (user().papel === "ROOT") return true;
    const g = group();
    return !!g && g.modulos.includes(moduleId);
  }
  function moduleById(id) { return state.modulos.find(m => m.id === id); }
  function turmaById(id) { return state.turmas.find(t => t.id === id) || { codigo: "—", componente: "—" }; }
  function alunoById(id) { return state.alunos.find(a => a.id === id) || { nome: "—", ra: "—" }; }
  function professorById(id) { return state.professores.find(p => p.id === id) || { nome: "—" }; }
  function cursoById(id) { return state.cursos.find(c => c.id === id) || { nome: "—", codigo: "—" }; }
  function grupoById(id) { return state.grupos.find(g => g.id === id) || { nome: "—", papel: "—" }; }
  function usuarioById(id) { return state.usuarios.find(u => u.id === id) || { nome: "—" }; }
  function pagamentosDa(mensalidadeId) { return state.pagamentos.filter(p => p.mensalidadeId === mensalidadeId); }
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
  function minhasMatriculas() {
    const a = student();
    return a ? state.matriculas.filter(m => m.alunoId === a.id) : [];
  }
  function minhasTurmas() {
    if (isStudent()) return minhasMatriculas().map(m => m.turmaId);
    if (isTeacher()) {
      const p = teacher();
      return p ? state.turmas.filter(t => t.professorId === p.id).map(t => t.id) : [];
    }
    return state.turmas.map(t => t.id);
  }
  function turmasVisiveis() {
    const ids = minhasTurmas();
    return state.turmas.filter(t => ids.includes(t.id));
  }
  function avaliacoesVisiveis() {
    const turmas = minhasTurmas();
    return state.avaliacoes
      .filter(a => turmas.includes(a.turmaId))
      .sort((a, b) => String(a.fim).localeCompare(String(b.fim)));
  }
  function matriculasDaTurma(turmaId) {
    return state.matriculas.filter(m => m.turmaId === turmaId);
  }
  function matriculaDoAlunoNaTurma(turmaId) {
    const a = student();
    return a ? state.matriculas.find(m => m.alunoId === a.id && m.turmaId === turmaId) : null;
  }
  function tentativasDa(avaliacaoId, matriculaId) {
    return state.tentativas
      .filter(t => t.avaliacaoId === avaliacaoId && (!matriculaId || t.matriculaId === matriculaId))
      .sort((a, b) => b.numero - a.numero);
  }
  function ultimaTentativa(avaliacaoId, matriculaId) { return tentativasDa(avaliacaoId, matriculaId)[0] || null; }
  function avaliacaoAberta(av) {
    return av.status === "PUBLICADA" && new Date(av.inicio) <= TODAY && new Date(av.fim) >= TODAY;
  }
  function mediaAvaliacao(avaliacaoId) {
    const ts = tentativasDa(avaliacaoId);
    if (!ts.length) return null;
    return ts.reduce((sum, t) => sum + Number(t.pontuacao), 0) / ts.length;
  }
  function mediaDoAluno() {
    const a = student();
    if (!a) return null;
    let peso = 0, soma = 0;
    minhasMatriculas().forEach(m => {
      avaliacoesVisiveis().forEach(av => {
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
    const regs = state.registros.filter(r => r.matriculaId === matriculaId);
    if (!regs.length) return null;
    const ok = regs.filter(r => r.status === "PRESENTE" || r.status === "JUSTIFICADO").length;
    return Math.round((ok / regs.length) * 100);
  }
  function frequenciaDoAluno() {
    const ms = minhasMatriculas();
    const vals = ms.map(m => frequenciaDaMatricula(m.id)).filter(v => v !== null);
    if (!vals.length) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }
  function frequenciaGeral() {
    const vals = state.matriculas.map(m => frequenciaDaMatricula(m.id)).filter(v => v !== null);
    if (!vals.length) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }
  function mensalidadesVisiveis() {
    if (isStudent()) {
      const ids = minhasMatriculas().map(m => m.id);
      return state.mensalidades.filter(m => ids.includes(m.matriculaId));
    }
    return state.mensalidades;
  }
  function sessoesVisiveis() {
    const turmas = minhasTurmas();
    return state.sessoes.filter(s => turmas.includes(s.turmaId)).sort((a, b) => String(b.data).localeCompare(String(a.data)));
  }
  function solicitacoesVisiveis() {
    if (isRoot() || isAdmin()) return state.solicitacoes;
    if (isTeacher()) return state.solicitacoes.filter(s => s.solicitanteId === user().id);
    if (isStudent()) return state.solicitacoes.filter(s => s.solicitanteId === user().id);
    return state.solicitacoes;
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

  function initials(name) {
    const parts = String(name || "?").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "?";
    return ((parts[0][0] || "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
  }
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function money(value) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));
  }
  function fmtDate(value) {
    if (!value) return "—";
    const d = new Date(String(value).length <= 10 ? value + "T12:00:00" : value);
    if (Number.isNaN(d.getTime())) return String(value);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  }
  function fmtDateTime(value) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return `${fmtDate(value)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  function fmtShort(value) {
    const d = new Date(String(value).length <= 10 ? value + "T12:00:00" : value);
    if (Number.isNaN(d.getTime())) return "—";
    return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]}`;
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
    EMPRESTADO: "Emprestado", MANUTENCAO: "Manutenção", BAIXADO: "Baixado"
  };
  const STATUS_TONES = {
    ATIVA: "ok", PUBLICADA: "ok", PAGA: "ok", PRESENTE: "ok", APROVADA: "ok", CONFIRMADO: "ok", DISPONIVEL: "ok",
    RASCUNHO: "neutral", ABERTA: "info", PARCIAL: "warn", PENDENTE: "warn", JUSTIFICADO: "warn", EMPRESTADO: "info",
    VENCIDA: "danger", AUSENTE: "danger", REJEITADA: "danger", CANCELADA: "danger", ENCERRADA: "neutral",
    MANUTENCAO: "warn", BAIXADO: "neutral", TRANCADA: "warn", CONCLUIDA: "ok", ESTORNADO: "danger"
  };
  function statusBadge(status) {
    const tone = STATUS_TONES[status] || "neutral";
    return `<span class="badge badge-${tone}"><span class="dot"></span>${esc(STATUS_LABELS[status] || status)}</span>`;
  }
  function roleBadge(papel) {
    const map = { ROOT: ["purple", "Root"], ADMINISTRADOR: ["info", "Administrador"], USUARIO: ["neutral", "Usuário"] };
    const [tone, label] = map[papel] || ["neutral", papel];
    return `<span class="badge badge-${tone}"><span class="dot"></span>${label}</span>`;
  }
  function icon(name, extra) {
    return `<svg class="icon ${extra || ""}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  }
  function avatar(name, size) {
    return `<span class="avatar avatar-${size || "md"}" aria-hidden="true">${esc(initials(name))}</span>`;
  }
  function progress(value, tone) {
    const v = Math.max(0, Math.min(100, Number(value || 0)));
    return `<div class="progress ${tone || ""}"><span style="width:${v}%"></span></div>`;
  }
  function pageHead(eyebrow, title, subtitle, actions) {
    return `<div class="page-head">
      <div>
        <div class="eyebrow">${esc(eyebrow)}</div>
        <h1>${esc(title)}</h1>
        <p class="page-sub">${subtitle}</p>
      </div>
      <div class="page-actions">${actions || ""}</div>
    </div>`;
  }
  function emptyState(iconName, title, text) {
    return `<div class="empty"><div class="empty-icon">${icon(iconName, "icon-lg")}</div><h3>${esc(title)}</h3><p>${esc(text)}</p></div>`;
  }
  function kpi(label, value, foot, tone, tint, iconName) {
    return `<article class="kpi" style="--tone:${tone};--tint:${tint}">
      <div class="kpi-top"><span class="kpi-label">${esc(label)}</span><span class="kpi-icon">${icon(iconName)}</span></div>
      <div class="kpi-value">${value}</div>
      <div class="kpi-foot">${foot}</div>
    </article>`;
  }

  function navBadge(id) {
    if (id === "avaliacoes") {
      const n = avaliacoesVisiveis().filter(avaliacaoAberta).length;
      return n ? `<span class="nav-badge">${n}</span>` : "";
    }
    if (id === "financeiro") {
      const n = mensalidadesVisiveis().filter(m => statusMensalidade(m) === "VENCIDA").length;
      return n ? `<span class="nav-badge">${n}</span>` : "";
    }
    if (id === "presenca") {
      const n = sessoesVisiveis().filter(s => s.status === "ABERTA").length;
      return n ? `<span class="nav-badge">${n}</span>` : "";
    }
    if (id === "agenda" && podeAprovarAgenda()) {
      const n = state.solicitacoes.filter(s => s.status === "PENDENTE").length;
      return n ? `<span class="nav-badge">${n}</span>` : "";
    }
    return "";
  }

  function navItem(id, label, iconName, href, active) {
    return `<a class="nav-item ${active ? "active" : ""}" href="${href}">${icon(iconName)}<span>${esc(label)}</span>${navBadge(id)}</a>`;
  }

  function shell(route) {
    const u = user();
    const g = group();
    const activeModule = moduleById(route);
    const title = route === "painel" ? "Painel" : route === "acesso" ? "Acesso" : activeModule ? activeModule.nome : "EduGestor";
    const modules = allowedModules();
    return `<div class="app-shell">
      <aside class="sidebar">
        <a class="brand-lockup" href="#/painel" style="text-decoration:none">
          <span class="brand-mark">E</span>
          <span class="brand-copy"><span class="brand-name">EduGestor</span><span class="brand-sub">Gestão acadêmica</span></span>
        </a>
        <div class="nav-group-label">Visão geral</div>
        <nav class="nav" aria-label="Navegação principal">
          ${navItem("painel", "Painel", "grid", "#/painel", route === "painel")}
        </nav>
        <div class="nav-group-label">Módulos</div>
        <nav class="nav" aria-label="Módulos">
          ${modules.map(m => navItem(m.id, m.nome, m.icone, m.rota, route === m.id)).join("")}
          ${isRoot() ? navItem("acesso", "Acesso e módulos", "settings", "#/acesso", route === "acesso") : ""}
        </nav>
        <div class="sidebar-spacer"></div>
        <div class="sidebar-user">
          ${avatar(u.nome, "sm")}
          <div class="sidebar-user-main">
            <div class="sidebar-user-name">${esc(u.nome)}</div>
            <div class="sidebar-user-role">${esc(g ? g.nome : "Sem grupo")} · ${esc(u.papel)}</div>
          </div>
          <button class="icon-btn" data-action="logout" title="Sair" aria-label="Sair">${icon("logout", "icon-sm")}</button>
        </div>
      </aside>
      <div class="main">
        <header class="topbar">
          <div class="topbar-crumbs"><span>EduGestor</span><span>/</span><strong>${esc(title)}</strong></div>
          <div class="topbar-spacer"></div>
          <form class="global-search" data-form="global-search" role="search">
            ${icon("search")}
            <input type="search" name="q" placeholder="Buscar no acervo..." aria-label="Buscar no acervo" value="${esc(ui.libQuery)}">
          </form>
          <span class="topbar-date">${dayOf(TODAY)}, ${fmtDate(TODAY)}</span>
          <span class="topbar-divider"></span>
          <div class="flex-center">${avatar(u.nome, "sm")}<span class="text-sm strong">${esc(u.nome.split(" ")[0])}</span></div>
        </header>
        <div class="content"><div id="view"></div></div>
      </div>
    </div>`;
  }

  function render() {
    if (!user()) { renderLogin(); return; }
    const route = (location.hash || "#/painel").replace(/^#\/?/, "") || "painel";
    const known = ["painel", "acesso"].concat(state.modulos.map(m => m.id));
    if (!known.includes(route)) { app.innerHTML = shell("painel"); document.getElementById("view").innerHTML = notFound(); return; }
    if (route === "acesso" && !isRoot()) { app.innerHTML = shell("painel"); document.getElementById("view").innerHTML = forbidden("Acesso e módulos"); return; }
    if (route !== "painel" && route !== "acesso" && !canAccess(route)) {
      app.innerHTML = shell("painel");
      document.getElementById("view").innerHTML = forbidden(moduleById(route) ? moduleById(route).nome : "Módulo");
      return;
    }
    app.innerHTML = shell(route);
    const view = document.getElementById("view");
    if (route === "painel") view.innerHTML = renderDashboard();
    else if (route === "avaliacoes") view.innerHTML = renderAvaliacoes();
    else if (route === "financeiro") view.innerHTML = renderFinanceiro();
    else if (route === "presenca") view.innerHTML = renderPresenca();
    else if (route === "agenda") view.innerHTML = renderAgenda();
    else if (route === "biblioteca") view.innerHTML = renderBiblioteca();
    else if (route === "acesso") view.innerHTML = renderAcesso();
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function renderLogin() {
    const demo = state.usuarios.slice().sort((a, b) => {
      const rank = { ROOT: 0, ADMINISTRADOR: 1, USUARIO: 2 };
      return rank[a.papel] - rank[b.papel] || a.nome.localeCompare(b.nome);
    });
    app.innerHTML = `<div class="login-page">
      <section class="login-story">
        <div class="story-top">
          <div class="brand-lockup"><span class="brand-mark">E</span><span class="brand-copy"><span class="brand-name">EduGestor</span><span class="brand-sub">Plataforma acadêmica</span></span></div>
        </div>
        <div class="story-main">
          <span class="story-kicker">${icon("check", "icon-sm")} Projeto final · modelagem de banco de dados</span>
          <h1>A faculdade inteira, <em>em um só lugar.</em></h1>
          <p>Cinco módulos conectados pela mesma matrícula. Avaliações, mensalidades, presença, agenda e biblioteca com acesso controlado por grupo.</p>
        </div>
        <div class="story-modules">
          ${state.modulos.map(m => `<span class="story-chip"><span class="dot"></span>${esc(m.nome)}</span>`).join("")}
        </div>
        <div class="story-foot"><span>Protótipo local</span><span>Dados fictícios</span><span>SQLite · modelo relacional</span></div>
      </section>
      <section class="login-panel">
        <div class="login-card">
          <div class="login-eyebrow">Acesso de demonstração</div>
          <h2>Entrar no EduGestor</h2>
          <p>Escolha um perfil para explorar a plataforma. O menu e as permissões mudam conforme o grupo.</p>
          <div class="demo-list">
            ${demo.map(u => {
              const g = grupoById(u.grupoId);
              const role = u.papel === "ROOT" ? "Root" : u.papel === "ADMINISTRADOR" ? "Administrador" : u.perfil === "aluno" ? "Aluno" : u.perfil === "professor" ? "Professor" : "Servidor";
              return `<button class="demo-user" data-action="login" data-user="${esc(u.id)}">
                ${avatar(u.nome, "md")}
                <span class="demo-user-main"><span class="demo-user-name">${esc(u.nome)}</span><span class="demo-user-meta">${esc(g.nome)} · ${esc(role)}</span></span>
                <span class="demo-user-role">${esc(role)}</span>
              </button>`;
            }).join("")}
          </div>
          <div class="login-note">${icon("alert", "icon-sm")}<span>Protótipo local com dados fictícios. A sessão e as alterações ficam salvas neste navegador até você restaurar a demonstração.</span></div>
        </div>
      </section>
    </div>`;
  }

  function forbidden(moduleName) {
    return `<div class="card panel" style="max-width:720px;margin:8vh auto;text-align:center;padding:42px">
      <div class="empty-icon" style="margin:0 auto 14px;width:58px;height:58px;border-radius:16px;background:var(--red-soft);color:var(--red);display:grid;place-items:center">${icon("alert", "icon-lg")}</div>
      <div class="eyebrow">Acesso restrito</div>
      <h1 style="font-size:31px;margin:6px 0 8px">${esc(moduleName)} não está disponível</h1>
      <p class="muted" style="max-width:480px;margin:0 auto 18px">O módulo não está habilitado para o grupo <strong>${esc(group() ? group().nome : "—")}</strong>. Peça a liberação ao responsável de acesso.</p>
      <a class="btn btn-primary" href="#/painel">${icon("grid")} Voltar ao painel</a>
    </div>`;
  }
  function notFound() {
    return `<div class="card panel" style="max-width:620px;margin:8vh auto;text-align:center;padding:42px">
      <div class="eyebrow">404</div><h1 style="font-size:31px;margin:6px 0 8px">Página não encontrada</h1>
      <p class="muted">O endereço informado não existe neste protótipo.</p>
      <a class="btn btn-primary" href="#/painel">${icon("grid")} Ir para o painel</a>
    </div>`;
  }

  /* ---------------- Dashboard ---------------- */
function renderDashboard() {
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
    const vencidas = finList.filter(m => statusMensalidade(m) === "VENCIDA");
    const abertas = hasAval ? avaliacoesVisiveis().filter(avaliacaoAberta) : [];
    const freq = hasPres ? (isStudent() ? frequenciaDoAluno() : frequenciaGeral()) : null;
    const media = hasAval ? (isStudent() ? mediaDoAluno() : (() => {
      const vals = avaliacoesVisiveis().map(av => mediaAvaliacao(av.id)).filter(v => v !== null);
      return vals.length ? vals.reduce((x, y) => x + y, 0) / vals.length : null;
    })()) : null;
    const exemplares = hasBib ? state.exemplares : [];
    const disponiveis = exemplares.filter(e => e.status === "DISPONIVEL").length;
    const nextEvents = state.eventos.filter(e => e.inicio.slice(0, 10) >= "2026-10-27").sort((x, y) => String(x.inicio).localeCompare(String(y.inicio)));
    const pending = hasAgenda ? state.solicitacoes.filter(s => s.status === "PENDENTE") : [];
    const upcoming = [];
    if (hasPres) sessoesVisiveis().filter(s => s.data >= "2026-10-27").forEach(s => upcoming.push({ tipo: "sessao", data: s.data, item: s }));
    if (hasAgenda) nextEvents.forEach(e => upcoming.push({ tipo: "evento", data: e.inicio.slice(0, 10), item: e }));
    upcoming.sort((x, y) => x.data.localeCompare(y.data));
    const destaques = abertas.slice(0, 3);

    const kpis = [];
    if (hasAval) kpis.push(kpi("Avaliações abertas", `${abertas.length}`, `${avaliacoesVisiveis().length} no seu recorte`, "#7c3aed", "#f1eafe", "clipboard"));
    if (hasFin) kpis.push(kpi(isStudent() ? "Em aberto" : "A receber", money(aberto), `${vencidas.length} vencida(s)`, "#b45309", "#fdf0dd", "wallet"));
    if (hasPres) kpis.push(kpi("Frequência", freq === null ? "—" : `${freq}%`, isStudent() ? "Média das suas matrículas" : "Média das turmas", "#0f766e", "#dff5f1", "calendar-check"));
    if (hasBib) kpis.push(kpi("Acervo disponível", `${disponiveis}<small>/${exemplares.length}</small>`, `${state.livros.length} títulos catalogados`, "#9d174d", "#fbe7ef", "book"));
    if (hasAgenda) kpis.push(kpi("Próximo evento", nextEvents[0] ? fmtShort(nextEvents[0].inicio) : "—", nextEvents[0] ? nextEvents[0].titulo : "sem eventos futuros", "#1d4ed8", "#e5edff", "calendar"));
    if (kpis.length < 3) kpis.push(kpi("Matrículas ativas", `${isStudent() ? minhasMatriculas().length : state.matriculas.filter(m => m.status === "ATIVA").length}`, "no semestre", "#0f766e", "#dff5f1", "users"));
    if (kpis.length < 4) kpis.push(kpi("Turmas", `${turmasVisiveis().length}`, "no seu recorte", "#6d28d9", "#f0e9ff", "grid"));

    const pendencias = [];
    if (hasFin && vencidas.length) pendencias.push({ tone: "danger", icon: "wallet", titulo: `${vencidas.length} mensalidade(s) vencida(s)`, texto: isStudent() ? "Regularize para liberar novas matrículas." : "Há cobranças em atraso no financeiro.", href: "#/financeiro", label: "Abrir financeiro" });
    if (hasAval && isStudent()) {
      const semTentativa = abertas.filter(av => {
        const m = matriculaDoAlunoNaTurma(av.turmaId);
        return m && !ultimaTentativa(av.id, m.id);
      });
      if (semTentativa.length) pendencias.push({ tone: "warn", icon: "clipboard", titulo: `${semTentativa.length} avaliação(ões) sem tentativa`, texto: "Algumas avaliações abertas ainda não foram iniciadas.", href: "#/avaliacoes", label: "Ver avaliações" });
    }
    if (hasAgenda && podeAprovarAgenda() && pending.length) pendencias.push({ tone: "warn", icon: "calendar", titulo: `${pending.length} solicitação(ões) de agenda`, texto: "Pedidos de alteração aguardam sua análise.", href: "#/agenda", label: "Analisar agenda" });
    if (hasPres && isTeacher()) {
      const abertasSessoes = sessoesVisiveis().filter(s => s.status === "ABERTA");
      if (abertasSessoes.length) pendencias.push({ tone: "info", icon: "calendar-check", titulo: `${abertasSessoes.length} chamada(s) em aberto`, texto: "Registre a presença das suas turmas.", href: "#/presenca", label: "Fazer chamada" });
    }
    if (!pendencias.length) pendencias.push({ tone: "ok", icon: "check", titulo: "Tudo em dia", texto: "Não há pendências para o seu perfil agora.", href: "#/painel", label: "Atualizar" });

    let secondPanel = "";
    if (hasAval) {
      secondPanel = `<section class="card panel">
        <div class="panel-head"><h2>Avaliações em destaque</h2><a class="btn btn-sm btn-ghost" href="#/avaliacoes">Ver todas ${icon("arrow")}</a></div>
        ${destaques.length ? `<div class="assessment-grid">${destaques.map(av => miniAssessment(av)).join("")}</div>` : emptyState("clipboard", "Sem avaliações abertas", "Quando uma avaliação for publicada, ela aparece aqui.")}
      </section>`;
    } else if (hasBib) {
      secondPanel = `<section class="card panel">
        <div class="panel-head"><h2>Acervo em destaque</h2><a class="btn btn-sm btn-ghost" href="#/biblioteca">Abrir biblioteca ${icon("arrow")}</a></div>
        <div class="book-grid">${state.livros.slice(0, 3).map(b => {
          const ex = state.exemplares.filter(e => e.livroId === b.id);
          const disp = ex.filter(e => e.status === "DISPONIVEL").length;
          return `<article class="book-card" style="--book:${b.cor}"><div class="book-cover"><span>${esc(b.titulo)}</span></div><div class="book-body"><h3>${esc(b.titulo)}</h3><div class="book-author">${esc(b.autor)}</div><div class="book-foot"><span class="badge badge-${disp ? "ok" : "warn"}">${disp} disponível(is)</span><button class="btn btn-sm" data-action="book-detail" data-id="${b.id}">Ver</button></div></div></article>`;
        }).join("")}</div>
      </section>`;
    } else if (hasFin) {
      const recent = state.pagamentos
        .filter(p => finList.some(m => m.id === p.mensalidadeId))
        .sort((x, y) => String(y.data).localeCompare(String(x.data))).slice(0, 3);
      secondPanel = `<section class="card panel">
        <div class="panel-head"><h2>Últimos pagamentos</h2><a class="btn btn-sm btn-ghost" href="#/financeiro">Ver financeiro ${icon("arrow")}</a></div>
        ${recent.length ? `<div class="list">${recent.map(p => { const m = state.mensalidades.find(x => x.id === p.mensalidadeId); const mat = m ? state.matriculas.find(x => x.id === m.matriculaId) : null; return `<div class="list-row"><span class="kpi-icon" style="--tint:var(--green-soft);--tone:var(--green)">${icon("check")}</span><div class="list-main"><div class="list-title">${esc(mat ? alunoById(mat.alunoId).nome : "Pagamento")}</div><div class="list-sub">${esc(m ? fmtCompetencia(m.competencia) : "")} · ${fmtDateTime(p.data)}</div></div><strong class="text-sm">${money(p.valor)}</strong></div>`; }).join("")}</div>` : emptyState("wallet", "Sem pagamentos", "As baixas registradas aparecem aqui.")}
      </section>`;
    } else if (hasAgenda) {
      secondPanel = `<section class="card panel">
        <div class="panel-head"><h2>Próximos eventos</h2><a class="btn btn-sm btn-ghost" href="#/agenda">Abrir agenda ${icon("arrow")}</a></div>
        ${nextEvents.length ? `<div class="list">${nextEvents.slice(0, 3).map(e => `<div class="list-row"><span class="kpi-icon" style="--tint:var(--blue-soft);--tone:var(--blue)">${icon("calendar")}</span><div class="list-main"><div class="list-title">${esc(e.titulo)}</div><div class="list-sub">${fmtDate(e.inicio)} · ${esc(e.local)}</div></div>${statusBadge(e.status)}</div>`).join("")}</div>` : emptyState("calendar", "Sem eventos", "Nenhum evento futuro publicado.")}
      </section>`;
    }

    const summary = (hasPres || hasAval)
      ? `<section class="card panel">
          <div class="panel-head"><h2>Resumo acadêmico</h2><span class="muted">2026/2</span></div>
          <div class="flex-center" style="gap:18px;margin-bottom:8px">
            <div class="ring" style="--value:${freq === null ? 0 : freq};--tone:${freq !== null && freq < 75 ? "var(--amber)" : "var(--brand)"}"><span>${freq === null ? "—" : freq + "%"}</span><small>frequência</small></div>
            <div style="flex:1">
              <div class="metric-line"><span>Média ponderada</span><strong>${media === null ? "—" : media.toFixed(1)}</strong></div>
              <div class="metric-line"><span>Matrículas ativas</span><strong>${isStudent() ? minhasMatriculas().length : state.matriculas.filter(m => m.status === "ATIVA").length}</strong></div>
              <div class="metric-line"><span>Tentativas</span><strong>${isStudent() ? state.tentativas.filter(t => minhasMatriculas().some(m => m.id === t.matriculaId)).length : state.tentativas.length}</strong></div>
            </div>
          </div>
          <div class="divider"></div>
          <div class="text-xs muted">Aprovação: média ≥ 6,0 e frequência ≥ 75%.</div>
        </section>`
      : hasFin
        ? `<section class="card panel">
            <div class="panel-head"><h2>Resumo financeiro</h2><span class="muted">2026/2</span></div>
            <div class="metric-line"><span>Em aberto</span><strong>${money(aberto)}</strong></div>
            <div class="metric-line"><span>Recebido</span><strong>${money(finList.reduce((s, m) => s + Number(m.valor) - Number(m.desconto), 0) - aberto)}</strong></div>
            <div class="metric-line"><span>Vencidas</span><strong>${vencidas.length}</strong></div>
            <div class="mt-12">${progress(finList.length ? Math.round(((finList.length - vencidas.length) / finList.length) * 100) : 100, vencidas.length ? "warn" : "")}</div>
          </section>`
        : `<section class="card panel">
            <div class="panel-head"><h2>Resumo do acervo</h2></div>
            <div class="metric-line"><span>Títulos</span><strong>${state.livros.length}</strong></div>
            <div class="metric-line"><span>Exemplares</span><strong>${state.exemplares.length}</strong></div>
            <div class="metric-line"><span>Disponíveis</span><strong>${disponiveis}</strong></div>
            <div class="mt-12">${progress(state.exemplares.length ? Math.round((disponiveis / state.exemplares.length) * 100) : 0)}</div>
          </section>`;

    return `${pageHead("Visão geral", `Olá, ${name}`, `Um recorte do semestre 2026/2 · ${dayOf(TODAY)}, ${fmtDate(TODAY)}.`, `<a class="btn btn-sm" href="#/agenda">${icon("calendar")} Agenda</a>`)}
      <div class="kpi-grid" style="--kpi-cols:${Math.min(4, kpis.length)}">
        ${kpis.slice(0, 4).join("")}
      </div>
      <div class="module-grid">
        ${allowedModules().map(m => `<a class="module-card" href="${m.rota}" style="--tone:${m.cor};--tint:${m.corSuave}">
          <span class="module-icon">${icon(m.icone, "icon-lg")}</span>
          <h3>${esc(m.nome)}</h3><p>${esc(m.descricao)}</p>
          <span class="module-link">Abrir módulo ${icon("arrow")}</span>
        </a>`).join("")}
      </div>
      <div class="dashboard-grid">
        <div class="stack">
          ${hasPres || hasAgenda ? `<section class="card panel">
            <div class="panel-head"><h2>Próximos compromissos</h2><span class="muted">${upcoming.length} item(ns)</span></div>
            <div class="list">
              ${upcoming.length ? upcoming.slice(0, 5).map(({ tipo, item }) => {
                const isSession = tipo === "sessao";
                const title = isSession ? item.tema : item.titulo;
                const sub = isSession ? `${turmaById(item.turmaId).codigo} · ${turmaById(item.turmaId).componente}` : `${item.tipo} · ${item.local}`;
                const date = isSession ? `${fmtDate(item.data)} · ${item.inicio}` : `${fmtDate(item.inicio)} · ${item.inicio.slice(11, 16)}`;
                return `<div class="list-row"><span class="kpi-icon" style="--tint:${isSession ? "var(--brand-soft)" : "var(--blue-soft)"};--tone:${isSession ? "var(--brand)" : "var(--blue)"}">${icon(isSession ? "calendar-check" : "calendar")}</span>
                  <div class="list-main"><div class="list-title">${esc(title)}</div><div class="list-sub">${esc(sub)}</div></div>
                  <div class="right"><div class="text-xs strong nowrap">${esc(date)}</div><div class="text-xs muted">${esc(item.status || "")}</div></div></div>`;
              }).join("") : emptyState("calendar", "Agenda livre", "Nenhum compromisso futuro nos seus módulos.")}
            </div>
          </section>` : ""}
          ${secondPanel}
        </div>
        <div class="stack">
          <section class="card panel">
            <div class="panel-head"><h2>Pendências</h2><span class="badge badge-warn">${pendencias.length}</span></div>
            <div class="stack" style="gap:10px">
              ${pendencias.slice(0, 3).map(p => `<div class="alert alert-${p.tone === "ok" ? "info" : p.tone}">${icon(p.icon)}<div><strong>${esc(p.titulo)}</strong><div class="text-xs" style="margin-top:2px">${esc(p.texto)}</div><a class="text-xs strong" style="color:inherit" href="${p.href}">${esc(p.label)} →</a></div></div>`).join("")}
            </div>
          </section>
          ${summary}
        </div>
      </div>`;
  }

  function miniAssessment(av) {
    const m = isStudent() ? matriculaDoAlunoNaTurma(av.turmaId) : null;
    const tt = m ? ultimaTentativa(av.id, m.id) : null;
    return `<article class="assessment-card">
      <div class="assessment-card-top"><div><h3>${esc(av.titulo)}</h3><div class="meta"><span>${icon("users")} ${esc(turmaById(av.turmaId).codigo)}</span><span>${icon("clipboard")} peso ${esc(av.peso)}</span></div></div>${statusBadge(avaliacaoAberta(av) ? "PUBLICADA" : av.status)}</div>
      <div class="assessment-foot"><div>${tt ? `<div class="grade">${tt.pontuacao.toFixed(1)}<small>/10</small></div>` : `<span class="text-xs muted">Sem tentativa</span>`}</div>
      <a class="btn btn-sm ${avaliacaoAberta(av) && !tt ? "btn-primary" : ""}" href="#/avaliacoes">${tt ? "Ver resultado" : "Abrir"}</a></div>
    </article>`;
  }

  /* ---------------- Avaliações ---------------- */
  function renderAvaliacoes() {
    const tab = ui.tab.avaliacoes || "avaliacoes";
    const staffView = isStaff() || isTeacher();
    const abertas = avaliacoesVisiveis().filter(avaliacaoAberta);
    const media = isStudent() ? mediaDoAluno() : null;
    const myAttempts = isStudent()
      ? state.tentativas.filter(t => minhasMatriculas().some(m => m.id === t.matriculaId)).sort((a, b) => b.fim.localeCompare(a.fim))
      : [];
    const headerActions = staffView
      ? `<span class="badge badge-purple">${abertas.length} aberta(s)</span>`
      : `<a class="btn btn-sm" href="#/avaliacoes" data-action="tab" data-page="avaliacoes" data-tab="tentativas">${icon("file")} Minhas tentativas</a>`;
    return `${pageHead("Módulo Avaliações", "Desempenho e tentativas", "Provas, trabalhos e configuração de gestão acadêmica.", headerActions)}
      ${isStudent() ? `<div class="kpi-grid">
        ${kpi("Média ponderada", media === null ? "—" : media.toFixed(1), "peso das avaliações", "#7c3aed", "#f1eafe", "chart")}
        ${kpi("Avaliações abertas", `${abertas.length}`, "disponíveis agora", "#0f766e", "#dff5f1", "clipboard")}
        ${kpi("Tentativas", `${myAttempts.length}`, "registradas no semestre", "#1d4ed8", "#e5edff", "file")}
        ${kpi("Aprovação", media !== null && media >= 6 ? "No caminho" : "Atenção", "média mínima 6,0", media !== null && media >= 6 ? "#15803d" : "#b45309", media !== null && media >= 6 ? "#e4f5e9" : "#fdf0dd", "check")}
      </div>` : `<div class="kpi-grid">
        ${kpi("Avaliações", `${avaliacoesVisiveis().length}`, "no seu recorte", "#7c3aed", "#f1eafe", "clipboard")}
        ${kpi("Publicadas", `${avaliacoesVisiveis().filter(a => a.status === "PUBLICADA").length}`, "disponíveis aos alunos", "#0f766e", "#dff5f1", "check")}
        ${kpi("Tentativas", `${state.tentativas.length}`, "registradas", "#1d4ed8", "#e5edff", "file")}
        ${kpi("Média geral", mediaGeralAvaliacoes(), "das avaliações com nota", "#b45309", "#fdf0dd", "chart")}
      </div>`}
      <div class="toolbar">
        <div class="tabs" role="tablist">
          <button class="tab ${tab === "avaliacoes" ? "active" : ""}" data-action="tab" data-page="avaliacoes" data-tab="avaliacoes">${staffView ? "Avaliações" : "Minhas avaliações"}</button>
          <button class="tab ${tab === "tentativas" ? "active" : ""}" data-action="tab" data-page="avaliacoes" data-tab="tentativas">${staffView ? "Tentativas" : "Minhas tentativas"}</button>
        </div>
        <span class="muted text-xs">${staffView ? (isTeacher() ? "Somente suas turmas" : "Todas as turmas visíveis") : "Somente seus registros"}</span>
      </div>
      ${tab === "tentativas" ? (staffView ? renderTentativasStaff() : renderMinhasTentativas(myAttempts)) : (staffView ? renderAvaliacoesStaff() : renderAvaliacoesAluno())}
      ${isStudent() ? `<div class="card panel mt-16"><div class="flex-between"><div><div class="eyebrow">Regra de negócio</div><h3 style="font-size:18px">Como a nota é calculada</h3><p class="muted text-sm" style="margin-top:3px">A pontuação da tentativa soma as questões corretas. A média final pondera cada avaliação pelo peso.</p></div><span class="badge badge-purple">média ≥ 6,0</span></div></div>` : ""}`;
  }

  function mediaGeralAvaliacoes() {
    const vals = avaliacoesVisiveis().map(av => mediaAvaliacao(av.id)).filter(v => v !== null);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : "—";
  }

  function renderAvaliacoesAluno() {
    const list = avaliacoesVisiveis();
    if (!list.length) return `<div class="card panel">${emptyState("clipboard", "Nenhuma avaliação", "Não há avaliações para as suas turmas neste semestre.")}</div>`;
    return `<div class="assessment-grid">
      ${list.map(av => {
        const mat = matriculaDoAlunoNaTurma(av.turmaId);
        const ts = mat ? tentativasDa(av.id, mat.id) : [];
        const last = ts[0] || null;
        const max = av.gestao ? av.gestao.maxTentativas : 1;
        const used = ts.length;
        const canStart = mat && avaliacaoAberta(av) && used < max && av.questoes.length > 0;
        return `<article class="assessment-card">
          <div class="assessment-card-top">
            <div><h3>${esc(av.titulo)}</h3><div class="meta">
              <span>${icon("users")} ${esc(turmaById(av.turmaId).codigo)}</span>
              <span>${icon("clipboard")} ${esc(av.tipo)} · peso ${esc(av.peso)}</span>
              <span>${icon("clock")} até ${fmtDateTime(av.fim)}</span>
            </div></div>
            ${statusBadge(avaliacaoAberta(av) ? "ABERTA" : av.status)}
          </div>
          <div class="assessment-foot">
            <div>${last ? `<div class="grade">${Number(last.pontuacao).toFixed(1)}<small>/10</small></div><span class="text-xs muted">${used} de ${max} tentativa(s)</span>` : `<span class="text-xs muted">Sem tentativa · ${max} disponível(is)</span>`}</div>
            ${last ? `<div class="flex gap-8"><button class="btn btn-sm" data-action="view-attempt" data-id="${last.id}">${icon("file")} Ver resultado</button>${canStart ? `<button class="btn btn-sm btn-primary" data-action="start-attempt" data-id="${av.id}">${icon("plus")} Nova tentativa</button>` : ""}</div>`
              : canStart ? `<button class="btn btn-sm btn-primary" data-action="start-attempt" data-id="${av.id}">${icon("plus")} Iniciar tentativa</button>`
              : `<span class="text-xs muted">${av.status === "RASCUNHO" ? "Aguardando publicação" : "Fora da janela"}</span>`}
          </div>
        </article>`;
      }).join("")}
    </div>`;
  }

  function renderAvaliacoesStaff() {
    const list = avaliacoesVisiveis();
    if (!list.length) return `<div class="card panel">${emptyState("clipboard", "Nenhuma avaliação", "Não há avaliações nas turmas do seu recorte.")}</div>`;
    return `<div class="table-wrap"><table class="data">
      <thead><tr><th>Avaliação</th><th>Turma</th><th>Professor</th><th>Período</th><th>Peso</th><th>Tentativas</th><th>Média</th><th>Status</th><th></th></tr></thead>
      <tbody>${list.map(av => {
        const ts = tentativasDa(av.id);
        const media = mediaAvaliacao(av.id);
        return `<tr>
          <td><div class="strong">${esc(av.titulo)}</div><div class="sub">${esc(av.tipo)} · ${esc(av.questoes.length)} questão(ões)</div></td>
          <td>${esc(turmaById(av.turmaId).codigo)}<div class="sub">${esc(turmaById(av.turmaId).componente)}</div></td>
          <td>${esc(professorById(av.professorId).nome)}</td>
          <td class="nowrap">${fmtDate(av.inicio)}<div class="sub">até ${fmtDate(av.fim)}</div></td>
          <td class="num">${esc(av.peso)}</td>
          <td class="num">${ts.length}</td>
          <td class="num">${media === null ? "—" : media.toFixed(1)}</td>
          <td>${statusBadge(av.status)}</td>
          <td class="actions">
            <button class="btn btn-sm" data-action="view-assessment" data-id="${av.id}">${icon("chart")} Ver</button>
            ${av.status === "RASCUNHO" ? `<button class="btn btn-sm btn-primary" data-action="publish-assessment" data-id="${av.id}">Publicar</button>` : ""}
            ${av.status === "PUBLICADA" ? `<button class="btn btn-sm" data-action="close-assessment" data-id="${av.id}">Encerrar</button>` : ""}
          </td>
        </tr>`;
      }).join("")}</tbody>
    </table></div>`;
  }

  function renderMinhasTentativas(attempts) {
    if (!attempts.length) return `<div class="card panel">${emptyState("file", "Nenhuma tentativa", "Você ainda não iniciou nenhuma avaliação.")}</div>`;
    return `<div class="table-wrap"><table class="data">
      <thead><tr><th>Avaliação</th><th>Turma</th><th>Número</th><th>Enviada em</th><th>Nota</th><th>Status</th><th></th></tr></thead>
      <tbody>${attempts.map(t => {
        const av = state.avaliacoes.find(a => a.id === t.avaliacaoId);
        return `<tr><td><div class="strong">${esc(av ? av.titulo : "—")}</div><div class="sub">peso ${esc(av ? av.peso : "—")}</div></td>
          <td>${esc(av ? turmaById(av.turmaId).codigo : "—")}</td><td class="num">${t.numero}</td><td class="nowrap">${fmtDateTime(t.fim)}</td>
          <td class="num strong">${Number(t.pontuacao).toFixed(1)}</td><td>${statusBadge(t.status === "FINALIZADA" ? "CONCLUIDA" : t.status)}</td>
          <td class="actions"><button class="btn btn-sm" data-action="view-attempt" data-id="${t.id}">${icon("file")} Detalhes</button></td></tr>`;
      }).join("")}</tbody></table></div>`;
  }

  function renderTentativasStaff() {
    const list = state.tentativas
      .filter(t => avaliacoesVisiveis().some(a => a.id === t.avaliacaoId))
      .sort((a, b) => b.fim.localeCompare(a.fim));
    if (!list.length) return `<div class="card panel">${emptyState("file", "Nenhuma tentativa", "Ainda não há tentativas nas avaliações do seu recorte.")}</div>`;
    return `<div class="table-wrap"><table class="data">
      <thead><tr><th>Aluno</th><th>Avaliação</th><th>Turma</th><th>Enviada em</th><th>Nota</th><th></th></tr></thead>
      <tbody>${list.map(t => {
        const av = state.avaliacoes.find(a => a.id === t.avaliacaoId);
        const mat = state.matriculas.find(m => m.id === t.matriculaId);
        return `<tr><td>${esc(mat ? alunoById(mat.alunoId).nome : "—")}<div class="sub">${esc(mat ? alunoById(mat.alunoId).ra : "—")}</div></td>
          <td>${esc(av ? av.titulo : "—")}</td><td>${esc(av ? turmaById(av.turmaId).codigo : "—")}</td>
          <td class="nowrap">${fmtDateTime(t.fim)}</td><td class="num strong">${Number(t.pontuacao).toFixed(1)}</td>
          <td class="actions"><button class="btn btn-sm" data-action="view-attempt" data-id="${t.id}">Detalhes</button></td></tr>`;
      }).join("")}</tbody></table></div>`;
  }

  function openAttempt(avId) {
    const av = state.avaliacoes.find(a => a.id === avId);
    const mat = av ? matriculaDoAlunoNaTurma(av.turmaId) : null;
    if (!av || !mat) { toast("Matrícula não encontrada para esta avaliação.", "error"); return; }
    const ts = tentativasDa(av.id, mat.id);
    const max = av.gestao ? av.gestao.maxTentativas : 1;
    if (ts.length >= max) { toast("Limite de tentativas atingido.", "warn"); return; }
    if (!avaliacaoAberta(av)) { toast("A avaliação está fora da janela de tentativa.", "warn"); return; }
    if (!av.questoes.length) { toast("A avaliação ainda não possui questões.", "warn"); return; }
    ui.attempt = { avId: av.id, matId: mat.id };
    showModal({
      eyebrow: "Tentativa " + (ts.length + 1) + " de " + max,
      title: av.titulo,
      size: "modal-lg",
      body: `<div class="alert alert-info" style="margin-bottom:14px">${icon("clock")}<div><strong>Janela aberta até ${fmtDateTime(av.fim)}</strong><div class="text-xs">A nota é calculada pela soma das questões corretas. Cada questão vale os pontos indicados.</div></div></div>
        <form id="attempt-form" data-form="attempt">
          <input type="hidden" name="avaliacaoId" value="${esc(av.id)}">
          <input type="hidden" name="matriculaId" value="${esc(mat.id)}">
          ${av.questoes.map((q, i) => `<div class="question-block">
            <div class="flex-between"><h4>${i + 1}. ${esc(q.enunciado)}</h4><span class="q-points">${q.pontos} ponto(s)</span></div>
            <div class="mt-8">${q.alternativas.map((alt, idx) => `<label class="option"><input type="radio" name="q-${esc(q.id)}" value="${idx}"> <span>${esc(alt)}</span></label>`).join("")}</div>
          </div>`).join("")}
          <div class="form-error" data-error="attempt"></div>
          <div class="text-xs muted">Ao enviar, a tentativa é finalizada e não pode ser alterada.</div>
        </form>`,
      footer: `<button class="btn" data-action="close-modal">Cancelar</button><button class="btn btn-primary" type="submit" form="attempt-form">${icon("check")} Enviar tentativa</button>`
    });
  }

  function submitAttempt(form) {
    const av = state.avaliacoes.find(a => a.id === form.avaliacaoId.value);
    const mat = state.matriculas.find(m => m.id === form.matriculaId.value);
    if (!av || !mat) { toast("Não foi possível registrar a tentativa.", "error"); return; }
    const respostas = {};
    for (const q of av.questoes) {
      const selected = form.querySelector(`input[name="q-${q.id}"]:checked`);
      if (!selected) { showFormError("attempt", "Responda todas as questões antes de enviar."); return; }
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
      respostas
    });
    saveState();
    closeModal();
    toast("Tentativa enviada. Nota: " + pontuacao.toFixed(1) + "/10.", "success");
    render();
  }

  function openAttemptResult(ttId) {
    const tt = state.tentativas.find(t => t.id === ttId);
    if (!tt) return;
    const av = state.avaliacoes.find(a => a.id === tt.avaliacaoId);
    const mat = state.matriculas.find(m => m.id === tt.matriculaId);
    const studentName = mat ? alunoById(mat.alunoId).nome : "Aluno";
    showModal({
      eyebrow: "Resultado da tentativa",
      title: av ? av.titulo : "Avaliação",
      size: "modal-lg",
      body: `<div class="attempt-result"><div class="attempt-score">${Number(tt.pontuacao).toFixed(1)}<small>/10</small></div>
        <div><div class="strong">${esc(studentName)}</div><div class="muted text-sm">${esc(av ? turmaById(av.turmaId).codigo : "")} · tentativa ${tt.numero} · ${fmtDateTime(tt.fim)}</div><div class="mt-8">${statusBadge("CONCLUIDA")}</div></div></div>
        ${av ? av.questoes.map((q, i) => {
          const selected = tt.respostas ? tt.respostas[q.id] : null;
          return `<div class="question-block"><div class="flex-between"><h4>${i + 1}. ${esc(q.enunciado)}</h4><span class="q-points">${q.pontos} ponto(s)</span></div>
            <div class="mt-8">${q.alternativas.map((alt, idx) => {
              const cls = idx === q.correta ? "correct" : idx === selected ? "wrong" : "";
              return `<div class="option ${cls}"><span style="font-weight:700;width:16px">${String.fromCharCode(65 + idx)}</span><span>${esc(alt)}</span>${idx === q.correta ? `<span style="margin-left:auto">${icon("check", "icon-sm")}</span>` : ""}</div>`;
            }).join("")}</div>
            <div class="text-xs muted mt-8">${selected === q.correta ? "Resposta correta." : selected === null ? "Questão não respondida." : "Resposta incorreta."}</div>
          </div>`;
        }).join("") : ""}`,
      footer: `<button class="btn btn-primary" data-action="close-modal">Fechar</button>`
    });
  }

  function openAssessmentStats(avId) {
    const av = state.avaliacoes.find(a => a.id === avId);
    if (!av) return;
    const ts = tentativasDa(av.id);
    const media = mediaAvaliacao(av.id);
    showModal({
      eyebrow: "Gestão da avaliação",
      title: av.titulo,
      size: "modal-lg",
      body: `<div class="summary-strip">
        <div class="summary-item"><span>Turma</span><strong>${esc(turmaById(av.turmaId).codigo)}</strong></div>
        <div class="summary-item"><span>Peso</span><strong>${esc(av.peso)}</strong></div>
        <div class="summary-item"><span>Tentativas</span><strong>${ts.length}</strong></div>
        <div class="summary-item"><span>Média</span><strong>${media === null ? "—" : media.toFixed(1)}</strong></div>
        <div class="summary-item"><span>Status</span><strong>${esc(STATUS_LABELS[av.status] || av.status)}</strong></div>
      </div>
      <div class="table-wrap"><table class="data"><thead><tr><th>Aluno</th><th>Tentativa</th><th>Enviada em</th><th>Nota</th></tr></thead><tbody>
        ${ts.length ? ts.map(t => { const mat = state.matriculas.find(m => m.id === t.matriculaId); return `<tr><td>${esc(mat ? alunoById(mat.alunoId).nome : "—")}</td><td>${t.numero}</td><td>${fmtDateTime(t.fim)}</td><td class="num strong">${Number(t.pontuacao).toFixed(1)}</td></tr>`; }).join("") : `<tr><td colspan="4" class="muted">Sem tentativas registradas.</td></tr>`}
      </tbody></table></div>
      <div class="alert alert-info mt-16">${icon("alert")}<div><strong>Gestão</strong><div class="text-xs">Limite de ${av.gestao ? av.gestao.maxTentativas : 1} tentativa(s). ${av.gestao && av.gestao.permiteRecuperacao ? "Recuperação habilitada com peso " + av.gestao.pesoRecuperacao + "." : "Sem recuperação."}</div></div></div>`,
      footer: `<button class="btn" data-action="close-modal">Fechar</button>`
    });
  }

  /* ---------------- Financeiro ---------------- */
  function renderFinanceiro() {
    const tab = ui.tab.financeiro || "mensalidades";
    const list = mensalidadesVisiveis();
    const aberto = list.reduce((sum, m) => sum + saldoDa(m), 0);
    const vencidas = list.filter(m => statusMensalidade(m) === "VENCIDA");
    const recebido = state.pagamentos
      .filter(p => list.some(m => m.id === p.mensalidadeId))
      .reduce((sum, p) => sum + Number(p.valor), 0);
    const total = list.reduce((sum, m) => sum + Number(m.valor) - Number(m.desconto), 0);
    const adimplencia = total ? Math.round(((total - aberto) / total) * 100) : 100;
    return `${pageHead("Módulo Financeiro", "Mensalidades e pagamentos", "Cobranças por competência, baixas parciais e métodos de pagamento.", `<span class="badge badge-${vencidas.length ? "danger" : "ok"}">${vencidas.length} vencida(s)</span>`)}
      <div class="kpi-grid">
        ${kpi("Em aberto", money(aberto), `${list.filter(m => statusMensalidade(m) !== "PAGA").length} cobrança(s)`, "#b45309", "#fdf0dd", "wallet")}
        ${kpi("Recebido", money(recebido), `${state.pagamentos.filter(p => list.some(m => m.id === p.mensalidadeId)).length} pagamento(s)`, "#15803d", "#e4f5e9", "check")}
        ${kpi("Vencidas", `${vencidas.length}`, vencidas.length ? "regularize para liberar matrícula" : "nenhuma pendência", "#b91c1c", "#fde8e8", "alert")}
        ${kpi("Adimplência", `${adimplencia}%`, "do valor total do recorte", "#0f766e", "#dff5f1", "chart")}
      </div>
      <div class="toolbar">
        <div class="tabs">
          <button class="tab ${tab === "mensalidades" ? "active" : ""}" data-action="tab" data-page="financeiro" data-tab="mensalidades">Mensalidades</button>
          <button class="tab ${tab === "pagamentos" ? "active" : ""}" data-action="tab" data-page="financeiro" data-tab="pagamentos">Pagamentos</button>
          <button class="tab ${tab === "metodos" ? "active" : ""}" data-action="tab" data-page="financeiro" data-tab="metodos">Métodos</button>
        </div>
        ${tab === "mensalidades" ? `<div class="pill-filter">${["TODAS", "ABERTA", "VENCIDA", "PAGA"].map(f => `<button class="pill ${ui.finFilter === f ? "active" : ""}" data-action="fin-filter" data-filter="${f}">${f === "TODAS" ? "Todas" : STATUS_LABELS[f]}</button>`).join("")}</div>` : ""}
      </div>
      ${tab === "mensalidades" ? renderMensalidades(list) : tab === "pagamentos" ? renderPagamentos(list) : renderMetodos()}
    `;
  }

  function renderMensalidades(all) {
    let list = all.slice().sort((a, b) => String(a.vencimento).localeCompare(String(b.vencimento)));
    if (ui.finFilter !== "TODAS") list = list.filter(m => statusMensalidade(m) === ui.finFilter);
    if (!list.length) return `<div class="card panel">${emptyState("wallet", "Nenhuma cobrança", "Não há mensalidades para o filtro selecionado.")}</div>`;
    const staff = !isStudent();
    return `<div class="table-wrap"><table class="data">
      <thead><tr>${staff ? "<th>Aluno</th>" : ""}<th>Competência</th><th>Vencimento</th><th>Valor</th><th>Desconto</th><th>Saldo</th><th>Status</th><th></th></tr></thead>
      <tbody>${list.map(m => {
        const mat = state.matriculas.find(x => x.id === m.matriculaId);
        const aluno = mat ? alunoById(mat.alunoId) : null;
        const saldo = saldoDa(m);
        const st = statusMensalidade(m);
        return `<tr>
          ${staff ? `<td><div class="strong">${esc(aluno ? aluno.nome : "—")}</div><div class="sub">${esc(mat ? turmaById(mat.turmaId).codigo : "—")} · ${esc(aluno ? aluno.ra : "")}</div></td>` : ""}
          <td class="nowrap">${fmtCompetencia(m.competencia)}</td>
          <td class="nowrap">${fmtDate(m.vencimento)}</td>
          <td class="num">${money(m.valor)}</td>
          <td class="num">${m.desconto ? money(m.desconto) : "—"}</td>
          <td class="num strong">${money(saldo)}</td>
          <td>${statusBadge(st)}</td>
          <td class="actions">${saldo > 0 ? `<button class="btn btn-sm btn-primary" data-action="pay-mensalidade" data-id="${m.id}">${icon("wallet")} Pagar</button>` : `<span class="text-xs muted">Quitada</span>`}</td>
        </tr>`;
      }).join("")}</tbody></table></div>`;
  }

  function renderPagamentos(all) {
    const ids = all.map(m => m.id);
    const list = state.pagamentos.filter(p => ids.includes(p.mensalidadeId)).sort((a, b) => String(b.data).localeCompare(String(a.data)));
    if (!list.length) return `<div class="card panel">${emptyState("wallet", "Nenhum pagamento", "As baixas registradas aparecem aqui.")}</div>`;
    return `<div class="table-wrap"><table class="data">
      <thead><tr><th>Data</th><th>Aluno</th><th>Competência</th><th>Método</th><th>Valor</th><th>Comprovante</th><th>Status</th></tr></thead>
      <tbody>${list.map(p => {
        const m = state.mensalidades.find(x => x.id === p.mensalidadeId);
        const mat = m ? state.matriculas.find(x => x.id === m.matriculaId) : null;
        const metodo = state.metodos.find(x => x.id === p.metodoId);
        return `<tr><td class="nowrap">${fmtDateTime(p.data)}</td><td>${esc(mat ? alunoById(mat.alunoId).nome : "—")}</td><td>${esc(m ? fmtCompetencia(m.competencia) : "—")}</td><td>${esc(metodo ? metodo.nome : "—")}</td><td class="num strong">${money(p.valor)}</td><td class="mono">${esc(p.comprovante)}</td><td>${statusBadge(p.status)}</td></tr>`;
      }).join("")}</tbody></table></div>`;
  }

  function renderMetodos() {
    return `<div class="grid-3">${state.metodos.map(m => `<article class="card panel">
      <div class="flex-between"><span class="kpi-icon" style="--tint:var(--amber-soft);--tone:var(--amber)">${icon("wallet")}</span>${statusBadge(m.ativo ? "ATIVA" : "CANCELADA")}</div>
      <h3 style="font-size:18px;margin-top:10px">${esc(m.nome)}</h3>
      <p class="muted text-sm">${esc(m.tipo)} · taxa de ${m.taxa ? m.taxa + "%" : "0%"}</p>
      <div class="divider"></div><div class="text-xs muted">${m.taxa ? "Taxa aplicada no registro do pagamento." : "Sem taxa para a instituição."}</div>
    </article>`).join("")}</div>`;
  }

  function openPayment(mensalidadeId) {
    const m = state.mensalidades.find(x => x.id === mensalidadeId);
    if (!m) return;
    const saldo = saldoDa(m);
    if (saldo <= 0) { toast("Esta mensalidade já está quitada.", "warn"); return; }
    const mat = state.matriculas.find(x => x.id === m.matriculaId);
    showModal({
      eyebrow: "Registrar pagamento",
      title: "Mensalidade " + fmtCompetencia(m.competencia),
      body: `<form id="payment-form" data-form="payment">
        <input type="hidden" name="mensalidadeId" value="${esc(m.id)}">
        <div class="alert alert-info mb-16">${icon("wallet")}<div><strong>${esc(mat ? alunoById(mat.alunoId).nome : "Aluno")}</strong><div class="text-xs">Saldo devedor: ${money(saldo)} · vencimento ${fmtDate(m.vencimento)}</div></div></div>
        <div class="form-grid">
          <div class="field"><label for="pay-valor">Valor do pagamento</label><input class="form-input" id="pay-valor" name="valor" type="number" min="0.01" step="0.01" max="${saldo.toFixed(2)}" value="${saldo.toFixed(2)}" required><span class="hint">Aceita baixa parcial até ${money(saldo)}.</span></div>
          <div class="field"><label for="pay-metodo">Método</label><select class="form-select" id="pay-metodo" name="metodoId">${state.metodos.filter(x => x.ativo).map(x => `<option value="${esc(x.id)}">${esc(x.nome)}${x.taxa ? " · taxa " + x.taxa + "%" : ""}</option>`).join("")}</select></div>
          <div class="field span-2"><label for="pay-obs">Observação (opcional)</label><input class="form-input" id="pay-obs" name="observacao" placeholder="Ex.: pagamento via PIX"></div>
        </div>
        <div class="form-error" data-error="payment"></div>
      </form>`,
      footer: `<button class="btn" data-action="close-modal">Cancelar</button><button class="btn btn-primary" type="submit" form="payment-form">${icon("check")} Confirmar pagamento</button>`
    });
  }

  function submitPayment(form) {
    const m = state.mensalidades.find(x => x.id === form.mensalidadeId.value);
    if (!m) return;
    const saldo = saldoDa(m);
    const valor = Number(form.valor.value);
    if (!Number.isFinite(valor) || valor <= 0) { showFormError("payment", "Informe um valor maior que zero."); return; }
    if (valor > saldo + 0.009) { showFormError("payment", "O valor não pode exceder o saldo de " + money(saldo) + "."); return; }
    const now = new Date();
    state.pagamentos.push({
      id: "pag-" + Date.now(),
      mensalidadeId: m.id,
      metodoId: form.metodoId.value,
      usuarioId: user().id,
      valor,
      data: now.toISOString(),
      status: "CONFIRMADO",
      comprovante: "COMP-" + Math.floor(2000 + Math.random() * 7999)
    });
    const novoSaldo = saldoDa(m);
    m.status = novoSaldo <= 0.009 ? "PAGA" : "PARCIAL";
    saveState();
    closeModal();
    toast("Pagamento de " + money(valor) + " registrado.", "success");
    render();
  }

  /* ---------------- Presença ---------------- */
  function renderPresenca() {
    if (isStudent()) return renderPresencaAluno();
    const sessions = sessoesVisiveis();
    if (!sessions.length) return `${pageHead("Módulo Presença", "Chamada e frequência", "Registre presença por sessão.", "")}<div class="card panel">${emptyState("calendar-check", "Nenhuma sessão", "Não há sessões nas turmas do seu recorte.")}</div>`;
    if (!ui.sessionId || !sessions.some(s => s.id === ui.sessionId)) ui.sessionId = (sessions.find(s => s.status === "ABERTA") || sessions[0]).id;
    const session = sessions.find(s => s.id === ui.sessionId) || sessions[0];
    const mats = matriculasDaTurma(session.turmaId);
    const regs = state.registros.filter(r => r.sessaoId === session.id);
    const freqVals = mats.map(m => frequenciaDaMatricula(m.id)).filter(v => v !== null);
    const avg = freqVals.length ? Math.round(freqVals.reduce((a, b) => a + b, 0) / freqVals.length) : null;
    const presentes = regs.filter(r => r.status === "PRESENTE").length;
    const ausentes = regs.filter(r => r.status === "AUSENTE").length;
    const just = regs.filter(r => r.status === "JUSTIFICADO").length;
    const readOnly = session.status !== "ABERTA";
    return `${pageHead("Módulo Presença", "Chamada e frequência", "Sessões, registros por matrícula e acompanhamento da turma.", `<button class="btn btn-sm ${readOnly ? "" : "btn-primary"}" data-action="toggle-session" data-id="${session.id}">${icon(readOnly ? "refresh" : "check")} ${readOnly ? "Reabrir sessão" : "Encerrar sessão"}</button>`)}
      <div class="kpi-grid">
        ${kpi("Frequência da turma", avg === null ? "—" : avg + "%", `${mats.length} matrícula(s)`, "#0f766e", "#dff5f1", "calendar-check")}
        ${kpi("Presentes", `${presentes}`, "na sessão selecionada", "#15803d", "#e4f5e9", "check")}
        ${kpi("Ausentes", `${ausentes}`, `${just} justificada(s)`, "#b91c1c", "#fde8e8", "alert")}
        ${kpi("Sessões", `${sessions.length}`, "no recorte do perfil", "#1d4ed8", "#e5edff", "calendar")}
      </div>
      <div class="session-picker" role="tablist" aria-label="Sessões">
        ${sessions.map(s => `<button class="session-chip ${s.id === session.id ? "active" : ""}" data-action="select-session" data-id="${s.id}"><strong>${fmtDate(s.data)}</strong>${esc(s.tema)}<div class="text-xs muted">${esc(turmaById(s.turmaId).codigo)} · ${statusLabel(s.status)}</div></button>`).join("")}
      </div>
      <section class="card panel">
        <div class="panel-head"><div><h2>${esc(session.tema)}</h2><span class="muted text-sm">${esc(turmaById(session.turmaId).codigo)} · ${esc(turmaById(session.turmaId).componente)} · ${fmtDate(session.data)} ${esc(session.inicio)}–${esc(session.fim)} · ${esc(professorById(session.professorId).nome)}</span></div>${statusBadge(session.status)}</div>
        <form id="attendance-form" data-form="attendance">
          <div class="table-wrap"><table class="data"><thead><tr><th>Aluno</th><th>RA</th><th>Frequência</th><th>Status</th><th>Justificativa</th></tr></thead><tbody>
          ${mats.map(m => {
            const reg = regs.find(r => r.matriculaId === m.id);
            const st = reg ? reg.status : "PRESENTE";
            const freq = frequenciaDaMatricula(m.id);
            return `<tr><td><div class="strong">${esc(alunoById(m.alunoId).nome)}</div><div class="sub">${esc(m.status)}</div></td><td class="mono">${esc(alunoById(m.alunoId).ra)}</td>
              <td style="min-width:120px"><div class="flex-center"><span class="text-xs" style="width:34px">${freq === null ? "—" : freq + "%"}</span>${progress(freq || 0, freq !== null && freq < 75 ? "warn" : "")}</div></td>
              <td><select class="form-select" name="att-${esc(m.id)}" ${readOnly ? "disabled" : ""}>${["PRESENTE", "AUSENTE", "JUSTIFICADO"].map(s => `<option value="${s}" ${st === s ? "selected" : ""}>${STATUS_LABELS[s]}</option>`).join("")}</select></td>
              <td><input class="form-input" name="just-${esc(m.id)}" value="${esc(reg ? reg.justificativa : "")}" placeholder="Obrigatória se justificado" ${readOnly ? "disabled" : ""}></td></tr>`;
          }).join("")}</tbody></table></div>
          <div class="form-error" data-error="attendance"></div>
          <div class="flex-between mt-16"><span class="text-xs muted">${readOnly ? "Sessão encerrada: reabra para editar os registros." : "A frequência é recalculada ao salvar."}</span><button class="btn btn-primary" type="submit" ${readOnly ? "disabled" : ""}>${icon("check")} Salvar chamada</button></div>
        </form>
      </section>`;
  }

  function statusLabel(status) { return STATUS_LABELS[status] || status; }

  function renderPresencaAluno() {
    const ms = minhasMatriculas();
    const regs = state.registros.filter(r => ms.some(m => m.id === r.matriculaId)).sort((a, b) => {
      const sa = state.sessoes.find(s => s.id === a.sessaoId);
      const sb = state.sessoes.find(s => s.id === b.sessaoId);
      return String(sb ? sb.data : "").localeCompare(String(sa ? sa.data : ""));
    });
    const freq = frequenciaDoAluno();
    const presentes = regs.filter(r => r.status === "PRESENTE").length;
    const ausentes = regs.filter(r => r.status === "AUSENTE").length;
    const just = regs.filter(r => r.status === "JUSTIFICADO").length;
    return `${pageHead("Módulo Presença", "Sua frequência", "Acompanhe presenças, faltas e justificativas por sessão.", `<span class="badge badge-${freq !== null && freq >= 75 ? "ok" : "danger"}">${freq === null ? "Sem registros" : freq + "% de frequência"}</span>`)}
      <div class="dashboard-grid">
        <div class="stack">
          <div class="kpi-grid" style="grid-template-columns:repeat(3,minmax(0,1fr))">
            ${kpi("Presenças", `${presentes}`, "registros confirmados", "#15803d", "#e4f5e9", "check")}
            ${kpi("Faltas", `${ausentes}`, "ausências sem justificativa", "#b91c1c", "#fde8e8", "alert")}
            ${kpi("Justificadas", `${just}`, "contam para a frequência", "#b45309", "#fdf0dd", "file")}
          </div>
          <section class="card panel">
            <div class="panel-head"><h2>Histórico de presença</h2><span class="muted">${regs.length} registro(s)</span></div>
            ${regs.length ? `<div class="table-wrap"><table class="data"><thead><tr><th>Data</th><th>Sessão</th><th>Turma</th><th>Status</th><th>Justificativa</th></tr></thead><tbody>
              ${regs.map(r => { const s = state.sessoes.find(x => x.id === r.sessaoId); return `<tr><td class="nowrap">${s ? fmtDate(s.data) : "—"}</td><td>${esc(s ? s.tema : "—")}</td><td>${esc(s ? turmaById(s.turmaId).codigo : "—")}</td><td>${statusBadge(r.status)}</td><td class="text-xs muted">${esc(r.justificativa || "—")}</td></tr>`; }).join("")}
            </tbody></table></div>` : emptyState("calendar-check", "Sem registros", "Ainda não há chamadas registradas para você.")}
          </section>
        </div>
        <div class="stack">
          <section class="card panel">
            <div class="panel-head"><h2>Frequência</h2></div>
            <div style="display:flex;justify-content:center;padding:10px 0 16px"><div class="ring" style="--value:${freq || 0};--tone:${freq !== null && freq < 75 ? "var(--amber)" : "var(--brand)"};width:132px;height:132px"><span style="font-size:32px">${freq === null ? "—" : freq + "%"}</span><small>mínimo 75%</small></div></div>
            <div class="text-sm muted" style="text-align:center">A frequência considera presenças e justificativas sobre o total de sessões registradas.</div>
          </section>
          <section class="card panel">
            <div class="panel-head"><h2>Matrículas</h2></div>
            ${ms.map(m => `<div class="metric-line"><span>${esc(turmaById(m.turmaId).codigo)} · ${esc(turmaById(m.turmaId).componente)}</span><strong>${frequenciaDaMatricula(m.id) === null ? "—" : frequenciaDaMatricula(m.id) + "%"}</strong></div>`).join("") || `<div class="text-sm muted">Sem matrícula ativa.</div>`}
          </section>
        </div>
      </div>`;
  }

  function submitAttendance(form) {
    const session = state.sessoes.find(s => s.id === ui.sessionId);
    if (!session) return;
    if (session.status !== "ABERTA") { toast("Reabra a sessão para editar a chamada.", "warn"); return; }
    const changes = [];
    let justificativaFaltando = false;
    matriculasDaTurma(session.turmaId).forEach(m => {
      const sel = form.querySelector(`[name="att-${m.id}"]`);
      if (!sel) return;
      const status = sel.value;
      const just = form.querySelector(`[name="just-${m.id}"]`);
      const justificativa = just ? just.value.trim() : "";
      if (status === "JUSTIFICADO" && !justificativa) justificativaFaltando = true;
      changes.push({ matriculaId: m.id, status, justificativa });
    });
    if (justificativaFaltando) {
      const error = form.querySelector('[data-error="attendance"]');
      if (error) { error.textContent = "Informe a justificativa para os registros justificados."; error.classList.add("show"); }
      toast("Informe a justificativa para os registros justificados.", "warn");
      return;
    }
    changes.forEach(change => {
      let reg = state.registros.find(r => r.sessaoId === session.id && r.matriculaId === change.matriculaId);
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
    saveState();
    toast("Chamada salva.", "success");
    render();
  }

  /* ---------------- Agenda ---------------- */
  function renderAgenda() {
    const tab = ui.tab.agenda || "grade";
    const turmas = turmasVisiveis();
    if (!ui.agendaTurma || !turmas.some(t => t.id === ui.agendaTurma)) ui.agendaTurma = turmas[0] ? turmas[0].id : null;
    const turma = turmas.find(t => t.id === ui.agendaTurma);
    const pendentes = state.solicitacoes.filter(s => s.status === "PENDENTE");
    return `${pageHead("Módulo Agenda", "Grade, eventos e alterações", "Horários da turma, eventos acadêmicos e solicitações de mudança.", `<button class="btn btn-sm btn-primary" data-action="request-change">${icon("plus")} Solicitar alteração</button>`)}
      <div class="toolbar">
        <div class="tabs">
          <button class="tab ${tab === "grade" ? "active" : ""}" data-action="tab" data-page="agenda" data-tab="grade">Grade horária</button>
          <button class="tab ${tab === "eventos" ? "active" : ""}" data-action="tab" data-page="agenda" data-tab="eventos">Eventos</button>
          <button class="tab ${tab === "solicitacoes" ? "active" : ""}" data-action="tab" data-page="agenda" data-tab="solicitacoes">Solicitações ${pendentes.length ? `<span class="badge badge-warn">${pendentes.length}</span>` : ""}</button>
        </div>
        ${tab === "grade" && turmas.length > 1 ? `<select class="form-select" style="width:auto" data-change="agenda-turma" aria-label="Turma">${turmas.map(t => `<option value="${esc(t.id)}" ${t.id === ui.agendaTurma ? "selected" : ""}>${esc(t.codigo)} · ${esc(t.componente)}</option>`).join("")}</select>` : ""}
      </div>
      ${tab === "grade" ? renderGrade(turma, turmas) : tab === "eventos" ? renderEventos() : renderSolicitacoes()}
    `;
  }

  function renderGrade(turma) {
    if (!turma) return `<div class="card panel">${emptyState("calendar", "Sem turma", "Não há turma vinculada ao seu perfil.")}</div>`;
    const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
    const slots = ["14:00", "19:00"];
    const entries = state.grade.filter(g => g.turmaId === turma.id && g.status === "ATIVA");
    return `<section class="card panel">
      <div class="panel-head"><div><h2>${esc(turma.codigo)} · ${esc(turma.componente)}</h2><span class="muted text-sm">${esc(turma.periodo)} · ${esc(turma.turno)} · ${esc(professorById(turma.professorId).nome)}</span></div><span class="badge badge-info">${entries.length} horário(s)</span></div>
      <div style="overflow:auto"><div class="week-grid">
        <div></div>${days.map(d => `<div class="week-head">${d}</div>`).join("")}
        ${slots.map(slot => `<div class="week-time">${slot}</div>${days.map(day => {
          const items = entries.filter(g => g.dia === day && g.inicio === slot);
          return `<div class="week-cell">${items.map(g => `<div class="week-event"><strong>${esc(g.componente)}</strong><small>${esc(g.inicio)}–${esc(g.fim)} · ${esc(g.sala)}</small></div>`).join("")}</div>`;
        }).join("")}`).join("")}
      </div></div>
      <div class="alert alert-info mt-16">${icon("calendar")}<div><strong>Conflitos e alterações</strong><div class="text-xs">A aprovação de uma solicitação valida choque de horário para a turma e para o professor antes de atualizar a grade.</div></div></div>
    </section>`;
  }

  function renderEventos() {
    const list = state.eventos.slice().sort((a, b) => String(a.inicio).localeCompare(String(b.inicio)));
    if (!list.length) return `<div class="card panel">${emptyState("calendar", "Sem eventos", "Nenhum evento publicado.")}</div>`;
    return `<div class="event-grid">${list.map(e => {
      const d = new Date(e.inicio);
      return `<article class="event-card"><div class="event-date"><div><strong>${String(d.getDate()).padStart(2, "0")}</strong><small>${MONTHS[d.getMonth()]}</small></div></div>
        <div style="flex:1"><div class="flex-between"><h3>${esc(e.titulo)}</h3>${statusBadge(e.status)}</div><div class="meta"><span>${icon("clock")} ${fmtDateTime(e.inicio)}</span><span>${icon("users")} ${esc(e.publico)}</span><span>${icon("grid")} ${esc(e.local)}</span></div>
        <div class="text-xs muted mt-8">${esc(e.tipo)} · responsável ${esc(professorById(e.professorId).nome)}</div></div></article>`;
    }).join("")}</div>`;
  }

  function renderSolicitacoes() {
    const list = solicitacoesVisiveis().slice().sort((a, b) => String(b.data).localeCompare(String(a.data)));
    if (!list.length) return `<div class="card panel">${emptyState("calendar", "Nenhuma solicitação", "Pedidos de alteração de horário aparecem aqui.")}</div>`;
    return `<div class="card panel"><div class="panel-head"><h2>Solicitações de alteração</h2><span class="muted">${list.length} registro(s)</span></div><div class="list">
      ${list.map(s => {
        const g = state.grade.find(x => x.id === s.gradeId);
        return `<div class="request-row"><span class="request-icon">${icon(s.status === "APROVADA" ? "check" : s.status === "REJEITADA" ? "x" : "clock")}</span>
          <div class="list-main"><div class="flex-between"><div class="list-title">${esc(s.tipo.replace(/_/g, " "))} · ${esc(g ? g.componente : "—")}</div>${statusBadge(s.status)}</div>
          <div class="list-sub">${esc(g ? turmaById(g.turmaId).codigo : "—")} · solicitado por ${esc(usuarioById(s.solicitanteId).nome)} em ${fmtDateTime(s.data)}</div>
          <div class="text-xs muted mt-8">${esc(s.justificativa)}${s.salaProposta ? ` · sala proposta: ${esc(s.salaProposta)}` : ""}${s.motivoRejeicao ? ` · motivo: ${esc(s.motivoRejeicao)}` : ""}</div>
          ${podeAprovarAgenda() && s.status === "PENDENTE" ? `<div class="mt-8 flex gap-8"><button class="btn btn-sm btn-primary" data-action="approve-request" data-id="${s.id}">${icon("check")} Aprovar</button><button class="btn btn-sm btn-danger" data-action="reject-request" data-id="${s.id}">${icon("x")} Rejeitar</button></div>` : ""}
          </div></div>`;
      }).join("")}
    </div></div>`;
  }

  function openRequestChange() {
    const turma = state.turmas.find(t => t.id === ui.agendaTurma) || turmasVisiveis()[0];
    if (!turma) { toast("Sem turma para solicitar alteração.", "warn"); return; }
    const entries = state.grade.filter(g => g.turmaId === turma.id && g.status === "ATIVA");
    if (!entries.length) { toast("A turma não possui grade horária ativa.", "warn"); return; }
    showModal({
      eyebrow: "Agenda",
      title: "Solicitar alteração de horário",
      body: `<form id="request-form" data-form="request">
        <div class="form-grid">
          <div class="field span-2"><label for="req-grade">Horário</label><select class="form-select" id="req-grade" name="gradeId">${entries.map(g => `<option value="${esc(g.id)}">${esc(g.dia)} · ${esc(g.inicio)}–${esc(g.fim)} · ${esc(g.componente)}</option>`).join("")}</select></div>
          <div class="field"><label for="req-tipo">Tipo</label><select class="form-select" id="req-tipo" name="tipo"><option value="NOVO_HORARIO">Novo horário</option><option value="SUBSTITUICAO">Substituição</option><option value="CANCELAMENTO">Cancelamento</option></select></div>
          <div class="field"><label for="req-sala">Sala proposta (opcional)</label><input class="form-input" id="req-sala" name="salaProposta" placeholder="Ex.: 305"></div>
          <div class="field span-2"><label for="req-just">Justificativa</label><textarea class="form-textarea" id="req-just" name="justificativa" required placeholder="Explique o motivo da alteração."></textarea></div>
        </div>
        <div class="form-error" data-error="request"></div>
        <div class="alert alert-info mt-12">${icon("clock")}<div class="text-xs">A solicitação nasce pendente e será analisada pela coordenação. A grade só muda após a aprovação.</div></div>
      </form>`,
      footer: `<button class="btn" data-action="close-modal">Cancelar</button><button class="btn btn-primary" type="submit" form="request-form">${icon("check")} Enviar solicitação</button>`
    });
  }

  function submitRequest(form) {
    const gradeId = form.gradeId.value;
    const grade = state.grade.find(g => g.id === gradeId);
    if (!grade) return;
    const justificativa = form.justificativa.value.trim();
    if (!justificativa) { showFormError("request", "Informe a justificativa."); return; }
    state.solicitacoes.push({
      id: "sol-" + Date.now(),
      gradeId,
      solicitanteId: user().id,
      aprovadorId: null,
      tipo: form.tipo.value,
      justificativa,
      data: new Date().toISOString(),
      dataAprovacao: null,
      status: "PENDENTE",
      salaProposta: form.salaProposta.value.trim() || null
    });
    saveState();
    closeModal();
    ui.tab.agenda = "solicitacoes";
    toast("Solicitação enviada para a coordenação.", "success");
    render();
  }

  function approveRequest(id) {
    const s = state.solicitacoes.find(x => x.id === id);
    if (!s) return;
    s.status = "APROVADA";
    s.aprovadorId = user().id;
    s.dataAprovacao = new Date().toISOString();
    if (s.tipo === "NOVO_HORARIO" && s.salaProposta) {
      const g = state.grade.find(x => x.id === s.gradeId);
      if (g) g.sala = s.salaProposta;
    }
    if (s.tipo === "CANCELAMENTO") {
      const g = state.grade.find(x => x.id === s.gradeId);
      if (g) g.status = "INATIVA";
    }
    saveState();
    toast("Solicitação aprovada e agenda atualizada.", "success");
    render();
  }

  function openRejectRequest(id) {
    const s = state.solicitacoes.find(x => x.id === id);
    if (!s) return;
    showModal({
      eyebrow: "Agenda",
      title: "Rejeitar solicitação",
      body: `<form id="reject-form" data-form="reject"><input type="hidden" name="id" value="${esc(id)}">
        <p class="text-sm muted mb-16">Explique o motivo da rejeição. O solicitante verá a resposta no histórico.</p>
        <div class="field"><label for="reject-motivo">Motivo</label><textarea class="form-textarea" id="reject-motivo" name="motivo" required></textarea></div>
        <div class="form-error" data-error="reject"></div>
      </form>`,
      footer: `<button class="btn" data-action="close-modal">Cancelar</button><button class="btn btn-danger" type="submit" form="reject-form">Rejeitar</button>`
    });
  }

  function submitReject(form) {
    const s = state.solicitacoes.find(x => x.id === form.id.value);
    if (!s) return;
    const motivo = form.motivo.value.trim();
    if (!motivo) { showFormError("reject", "Informe o motivo."); return; }
    s.status = "REJEITADA";
    s.aprovadorId = user().id;
    s.dataAprovacao = new Date().toISOString();
    s.motivoRejeicao = motivo;
    saveState();
    closeModal();
    toast("Solicitação rejeitada.", "success");
    render();
  }

  /* ---------------- Biblioteca ---------------- */
  function renderBiblioteca() {
    const tab = ui.libTab || "livros";
    const acervoCount = state.acervos.length;
    const disponiveis = state.exemplares.filter(e => e.status === "DISPONIVEL").length;
    return `${pageHead("Módulo Biblioteca", "Acervo e exemplares", "Catálogo por acervo, disponibilidade dos exemplares e histórico de buscas.", `<span class="badge badge-ok">${disponiveis} exemplar(es) disponível(is)</span>`)}
      <div class="kpi-grid">
        ${kpi("Acervos", `${acervoCount}`, "coleções ativas", "#9d174d", "#fbe7ef", "book")}
        ${kpi("Títulos", `${state.livros.length}`, "referências catalogadas", "#1d4ed8", "#e5edff", "book")}
        ${kpi("Exemplares", `${state.exemplares.length}`, `${disponiveis} disponíveis`, "#0f766e", "#dff5f1", "grid")}
        ${kpi("Buscas", `${state.historico.length}`, "registradas no histórico", "#b45309", "#fdf0dd", "search")}
      </div>
      <div class="toolbar">
        <div class="tabs">
          ${[["livros", "Livros"], ["acervo", "Acervos"], ["exemplares", "Exemplares"], ["historico", "Histórico"]].map(([id, label]) => `<button class="tab ${tab === id ? "active" : ""}" data-action="tab" data-page="biblioteca" data-tab="${id}">${label}</button>`).join("")}
        </div>
      </div>
      ${tab === "livros" ? renderLivros() : tab === "acervo" ? renderAcervos() : tab === "exemplares" ? renderExemplares() : renderHistorico()}
    `;
  }

  function livrosFiltrados() {
    const q = ui.libQuery.trim().toLowerCase();
    return state.livros.filter(l => {
      const matchQ = !q || [l.titulo, l.autor, l.isbn, l.area, l.editora].some(v => String(v).toLowerCase().includes(q));
      const matchA = ui.libArea === "TODOS" || l.area === ui.libArea;
      return matchQ && matchA;
    });
  }

  function renderLivros() {
    const list = livrosFiltrados();
    const areas = ["TODOS"].concat([...new Set(state.livros.map(l => l.area))]);
    return `<form class="toolbar" data-form="library-search">
      <div class="searchbox">${icon("search")}<input type="search" name="q" value="${esc(ui.libQuery)}" placeholder="Buscar por título, autor, ISBN ou área..." aria-label="Buscar no acervo"></div>
      <select class="form-select" style="width:auto" name="area" aria-label="Filtrar por área">${areas.map(a => `<option value="${esc(a)}" ${ui.libArea === a ? "selected" : ""}>${a === "TODOS" ? "Todas as áreas" : esc(a)}</option>`).join("")}</select>
      <button class="btn btn-primary" type="submit">${icon("search")} Buscar</button>
      ${ui.libQuery ? `<button class="btn btn-ghost" type="button" data-action="clear-library-search">Limpar</button>` : ""}
    </form>
    ${list.length ? `<div class="book-grid">${list.map(b => {
      const ex = state.exemplares.filter(e => e.livroId === b.id);
      const disp = ex.filter(e => e.status === "DISPONIVEL").length;
      return `<article class="book-card" style="--book:${b.cor}"><div class="book-cover"><span>${esc(b.titulo)}</span></div><div class="book-body">
        <h3>${esc(b.titulo)}</h3><div class="book-author">${esc(b.autor)} · ${esc(b.ano)}</div>
        <div class="text-xs muted">${esc(b.area)} · ${esc(b.editora)}</div>
        <div class="book-foot"><span class="badge badge-${disp ? "ok" : "warn"}">${disp} de ${ex.length} disponível(is)</span><button class="btn btn-sm" data-action="book-detail" data-id="${b.id}">Detalhes ${icon("arrow")}</button></div>
      </div></article>`;
    }).join("")}</div>` : `<div class="card panel">${emptyState("search", "Nenhum livro encontrado", "Tente outro termo ou remova o filtro de área.")}</div>`}`;
  }

  function renderAcervos() {
    return `<div class="acervo-grid">${state.acervos.map(a => {
      const livros = state.livros.filter(l => l.acervoId === a.id);
      const ex = state.exemplares.filter(e => livros.some(l => l.id === e.livroId));
      return `<article class="acervo-card"><span class="acervo-icon">${icon("book", "icon-lg")}</span><div style="flex:1"><div class="flex-between"><h3 style="font-size:18px">${esc(a.nome)}</h3>${statusBadge(a.ativo ? "ATIVA" : "CANCELADA")}</div><p class="muted text-sm" style="margin:3px 0 8px">${esc(a.descricao)}</p><div class="meta" style="display:flex;gap:12px;font-size:11px;color:var(--muted)"><span>${livros.length} título(s)</span><span>${ex.length} exemplar(es)</span><span>${esc(a.area)}</span></div></div></article>`;
    }).join("")}</div>`;
  }

  function renderExemplares() {
    return `<div class="table-wrap"><table class="data"><thead><tr><th>Tombo</th><th>Livro</th><th>Área</th><th>Localização</th><th>Aquisição</th><th>Status</th></tr></thead><tbody>
      ${state.exemplares.map(e => { const l = state.livros.find(x => x.id === e.livroId); return `<tr><td class="mono">${esc(e.tombo)}</td><td><div class="strong">${esc(l ? l.titulo : "—")}</div><div class="sub">${esc(l ? l.autor : "")}</div></td><td>${esc(l ? l.area : "—")}</td><td>${esc(e.localizacao)}</td><td class="nowrap">${fmtDate(e.dataAquisicao)}</td><td>${statusBadge(e.status)}</td></tr>`; }).join("")}
    </tbody></table></div>`;
  }

  function renderHistorico() {
    const all = podeGerenciarBiblioteca();
    const list = (all ? state.historico : state.historico.filter(h => h.usuarioId === user().id)).slice().sort((a, b) => String(b.data).localeCompare(String(a.data)));
    if (!list.length) return `<div class="card panel">${emptyState("search", "Sem buscas", "O histórico registra as consultas feitas no catálogo.")}</div>`;
    return `<div class="table-wrap"><table class="data"><thead><tr><th>Termo</th><th>Filtros</th>${all ? "<th>Usuário</th>" : ""}<th>Data</th><th>Resultados</th></tr></thead><tbody>
      ${list.map(h => `<tr><td><span class="history-term">${esc(h.termo)}</span></td><td>${esc(h.filtros)}</td>${all ? `<td>${esc(usuarioById(h.usuarioId).nome)}</td>` : ""}<td class="nowrap">${fmtDateTime(h.data)}</td><td class="num">${h.resultados}</td></tr>`).join("")}
    </tbody></table></div>`;
  }

  function submitLibrarySearch(form) {
    ui.libQuery = form.q.value.trim();
    ui.libArea = form.area.value;
    const results = livrosFiltrados().length;
    if (ui.libQuery) {
      state.historico.push({
        id: "hb-" + Date.now(),
        usuarioId: user().id,
        termo: ui.libQuery,
        filtros: ui.libArea === "TODOS" ? "Todos" : ui.libArea,
        data: new Date().toISOString(),
        resultados: results
      });
      saveState();
      toast(results ? `${results} livro(s) encontrado(s).` : "Nenhum livro encontrado para a busca.", results ? "success" : "warn");
    }
    render();
  }

  function openBookDetail(bookId) {
    const b = state.livros.find(l => l.id === bookId);
    if (!b) return;
    const ex = state.exemplares.filter(e => e.livroId === b.id);
    const acervo = state.acervos.find(a => a.id === b.acervoId);
    showModal({
      eyebrow: "Biblioteca",
      title: b.titulo,
      body: `<div class="flex-center" style="align-items:flex-start;gap:16px;margin-bottom:16px">
        <div style="width:96px;height:126px;border-radius:10px;background:linear-gradient(135deg,${b.cor},#0b1f33);position:relative;flex:0 0 auto"><span style="position:absolute;left:16px;top:14px;bottom:14px;width:4px;background:rgba(255,255,255,.45);border-radius:2px"></span></div>
        <div><h3 style="font-size:22px;line-height:1.15">${esc(b.titulo)}</h3><div class="muted text-sm">${esc(b.autor)} · ${esc(b.editora)} · ${esc(b.ano)}</div>
        <div class="meta" style="display:flex;gap:12px;flex-wrap:wrap;font-size:11px;color:var(--muted);margin-top:6px"><span>ISBN ${esc(b.isbn)}</span><span>${esc(b.area)}</span><span>${esc(acervo ? acervo.nome : "—")}</span></div></div>
      </div>
      <div class="table-wrap"><table class="data"><thead><tr><th>Tombo</th><th>Localização</th><th>Aquisição</th><th>Status</th></tr></thead><tbody>
        ${ex.map(e => `<tr><td class="mono">${esc(e.tombo)}</td><td>${esc(e.localizacao)}</td><td>${fmtDate(e.dataAquisicao)}</td><td>${statusBadge(e.status)}</td></tr>`).join("")}
      </tbody></table></div>`,
      footer: `<button class="btn btn-primary" data-action="close-modal">Fechar</button>`
    });
  }

  /* ---------------- Acesso ---------------- */
  function renderAcesso() {
    if (!isRoot()) return forbidden("Acesso e módulos");
    return `${pageHead("Administração", "Grupos, papéis e módulos", "A matriz define quais módulos cada grupo enxerga. Apenas o papel ROOT altera esta configuração.", `<button class="btn btn-sm btn-danger" data-action="reset-demo">${icon("refresh")} Restaurar demonstração</button>`)}
      <div class="grid-2" style="align-items:start">
        <section class="card panel">
          <div class="panel-head"><div><h2>Matriz de módulos</h2><span class="muted text-sm">Clique no interruptor para habilitar ou desabilitar.</span></div><span class="badge badge-neutral">${state.grupos.length} grupos</span></div>
          <div style="overflow:auto"><table class="matrix"><thead><tr><th>Grupo</th>${state.modulos.map(m => `<th>${esc(m.nome)}</th>`).join("")}</tr></thead><tbody>
            ${state.grupos.map(g => `<tr><td><span class="group-name">${esc(g.nome)}</span><span class="group-role">${esc(g.papel)}</span></td>
              ${state.modulos.map(m => { const on = g.modulos.includes(m.id); return `<td><button class="switch ${on ? "on" : ""}" data-action="toggle-module" data-group="${esc(g.id)}" data-module="${esc(m.id)}" aria-label="${on ? "Desabilitar" : "Habilitar"} ${esc(m.nome)} para ${esc(g.nome)}" aria-pressed="${on}"></button></td>`; }).join("")}
            </tr>`).join("")}
          </tbody></table></div>
          <div class="alert alert-info mt-16">${icon("alert")}<div><strong>Defesa em profundidade</strong><div class="text-xs">O menu esconde o módulo, a rota revalida o grupo e cada tela confirma o vínculo do usuário com o registro.</div></div></div>
        </section>
        <section class="card panel">
          <div class="panel-head"><div><h2>Usuários</h2><span class="muted text-sm">Credenciais de demonstração.</span></div><span class="badge badge-neutral">${state.usuarios.length}</span></div>
          <div class="table-wrap"><table class="data"><thead><tr><th>Usuário</th><th>Grupo</th><th>Papel</th></tr></thead><tbody>
            ${state.usuarios.map(u => `<tr><td><div class="flex-center">${avatar(u.nome, "sm")}<div><div class="strong">${esc(u.nome)}</div><div class="sub">${esc(u.email)}</div></div></div></td><td>${esc(grupoById(u.grupoId).nome)}</td><td>${roleBadge(u.papel)}</td></tr>`).join("")}
          </tbody></table></div>
        </section>
      </div>`;
  }

  function toggleModule(groupId, moduleId) {
    const g = state.grupos.find(x => x.id === groupId);
    if (!g) return;
    if (g.modulos.includes(moduleId)) g.modulos = g.modulos.filter(x => x !== moduleId);
    else g.modulos.push(moduleId);
    saveState();
    toast("Matriz de módulos atualizada.", "success");
    render();
  }

  function resetDemo() {
    showModal({
      eyebrow: "Demonstração",
      title: "Restaurar os dados?",
      body: `<p class="text-sm muted">As tentativas, pagamentos, chamadas e solicitações criadas neste navegador serão substituídas pelos dados originais do protótipo.</p>`,
      footer: `<button class="btn" data-action="close-modal">Cancelar</button><button class="btn btn-danger" data-action="confirm-reset">${icon("refresh")} Restaurar</button>`
    });
  }

  /* ---------------- Modal / toast ---------------- */
  function showModal({ eyebrow, title, body, footer, size }) {
    modalRoot.innerHTML = `<div class="modal-backdrop" data-action="close-modal"></div>
      <div class="modal-card ${size || ""}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-head"><div><div class="eyebrow">${esc(eyebrow || "EduGestor")}</div><h2 id="modal-title">${esc(title)}</h2></div><button class="icon-btn" data-action="close-modal" aria-label="Fechar">${icon("x")}</button></div>
        <div class="modal-body">${body}</div>
        ${footer ? `<div class="modal-foot">${footer}</div>` : ""}
      </div>`;
    modalRoot.classList.add("open");
    modalRoot.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const focus = modalRoot.querySelector("input:not([type=hidden]),select,textarea,button");
    if (focus) setTimeout(() => focus.focus(), 30);
  }
  function closeModal() {
    modalRoot.classList.remove("open");
    modalRoot.setAttribute("aria-hidden", "true");
    modalRoot.innerHTML = "";
    document.body.style.overflow = "";
  }
  function showFormError(name, message) {
    const el = modalRoot.querySelector(`[data-error="${name}"]`);
    if (el) { el.textContent = message; el.classList.add("show"); }
    else toast(message, "warn");
  }
  function toast(message, type) {
    const el = document.createElement("div");
    el.className = "toast" + (type === "error" ? " toast-error" : type === "warn" ? " toast-warn" : "");
    el.innerHTML = `${icon(type === "error" ? "alert" : type === "warn" ? "clock" : "check")}<span>${esc(message)}</span>`;
    toastRoot.appendChild(el);
    setTimeout(() => el.remove(), 3800);
  }

  /* ---------------- Events ---------------- */
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.getAttribute("data-action");
    const id = target.getAttribute("data-id");
    if (action === "login") {
      const loginId = target.getAttribute("data-user");
      const u = state.usuarios.find(x => x.id === loginId);
      if (!u) return;
      session = { userId: u.id };
      saveSession();
      location.hash = "#/painel";
      render();
      toast(`Bem-vindo(a), ${u.nome.split(" ")[0]}.`, "success");
    } else if (action === "logout") {
      session = null;
      saveSession();
      location.hash = "#/login";
      render();
    } else if (action === "tab") {
      const page = target.getAttribute("data-page");
      ui.tab[page] = target.getAttribute("data-tab");
      if (page === "financeiro") ui.finFilter = "TODAS";
      render();
    } else if (action === "fin-filter") {
      ui.finFilter = target.getAttribute("data-filter");
      render();
    } else if (action === "start-attempt") {
      openAttempt(id);
    } else if (action === "view-attempt") {
      openAttemptResult(id);
    } else if (action === "view-assessment") {
      openAssessmentStats(id);
    } else if (action === "publish-assessment") {
      const av = state.avaliacoes.find(a => a.id === id);
      if (!av) return;
      if (!av.questoes.length) { toast("Inclua pelo menos uma questão antes de publicar.", "warn"); return; }
      av.status = "PUBLICADA";
      saveState();
      toast("Avaliação publicada.", "success");
      render();
    } else if (action === "close-assessment") {
      const av = state.avaliacoes.find(a => a.id === id);
      if (!av) return;
      av.status = "ENCERRADA";
      saveState();
      toast("Avaliação encerrada.", "success");
      render();
    } else if (action === "pay-mensalidade") {
      openPayment(id);
    } else if (action === "select-session") {
      ui.sessionId = id;
      render();
    } else if (action === "toggle-session") {
      const s = state.sessoes.find(x => x.id === id);
      if (!s) return;
      s.status = s.status === "ABERTA" ? "ENCERRADA" : "ABERTA";
      saveState();
      toast(s.status === "ABERTA" ? "Sessão reaberta." : "Sessão encerrada.", "success");
      render();
    } else if (action === "request-change") {
      openRequestChange();
    } else if (action === "approve-request") {
      approveRequest(id);
    } else if (action === "reject-request") {
      openRejectRequest(id);
    } else if (action === "clear-library-search") {
      ui.libQuery = "";
      ui.libArea = "TODOS";
      render();
    } else if (action === "book-detail") {
      openBookDetail(id);
    } else if (action === "toggle-module") {
      toggleModule(target.getAttribute("data-group"), target.getAttribute("data-module"));
    } else if (action === "reset-demo") {
      resetDemo();
    } else if (action === "confirm-reset") {
      state = clone(window.EDU);
      saveState();
      closeModal();
      toast("Dados da demonstração restaurados.", "success");
      render();
    } else if (action === "close-modal") {
      closeModal();
    }
  });

  document.addEventListener("change", (event) => {
    const el = event.target.closest("[data-change]");
    if (!el) return;
    if (el.getAttribute("data-change") === "agenda-turma") {
      ui.agendaTurma = el.value;
      render();
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    const type = form.getAttribute("data-form");
    if (!type) return;
    event.preventDefault();
    if (type === "global-search") {
      ui.libQuery = form.q.value.trim();
      ui.libArea = "TODOS";
      ui.libTab = "livros";
      if (!canAccess("biblioteca")) { toast("O módulo Biblioteca não está habilitado para o seu grupo.", "warn"); return; }
      location.hash = "#/biblioteca";
      render();
    } else if (type === "attempt") {
      submitAttempt(form);
    } else if (type === "payment") {
      submitPayment(form);
    } else if (type === "attendance") {
      submitAttendance(form);
    } else if (type === "request") {
      submitRequest(form);
    } else if (type === "reject") {
      submitReject(form);
    } else if (type === "library-search") {
      submitLibrarySearch(form);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modalRoot.classList.contains("open")) closeModal();
  });

  window.addEventListener("hashchange", render);

  if (session && !user()) { session = null; saveSession(); }
  if (!user() && (!location.hash || location.hash === "#/")) location.hash = "#/login";
  render();
})();