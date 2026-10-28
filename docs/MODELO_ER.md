# Modelo Entidade-Relacionamento — EduGestor

**Diagramas Draw.io:** [`diagramas/drawio/EduGestor-Diagramas.drawio`](diagramas/drawio/EduGestor-Diagramas.drawio)
**Páginas renderizadas:** [`diagramas/render/`](diagramas/render/)

O modelo foi dividido em sete páginas para manter a leitura confortável:

| Página | Entidades |
| --- | --- |
| ER 00 — Núcleo de Acesso | `Papel`, `Grupo`, `Usuario`, `Modulo`, `GrupoModulo` |
| ER 01 — Base Acadêmica | `Usuario`, `Curso`, `Aluno`, `Professor`, `Turma`, `Matricula` |
| ER 02 — Avaliações | `Avaliacao`, `GestaoAvaliacao`, `Questao`, `Alternativa`, `Tentativa`, `RespostaAluno`, `Turma`, `Matricula`, `Professor` |
| ER 03 — Financeiro | `MetodoPagamento`, `Mensalidade`, `Pagamento`, `Matricula`, `Aluno`, `Usuario` |
| ER 04 — Presença | `Sessao`, `RegistroPresenca`, `Turma`, `Matricula`, `Aluno`, `Professor`, `Usuario` |
| ER 05 — Agenda | `GradeHoraria`, `SolicitacaoAlteracao`, `Evento`, `Professor`, `Turma`, `Usuario` |
| ER 06 — Biblioteca | `Acervo`, `Livro`, `Exemplar`, `HistoricoBusca`, `Usuario` |

---

## 1. Convenções

| Símbolo | Significado |
| --- | --- |
| `PK` | Chave primária |
| `FK` | Chave estrangeira |
| `UK` | Restrição de unicidade |
| `||` | Exatamente um |
| `|o` | Zero ou um |
| `o{` | Zero ou muitos |
| `|{` | Um ou muitos |

A leitura é feita nas duas pontas. Em `TURMA ||--o{ MATRICULA`, cada matrícula pertence a exatamente uma turma e cada turma recebe zero ou muitas matrículas.

---

## 2. Dicionário de entidades

### 2.1 Núcleo de acesso

| Entidade | Atributos principais | Chaves e restrições |
| --- | --- | --- |
| `Papel` | `id_papel`, `nome`, `descricao` | PK `id_papel`; UK `nome`; valores `ROOT`, `ADMINISTRADOR`, `USUARIO`. |
| `Grupo` | `id_grupo`, `nome`, `descricao`, `ativo` | PK `id_grupo`; UK `nome`. |
| `Usuario` | `id_usuario`, `id_grupo`, `id_papel`, `nome`, `email`, `senha_hash`, `ativo`, `criado_em` | PK `id_usuario`; UK `email`; FK para `Grupo` e `Papel`. |
| `Modulo` | `id_modulo`, `codigo`, `nome`, `descricao`, `ativo` | PK `id_modulo`; UK `codigo` (`AVALIACOES`, `FINANCEIRO`, `PRESENCA`, `AGENDA`, `BIBLIOTECA`). |
| `GrupoModulo` | `id_grupo`, `id_modulo`, `habilitado_em`, `id_usuario_habilitou` | PK composta (`id_grupo`, `id_modulo`); três FKs. |

### 2.2 Base acadêmica

| Entidade | Atributos principais | Chaves e restrições |
| --- | --- | --- |
| `Curso` | `id_curso`, `id_professor_coordenador`, `nome`, `codigo`, `carga_horaria`, `modalidade`, `ativo` | PK `id_curso`; UK `codigo`; FK opcional para `Professor`; carga positiva. |
| `Aluno` | `id_aluno`, `id_usuario`, `id_curso`, `ra`, `data_ingresso`, `situacao` | PK `id_aluno`; UK `id_usuario` e `ra`; FK para `Curso`. |
| `Professor` | `id_professor`, `id_usuario`, `siape`, `titulacao`, `area_atuacao` | PK `id_professor`; UK `id_usuario` e `siape`. |
| `Turma` | `id_turma`, `id_curso`, `id_professor`, `codigo`, `periodo_letivo`, `turno`, `vagas`, `status` | PK `id_turma`; FKs para `Curso` e `Professor`; `vagas > 0`. |
| `Matricula` | `id_matricula`, `id_aluno`, `id_turma`, `data_matricula`, `status`, `nota_final`, `frequencia` | PK `id_matricula`; UK (`id_aluno`, `id_turma`); FKs; `nota_final` 0–10; `frequencia` 0–100. |

