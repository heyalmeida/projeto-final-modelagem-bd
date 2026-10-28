# EduGestor — Plataforma de Gestão Acadêmica Modular

**Trabalho final — Modelagem de Banco de Dados**
**Tema:** faculdade
**Base técnica:** aplicação em camadas `Models` / `DAO` / `Utils` / `Forms`, WinForms .NET Framework e SQLite, reaproveitada do projeto `ProjetoFinal-C#`.
**Protótipo local:** [`prototipo/index.html`](../prototipo/index.html)

---

## 1. Tema reescrito

O projeto deixa o contexto de livraria e passa a representar a rotina acadêmica de uma faculdade. O **EduGestor** é uma plataforma modular: cada setor recebe apenas as funcionalidades de que precisa, e todos compartilham o mesmo cadastro de usuários, cursos, alunos, professores, turmas e matrículas.

O sistema resolve um problema recorrente na faculdade: secretaria, coordenação, professores, alunos, financeiro e biblioteca mantêm recortes diferentes da mesma informação. Sem uma base comum, matrícula, nota, presença, mensalidade e acervo divergem. O EduGestor centraliza essas rotinas em cinco módulos funcionais, todos apoiados pelo núcleo de acesso e pela base acadêmica.

### 1.1 Do projeto anterior para o novo tema

| Dimensão | Projeto anterior — EntreLivros | Projeto atual — EduGestor |
| --- | --- | --- |
| Domínio | Livraria: acervo, editoras, vendas e estoque | Faculdade: avaliações, financeiro, presença, agenda e biblioteca |
| Unidade central | Obra e pedido | Curso, turma e matrícula |
| Controle de acesso | Perfis aplicados a telas | Papel global + grupo + módulo habilitado |
| Organização | Telas fixas | Núcleo de acesso + cinco módulos educacionais |
| Operações típicas | Venda, baixa de estoque | Tentativa de avaliação, pagamento de mensalidade, registro de presença, alteração de horário, busca no acervo |
| Relatórios | Faturamento e balanço | Desempenho por avaliação, inadimplência, frequência, ocupação da agenda, uso do acervo |

### 1.2 Objetivos

- Centralizar a operação acadêmica em uma plataforma modular.
- Liberar funcionalidades por grupo, sem duplicar cadastros.
- Conectar avaliação, finanças, presença, agenda e biblioteca à mesma matrícula.
- Garantir integridade, rastreabilidade e regras de negócio verificáveis.
- Entregar um modelo ER, um diagrama de classes e um protótipo navegável.

---

## 2. Núcleo de acesso

### 2.1 Entidades

| Entidade | Função |
| --- | --- |
| `Papel` | Permissão global: `ROOT`, `ADMINISTRADOR` ou `USUARIO`. |
| `Grupo` | Agrupamento organizacional que recebe módulos. |
| `Usuario` | Credencial e identidade de acesso. |
| `Modulo` | Catálogo de funcionalidades habilitáveis. |
| `GrupoModulo` | Associação N:N entre grupo e módulo, com data e autor da habilitação. |

### 2.2 Papéis

| Papel | Permissões globais |
| --- | --- |
| `ROOT` | Administra papéis, grupos, usuários e o catálogo de módulos; habilita módulos; acessa tudo para suporte. |
| `ADMINISTRADOR` | Opera os dados dos módulos habilitados para o seu grupo; não altera a estrutura de acesso. |
| `USUARIO` | Usa os módulos do seu grupo conforme o perfil acadêmico e a titularidade do registro. |

O acesso é concedido pela combinação de três fatores: papel compatível, módulo habilitado para o grupo e vínculo com o registro (aluno, professor, responsável financeiro ou bibliotecário).

### 2.3 Grupos de exemplo

| Grupo | Papel | Avaliações | Financeiro | Presença | Agenda | Biblioteca |
| --- | --- | :---: | :---: | :---: | :---: | :---: |
| Tecnologia da Informação | `ROOT` | ✔ | ✔ | ✔ | ✔ | ✔ |
| Direção | `ADMINISTRADOR` | ✔ | ✔ | ✔ | ✔ | ✔ |
| Secretaria Acadêmica | `ADMINISTRADOR` |  | ✔ | ✔ | ✔ | ✔ |
| Coordenação de Curso | `ADMINISTRADOR` | ✔ |  | ✔ | ✔ | ✔ |
| Professores | `USUARIO` | ✔ |  | ✔ | ✔ | ✔ |
| Alunos | `USUARIO` | ✔ | ✔ | ✔ | ✔ | ✔ |
| Financeiro | `USUARIO` |  | ✔ |  |  |  |
| Biblioteca | `USUARIO` |  |  |  | ✔ | ✔ |

### 2.4 Regras do núcleo

