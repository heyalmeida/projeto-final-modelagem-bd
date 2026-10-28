# Diagrama de Classes — EduGestor

**Arquivo Draw.io:** [`diagramas/drawio/EduGestor-Diagramas.drawio`](diagramas/drawio/EduGestor-Diagramas.drawio)
**Páginas renderizadas:** [`diagramas/render/`](diagramas/render/)

O diagrama foi dividido em sete páginas para preservar a legibilidade:

| Página | Classes |
| --- | --- |
| Classes 00 — Núcleo de Acesso | `Papel`, `Grupo`, `Usuario`, `Modulo`, `GrupoModulo` |
| Classes 01 — Base Acadêmica | `Usuario`, `Curso`, `Aluno`, `Professor`, `Turma`, `Matricula` |
| Classes 02 — Avaliações | `Avaliacao`, `GestaoAvaliacao`, `Questao`, `Alternativa`, `Tentativa`, `RespostaAluno`, `Turma`, `Matricula`, `Professor` |
| Classes 03 — Financeiro | `MetodoPagamento`, `Mensalidade`, `Pagamento`, `Usuario`, `Matricula`, `Aluno` |
| Classes 04 — Presença | `Sessao`, `RegistroPresenca`, `Turma`, `Matricula`, `Aluno`, `Professor`, `Usuario` |
| Classes 05 — Agenda | `GradeHoraria`, `SolicitacaoAlteracao`, `Evento`, `Professor`, `Turma`, `Usuario` |
| Classes 06 — Biblioteca | `Acervo`, `Livro`, `Exemplar`, `HistoricoBusca`, `Usuario` |

---

## 1. Convenções

| Elemento | Representação |
| --- | --- |
| Classe | Retângulo com nome, atributos e operações. |
| Herança | Seta com triângulo vazio (`Usuario <|-- Aluno`). |
| Associação | Linha contínua com multiplicidade nas duas pontas. |
| Composição | Losango preenchido na ponta do todo. |
| Associação N:N | Classe intermediária (`GrupoModulo`). |
| Visibilidade | `+` público, `-` privado. |

As multiplicidades são lidas na ponta oposta. Em `Turma "1" -- "0..*" Matricula`, uma turma recebe zero ou muitas matrículas e cada matrícula pertence a exatamente uma turma.

---

## 2. Classes do núcleo

| Classe | Atributos principais | Operações principais |
| --- | --- | --- |
| `Papel` | `idPapel`, `nome`, `descricao` | `possuiPermissao(permissao)` |
| `Grupo` | `idGrupo`, `nome`, `descricao`, `ativo` | `adicionarUsuario`, `habilitarModulo`, `possuiModulo` |
| `Usuario` | `idUsuario`, `nome`, `email`, `senhaHash`, `ativo`, `criadoEm` | `autenticar`, `alterarSenha`, `possuiModulo` |
| `Modulo` | `idModulo`, `codigo`, `nome`, `descricao`, `ativo` | `habilitarPara`, `desabilitarPara` |
| `GrupoModulo` | `habilitadoEm`, `idUsuarioHabilitou` | `registrarHabilitacao` |

## 3. Classes da base acadêmica

| Classe | Atributos principais | Operações principais |
| --- | --- | --- |
| `Curso` | `idCurso`, `nome`, `codigo`, `cargaHoraria`, `modalidade`, `ativo` | `adicionarTurma`, `possuiAluno` |
| `Aluno` | `ra`, `dataIngresso`, `situacao` | `matricular`, `consultarHistorico` |
| `Professor` | `siape`, `titulacao`, `areaAtuacao` | `ministrarSessao`, `lancarNota` |
| `Turma` | `idTurma`, `codigo`, `periodoLetivo`, `turno`, `vagas`, `status` | `possuiVaga`, `abrirMatricula` |
| `Matricula` | `idMatricula`, `dataMatricula`, `status`, `notaFinal`, `frequencia` | `trancar`, `cancelar`, `calcularFrequencia` |

`Aluno` e `Professor` herdam de `Usuario`; no banco, a herança é implementada por tabelas 1:1 com `id_usuario` único.

## 4. Classes de Avaliações

