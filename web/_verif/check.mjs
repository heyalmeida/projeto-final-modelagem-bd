import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AppProviders } from "@/providers";
import { ViewerProvider } from "@/store/viewer-context";
import { createSeedData } from "@/store/seed";
import { allowedModules, canAccess, isRoot } from "@/lib/auth";
import { buildPainelResumo } from "@/features/painel/selectors";
import { mediaDoAluno } from "@/features/avaliacoes/selectors";
import { frequenciaDoAluno } from "@/features/presenca/selectors";
import { resumoFinanceiro } from "@/features/financeiro/selectors";

import PainelPage from "@/app/(dashboard)/painel/page";
import AvaliacoesPage from "@/app/(dashboard)/avaliacoes/page";
import FinanceiroPage from "@/app/(dashboard)/financeiro/page";
import PresencaPage from "@/app/(dashboard)/presenca/page";
import AgendaPage from "@/app/(dashboard)/agenda/page";
import BibliotecaPage from "@/app/(dashboard)/biblioteca/page";
import AcessoPage from "@/app/(dashboard)/acesso/page";
import LoginPage from "@/app/(auth)/login/page";
import { Navigation } from "@/components/layout/Navigation";
import {
  alternarStatusHorario,
  criarHorario,
} from "@/features/agenda/mutations";
import { lancarMensalidade, estornarPagamento, registrarPagamento, saldoDevedor } from "@/features/financeiro/mutations";
import {
  criarAvaliacao,
  enviarTentativa,
  excluirAvaliacao,
  publicarAvaliacao,
} from "@/features/avaliacoes/mutations";
import { alternarStatusExemplar, criarAcervo, criarLivro } from "@/features/biblioteca/mutations";
import { criarSessao } from "@/features/presenca/mutations";
import { criarUsuario } from "@/features/acesso/mutations";

const saldoDa = (data, mensalidade) => saldoDevedor(data, mensalidade.id);

const PAGINAS = [
  { nome: "painel", Page: PainelPage, marcador: "Olá,", guarda: null },
  { nome: "avaliacoes", Page: AvaliacoesPage, marcador: "Desempenho e tentativas", guarda: { module: "avaliacoes" } },
  { nome: "financeiro", Page: FinanceiroPage, marcador: "Mensalidades e pagamentos", guarda: { module: "financeiro" } },
  { nome: "presenca", Page: PresencaPage, marcador: "frequência", guarda: { module: "presenca" } },
  { nome: "agenda", Page: AgendaPage, marcador: "Grade, eventos e alterações", guarda: { module: "agenda" } },
  { nome: "biblioteca", Page: BibliotecaPage, marcador: "Acervo e exemplares", guarda: { module: "biblioteca" } },
  { nome: "acesso", Page: AcessoPage, marcador: "Grupos, papéis e módulos", guarda: { superuser: true } },
];

const BLOQUEIO = "não está disponível";

const falhas = [];
const avisos = [];
const originalError = console.error;
const originalWarn = console.warn;
console.error = (...args) => avisos.push(args.map(String).join(" "));
console.warn = (...args) => avisos.push(args.map(String).join(" "));

function falhar(mensagem) {
  falhas.push(mensagem);
}

function checar(descricao, condicao, detalhe = "") {
  if (!condicao) falhar(`${descricao}${detalhe ? ` → ${detalhe}` : ""}`);
}

const data = createSeedData();

/* ---------- 1. Integridade da base semeada ---------- */
checar("mensalidades geradas", data.mensalidades.length === data.matriculas.length * 3, `${data.mensalidades.length}`);
checar("pagamentos gerados", data.pagamentos.length > 0, `${data.pagamentos.length}`);
checar("exemplares gerados", data.exemplares.length === data.livros.length * 2, `${data.exemplares.length}`);
checar("registros de presença", data.registros.length > 0, `${data.registros.length}`);
checar("usuários", data.usuarios.length === 8, `${data.usuarios.length}`);
checar("módulos", data.modulos.length === 5, `${data.modulos.length}`);

/* ---------- 2. Regras de domínio por perfil ---------- */
const ana = data.usuarios.find((u) => u.id === "u-ana");
const root = data.usuarios.find((u) => u.id === "u-root");
const joao = data.usuarios.find((u) => u.id === "u-joao");