| Código | Regra |
| --- | --- |
| RN-C01 | Todo usuário pertence a exatamente um grupo e possui exatamente um papel. |
| RN-C02 | O e-mail é único e a senha é armazenada apenas como hash com salt. |
| RN-C03 | Usuário ou grupo inativo não autentica; o histórico acadêmico permanece. |
| RN-C04 | Um grupo pode ter zero ou vários módulos; um módulo pode estar habilitado para zero ou vários grupos. |
| RN-C05 | A habilitação de módulo registra data e usuário responsável em `GrupoModulo`. |
| RN-C06 | Desabilitar um módulo bloqueia novas operações sem apagar os dados existentes. |
| RN-C07 | O `ROOT` acessa a administração de grupos, papéis e módulos; o acesso aos dados acadêmicos continua sujeito ao módulo habilitado. |
| RN-C08 | Toda escrita relevante registra autor e data para auditoria. |

---

## 3. Base acadêmica

Entidades compartilhadas pelos módulos: `Curso`, `Aluno`, `Professor`, `Turma` e `Matricula`.

| Entidade | Função |
| --- | --- |
| `Curso` | Oferta acadêmica que agrupa alunos e turmas. |
| `Aluno` | Perfil acadêmico do usuário, com RA e curso. |
| `Professor` | Perfil docente, com SIAPE, titulação e área. |
| `Turma` | Oferta de um componente em um período letivo. |
| `Matricula` | Vínculo do aluno com a turma; é a âncora de avaliações, presença e mensalidades. |

| Código | Regra |
| --- | --- |
| RN-B01 | `Aluno` e `Professor` são especializações de `Usuario`, com vínculo 1:1. |
| RN-B02 | O RA e o SIAPE são únicos. O aluno está vinculado a um curso; o professor pode coordenar cursos e lecionar turmas. |
| RN-B03 | A turma pertence a um curso, tem um professor responsável, período letivo, turno e vagas positivas. |
| RN-B04 | A matrícula exige aluno ativo, turma com vagas e ausência de duplicidade aluno/turma. |
| RN-B05 | A matrícula transita entre `ATIVA`, `TRANCADA`, `CANCELADA` e `CONCLUIDA`. |
| RN-B06 | A nota final e a frequência são consolidadas apenas na conclusão. |

---

## 4. Módulo Avaliações

**Entidades:** `Avaliacao`, `GestaoAvaliacao`, `Questao`, `Alternativa`, `Tentativa`, `RespostaAluno`.
**Apoio:** `Turma`, `Matricula`, `Professor`.

`GestaoAvaliacao` é a entidade de **Gestão** do módulo: representa a configuração e a publicação da avaliação, com limite de tentativas, recuperação, peso da recuperação e data de divulgação.

| Código | Regra |
| --- | --- |
| RN-A01 | A avaliação pertence a uma turma e a um professor, tem tipo, peso positivo, janela de início e fim e status `RASCUNHO`, `PUBLICADA` ou `ENCERRADA`. |
| RN-A02 | A soma das pontuações das questões deve ser igual à nota máxima da avaliação. |
| RN-A03 | Questão objetiva possui pelo menos duas alternativas e exatamente uma correta; questão dissertativa não possui alternativa correta. |
| RN-A04 | A tentativa exige matrícula `ATIVA`, avaliação publicada, janela aberta e limite de tentativas não excedido. |
| RN-A05 | O aluno mantém uma única tentativa em andamento por avaliação; ao encerrar a janela, a tentativa é finalizada automaticamente. |
| RN-A06 | Cada questão recebe no máximo uma resposta por tentativa. Resposta objetiva deve referenciar uma alternativa da própria questão. |
| RN-A07 | A pontuação da tentativa é calculada pela soma das questões corretas e registrada em `Tentativa.pontuacao`; a nota final da matrícula é a média ponderada das avaliações. |
| RN-A08 | A aprovação exige média maior ou igual a 6,0 e frequência maior ou igual a 75%. |
| RN-A09 | Apenas o professor da turma ou um administrador configura `GestaoAvaliacao`, publica notas e concede recuperação. |
| RN-A10 | Após a divulgação, tentativas e respostas ficam somente leitura. O aluno vê apenas os próprios registros. |

---

## 5. Módulo Financeiro

**Entidades:** `Mensalidade`, `Pagamento`, `MetodoPagamento`.
**Apoio:** `Matricula`, `Aluno`, `Usuario`.

