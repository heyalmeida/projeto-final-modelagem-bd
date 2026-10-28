# EduGestor — Plataforma de Gestão Acadêmica Modular

Trabalho final da disciplina de Modelagem de Banco de Dados. O tema foi reescrito de uma livraria para uma **faculdade**, com cinco módulos educacionais conectados pelo mesmo núcleo de acesso e pela mesma matrícula.

**Entrega:** tema e regras de negócio, modelo ER, diagrama de classes, arquivo Draw.io com 14 páginas, documento em PDF e o **dashboard navegável em Next.js 15** (pasta `web/`).

---

## Como executar o dashboard

```powershell
cd web
npm install
npm run dev        # http://localhost:3000
```

Build de produção: `npm run build` + `npm start`. Verificações: `npm run lint`, `npm run typecheck` e `npm run verify` (renderiza todas as páginas para todos os perfis e exercita as regras de domínio). Detalhes de arquitetura e funcionalidades em [web/README.md](web/README.md).

### Perfis de demonstração

A tela de acesso lista os oito perfis; não há senha. O grupo define os módulos visíveis, e o menu é montado a partir da matriz de acesso.

| Perfil | Grupo | O que explora |
| --- | --- | --- |
| Ana Beatriz Lima | Alunos | os cinco módulos, tentativas, mensalidades, frequência, agenda e biblioteca |
| Bruno Nogueira | Alunos | os cinco módulos com outro histórico acadêmico |
| Carlos Mendes | Professores | avaliações, chamada, agenda e biblioteca |
| Maria Oliveira | Secretaria | financeiro, presença, agenda e biblioteca |
| João Ferreira | Financeiro | somente o módulo financeiro |
| Lúcia Ramos | Biblioteca | agenda e biblioteca |
| Helena Prado | Coordenação | avaliações, presença, agenda, biblioteca e aprovação de horários |
| Acesso Root | TI | todos os módulos, usuários e a matriz de acesso |

O dashboard é manipulável de ponta a ponta (cobranças, avaliações, sessões, grade, acervo, usuários) e o estado fica no navegador; **Restaurar demonstração** devolve a base original.

---

## Módulos

| Código | Módulo | Entidades principais |
| --- | --- | --- |
| `AVALIACOES` | Avaliações | `Avaliacao`, `GestaoAvaliacao`, `Questao`, `Alternativa`, `Tentativa`, `RespostaAluno` |
| `FINANCEIRO` | Financeiro | `Mensalidade`, `Pagamento`, `MetodoPagamento` |
| `PRESENCA` | Presença | `Sessao`, `RegistroPresenca` |
| `AGENDA` | Agenda | `Evento`, `GradeHoraria`, `SolicitacaoAlteracao` |
| `BIBLIOTECA` | Biblioteca | `Acervo`, `Livro`, `Exemplar`, `HistoricoBusca` |

O núcleo é formado por `Usuario`, `Grupo`, `Papel`, `Modulo` e `GrupoModulo`. A base acadêmica compartilhada contém `Curso`, `Aluno`, `Professor`, `Turma` e `Matricula`.

**Total:** 28 entidades, com regras de negócio por módulo e cardinalidades documentadas.

---

## Diagramas

O arquivo [EduGestor-Diagramas.drawio](docs/diagramas/drawio/EduGestor-Diagramas.drawio) possui 14 páginas:

- 7 páginas de **ER**: Núcleo de Acesso, Base Acadêmica, Avaliações, Financeiro, Presença, Agenda e Biblioteca.
- 7 páginas de **Classes**: as mesmas divisões, com atributos, operações e multiplicidades.

As páginas também estão renderizadas em SVG e PNG em [docs/diagramas/render](docs/diagramas/render). Os geradores em `tools/` (Python) produzem o arquivo Draw.io multipágina e o PDF de entrega.

| Documento | Conteúdo |
| --- | --- |
| [Tema e regras](docs/TEMA_E_REGRAS.md) | Tema reescrito, grupos, matriz de módulos, regras por módulo e adaptação do projeto anterior |
| [Modelo ER](docs/MODELO_ER.md) | Dicionário de entidades, relacionamentos e cardinalidades |
| [Diagrama de classes](docs/DIAGRAMA_CLASSES.md) | Classes, atributos, operações e multiplicidades |
| [Entrega em PDF](docs/Entrega-Modelagem-Educacional.pdf) | Documento final com texto e os 14 diagramas |

---

## Estrutura do repositório

```text
.
├── docs/                       # documentação da entrega
│   ├── TEMA_E_REGRAS.md
│   ├── MODELO_ER.md
│   ├── DIAGRAMA_CLASSES.md
│   ├── Entrega-Modelagem-Educacional.pdf
│   ├── diagramas/
│   │   ├── drawio/             # 14 páginas + arquivo multipágina
│   │   ├── render/             # SVG e PNG renderizados
│   │   └── xml/                # mxGraphModel usado no MCP
│   └── legado/                 # documentação do tema anterior (EntreLivros)
├── web/                        # dashboard Next.js 15 (App Router + TypeScript)
│   ├── src/app/                # rotas, layouts, loading e error boundary
│   ├── src/components/         # ui, layout e componentes por página
│   ├── src/features/           # regras de domínio por módulo
│   ├── src/store/              # estado, sessão, providers e seed
│   ├── _verif/                 # harness de verificação de renderização
│   └── README.md
└── tools/                      # geradores dos diagramas e do PDF (Python)
```

## Requisitos atendidos

- Tema reescrito para o domínio educacional (faculdade).
- Cinco módulos educacionais com entidades próprias.
- 28 entidades no total, acima do mínimo de 10.
- Relacionamentos com cardinalidade no ER.
- Diagrama de classes com atributos, operações e multiplicidades.
- Regras de negócio documentadas por módulo.
- Diagramas separados por módulo em páginas Draw.io.
- Dashboard navegável com autorização por grupo, CRUD em todos os módulos e persistência local.
- Entrega em PDF.