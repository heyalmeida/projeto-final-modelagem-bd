import { siteConfig } from "@/config/site";
import {
  avaliacoesAbertas,
  avaliacoesVisiveis,
  matriculaDaAvaliacao,
  mediaDoAluno,
  mediaGeral,
  ultimaTentativa,
} from "@/features/avaliacoes/selectors";
import { solicitacoesPendentes } from "@/features/agenda/selectors";
import { resumoAcervo } from "@/features/biblioteca/selectors";
import {
  alunoDaMatricula,
  minhasMatriculas,
  studentOf,
  turmaById,
  turmasVisiveis,
} from "@/features/core/selectors";
import {
  mensalidadesVisiveis,
  saldoDa,
  statusMensalidade,
} from "@/features/financeiro/selectors";
import type { Compromisso, Indicador, PainelResumo, Pendencia, DestaqueTipo } from "@/features/painel/types";
import { frequenciaDoAluno, frequenciaGeral, sessoesVisiveis } from "@/features/presenca/selectors";
import { allowedModules, canAccess, canApproveSchedule, currentGroup, isStudent, isTeacher } from "@/lib/auth";
import { formatCompetencia, formatDate, formatShortDate, formatTime, money } from "@/lib/utils";
import type { Viewer } from "@/types/domain";

/**
 * Monta o resumo do painel: indicadores, pendências, compromissos e o painel de
 * destaque — sempre respeitando os módulos liberados para o grupo.
 */