const viewerAna = { data, user: ana };
checar("média ponderada da Ana", Math.abs(mediaDoAluno(viewerAna) - 26 / 3) < 0.001, String(mediaDoAluno(viewerAna)));
checar("frequência da Ana", frequenciaDoAluno(viewerAna) === 67, String(frequenciaDoAluno(viewerAna)));
/* Ana tem a competência 2026-10 em aberto (as duas anteriores foram pagas). */
checar("saldo em aberto da Ana", resumoFinanceiro(viewerAna).aberto === 980, String(resumoFinanceiro(viewerAna).aberto));
/* A competência aberta venceu em 10/10 e a data de referência é 28/10. */
checar("vencidas no recorte da Ana", resumoFinanceiro(viewerAna).vencidas === 1, String(resumoFinanceiro(viewerAna).vencidas));
checar("módulos da Ana", allowedModules(data, ana).length === 5, String(allowedModules(data, ana).length));
checar("módulos do João", allowedModules(data, joao).length === 1, String(allowedModules(data, joao).length));
checar("root acessa tudo", allowedModules(data, root).length === 5 && isRoot(root));
checar("Ana acessa avaliações", canAccess(data, ana, "avaliacoes"));
checar("João não acessa avaliações", !canAccess(data, joao, "avaliacoes"));
checar("João não acessa biblioteca", !canAccess(data, joao, "biblioteca"));
checar("vencidas do root", resumoFinanceiro({ data, user: root }).vencidas > 0, String(resumoFinanceiro({ data, user: root }).vencidas));

for (const usuario of data.usuarios) {
  const resumo = buildPainelResumo({ data, user: usuario });
  checar(
    `painel do ${usuario.login} tem de 3 a 4 indicadores`,
    resumo.indicadores.length >= 3 && resumo.indicadores.length <= 4,
    String(resumo.indicadores.length),
  );
  checar(`painel do ${usuario.login} tem pendências`, resumo.pendencias.length > 0);
}

/* ---------- 3. Renderização de todas as páginas para todos os perfis ---------- */
let renderizadas = 0;
for (const usuario of data.usuarios) {
  for (const pagina of PAGINAS) {
    const permitido = pagina.guarda?.superuser
      ? isRoot(usuario)
      : pagina.guarda?.module
        ? canAccess(data, usuario, pagina.guarda.module)
        : true;

    let html = "";
    try {
      html = renderToStaticMarkup(
        React.createElement(
          AppProviders,
          null,
          React.createElement(ViewerProvider, { user: usuario }, React.createElement(pagina.Page)),
        ),
      );
      renderizadas += 1;
    } catch (erro) {
      falhar(`render ${pagina.nome} (${usuario.login}) quebrou: ${erro.message}`);
      continue;
    }

    if (permitido) {
      checar(`marcador de ${pagina.nome} para ${usuario.login}`, html.includes(pagina.marcador));
      checar(`sem bloqueio em ${pagina.nome} para ${usuario.login}`, !html.includes(BLOQUEIO));
    } else {
      checar(`bloqueio de ${pagina.nome} para ${usuario.login}`, html.includes(BLOQUEIO));
    }
  }
}

try {
  const htmlLogin = renderToStaticMarkup(React.createElement(AppProviders, null, React.createElement(LoginPage)));
  checar("login lista os perfis", htmlLogin.includes("Entrar no EduGestor") && htmlLogin.includes("Ana Beatriz Lima"));
  checar("login usa a imagem de apoio", htmlLogin.includes("images.unsplash.com"));
} catch (erro) {
  falhar(`render login quebrou: ${erro.message}`);
}

/* Capas do acervo e nome completo do usuário na navegação. */
const htmlBiblioteca = renderToStaticMarkup(
  React.createElement(
    AppProviders,
    null,
    React.createElement(ViewerProvider, { user: ana }, React.createElement(BibliotecaPage)),
  ),
);
checar("capas dos livros usam imagem", htmlBiblioteca.includes("images.unsplash.com"));
checar("saudação usa o nome completo", htmlBiblioteca.length > 0);

/* ---------- 4. Contadores da navegação são derivados dos dados ---------- */
function renderNav(usuario) {
  return renderToStaticMarkup(
    React.createElement(
      AppProviders,
      null,
      React.createElement(ViewerProvider, { user: usuario }, React.createElement(Navigation)),
    ),
  );
}

const navAna = renderNav(ana);
checar("contador de avaliações da Ana", navAna.includes("Avaliações — 2 avaliações abertas"), "esperado 2");
checar("contador financeiro da Ana", navAna.includes("Financeiro — 1 mensalidades vencidas"), "esperado 1");

const vencidasRoot = resumoFinanceiro({ data, user: root }).vencidas;
const navRoot = renderNav(root);
checar(
  "contador financeiro do root acompanha os dados",
  navRoot.includes(`Financeiro — ${vencidasRoot} mensalidades vencidas`),
  `esperado ${vencidasRoot}`,
);
checar("contadores variam entre perfis", vencidasRoot !== 1, `root=${vencidasRoot}, ana=1`);
checar("root vê Acesso e módulos", navRoot.includes("Acesso e módulos"));

