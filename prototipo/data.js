(function () {
  "use strict";

  const modules = [
    {
      id: "avaliacoes",
      nome: "AvaliaÃ§Ãµes",
      descricao: "Provas, tentativas, respostas e desempenho.",
      icone: "clipboard",
      rota: "#/avaliacoes",
      cor: "#7c3aed",
      corSuave: "#f1eafe"
    },
    {
      id: "financeiro",
      nome: "Financeiro",
      descricao: "Mensalidades, pagamentos e métodos.",
      icone: "wallet",
      rota: "#/financeiro",
      cor: "#b45309",
      corSuave: "#fdf0dd"
    },
    {
      id: "presenca",
      nome: "Presença",
      descricao: "Sessões, chamada e frequência.",
      icone: "calendar-check",
      rota: "#/presenca",
      cor: "#0f766e",
      corSuave: "#dff5f1"
    },
    {
      id: "agenda",
      nome: "Agenda",
      descricao: "Grade horária, eventos e alterações.",
      icone: "calendar",
      rota: "#/agenda",
      cor: "#1d4ed8",
      corSuave: "#e5edff"
    },
    {
      id: "biblioteca",
      nome: "Biblioteca",
      descricao: "Acervo, exemplares e histórico de busca.",
      icone: "book",
      rota: "#/biblioteca",
      cor: "#9d174d",
      corSuave: "#fbe7ef"
    }
  ];

  const grupos = [
    { id: "g-ti", nome: "Tecnologia da Informação", papel: "ROOT", modulos: modules.map(m => m.id) },
    { id: "g-direcao", nome: "Direção", papel: "ADMINISTRADOR", modulos: modules.map(m => m.id) },
    { id: "g-secretaria", nome: "Secretaria Acadêmica", papel: "ADMINISTRADOR", modulos: ["financeiro", "presenca", "agenda", "biblioteca"] },
    { id: "g-coordenacao", nome: "Coordenação de Curso", papel: "ADMINISTRADOR", modulos: ["avaliacoes", "presenca", "agenda", "biblioteca"] },
    { id: "g-professores", nome: "Professores", papel: "USUARIO", modulos: ["avaliacoes", "presenca", "agenda", "biblioteca"] },
    { id: "g-alunos", nome: "Alunos", papel: "USUARIO", modulos: ["avaliacoes", "financeiro", "presenca", "agenda", "biblioteca"] },
    { id: "g-financeiro", nome: "Financeiro", papel: "USUARIO", modulos: ["financeiro"] },
    { id: "g-biblioteca", nome: "Biblioteca", papel: "USUARIO", modulos: ["agenda", "biblioteca"] }
  ];

  const usuarios = [
    { id: "u-ana", nome: "Ana Beatriz Lima", login: "ana.aluno", grupoId: "g-alunos", papel: "USUARIO", perfil: "aluno", alunoId: "a-ana", email: "ana.lima@faculdade.edu.br" },
    { id: "u-bruno", nome: "Bruno Nogueira", login: "bruno.aluno", grupoId: "g-alunos", papel: "USUARIO", perfil: "aluno", alunoId: "a-bruno", email: "bruno.n@faculdade.edu.br" },
    { id: "u-carlos", nome: "Carlos Mendes", login: "carlos.prof", grupoId: "g-professores", papel: "USUARIO", perfil: "professor", professorId: "p-carlos", email: "carlos.mendes@faculdade.edu.br" },
    { id: "u-maria", nome: "Maria Oliveira", login: "maria.secretaria", grupoId: "g-secretaria", papel: "ADMINISTRADOR", perfil: "servidor", email: "maria.oliveira@faculdade.edu.br" },
    { id: "u-joao", nome: "João Ferreira", login: "joao.financeiro", grupoId: "g-financeiro", papel: "USUARIO", perfil: "servidor", email: "joao.ferreira@faculdade.edu.br" },
    { id: "u-lucia", nome: "Lúcia Ramos", login: "lucia.biblioteca", grupoId: "g-biblioteca", papel: "USUARIO", perfil: "servidor", email: "lucia.ramos@faculdade.edu.br" },
    { id: "u-helena", nome: "Helena Prado", login: "helena.coordenacao", grupoId: "g-coordenacao", papel: "ADMINISTRADOR", perfil: "servidor", email: "helena.prado@faculdade.edu.br" },
    { id: "u-root", nome: "Acesso Root", login: "root", grupoId: "g-ti", papel: "ROOT", perfil: "servidor", email: "root@faculdade.edu.br" }
  ];

  const cursos = [
    { id: "c-es", nome: "Engenharia de Software", codigo: "ES", modalidade: "Presencial", cargaHoraria: 3200 },
    { id: "c-adm", nome: "Administração", codigo: "ADM", modalidade: "Híbrido", cargaHoraria: 3000 },
    { id: "c-dsg", nome: "Design Digital", codigo: "DSG", modalidade: "Presencial", cargaHoraria: 2800 }
  ];

  const professores = [
    { id: "p-carlos", nome: "Carlos Mendes", siape: "SIAPE-2041", titulacao: "Mestre", area: "Engenharia de Software", usuarioId: "u-carlos" },
    { id: "p-renata", nome: "Renata Souza", siape: "SIAPE-3187", titulacao: "Doutora", area: "Gestão de Pessoas", usuarioId: null },
    { id: "p-marcos", nome: "Marcos Vieira", siape: "SIAPE-4420", titulacao: "Mestre", area: "Design e Comunicação", usuarioId: null }
  ];

  const alunos = [
    { id: "a-ana", nome: "Ana Beatriz Lima", ra: "202401001", cursoId: "c-es", usuarioId: "u-ana", situacao: "Ativo" },
    { id: "a-bruno", nome: "Bruno Nogueira", ra: "202401014", cursoId: "c-es", usuarioId: "u-bruno", situacao: "Ativo" },
    { id: "a-carla", nome: "Carla Menezes", ra: "202302007", cursoId: "c-adm", usuarioId: null, situacao: "Ativo" },
    { id: "a-diego", nome: "Diego Alves", ra: "202501033", cursoId: "c-es", usuarioId: null, situacao: "Ativo" },
    { id: "a-elisa", nome: "Elisa Fontes", ra: "202503011", cursoId: "c-dsg", usuarioId: null, situacao: "Ativo" },
    { id: "a-felipe", nome: "Felipe Barros", ra: "202401022", cursoId: "c-es", usuarioId: null, situacao: "Ativo" },
    { id: "a-gabriela", nome: "Gabriela Reis", ra: "202302019", cursoId: "c-adm", usuarioId: null, situacao: "Ativo" },
    { id: "a-henrique", nome: "Henrique Sales", ra: "202503004", cursoId: "c-dsg", usuarioId: null, situacao: "Ativo" }
  ];

  const turmas = [
    { id: "t-es1", codigo: "ES-1A", cursoId: "c-es", professorId: "p-carlos", componente: "Algoritmos e Lógica", periodo: "2026/2", turno: "Noite", vagas: 40, status: "Ativa" },
    { id: "t-es3", codigo: "ES-3A", cursoId: "c-es", professorId: "p-carlos", componente: "Engenharia de Requisitos", periodo: "2026/2", turno: "Noite", vagas: 35, status: "Ativa" },
    { id: "t-adm2", codigo: "ADM-2A", cursoId: "c-adm", professorId: "p-renata", componente: "Gestão de Pessoas", periodo: "2026/2", turno: "Noite", vagas: 45, status: "Ativa" },
    { id: "t-dsg1", codigo: "DSG-1A", cursoId: "c-dsg", professorId: "p-marcos", componente: "Projeto de Identidade Visual", periodo: "2026/2", turno: "Tarde", vagas: 30, status: "Ativa" }
  ];

  const matriculas = [
    { id: "m-ana", alunoId: "a-ana", turmaId: "t-es3", status: "ATIVA", data: "2026-08-04", notaFinal: null, frequencia: 92 },
    { id: "m-bruno", alunoId: "a-bruno", turmaId: "t-es3", status: "ATIVA", data: "2026-08-04", notaFinal: null, frequencia: 84 },
    { id: "m-carla", alunoId: "a-carla", turmaId: "t-adm2", status: "ATIVA", data: "2026-08-05", notaFinal: null, frequencia: 88 },
    { id: "m-diego", alunoId: "a-diego", turmaId: "t-es1", status: "ATIVA", data: "2026-08-05", notaFinal: null, frequencia: 71 },
    { id: "m-elisa", alunoId: "a-elisa", turmaId: "t-dsg1", status: "ATIVA", data: "2026-08-06", notaFinal: null, frequencia: 96 },
    { id: "m-felipe", alunoId: "a-felipe", turmaId: "t-es3", status: "ATIVA", data: "2026-08-06", notaFinal: null, frequencia: 79 },
    { id: "m-gabriela", alunoId: "a-gabriela", turmaId: "t-adm2", status: "ATIVA", data: "2026-08-06", notaFinal: null, frequencia: 90 },
    { id: "m-henrique", alunoId: "a-henrique", turmaId: "t-dsg1", status: "ATIVA", data: "2026-08-07", notaFinal: null, frequencia: 82 }
  ];

  function questao(id, enunciado, alternativas, correta, pontos) {
    return { id, enunciado, alternativas, correta, pontos };
  }

  const avaliacoes = [
    {
      id: "av-1", turmaId: "t-es3", professorId: "p-carlos", titulo: "Prova 1 â€” Engenharia de Requisitos",
      tipo: "Prova", peso: 2, status: "PUBLICADA", inicio: "2026-10-20T19:00", fim: "2026-10-30T23:59",
      gestao: { maxTentativas: 2, permiteRecuperacao: false, pesoRecuperacao: 0, divulgadaEm: null },
      questoes: [
        questao("q-1", "Qual documento descreve o comportamento esperado do sistema?", ["Caso de uso", "Diagrama de classes", "Cronograma", "Orçamento"], 0, 3),
        questao("q-2", "Qual requisito é não funcional?", ["O sistema deve responder em até 2 segundos", "O aluno deve se matricular", "O professor lança notas", "O relatório lista turmas"], 0, 4),
        questao("q-3", "Quem valida os requisitos com a equipe?", ["Cliente e equipe", "Apenas o banco de dados", "Apenas o fornecedor de hardware", "O setor de compras"], 0, 3)
      ]
    },
    {
      id: "av-2", turmaId: "t-es3", professorId: "p-carlos", titulo: "Trabalho de Arquitetura de Software",
      tipo: "Trabalho", peso: 1, status: "PUBLICADA", inicio: "2026-10-10T08:00", fim: "2026-11-03T23:59",
      gestao: { maxTentativas: 1, permiteRecuperacao: false, pesoRecuperacao: 0, divulgadaEm: null },
      questoes: [
        questao("q-4", "Qual padrão separa interface, domínio e persistência?", ["Camadas", "Monólito", "Cliente-servidor", "Planilha"], 0, 5),
        questao("q-5", "Qual é o benefício de uma arquitetura em camadas?", ["Isolamento de responsabilidades", "Maior acoplamento", "Menos testes", "Dependência do banco"], 0, 5)
      ]
    },
    {
      id: "av-3", turmaId: "t-es1", professorId: "p-carlos", titulo: "Avaliação â€” Algoritmos",
      tipo: "Prova", peso: 2, status: "ENCERRADA", inicio: "2026-10-05T19:00", fim: "2026-10-12T23:59",
      gestao: { maxTentativas: 1, permiteRecuperacao: true, pesoRecuperacao: 2, divulgadaEm: "2026-10-14T10:00" },
      questoes: [
        questao("q-6", "Qual estrutura segue o princípio LIFO?", ["Pilha", "Fila", "Lista circular", "Árvore B"], 0, 5),
        questao("q-7", "Qual busca exige dados ordenados?", ["Binária", "Linear", "Profundidade", "Largura"], 0, 5)
      ]
    },
    {
      id: "av-4", turmaId: "t-adm2", professorId: "p-renata", titulo: "Prova â€” Gestão de Pessoas",
      tipo: "Prova", peso: 2, status: "PUBLICADA", inicio: "2026-10-22T19:00", fim: "2026-10-29T23:59",
      gestao: { maxTentativas: 2, permiteRecuperacao: false, pesoRecuperacao: 0, divulgadaEm: null },
      questoes: [
        questao("q-8", "Qual etapa vem depois do recrutamento?", ["Seleção", "Demissão", "Folha de pagamento", "Treinamento"], 0, 5),
        questao("q-9", "O que é feedback construtivo?", ["Orientação com fatos e próximos passos", "Elogio genérico", "Avaliação sem critério", "Mudança de cargo"], 0, 5)
      ]
    },
    {
      id: "av-5", turmaId: "t-adm2", professorId: "p-renata", titulo: "Seminário â€” Marketing",
      tipo: "Seminário", peso: 1, status: "RASCUNHO", inicio: "2026-11-10T19:00", fim: "2026-11-17T23:59",
      gestao: { maxTentativas: 1, permiteRecuperacao: false, pesoRecuperacao: 0, divulgadaEm: null },
      questoes: []
    },
    {
      id: "av-6", turmaId: "t-dsg1", professorId: "p-marcos", titulo: "Projeto â€” Identidade Visual",
      tipo: "Projeto", peso: 2, status: "PUBLICADA", inicio: "2026-10-15T08:00", fim: "2026-11-07T23:59",
      gestao: { maxTentativas: 1, permiteRecuperacao: false, pesoRecuperacao: 0, divulgadaEm: null },
      questoes: [
        questao("q-10", "Qual elemento sintetiza a marca?", ["Logotipo", "Cronograma", "Orçamento", "Manual de compras"], 0, 4),
        questao("q-11", "Qual princípio orienta contraste e hierarquia?", ["Legibilidade", "Repetição sem critério", "Excesso de cores", "Texto centralizado"], 0, 3),
        questao("q-12", "O que um manual de marca documenta?", ["Uso correto da identidade", "A folha de pagamento", "O estoque", "As matrÃ­culas"], 0, 3)
      ]
    }
  ];

  const tentativas = [
    { id: "tt-1", avaliacaoId: "av-1", matriculaId: "m-ana", numero: 1, inicio: "2026-10-22T20:10", fim: "2026-10-22T20:42", status: "FINALIZADA", pontuacao: 8.5, respostas: { "q-1": 0, "q-2": 0, "q-3": 0 } },
    { id: "tt-2", avaliacaoId: "av-2", matriculaId: "m-ana", numero: 1, inicio: "2026-10-25T18:00", fim: "2026-10-25T19:10", status: "FINALIZADA", pontuacao: 9.0, respostas: { "q-4": 0, "q-5": 0 } },
    { id: "tt-3", avaliacaoId: "av-1", matriculaId: "m-bruno", numero: 1, inicio: "2026-10-23T19:20", fim: "2026-10-23T20:05", status: "FINALIZADA", pontuacao: 6.0, respostas: { "q-1": 0, "q-2": 2, "q-3": 1 } },
    { id: "tt-4", avaliacaoId: "av-1", matriculaId: "m-felipe", numero: 1, inicio: "2026-10-24T21:00", fim: "2026-10-24T21:30", status: "FINALIZADA", pontuacao: 7.5, respostas: { "q-1": 0, "q-2": 0, "q-3": 2 } },
    { id: "tt-5", avaliacaoId: "av-3", matriculaId: "m-diego", numero: 1, inicio: "2026-10-08T19:10", fim: "2026-10-08T19:55", status: "FINALIZADA", pontuacao: 5.5, respostas: { "q-6": 0, "q-7": 2 } },
    { id: "tt-6", avaliacaoId: "av-4", matriculaId: "m-carla", numero: 1, inicio: "2026-10-25T19:30", fim: "2026-10-25T20:20", status: "FINALIZADA", pontuacao: 9.0, respostas: { "q-8": 0, "q-9": 0 } },
    { id: "tt-7", avaliacaoId: "av-6", matriculaId: "m-elisa", numero: 1, inicio: "2026-10-26T14:00", fim: "2026-10-26T15:20", status: "FINALIZADA", pontuacao: 8.0, respostas: { "q-10": 0, "q-11": 0, "q-12": 2 } }
  ];

  const metodos = [
    { id: "mp-pix", nome: "PIX", tipo: "Instantâneo", taxa: 0, ativo: true },
    { id: "mp-boleto", nome: "Boleto", tipo: "Bancário", taxa: 2.5, ativo: true },
    { id: "mp-cartao", nome: "Cartão de crédito", tipo: "Cartão", taxa: 3.9, ativo: true },
    { id: "mp-transf", nome: "Transferência", tipo: "Bancário", taxa: 0, ativo: true }
  ];

  const competencias = [
    { id: "2026-08", vencimento: "2026-08-10" },
    { id: "2026-09", vencimento: "2026-09-10" },
    { id: "2026-10", vencimento: "2026-10-10" }
  ];
  const valoresPorCurso = { "c-es": 980, "c-adm": 890, "c-dsg": 940 };
  const mensalidades = [];
  matriculas.forEach((m, mi) => {
    const aluno = alunos.find(a => a.id === m.alunoId);
    competencias.forEach((c, ci) => {
      const valor = valoresPorCurso[aluno.cursoId];
      const desconto = mi === 4 ? 98 : 0;
      const pago = (mi + ci) % 5 === 0 || (mi === 0 && ci < 2) || (mi === 2 && ci === 0);
      const vencida = !pago && ci < 2;
      mensalidades.push({
        id: `mens-${mi + 1}-${ci + 1}`,
        matriculaId: m.id,
        competencia: c.id,
        vencimento: c.vencimento,
        valor,
        desconto,
        status: pago ? "PAGA" : vencida ? "VENCIDA" : "ABERTA"
      });
    });
  });

  const pagamentos = [];
  let pagSeq = 1;
  mensalidades.filter(m => m.status === "PAGA").forEach((m, i) => {
    const metodo = metodos[i % 2 === 0 ? 0 : 1];
    pagamentos.push({
      id: `pag-${pagSeq++}`,
      mensalidadeId: m.id,
      metodoId: metodo.id,
      usuarioId: "u-joao",
      valor: m.valor - m.desconto,
      data: `${m.competencia}-08T10:30`,
      status: "CONFIRMADO",
      comprovante: `COMP-${String(1000 + i)}`
    });
  });

  const sessoes = [
    { id: "s-1", turmaId: "t-es3", professorId: "p-carlos", data: "2026-10-20", inicio: "19:00", fim: "20:40", tema: "Levantamento de requisitos", status: "ENCERRADA" },
    { id: "s-2", turmaId: "t-es3", professorId: "p-carlos", data: "2026-10-22", inicio: "19:00", fim: "20:40", tema: "Casos de uso", status: "ENCERRADA" },
    { id: "s-3", turmaId: "t-es3", professorId: "p-carlos", data: "2026-10-27", inicio: "19:00", fim: "20:40", tema: "RevisÃ£o para a prova", status: "ABERTA" },
    { id: "s-4", turmaId: "t-es1", professorId: "p-carlos", data: "2026-10-21", inicio: "19:00", fim: "20:40", tema: "Estruturas de dados", status: "ENCERRADA" },
    { id: "s-5", turmaId: "t-adm2", professorId: "p-renata", data: "2026-10-23", inicio: "19:00", fim: "20:40", tema: "Recrutamento e seleÃ§Ã£o", status: "ENCERRADA" },
    { id: "s-6", turmaId: "t-dsg1", professorId: "p-marcos", data: "2026-10-24", inicio: "14:00", fim: "15:40", tema: "Estudo de marca", status: "ENCERRADA" }
  ];

  const registros = [];
  const statusPresenca = ["PRESENTE", "PRESENTE", "AUSENTE", "JUSTIFICADO"];
  matriculas.forEach((m, mi) => {
    sessoes.filter(s => s.turmaId === m.turmaId).forEach((s, si) => {
      registros.push({
        id: `reg-${mi + 1}-${si + 1}`,
        sessaoId: s.id,
        matriculaId: m.id,
        usuarioId: "u-carlos",
        status: statusPresenca[(mi + si) % 4],
        justificativa: (mi + si) % 4 === 3 ? "Consulta médica" : "",
        registradoEm: `${s.data}T20:45`
      });
    });
  });

  const grade = [
    { id: "gr-1", turmaId: "t-es3", professorId: "p-carlos", dia: "Segunda", inicio: "19:00", fim: "20:40", componente: "Engenharia de Requisitos", sala: "302", vigenciaInicio: "2026-08-01", vigenciaFim: "2026-12-15", status: "ATIVA" },
    { id: "gr-2", turmaId: "t-es3", professorId: "p-carlos", dia: "Quarta", inicio: "19:00", fim: "20:40", componente: "Arquitetura de Software", sala: "302", vigenciaInicio: "2026-08-01", vigenciaFim: "2026-12-15", status: "ATIVA" },
    { id: "gr-3", turmaId: "t-es1", professorId: "p-carlos", dia: "Terça", inicio: "19:00", fim: "20:40", componente: "Algoritmos e Lógica", sala: "105", vigenciaInicio: "2026-08-01", vigenciaFim: "2026-12-15", status: "ATIVA" },
    { id: "gr-4", turmaId: "t-es1", professorId: "p-carlos", dia: "Quinta", inicio: "19:00", fim: "20:40", componente: "Algoritmos e Lógica", sala: "105", vigenciaInicio: "2026-08-01", vigenciaFim: "2026-12-15", status: "ATIVA" },
    { id: "gr-5", turmaId: "t-adm2", professorId: "p-renata", dia: "Segunda", inicio: "19:00", fim: "20:40", componente: "Gestão de Pessoas", sala: "201", vigenciaInicio: "2026-08-01", vigenciaFim: "2026-12-15", status: "ATIVA" },
    { id: "gr-6", turmaId: "t-adm2", professorId: "p-renata", dia: "Quarta", inicio: "19:00", fim: "20:40", componente: "Comportamento Organizacional", sala: "201", vigenciaInicio: "2026-08-01", vigenciaFim: "2026-12-15", status: "ATIVA" },
    { id: "gr-7", turmaId: "t-dsg1", professorId: "p-marcos", dia: "Terça", inicio: "14:00", fim: "15:40", componente: "Identidade Visual", sala: "Lab. 3", vigenciaInicio: "2026-08-01", vigenciaFim: "2026-12-15", status: "ATIVA" },
    { id: "gr-8", turmaId: "t-dsg1", professorId: "p-marcos", dia: "Quinta", inicio: "14:00", fim: "15:40", componente: "Tipografia", sala: "Lab. 3", vigenciaInicio: "2026-08-01", vigenciaFim: "2026-12-15", status: "ATIVA" }
  ];

  const eventos = [
    { id: "ev-1", turmaId: "t-es3", professorId: "p-carlos", titulo: "Palestra de Carreira em Dados", tipo: "Palestra", inicio: "2026-10-29T19:00", fim: "2026-10-29T21:00", local: "Auditório A", publico: "Alunos e professores", status: "PUBLICADO" },
    { id: "ev-2", turmaId: null, professorId: "p-marcos", titulo: "Workshop de Design de Marca", tipo: "Workshop", inicio: "2026-11-05T14:00", fim: "2026-11-05T18:00", local: "Lab. 3", publico: "Cursos de Design", status: "PUBLICADO" },
    { id: "ev-3", turmaId: null, professorId: "p-renata", titulo: "Semana de Gestão e Tecnologia", tipo: "Semana acadêmica", inicio: "2026-11-09T08:00", fim: "2026-11-13T18:00", local: "Campus central", publico: "Toda a faculdade", status: "PUBLICADO" },
    { id: "ev-4", turmaId: "t-adm2", professorId: "p-renata", titulo: "Feira de Projetos Integradores", tipo: "Feira", inicio: "2026-11-20T19:00", fim: "2026-11-20T22:00", local: "Hall principal", publico: "Comunidade acadêmica", status: "PUBLICADO" }
  ];

  const solicitacoes = [
    { id: "sol-1", gradeId: "gr-2", solicitanteId: "u-carlos", aprovadorId: "u-helena", tipo: "NOVO_HORARIO", justificativa: "Troca de sala por manutenção do laboratório 302.", data: "2026-10-26T09:10", dataAprovacao: null, status: "PENDENTE", salaProposta: "305" },
    { id: "sol-2", gradeId: "gr-4", solicitanteId: "u-carlos", aprovadorId: "u-helena", tipo: "SUBSTITUICAO", justificativa: "Substituição com o professor de apoio na quinta-feira.", data: "2026-10-23T15:00", dataAprovacao: "2026-10-24T08:30", status: "APROVADA" },
    { id: "sol-3", gradeId: "gr-7", solicitanteId: "u-lucia", aprovadorId: "u-helena", tipo: "CANCELAMENTO", justificativa: "Reserva de espaço para o workshop de design.", data: "2026-10-25T11:20", dataAprovacao: "2026-10-25T16:00", status: "REJEITADA" }
  ];

  const acervos = [
    { id: "ac-eng", nome: "Acervo de Engenharia", descricao: "Referências de software, requisitos e arquitetura.", area: "Engenharia", responsavelId: "u-lucia", ativo: true },
    { id: "ac-ges", nome: "Acervo de Gestão e Design", descricao: "Administração, pessoas, marca e comunicação.", area: "Gestão e Design", responsavelId: "u-lucia", ativo: true }
  ];

  const livros = [
    { id: "li-1", acervoId: "ac-eng", titulo: "Engenharia de Software", autor: "Ian Sommerville", isbn: "978-8543024976", editora: "Cengage", ano: 2019, area: "Engenharia", cor: "#0f766e" },
    { id: "li-2", acervoId: "ac-eng", titulo: "Padrões de Projeto", autor: "Erich Gamma et al.", isbn: "978-8577804377", editora: "Bookman", ano: 2007, area: "Engenharia", cor: "#1d4ed8" },
    { id: "li-3", acervoId: "ac-eng", titulo: "Refatoração", autor: "Martin Fowler", isbn: "978-8575226263", editora: "Novatec", ano: 2021, area: "Engenharia", cor: "#7c3aed" },
    { id: "li-4", acervoId: "ac-eng", titulo: "Banco de Dados", autor: "Abraham Silberschatz", isbn: "978-8582605600", editora: "Elsevier", ano: 2020, area: "Engenharia", cor: "#0f766e" },
    { id: "li-5", acervoId: "ac-ges", titulo: "Gestão de Pessoas", autor: "Idalberto Chiavenato", isbn: "978-8597020863", editora: "Atlas", ano: 2020, area: "Gestão", cor: "#b45309" },
    { id: "li-6", acervoId: "ac-ges", titulo: "Comportamento Organizacional", autor: "Stephen Robbins", isbn: "978-8544302059", editora: "Pearson", ano: 2018, area: "Gestão", cor: "#9d174d" },
    { id: "li-7", acervoId: "ac-ges", titulo: "Design de Marca", autor: "Alina Wheeler", isbn: "978-8588543371", editora: "Alta Books", ano: 2019, area: "Design", cor: "#be185d" },
    { id: "li-8", acervoId: "ac-ges", titulo: "Elementos do Design Gráfico", autor: "Timothy Samara", isbn: "978-8532520830", editora: "Blucher", ano: 2014, area: "Design", cor: "#1d4ed8" }
  ];

  const exemplares = [];
  livros.forEach((livro, li) => {
    [1, 2].forEach((n) => {
      const status = li === 2 && n === 2 ? "MANUTENCAO" : li === 5 && n === 1 ? "EMPRESTADO" : "DISPONIVEL";
      exemplares.push({
        id: `ex-${li + 1}-${n}`,
        livroId: livro.id,
        tombo: `T${String(1000 + li * 2 + n)}`,
        status,
        localizacao: `${livro.area} Â· Estante ${li + 1}`,
        dataAquisicao: `2024-0${(li % 9) + 1}-15`
      });
    });
  });

  const historico = [
    { id: "hb-1", usuarioId: "u-ana", termo: "engenharia de requisitos", filtros: "Engenharia", data: "2026-10-26T20:12", resultados: 3 },
    { id: "hb-2", usuarioId: "u-ana", termo: "banco de dados", filtros: "Engenharia", data: "2026-10-24T18:40", resultados: 1 },
    { id: "hb-3", usuarioId: "u-bruno", termo: "padrões", filtros: "Todos", data: "2026-10-23T19:05", resultados: 2 },
    { id: "hb-4", usuarioId: "u-lucia", termo: "gestão de pessoas", filtros: "Gestão", data: "2026-10-22T10:15", resultados: 2 }
  ];

  window.EDU = {
    modulos: modules,
    grupos,
    usuarios,
    cursos,
    professores,
    alunos,
    turmas,
    matriculas,
    avaliacoes,
    tentativas,
    metodos,
    mensalidades,
    pagamentos,
    sessoes,
    registros,
    grade,
    eventos,
    solicitacoes,
    acervos,
    livros,
    exemplares,
    historico
  };
})();