export function buildPainelResumo(viewer: Viewer): PainelResumo {
  const { data, user } = viewer;
  const aluno = studentOf(viewer);
  const nome = aluno?.nome ?? user.nome;
  const grupo = currentGroup(data, user);

  const acesso = {
    avaliacoes: canAccess(data, user, "avaliacoes"),
    financeiro: canAccess(data, user, "financeiro"),
    presenca: canAccess(data, user, "presenca"),
    agenda: canAccess(data, user, "agenda"),
    biblioteca: canAccess(data, user, "biblioteca"),
  };

  const mensalidades = acesso.financeiro ? mensalidadesVisiveis(viewer) : [];
  const aberto = mensalidades.reduce((soma, mensalidade) => soma + saldoDa(data, mensalidade), 0);
  const vencidas = mensalidades.filter((mensalidade) => statusMensalidade(data, mensalidade) === "VENCIDA");

  const avaliacoesDoRecorte = acesso.avaliacoes ? avaliacoesVisiveis(viewer) : [];
  const abertas = acesso.avaliacoes ? avaliacoesAbertas(viewer) : [];

  const frequencia = acesso.presenca
    ? isStudent(user)
      ? frequenciaDoAluno(viewer)
      : frequenciaGeral(data)
    : null;

  const media = acesso.avaliacoes ? (isStudent(user) ? mediaDoAluno(viewer) : mediaGeral(viewer)) : null;

  const exemplares = acesso.biblioteca ? data.exemplares : [];
  const disponiveis = exemplares.filter((exemplar) => exemplar.status === "DISPONIVEL").length;

  const proximosEventos = data.eventos
    .filter((evento) => evento.inicio.slice(0, 10) >= siteConfig.upcomingFrom)
    .sort((a, b) => String(a.inicio).localeCompare(String(b.inicio)));

  const pendenciasAgenda = acesso.agenda ? solicitacoesPendentes(data) : [];

  /* ---------- indicadores ---------- */
  const indicadores: Indicador[] = [];

  if (acesso.avaliacoes) {
    indicadores.push({
      id: "avaliacoes",
      label: "Avaliações abertas",
      value: String(abertas.length),
      hint: `${avaliacoesDoRecorte.length} no seu recorte`,
      icon: "avaliacoes",
      tone: "violet",
    });
  }

  if (acesso.financeiro) {
    indicadores.push({
      id: "financeiro",
      label: isStudent(user) ? "Em aberto" : "A receber",
      value: money(aberto),
      hint: `${vencidas.length} vencida(s)`,
      icon: "financeiro",
      tone: "amber",
    });
  }

  if (acesso.presenca) {
    indicadores.push({
      id: "presenca",
      label: "Frequência",
      value: frequencia === null ? "—" : `${frequencia}%`,
      hint: isStudent(user) ? "Média das suas matrículas" : "Média das turmas",
      icon: "presenca",
      tone: "brand",
    });
  }

  if (acesso.biblioteca) {
    indicadores.push({
      id: "biblioteca",
      label: "Acervo disponível",
      value: String(disponiveis),
      suffix: `/${exemplares.length}`,
      hint: `${data.livros.length} títulos catalogados`,
      icon: "biblioteca",
      tone: "pink",
    });
  }

  if (acesso.agenda) {
    const proximo = proximosEventos[0];
    indicadores.push({
      id: "agenda",
      label: "Próximo evento",
      value: proximo ? formatShortDate(proximo.inicio) : "—",
      hint: proximo ? proximo.titulo : "sem eventos futuros",
      icon: "agenda",
      tone: "blue",
    });
  }

  const matriculasAtivas = isStudent(user)
    ? minhasMatriculas(viewer).length
    : data.matriculas.filter((matricula) => matricula.status === "ATIVA").length;

  if (indicadores.length < 3) {
    indicadores.push({
      id: "matriculas",
      label: "Matrículas ativas",
      value: String(matriculasAtivas),
      hint: "no semestre",
      icon: "users",
      tone: "brand",
    });
  }

  if (indicadores.length < 4) {
    indicadores.push({
      id: "turmas",
      label: "Turmas",
      value: String(turmasVisiveis(viewer).length),
      hint: "no seu recorte",
      icon: "painel",
      tone: "violet",
    });
  }

  /* ---------- pendências ---------- */
  const pendencias: Pendencia[] = [];

  if (acesso.financeiro && vencidas.length) {
    pendencias.push({
      id: "financeiro-vencidas",
      tone: "danger",
      icon: "financeiro",
      titulo: `${vencidas.length} mensalidade(s) vencida(s)`,
      texto: isStudent(user) ? "Regularize para liberar novas matrículas." : "Há cobranças em atraso no financeiro.",
      href: "/financeiro",
      label: "Abrir financeiro",
    });
  }

  if (acesso.avaliacoes && isStudent(user)) {
    const semTentativa = abertas.filter((avaliacao) => {
      const matricula = matriculaDaAvaliacao(viewer, avaliacao);
      return matricula && !ultimaTentativa(data, avaliacao.id, matricula.id);
    });
    if (semTentativa.length) {
      pendencias.push({
        id: "avaliacoes-sem-tentativa",
        tone: "warn",
        icon: "avaliacoes",
        titulo: `${semTentativa.length} avaliação(ões) sem tentativa`,
        texto: "Algumas avaliações abertas ainda não foram iniciadas.",
        href: "/avaliacoes",
        label: "Ver avaliações",
      });
    }
  }

  if (acesso.agenda && canApproveSchedule(user, grupo) && pendenciasAgenda.length) {
    pendencias.push({
      id: "agenda-pendente",
      tone: "warn",
      icon: "agenda",
      titulo: `${pendenciasAgenda.length} solicitação(ões) de agenda`,
      texto: "Pedidos de alteração aguardam sua análise.",
      href: "/agenda",
      label: "Analisar agenda",
    });
  }

  if (acesso.presenca && isTeacher(user)) {
    const chamadasAbertas = sessoesVisiveis(viewer).filter((sessao) => sessao.status === "ABERTA");
    if (chamadasAbertas.length) {
      pendencias.push({
        id: "presenca-aberta",
        tone: "info",
        icon: "presenca",
        titulo: `${chamadasAbertas.length} chamada(s) em aberto`,
        texto: "Registre a presença das suas turmas.",
        href: "/presenca",
        label: "Fazer chamada",
      });
    }
  }

  if (!pendencias.length) {
    pendencias.push({
      id: "em-dia",
      tone: "ok",
      icon: "check",
      titulo: "Tudo em dia",
      texto: "Não há pendências para o seu perfil agora.",
      href: "/painel",
      label: "Atualizar",
    });
  }

  /* ---------- compromissos ---------- */
  const compromissos: Compromisso[] = [];

  if (acesso.presenca) {
    sessoesVisiveis(viewer)
      .filter((sessao) => sessao.data >= siteConfig.upcomingFrom)
      .forEach((sessao) => {
        const turma = turmaById(data, sessao.turmaId);
        compromissos.push({
          id: sessao.id,
          tipo: "sessao",
          data: sessao.data,
          titulo: sessao.tema,
          descricao: `${turma.codigo} · ${turma.componente}`,
          horario: `${formatDate(sessao.data)} · ${sessao.inicio}`,
          status: sessao.status,
        });
      });
  }

  if (acesso.agenda) {
    proximosEventos.forEach((evento) => {
      compromissos.push({
        id: evento.id,
        tipo: "evento",
        data: evento.inicio.slice(0, 10),
        titulo: evento.titulo,
        descricao: `${evento.tipo} · ${evento.local}`,
        horario: `${formatDate(evento.inicio)} · ${formatTime(evento.inicio)}`,
        status: evento.status,
      });
    });
  }

  compromissos.sort((a, b) => a.data.localeCompare(b.data));

  /* ---------- painel de destaque ---------- */
  let destaque: DestaqueTipo = null;
  if (acesso.avaliacoes) destaque = "avaliacoes";
  else if (acesso.biblioteca) destaque = "biblioteca";
  else if (acesso.financeiro) destaque = "financeiro";
  else if (acesso.agenda) destaque = "agenda";

  const idsMensalidades = new Set(mensalidades.map((mensalidade) => mensalidade.id));
  const pagamentosRecentes = data.pagamentos
    .filter((pagamento) => idsMensalidades.has(pagamento.mensalidadeId))
    .sort((a, b) => String(b.data).localeCompare(String(a.data)))
    .slice(0, 3)
    .map((pagamento) => {
      const mensalidade = data.mensalidades.find((item) => item.id === pagamento.mensalidadeId);
      const detalhe = mensalidade ? alunoDaMatricula(data, mensalidade.matriculaId) : null;
      return {
        id: pagamento.id,
        aluno: detalhe ? detalhe.aluno.nome : "Pagamento",
        competencia: mensalidade ? formatCompetencia(mensalidade.competencia) : "",
        data: pagamento.data,
        valor: Number(pagamento.valor),
      };
    });

  /* ---------- resumos ---------- */
  const tentativasDoAluno = isStudent(user)
    ? data.tentativas.filter((tentativa) =>
        minhasMatriculas(viewer).some((matricula) => matricula.id === tentativa.matriculaId),
      ).length
    : data.tentativas.length;

  const resumoAcademico =
    acesso.presenca || acesso.avaliacoes
      ? {
          frequencia,
          media,
          matriculasAtivas,
          tentativas: tentativasDoAluno,
        }
      : null;

  const totalMensalidades = mensalidades.reduce(
    (soma, mensalidade) => soma + Number(mensalidade.valor) - Number(mensalidade.desconto),
    0,
  );

  const resumoFinanceiro =
    !resumoAcademico && acesso.financeiro
      ? {
          aberto,
          recebido: totalMensalidades - aberto,
          vencidas: vencidas.length,
          percentual: mensalidades.length
            ? Math.round(((mensalidades.length - vencidas.length) / mensalidades.length) * 100)
            : 100,
        }
      : null;

  const acervo = resumoAcervo(data);
  const resumoAcervoPainel =
    !resumoAcademico && !resumoFinanceiro
      ? {
          titulos: acervo.titulos,
          exemplares: acervo.exemplares,
          disponiveis: acervo.disponiveis,
          percentual: acervo.percentualDisponivel,
        }
      : null;

  return {
    nome,
    modulos: allowedModules(data, user),
    acesso,
    indicadores: indicadores.slice(0, 4),
    pendencias,
    compromissos,
    destaque,
    avaliacoesDestaque: abertas.slice(0, 3),
    livrosDestaque: acesso.biblioteca ? data.livros.slice(0, 3) : [],
    proximosEventos: proximosEventos.slice(0, 3),
    pagamentosRecentes,
    resumoAcademico,
    resumoFinanceiro,
    resumoAcervo: resumoAcervoPainel,
  };
}