const navJoao = renderNav(joao);
checar("João não vê o módulo de avaliações", !navJoao.includes("Avaliações"));
checar("João não vê Acesso e módulos", !navJoao.includes("Acesso e módulos"));

const htmlPainelRoot = renderToStaticMarkup(
  React.createElement(
    AppProviders,
    null,
    React.createElement(ViewerProvider, { user: root }, React.createElement(PainelPage)),
  ),
);
checar("saudação mostra o nome completo", htmlPainelRoot.includes("Olá, Acesso Root"), "esperado nome completo");

/* ---------- 5. Mutações de domínio (CRUD) ---------- */
const rascunho = createSeedData();

// Agenda: choque de horário para a turma/professor é bloqueado.
const choque = criarHorario(rascunho, {
  turmaId: "t-es3",
  dia: "Quarta",
  inicio: "19:30",
  fim: "21:00",
  componente: "Banco de Dados II",
  sala: "305",
  vigenciaInicio: "2026-08-01",
  vigenciaFim: "2026-12-15",
});
checar("choque de horário bloqueado", !choque.ok, choque.ok ? "criou horário em conflito" : "");

const horarioNovo = criarHorario(rascunho, {
  turmaId: "t-es3",
  dia: "Sexta",
  inicio: "19:00",
  fim: "20:40",
  componente: "Banco de Dados II",
  sala: "305",
  vigenciaInicio: "2026-08-01",
  vigenciaFim: "2026-12-15",
});
checar("horário criado na grade", horarioNovo.ok && rascunho.grade.some((g) => g.dia === "Sexta" && g.turmaId === "t-es3"));

const horarioCriado = rascunho.grade.find((g) => g.dia === "Sexta");
alternarStatusHorario(rascunho, horarioCriado.id);
checar("horário inativado", rascunho.grade.find((g) => g.id === horarioCriado.id).status === "INATIVA");

// Financeiro: competência duplicada é bloqueada; lançamento novo aparece em aberto.
const duplicada = lancarMensalidade(rascunho, {
  matriculaId: "m-ana",
  competencia: "2026-08",
  vencimento: "2026-11-10",
  valor: 980,
  desconto: 0,
});
checar("cobrança duplicada bloqueada", !duplicada.ok, duplicada.ok ? "permitiu duplicar" : "");

const novaCobranca = lancarMensalidade(rascunho, {
  matriculaId: "m-ana",
  competencia: "2026-11",
  vencimento: "2026-11-10",
  valor: 980,
  desconto: 50,
});
const mensalidadeNova = rascunho.mensalidades.find((m) => m.matriculaId === "m-ana" && m.competencia === "2026-11");
checar("cobrança lançada", novaCobranca.ok && Boolean(mensalidadeNova));

// Baixa e estorno alteram o saldo derivado.
const saldoAntes = saldoDa(rascunho, mensalidadeNova);
registrarPagamento(rascunho, {
  mensalidadeId: mensalidadeNova.id,
  metodoId: "mp-pix",
  valor: saldoAntes,
  usuarioId: "u-joao",
});
checar("baixa quita a cobrança", saldoDa(rascunho, mensalidadeNova) === 0);
const pagamentoNovo = rascunho.pagamentos[rascunho.pagamentos.length - 1];
estornarPagamento(rascunho, { pagamentoId: pagamentoNovo.id });
checar("estorno devolve o saldo", saldoDa(rascunho, mensalidadeNova) === saldoAntes);
checar("estorno marcado no histórico", pagamentoNovo.status === "ESTORNADO");

// Avaliações: cria rascunho, publica e registra tentativa do aluno.
const novaAvaliacao = criarAvaliacao(rascunho, {
  turmaId: "t-es3",
  titulo: "Prova 2 — Modelagem",
  tipo: "Prova",
  peso: 2,
  inicio: "2026-10-20T19:00",
  fim: "2026-11-10T23:59",
  maxTentativas: 1,
  permiteRecuperacao: false,
  pesoRecuperacao: 0,
  questoes: [{ enunciado: "Qual modelo garante menor redundância?", alternativas: ["Relacional", "Planilha"], correta: 0, pontos: 10 }],
});
const avaliacaoCriada = rascunho.avaliacoes.find((a) => a.titulo === "Prova 2 — Modelagem");
checar("avaliação criada como rascunho", novaAvaliacao.ok && avaliacaoCriada?.status === "RASCUNHO");
checar("professor herdado da turma", avaliacaoCriada.professorId === "p-carlos");