### 2.3 Avaliações

| Entidade | Atributos principais | Chaves e restrições |
| --- | --- | --- |
| `Avaliacao` | `id_avaliacao`, `id_turma`, `id_professor`, `titulo`, `tipo`, `peso`, `data_inicio`, `data_fim`, `status` | PK; FKs; peso positivo; `data_fim > data_inicio`. |
| `GestaoAvaliacao` | `id_gestao`, `id_avaliacao`, `id_professor`, `max_tentativas`, `permite_recuperacao`, `peso_recuperacao`, `divulgada_em`, `status` | PK; UK `id_avaliacao`; FKs; relação 1:1 com `Avaliacao`. |
| `Questao` | `id_questao`, `id_avaliacao`, `enunciado`, `tipo`, `pontuacao`, `ordem` | PK; FK; pontuação positiva; UK (`id_avaliacao`, `ordem`). |
| `Alternativa` | `id_alternativa`, `id_questao`, `texto`, `correta`, `ordem` | PK; FK; UK (`id_questao`, `ordem`). |
| `Tentativa` | `id_tentativa`, `id_avaliacao`, `id_matricula`, `numero`, `inicio`, `fim`, `status`, `pontuacao` | PK; UK (`id_avaliacao`, `id_matricula`, `numero`); FKs. |
| `RespostaAluno` | `id_resposta`, `id_tentativa`, `id_questao`, `id_alternativa`, `texto_dissertativo`, `correta` | PK; UK (`id_tentativa`, `id_questao`); FKs; alternativa opcional. |

### 2.4 Financeiro

| Entidade | Atributos principais | Chaves e restrições |
| --- | --- | --- |
| `Mensalidade` | `id_mensalidade`, `id_matricula`, `competencia`, `valor`, `desconto`, `data_vencimento`, `status` | PK; FK; UK (`id_matricula`, `competencia`); valor positivo. |
| `MetodoPagamento` | `id_metodo`, `nome`, `tipo`, `taxa`, `ativo` | PK; taxa não negativa. |
| `Pagamento` | `id_pagamento`, `id_mensalidade`, `id_metodo`, `id_usuario_registro`, `valor_pago`, `data_pagamento`, `status`, `comprovante` | PK; três FKs; valor positivo. |

### 2.5 Presença

| Entidade | Atributos principais | Chaves e restrições |
| --- | --- | --- |
| `Sessao` | `id_sessao`, `id_turma`, `id_professor`, `data_sessao`, `hora_inicio`, `hora_fim`, `tema`, `status` | PK; FKs; `hora_fim > hora_inicio`; UK (`id_turma`, `data_sessao`, `hora_inicio`). |
| `RegistroPresenca` | `id_registro`, `id_sessao`, `id_matricula`, `id_usuario_registro`, `status`, `justificativa`, `registrado_em` | PK; UK (`id_sessao`, `id_matricula`); quatro FKs. |

### 2.6 Agenda

| Entidade | Atributos principais | Chaves e restrições |
| --- | --- | --- |
| `GradeHoraria` | `id_grade`, `id_turma`, `id_professor`, `dia_semana`, `hora_inicio`, `hora_fim`, `componente`, `sala`, `vigencia_inicio`, `vigencia_fim`, `status` | PK; FKs; UK (`id_turma`, `dia_semana`, `hora_inicio`); horário válido. |
| `Evento` | `id_evento`, `id_turma`, `id_professor_responsavel`, `titulo`, `tipo`, `data_inicio`, `data_fim`, `local`, `publico_alvo`, `status` | PK; FK de turma opcional; FK do responsável; `data_fim > data_inicio`. |
| `SolicitacaoAlteracao` | `id_solicitacao`, `id_grade`, `id_solicitante`, `id_aprovador`, `tipo`, `justificativa`, `data_solicitacao`, `data_aprovacao`, `status` | PK; FKs para grade, solicitante e aprovador; aprovador opcional. |