| Classe | Atributos principais | Operações principais |
| --- | --- | --- |
| `Avaliacao` | `idAvaliacao`, `titulo`, `tipo`, `peso`, `dataInicio`, `dataFim`, `status` | `estaAberta`, `calcularMedia` |
| `GestaoAvaliacao` | `idGestao`, `maxTentativas`, `permiteRecuperacao`, `pesoRecuperacao`, `divulgadaEm`, `status` | `configurar`, `divulgarNotas` |
| `Questao` | `idQuestao`, `enunciado`, `tipo`, `pontuacao`, `ordem` | `validarResposta` |
| `Alternativa` | `idAlternativa`, `texto`, `correta`, `ordem` | `marcarCorreta` |
| `Tentativa` | `idTentativa`, `numero`, `inicio`, `fim`, `status`, `pontuacao` | `iniciar`, `finalizar`, `calcularPontuacao` |
| `RespostaAluno` | `idResposta`, `textoDissertativo`, `correta` | `avaliar` |

## 5. Classes de Financeiro

| Classe | Atributos principais | Operações principais |
| --- | --- | --- |
| `Mensalidade` | `idMensalidade`, `competencia`, `valor`, `desconto`, `dataVencimento`, `status` | `calcularSaldo`, `estaVencida` |
| `MetodoPagamento` | `idMetodo`, `nome`, `tipo`, `taxa`, `ativo` | `estaAtivo` |
| `Pagamento` | `idPagamento`, `valorPago`, `dataPagamento`, `status`, `comprovante` | `registrar`, `estornar` |

## 6. Classes de Presença

| Classe | Atributos principais | Operações principais |
| --- | --- | --- |
| `Sessao` | `idSessao`, `dataSessao`, `horaInicio`, `horaFim`, `tema`, `status` | `abrir`, `encerrar` |
| `RegistroPresenca` | `idRegistro`, `status`, `justificativa`, `registradoEm` | `justificar`, `alterarStatus` |

## 7. Classes de Agenda

| Classe | Atributos principais | Operações principais |
| --- | --- | --- |
| `GradeHoraria` | `idGrade`, `diaSemana`, `horaInicio`, `horaFim`, `componente`, `sala`, `vigenciaInicio`, `vigenciaFim`, `status` | `possuiConflito`, `alterarHorario` |
| `Evento` | `idEvento`, `titulo`, `tipo`, `dataInicio`, `dataFim`, `local`, `publicoAlvo`, `status` | `publicar`, `cancelar` |
| `SolicitacaoAlteracao` | `idSolicitacao`, `tipo`, `justificativa`, `dataSolicitacao`, `dataAprovacao`, `status` | `aprovar`, `rejeitar` |

## 8. Classes de Biblioteca

| Classe | Atributos principais | Operações principais |
| --- | --- | --- |
| `Acervo` | `idAcervo`, `nome`, `descricao`, `area`, `ativo` | `adicionarLivro`, `totalExemplares` |
| `Livro` | `idLivro`, `titulo`, `autor`, `isbn`, `editora`, `ano`, `area` | `disponibilidade` |
| `Exemplar` | `idExemplar`, `tombo`, `status`, `localizacao`, `dataAquisicao` | `estaDisponivel`, `baixar` |
| `HistoricoBusca` | `idBusca`, `termo`, `filtros`, `dataBusca`, `qtdResultados` | `registrar`, `listarPorUsuario` |

---

## 9. Multiplicidades

