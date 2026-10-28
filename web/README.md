# EduGestor — dashboard em Next.js 15

Dashboard administrativo do EduGestor em **Next.js 15 (App Router) + TypeScript + Tailwind CSS + daisyUI + lucide-react** — evolução do protótipo local (HTML/React sem build), que foi desativado após este porte.

A identidade visual, as regras de negócio e o roteiro de demonstração são os mesmos do protótipo original. O que mudou é a arquitetura: rotas reais, componentes por página, domínio isolado em `features/` e tipagem de ponta a ponta.

## Como executar

```bash
cd web
npm install
npm run dev          # http://localhost:3000
```

Build de produção:

```bash
npm run build
npm start
```

### Verificações

| Comando | O que faz |
| --- | --- |
| `npm run lint` | ESLint (ESLint CLI, sem warnings) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | build de produção + checagem de tipos |
| `npm run verify` | renderiza as 7 páginas para os 8 perfis e valida regras de domínio |

`npm run verify` sobe um runtime de verificação (pasta `_verif/`) que transpila TS/TSX com o TypeScript instalado, resolve o alias `@/` e troca `next/link`, `next/image` e `next/navigation` por mocks. Ele falha se alguma página quebrar, se um bloqueio de módulo deixar de aparecer ou se um contador da navegação divergir dos dados.

## O que dá para fazer no dashboard

O dashboard é manipulável de ponta a ponta; toda alteração é persistida no `localStorage` do navegador e sobrevive ao recarregamento. Para voltar ao estado original existe **Restaurar demonstração** — na sidebar (qualquer perfil) e em **Acesso e módulos** (root).

| Módulo | Criar | Manipular |
| --- | --- | --- |
| Painel | — | gráficos de previsto × recebido e cobranças por status (recorte do perfil) |
| Avaliações | avaliação com questões objetivas dinâmicas, janela, peso e gestão de tentativas | editar/excluir rascunho, publicar, encerrar, tentativa do aluno com correção; gráfico de média por avaliação |
| Financeiro | lançamento de cobrança (matrícula, competência, vencimento, valor, desconto) | baixa total/parcial, **estorno de pagamento**, filtros; gráfico previsto × recebido e rosca de status |
| Presença | nova sessão de aula (turma, data, janela, tema) | chamada por matrícula com justificativa, encerrar/reabrir; rosca de distribuição para o aluno |
| Agenda | horário novo na grade (com validação de choque para turma e professor), evento acadêmico | editar horário, inativar/reativar, remover evento, solicitar alteração com aprovação da coordenação |
| Biblioteca | título (com tombamento de exemplares) e acervo | situação do exemplar (disponível, emprestado, manutenção, baixado), adicionar exemplar, busca com histórico |
| Acesso | usuário de demonstração (papel herdado do grupo) | matriz grupo × módulo em tempo real |

## Perfis de demonstração

A tela de acesso lista os oito perfis; não há senha. O grupo define os módulos visíveis e o menu é montado a partir da matriz de acesso.

| Perfil | Grupo | Módulos |
| --- | --- | --- |
| Ana Beatriz Lima | Alunos | os cinco |
| Bruno Nogueira | Alunos | os cinco |
| Carlos Mendes | Professores | avaliações, presença, agenda, biblioteca |
| Maria Oliveira | Secretaria | financeiro, presença, agenda, biblioteca |
| João Ferreira | Financeiro | financeiro |
| Lúcia Ramos | Biblioteca | agenda, biblioteca |
| Helena Prado | Coordenação | avaliações, presença, agenda, biblioteca |
| Acesso Root | TI | os cinco + acesso |

## Arquitetura