| Código | Regra |
| --- | --- |
| RN-F01 | Existe no máximo uma mensalidade por matrícula e competência (`AAAA-MM`). |
| RN-F02 | O valor da mensalidade é positivo; desconto não pode ser maior que o valor; o saldo é `valor - desconto - pagamentos`. |
| RN-F03 | A mensalidade transita entre `ABERTA`, `PARCIAL`, `PAGA`, `VENCIDA` e `CANCELADA`. |
| RN-F04 | O pagamento pode ser parcial, mas a soma dos pagamentos não pode exceder o saldo. |
| RN-F05 | O método de pagamento precisa estar ativo; o pagamento registra valor, data, status e comprovante. |
| RN-F06 | Pagamento e mensalidade não são excluídos: estorno ou cancelamento preservam o histórico. |
| RN-F07 | Mensalidade vencida há mais de 30 dias é sinalizada e bloqueia nova matrícula até regularização. |
| RN-F08 | Apenas o grupo Financeiro, a Secretaria e a Direção registram ou estornam pagamentos. O aluno consulta apenas as próprias mensalidades. |

---

## 6. Módulo Presença

**Entidades:** `Sessao`, `RegistroPresenca`.
**Apoio:** `Turma`, `Matricula`, `Aluno`, `Professor`.

| Código | Regra |
| --- | --- |
| RN-P01 | A sessão pertence a uma turma e a um professor, com data, hora de início, hora de fim e tema. |
| RN-P02 | Não existe sessão duplicada para a mesma turma no mesmo intervalo de data e horário. |
| RN-P03 | O registro de presença é único por sessão e matrícula. |
| RN-P04 | O status é `PRESENTE`, `AUSENTE` ou `JUSTIFICADO`; a justificativa é obrigatória no status `JUSTIFICADO`. |
| RN-P05 | Apenas matrícula ativa recebe registro; a sessão encerrada fica somente leitura, salvo ajuste autorizado pela coordenação. |
| RN-P06 | A frequência é calculada por `(presenças + justificadas) / sessões registradas`, em percentual. |
| RN-P07 | O professor acessa as próprias sessões; o aluno vê apenas os próprios registros. |
| RN-P08 | Cancelar uma sessão remove seus registros do cálculo, preservando o histórico para auditoria. |

---

## 7. Módulo Agenda

**Entidades:** `Evento`, `GradeHoraria`, `SolicitacaoAlteracao`.
**Apoio:** `Turma`, `Professor`, `Usuario`.

| Código | Regra |
| --- | --- |
| RN-G01 | A grade horária pertence a uma turma, tem professor, dia da semana, horário, componente, sala e vigência. |
| RN-G02 | Não há conflito de horário para a mesma turma nem para o mesmo professor no mesmo dia e faixa. |
| RN-G03 | O evento pode ser institucional ou vinculado a uma turma; possui título, tipo, período, local, público-alvo e responsável. |
| RN-G04 | A solicitação de alteração referencia uma grade, um solicitante e um tipo (`SUBSTITUICAO`, `CANCELAMENTO`, `NOVO_HORARIO`). |
| RN-G05 | A solicitação nasce `PENDENTE`; apenas a coordenação ou a direção aprova ou rejeita, com data e justificativa. |
| RN-G06 | A aprovação valida conflitos e atualiza a grade na mesma transação; a rejeição exige motivo. |
| RN-G07 | Evento e grade não são excluídos quando possuem histórico; usam status `CANCELADO` ou `INATIVO`. |
| RN-G08 | Aluno vê a agenda das próprias turmas; professor vê a própria agenda; coordenação vê o curso. |

---

## 8. Módulo Biblioteca

**Entidades:** `Acervo`, `Livro`, `Exemplar`, `HistoricoBusca`.
**Apoio:** `Usuario`, `Curso`, `Turma`.

| Código | Regra |
| --- | --- |
| RN-L01 | O acervo possui nome, área, responsável e status; cada livro pertence a um único acervo. |
| RN-L02 | O ISBN é único quando informado; título, autor, editora e ano são obrigatórios. |
| RN-L03 | Cada livro possui pelo menos um exemplar; o tombo do exemplar é único. |
| RN-L04 | O exemplar transita entre `DISPONIVEL`, `EMPRESTADO`, `MANUTENCAO` e `BAIXADO`. |
| RN-L05 | A busca é registrada em `HistoricoBusca` com usuário, termo, filtros, data e quantidade de resultados. |
| RN-L06 | O histórico é pessoal; o aluno vê apenas as próprias buscas e a biblioteca vê o agregado sem identificar preferências sensíveis. |
| RN-L07 | Livro ou exemplar com histórico não é excluído fisicamente; usa status. |
| RN-L08 | O catálogo só é acessível com o módulo habilitado para o grupo e usuário ativo. |

---

## 9. Entidades do modelo