| Relacionamento | Multiplicidade | Regra |
| --- | --- | --- |
| `Papel` — `Usuario` | 1 : 0..* | Cada usuário tem um papel. |
| `Grupo` — `Usuario` | 1 : 0..* | Cada usuário tem um grupo. |
| `Grupo` — `GrupoModulo` | 1 : 0..* | O grupo recebe várias habilitações. |
| `Modulo` — `GrupoModulo` | 1 : 0..* | O módulo é habilitado para vários grupos. |
| `Usuario` — `Aluno` | 1 : 0..1 | Herança: todo aluno é usuário. |
| `Usuario` — `Professor` | 1 : 0..1 | Herança: todo professor é usuário. |
| `Curso` — `Aluno` | 1 : 0..* | Cada aluno pertence a um curso. |
| `Curso` — `Turma` | 1 : 0..* | Cada turma pertence a um curso. |
| `Professor` — `Turma` | 1 : 0..* | Cada turma tem um professor responsável. |
| `Professor` — `Curso` | 0..1 : 0..* | Cada curso tem no máximo um coordenador. |
| `Aluno` — `Matricula` | 1 : 0..* | Cada matrícula pertence a um aluno. |
| `Turma` — `Matricula` | 1 : 0..* | Cada matrícula pertence a uma turma. |
| `Turma` — `Avaliacao` | 1 : 0..* | Cada avaliação pertence a uma turma. |
| `Professor` — `Avaliacao` | 1 : 0..* | Cada avaliação tem um professor responsável. |
| `Avaliacao` — `GestaoAvaliacao` | 1 : 1 | Configuração única por avaliação. |
| `Professor` — `GestaoAvaliacao` | 1 : 0..* | O professor gerencia várias configurações. |
| `Avaliacao` — `Questao` | 1 : 1..* | Cada questão pertence a uma avaliação. |
| `Questao` — `Alternativa` | 1 : 0..* | Questão objetiva tem alternativas; dissertativa tem zero. |
| `Avaliacao` — `Tentativa` | 1 : 0..* | Cada tentativa pertence a uma avaliação. |
| `Matricula` — `Tentativa` | 1 : 0..* | Cada tentativa pertence a uma matrícula. |
| `Tentativa` — `RespostaAluno` | 1 : 0..* | Cada resposta pertence a uma tentativa. |
| `Questao` — `RespostaAluno` | 1 : 0..* | Cada resposta pertence a uma questão. |
| `Alternativa` — `RespostaAluno` | 0..1 : 0..* | A resposta objetiva escolhe uma alternativa. |
| `Matricula` — `Mensalidade` | 1 : 0..* | Cada mensalidade pertence a uma matrícula. |
| `Mensalidade` — `Pagamento` | 1 : 0..* | Cada pagamento pertence a uma mensalidade. |
| `MetodoPagamento` — `Pagamento` | 1 : 0..* | Cada pagamento usa um método. |
| `Usuario` — `Pagamento` | 1 : 0..* | Cada pagamento registra o usuário responsável. |
| `Turma` — `Sessao` | 1 : 0..* | Cada sessão pertence a uma turma. |
| `Professor` — `Sessao` | 1 : 0..* | Cada sessão tem um professor. |
| `Sessao` — `RegistroPresenca` | 1 : 0..* | Cada registro pertence a uma sessão. |
| `Matricula` — `RegistroPresenca` | 1 : 0..* | Cada registro pertence a uma matrícula. |
| `Turma` — `GradeHoraria` | 1 : 0..* | Cada horário pertence a uma turma. |
| `Professor` — `GradeHoraria` | 1 : 0..* | Cada horário tem um professor. |
| `GradeHoraria` — `SolicitacaoAlteracao` | 1 : 0..* | Cada solicitação referencia um horário. |
| `Usuario` — `SolicitacaoAlteracao` | 1 : 0..* | Cada solicitação tem um solicitante. |
| `Usuario` — `SolicitacaoAlteracao` | 0..1 : 0..* | O aprovador é opcional enquanto pendente. |
| `Turma` — `Evento` | 0..1 : 0..* | O evento pode ser institucional ou de uma turma. |
| `Professor` — `Evento` | 1 : 0..* | Cada evento tem um responsável. |
| `Acervo` — `Livro` | 1 : 1..* | Cada livro pertence a um acervo. |
| `Livro` — `Exemplar` | 1 : 1..* | Cada exemplar pertence a um livro. |
| `Usuario` — `HistoricoBusca` | 1 : 0..* | Cada busca pertence a um usuário. |
| `Usuario` — `Acervo` | 1 : 0..* | Cada acervo tem um usuário responsável. |
| `Usuario` — `GrupoModulo` | 1 : 0..* | Cada habilitação registra o usuário responsável. |
| `Usuario` — `RegistroPresenca` | 1 : 0..* | Cada registro de presença guarda quem fez a chamada. |

---

## 10. Decisões orientadas a objetos

**Herança de perfis.** `Aluno` e `Professor` herdam de `Usuario`. O núcleo de acesso permanece único e os perfis acrescentam apenas os dados acadêmicos. No banco, a herança vira duas tabelas 1:1.

**Classe associativa explícita.** `GrupoModulo` carrega data e autor da habilitação, informações que não pertencem a `Grupo` nem a `Modulo`.

**Configuração separada do instrumento.** `Avaliacao` e `GestaoAvaliacao` têm ciclos de vida distintos: a avaliação descreve a prova; a gestão controla tentativas, recuperação e divulgação.

**Entidades ricas.** Operações como `possuiVaga`, `trancar`, `iniciar`, `calcularSaldo`, `justificar`, `aprovar` e `estaDisponivel` concentram regras de negócio nas classes e evitam que a tela decida sozinha.

**Histórico preservado.** Notas, pagamentos, presenças e solicitações não são apagados; usam status e mantêm autoria. Isso atende auditoria e integridade acadêmica.

**Biblioteca por exemplar.** `Livro` é a referência; `Exemplar` tem tombo único e status. A disponibilidade é calculada no exemplar, não no título.