```text
src/
├── app/
│   ├── (auth)/layout.tsx           # redireciona quem já tem sessão
│   ├── (auth)/login/page.tsx       # composição: LoginHero + ProfilePicker
│   ├── (dashboard)/layout.tsx      # shell: sessão, Sidebar, Header, ViewerProvider
│   ├── (dashboard)/painel/         # page.tsx + loading.tsx
│   ├── (dashboard)/avaliacoes/     # + financeiro, presenca, agenda, biblioteca, acesso
│   ├── error.tsx                   # error boundary do dashboard
│   ├── layout.tsx                  # providers globais + metadata
│   ├── not-found.tsx
│   └── globals.css
├── components/
│   ├── ui/                         # Button, Card, Modal, DataTable, Tabs, Badge, KpiCard...
│   ├── layout/                     # Sidebar, Header, Navigation, PageHeader, ModuleGuard
│   ├── auth/ painel/ avaliacoes/ financeiro/ presenca/ agenda/ biblioteca/ acesso/
├── features/
│   ├── core/                       # lookups e recorte de turmas/matrículas (núcleo acadêmico)
│   ├── auth/                       # perfis de demonstração + hook de login
│   ├── painel/                     # resumo do dashboard (indicadores, pendências, destaque)
│   ├── avaliacoes/ financeiro/ presenca/ agenda/ biblioteca/ acesso/
│   │   ├── selectors.ts            # leitura e regras de domínio (puras)
│   │   ├── schemas.ts              # validação com zod
│   │   ├── types.ts                # tipos da funcionalidade
│   │   └── hooks/                  # ações de escrita + estado de formulário
├── constants/                      # ícones, status, navegação, imagens
├── config/site.ts                  # nome, período, data de referência, regras de aprovação
├── lib/                            # auth (permissões), storage, utils (formatação/CN)
├── providers/                      # AppProviders, ToastProvider
├── store/                          # AppStoreProvider, ViewerProvider, seed
└── types/                          # contrato de dados (espelha o modelo ER)
```

### Decisões

**Páginas compostas, não monolíticas.** Cada `page.tsx` só orquestra seções. Páginas com estado compartilhado entre seções (abas, filtros, modais) expõem um `*Board` — `AvaliacoesBoard`, `FinanceiroBoard`, `AgendaBoard`, `BibliotecaBoard`, `PresencaBoard` — que mantém o estado e renderiza as seções.

**Domínio em `features/`.** `selectors.ts` concentra leitura e regra (saldo devedor, status derivado de mensalidade, frequência, janela de tentativa, mídia ponderada). `hooks/use-*-actions.ts` concentra escrita: recebem a intenção da tela, validam com zod e aplicam a mutação. Componentes não calculam regra de negócio.

**Server Components por padrão.** `app/layout.tsx` é servidor; só o que depende de sessão, rota ativa ou interação carrega `"use client"`. Os shells de layout são client components porque a sessão vive no `localStorage` (mesma premissa do protótipo).

**Autorização em três camadas.** O menu esconde o módulo (matriz grupo × módulo), `ModuleGuard` revalida a rota digitada e cada seletor recorta os dados pelo vínculo do usuário (aluno, professor, servidor). `src/lib/auth.ts` é a única fonte das regras de papel.

**Estado único e pequeno.** `AppStoreProvider` expõe `data`, `session`, `user`, `hydrated` e três escritas (`mutate`, `login`, `logout`). As mutações trabalham sobre um clone tipado do estado e persistem em `localStorage`. `ViewerProvider` garante `user` não nulo dentro do dashboard.

**Validação com zod.** Telas de escrita (tentativa, pagamento, chamada, solicitação de agenda) validam em `schemas.ts` e devolvem `{ ok: false, error }` para o formulário exibir a mensagem — sem exceções no fluxo de UI.

### Tipografia e imagens

- Títulos em serifa (Georgia) com peso 600: a haste fina do Palatino prejudicava a leitura em projeção.
- Escala de texto revisada (+12% nos tamanhos pequenos) e cinzas um tom mais escuros, pensando em datashow.
- Imagens de apoio vêm do Unsplash e ficam em `src/constants/images.ts`. As capas do acervo caem para o degradê do cartão se o provedor estiver indisponível (`CoverImage`).

## Diferenças em relação ao protótipo

| Protótipo | Next.js |
| --- | --- |
| rotas por hash (`#/painel`) | rotas do App Router (`/painel`) |
| estado global mutável + `notify()` | `AppStoreProvider` com clone imutável e `mutate` |
| modal global com `body()`/`footer()` | modal dirigido por estado local + `Modal` acessível |
| dados em `data.js` | `src/store/seed.ts` tipado, com geração determinística |
| busca do cabeçalho via variável global | `/biblioteca?busca=...` lido com `useSearchParams` |
| login por seleção de perfil | igual, com redirecionamento de rota no layout |

A tabela acima preserva o histórico do porte. O protótipo original (HTML/React sem build) foi removido do repositório após o porte; esta pasta é a versão vigente do produto.