| # | Entidade | Bloco | Papel |
| --- | --- | --- | --- |
| 1 | `Papel` | Núcleo | Permissão global. |
| 2 | `Grupo` | Núcleo | Agrupamento organizacional. |
| 3 | `Usuario` | Núcleo | Identidade e credencial. |
| 4 | `Modulo` | Núcleo | Catálogo de funcionalidades. |
| 5 | `GrupoModulo` | Núcleo | Habilitação N:N. |
| 6 | `Curso` | Acadêmico | Oferta de curso. |
| 7 | `Aluno` | Acadêmico | Perfil discente. |
| 8 | `Professor` | Acadêmico | Perfil docente. |
| 9 | `Turma` | Acadêmico | Oferta de componente. |
| 10 | `Matricula` | Acadêmico | Vínculo aluno/turma. |
| 11 | `Avaliacao` | Avaliações | Instrumento avaliativo. |
| 12 | `GestaoAvaliacao` | Avaliações | Configuração e publicação. |
| 13 | `Questao` | Avaliações | Item da avaliação. |
| 14 | `Alternativa` | Avaliações | Opção objetiva. |
| 15 | `Tentativa` | Avaliações | Execução do aluno. |
| 16 | `RespostaAluno` | Avaliações | Resposta a uma questão. |
| 17 | `Mensalidade` | Financeiro | Cobrança por competência. |
| 18 | `MetodoPagamento` | Financeiro | Forma de pagamento. |
| 19 | `Pagamento` | Financeiro | Baixa total ou parcial. |
| 20 | `Sessao` | Presença | Encontro da turma. |
| 21 | `RegistroPresenca` | Presença | Presença por matrícula. |
| 22 | `Evento` | Agenda | Evento acadêmico. |
| 23 | `GradeHoraria` | Agenda | Horário da turma. |
| 24 | `SolicitacaoAlteracao` | Agenda | Pedido de mudança de horário. |
| 25 | `Acervo` | Biblioteca | Coleção de livros. |
| 26 | `Livro` | Biblioteca | Referência bibliográfica. |
| 27 | `Exemplar` | Biblioteca | Cópia física. |
| 28 | `HistoricoBusca` | Biblioteca | Registro de busca. |

Total: **28 entidades**, acima do mínimo de 10.

---

## 10. Adaptação do projeto existente

A arquitetura em camadas é mantida; o domínio, as tabelas e as telas mudam.

| Tela atual | Nova tela | Conteúdo |
| --- | --- | --- |
| `FormAcesso` | Acesso | Login, grupo, papel e módulos habilitados. |
| `FormPrincipal` | Menu modular | Menu montado a partir dos módulos do grupo. |
| `FormPainel` | Painel acadêmico | Indicadores dos cinco módulos. |
| `FormAcervo` | Biblioteca | Acervo, livros e exemplares. |
| `FormEditoras` | Biblioteca — editoras | Editoras dos livros. |
| `FormEquipe` | Professores | Cadastro docente. |
| `FormPedidos` | Matrículas | Matrícula do aluno na turma. |
| `FormMovimentos` | Financeiro | Mensalidades e pagamentos. |
| `FormBalanco` | Relatórios | Desempenho, inadimplência, frequência e agenda. |
| `FormContas` | Administração de acesso | Usuários, grupos, papéis e módulos. |
| `FormBuscaObra` | Busca no acervo | Busca de livro e exemplar. |

| DAO atual | DAOs do novo domínio |
| --- | --- |
| `AcessoDAO` | `UsuarioDAO`, `GrupoDAO`, `PapelDAO`, `ModuloDAO` |
| `ColaboradorDAO` | `ProfessorDAO` |
| `EditoraDAO` | `EditoraDAO` |
| `ObraDAO` | `AcervoDAO`, `LivroDAO`, `ExemplarDAO` |
| `PedidoDAO` | `MatriculaDAO` |
| `MovimentoDAO` | `MensalidadeDAO`, `PagamentoDAO` |
| — | `CursoDAO`, `AlunoDAO`, `TurmaDAO`, `AvaliacaoDAO`, `TentativaDAO`, `SessaoDAO`, `EventoDAO`, `GradeHorariaDAO` |

---

## 11. Entregáveis

| Arquivo | Conteúdo |
| --- | --- |
| `docs/TEMA_E_REGRAS.md` | Este documento. |
| `docs/MODELO_ER.md` | Dicionário, relacionamentos e cardinalidades. |
| `docs/DIAGRAMA_CLASSES.md` | Classes, atributos, operações e multiplicidades. |
| `docs/diagramas/drawio/EduGestor-Diagramas.drawio` | Arquivo Draw.io com 14 páginas. |
| `docs/diagramas/render/*.svg` | Diagramas vetoriais renderizados. |
| `docs/Entrega-Modelagem-Educacional.pdf` | Documento final. |
| `prototipo/index.html` | Protótipo local navegável. |