### 2.7 Biblioteca

| Entidade | Atributos principais | Chaves e restrições |
| --- | --- | --- |
| `Acervo` | `id_acervo`, `id_responsavel`, `nome`, `descricao`, `area`, `ativo` | PK; FK para `Usuario`; nome e área obrigatórios. |
| `Livro` | `id_livro`, `id_acervo`, `titulo`, `autor`, `isbn`, `editora`, `ano`, `area` | PK; FK; UK `isbn` quando informado. |
| `Exemplar` | `id_exemplar`, `id_livro`, `tombo`, `status`, `localizacao`, `data_aquisicao` | PK; UK `tombo`; FK; status de circulação. |
| `HistoricoBusca` | `id_busca`, `id_usuario`, `termo`, `filtros`, `data_busca`, `qtd_resultados` | PK; FK; registro imutável. |

---

## 3. Relacionamentos e cardinalidades

| # | Relacionamento | Cardinalidade | Regra |
| --- | --- | --- | --- |
| 1 | `Papel` — `Usuario` | 1 : N | Cada usuário tem um papel; o papel classifica vários usuários. |
| 2 | `Grupo` — `Usuario` | 1 : N | Cada usuário pertence a um grupo. |
| 3 | `Grupo` — `Modulo` | N : N | Resolvido por `GrupoModulo`; um grupo recebe vários módulos e um módulo atende vários grupos. |
| 4 | `Usuario` — `Aluno` | 1 : 0..1 | Todo aluno é um usuário; um usuário pode ter perfil de aluno. |
| 5 | `Usuario` — `Professor` | 1 : 0..1 | Todo professor é um usuário; um usuário pode ter perfil docente. |
| 6 | `Curso` — `Aluno` | 1 : N | Cada aluno está vinculado a um curso. |
| 7 | `Curso` — `Turma` | 1 : N | Cada turma pertence a um curso. |
| 8 | `Professor` — `Turma` | 1 : N | Cada turma tem um professor responsável. |
| 9 | `Professor` — `Curso` | 0..1 : N | Um professor pode coordenar vários cursos; cada curso tem no máximo um coordenador. |
| 10 | `Aluno` — `Matricula` | 1 : N | Um aluno realiza várias matrículas. |
| 11 | `Turma` — `Matricula` | 1 : N | Uma turma recebe várias matrículas. |
| 12 | `Turma` — `Avaliacao` | 1 : N | Uma turma possui várias avaliações. |
| 13 | `Professor` — `Avaliacao` | 1 : N | Um professor cria várias avaliações. |
| 14 | `Avaliacao` — `GestaoAvaliacao` | 1 : 1 | Cada avaliação tem uma configuração de gestão. |
| 15 | `Professor` — `GestaoAvaliacao` | 1 : N | O professor gerencia as configurações das suas avaliações. |
| 16 | `Avaliacao` — `Questao` | 1 : 1..N | Uma avaliação tem pelo menos uma questão. |
| 17 | `Questao` — `Alternativa` | 1 : 0..N | Questão objetiva tem várias alternativas; dissertativa tem zero. |
| 18 | `Avaliacao` — `Tentativa` | 1 : N | Uma avaliação gera várias tentativas. |
| 19 | `Matricula` — `Tentativa` | 1 : N | Uma matrícula executa várias tentativas. |
| 20 | `Tentativa` — `RespostaAluno` | 1 : N | Uma tentativa registra várias respostas. |
| 21 | `Questao` — `RespostaAluno` | 1 : N | Uma questão recebe respostas de várias tentativas. |
| 22 | `Alternativa` — `RespostaAluno` | 0..1 : N | A resposta objetiva escolhe uma alternativa; dissertativa não escolhe. |
| 23 | `Matricula` — `Mensalidade` | 1 : N | Uma matrícula gera mensalidades por competência. |
| 24 | `Mensalidade` — `Pagamento` | 1 : N | Uma mensalidade recebe pagamentos parciais. |
| 25 | `MetodoPagamento` — `Pagamento` | 1 : N | Um método classifica vários pagamentos. |
| 26 | `Aluno` — `Matricula` | 1 : N | Reforço da âncora acadêmica do financeiro. |
| 27 | `Usuario` — `Pagamento` | 1 : N | Um usuário registra vários pagamentos. |
| 28 | `Turma` — `Sessao` | 1 : N | Uma turma possui várias sessões. |
| 29 | `Professor` — `Sessao` | 1 : N | Um professor conduz várias sessões. |
| 30 | `Sessao` — `RegistroPresenca` | 1 : N | Uma sessão gera um registro por matrícula. |
| 31 | `Matricula` — `RegistroPresenca` | 1 : N | Uma matrícula acumula vários registros. |
| 32 | `Turma` — `Matricula` | 1 : N | Reforço da base para presença. |
| 33 | `Aluno` — `Matricula` | 1 : N | Reforço da base para presença. |
| 34 | `Professor` — `Turma` | 1 : N | Reforço do responsável pela turma. |
| 35 | `Turma` — `GradeHoraria` | 1 : N | Uma turma possui vários horários. |
| 36 | `Professor` — `GradeHoraria` | 1 : N | Um professor ministra vários horários. |
| 37 | `GradeHoraria` — `SolicitacaoAlteracao` | 1 : N | Um horário recebe várias solicitações. |
| 38 | `Usuario` — `SolicitacaoAlteracao` | 1 : N | Um usuário solicita alterações. |
| 39 | `Usuario` — `SolicitacaoAlteracao` | 0..1 : N | Um usuário aprova alterações (aprovador opcional). |
| 40 | `Turma` — `Evento` | 0..1 : N | Um evento pode estar vinculado a uma turma. |
| 41 | `Professor` — `Evento` | 1 : N | Cada evento tem um professor responsável. |
| 42 | `Acervo` — `Livro` | 1 : 1..N | Um acervo reúne vários livros; cada livro pertence a um acervo. |
| 43 | `Livro` — `Exemplar` | 1 : 1..N | Um livro possui pelo menos um exemplar. |
| 44 | `Usuario` — `HistoricoBusca` | 1 : N | Um usuário realiza várias buscas. |
| 45 | `Usuario` — `Acervo` | 1 : N | Cada acervo possui um usuário responsável. |
| 46 | `Usuario` — `GrupoModulo` | 1 : N | O usuário que executou a habilitação fica registrado na associação. |
| 47 | `Usuario` — `RegistroPresenca` | 1 : N | Cada registro de presença guarda o usuário que fez a chamada. |