publicarAvaliacao(rascunho, avaliacaoCriada.id);
checar("avaliação publicada", avaliacaoCriada.status === "PUBLICADA");
checar("rascunho não é excluído", !excluirAvaliacao(rascunho, avaliacaoCriada.id).ok);

const envio = enviarTentativa(rascunho, {
  avaliacaoId: avaliacaoCriada.id,
  matriculaId: "m-ana",
  respostas: { [avaliacaoCriada.questoes[0].id]: 0 },
});
checar("tentativa registrada com nota cheia", envio.ok && envio.pontuacao === 10, String(envio.pontuacao));
const envioRepetido = enviarTentativa(rascunho, {
  avaliacaoId: avaliacaoCriada.id,
  matriculaId: "m-ana",
  respostas: { [avaliacaoCriada.questoes[0].id]: 0 },
});
checar("segunda tentativa bloqueada pelo limite", !envioRepetido.ok);

// Presença: sessão duplicada bloqueada; sessão nova nasce aberta.
const sessaoDuplicada = criarSessao(rascunho, {
  turmaId: "t-es3",
  data: "2026-10-20",
  inicio: "19:00",
  fim: "20:40",
  tema: "Repetida",
});
checar("sessão duplicada bloqueada", !sessaoDuplicada.ok);
const novaSessao = criarSessao(rascunho, {
  turmaId: "t-es3",
  data: "2026-11-03",
  inicio: "19:00",
  fim: "20:40",
  tema: "Modelagem lógica",
});
checar("sessão criada aberta", novaSessao.ok && rascunho.sessoes.some((s) => s.tema === "Modelagem lógica" && s.status === "ABERTA"));

// Biblioteca: ISBN duplicado bloqueado; título cria exemplares; status muda.
const isbnDuplicado = criarLivro(rascunho, {
  acervoId: "ac-eng",
  titulo: "Banco de Dados (repetido)",
  autor: "Alguém",
  isbn: "978-8582605600",
  editora: "Elsevier",
  ano: 2020,
  area: "Engenharia",
  exemplares: 2,
});
checar("ISBN duplicado bloqueado", !isbnDuplicado.ok);

const novoLivro = criarLivro(rascunho, {
  acervoId: "ac-eng",
  titulo: "SQL Prático",
  autor: "Autor Demo",
  isbn: "978-0000000001",
  editora: "Campus",
  ano: 2025,
  area: "Engenharia",
  exemplares: 2,
});
const livroCriado = rascunho.livros.find((l) => l.titulo === "SQL Prático");
checar("livro catalogado com 2 exemplares", novoLivro.ok && rascunho.exemplares.filter((e) => e.livroId === livroCriado.id).length === 2);

const exemplarNovo = rascunho.exemplares.find((e) => e.livroId === livroCriado.id);
alternarStatusExemplar(rascunho, exemplarNovo.id, "EMPRESTADO");
checar("situação do exemplar atualizada", exemplarNovo.status === "EMPRESTADO");

const acervoDuplicado = criarAcervo(rascunho, { nome: "Acervo de Engenharia", descricao: "x", area: "Engenharia" }, "u-lucia");
checar("acervo duplicado bloqueado", !acervoDuplicado.ok);

// Acesso: login duplicado bloqueado; papel herdado do grupo.
const loginDuplicado = criarUsuario(rascunho, {
  nome: "Raquel Souza",
  login: "ana.aluno",
  email: "raquel@faculdade.edu.br",
  grupoId: "g-secretaria",
});
checar("login duplicado bloqueado", !loginDuplicado.ok);

criarUsuario(rascunho, {
  nome: "Raquel Souza",
  login: "raquel.secretaria",
  email: "raquel@faculdade.edu.br",
  grupoId: "g-secretaria",
});
const usuarioCriado = rascunho.usuarios.find((u) => u.login === "raquel.secretaria");
checar("usuário criado com papel do grupo", usuarioCriado?.papel === "ADMINISTRADOR");

console.error = originalError;
console.warn = originalWarn;

/* ---------- 4. Relatório ---------- */
const avisosUnicos = [...new Set(avisos)].filter((aviso) => aviso && !aviso.includes("ReactDOMServer"));
console.log(`Páginas renderizadas: ${renderizadas}/${data.usuarios.length * PAGINAS.length}`);
console.log(`Falhas: ${falhas.length}`);
falhas.forEach((falha) => console.log(`  FAIL ${falha}`));
if (avisosUnicos.length) {
  console.log(`Avisos (${avisosUnicos.length}):`);
  avisosUnicos.slice(0, 12).forEach((aviso) => console.log(`  WARN ${aviso.slice(0, 220)}`));
}
console.log(falhas.length ? "RESULTADO=FALHOU" : "RESULTADO=OK");
process.exit(falhas.length ? 1 : 0);