---

## 4. Decisões de modelagem

**Núcleo estável.** `Papel`, `Grupo`, `Usuario`, `Modulo` e `GrupoModulo` permanecem separados dos módulos. A habilitação de módulo é uma entidade associativa com data e autor, o que permite auditoria e desabilitação sem perda de histórico.

**Matrícula como âncora.** Avaliação, presença e mensalidade se ligam à matrícula, e não diretamente ao aluno. Assim, o histórico de uma turma ou de uma competência financeira permanece correto mesmo que o aluno mude de curso.

**Gestão da avaliação separada.** `Avaliacao` descreve o instrumento (título, peso, janela). `GestaoAvaliacao` descreve a operação (tentativas, recuperação, divulgação). A separação evita misturar configuração pedagógica com o registro da prova.

**Nota na tentativa.** A pontuação oficial é `Tentativa.pontuacao`, calculada a partir de `RespostaAluno` e das questões. A nota final da matrícula consolida a média ponderada das avaliações. A modelagem evita uma tabela de nota duplicada.

**Pagamento parcial.** `Mensalidade` guarda valor e desconto; `Pagamento` registra cada baixa. O saldo é derivado, e a soma dos pagamentos não pode exceder o valor devido.

**Presença única por sessão.** A unicidade (`id_sessao`, `id_matricula`) impede dois registros para o mesmo aluno no mesmo encontro. A frequência é calculada a partir desses registros.

**Agenda com solicitação.** `GradeHoraria` é a fonte da verdade. `SolicitacaoAlteracao` registra o pedido, o solicitante e o aprovador; a aprovação atualiza a grade em transação.

**Biblioteca centrada no exemplar.** `Livro` é a referência bibliográfica; `Exemplar` é a cópia física com tombo único. `HistoricoBusca` registra a consulta sem alterar o acervo.