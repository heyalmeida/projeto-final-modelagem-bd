# EduGestor — protótipo local

Protótipo navegável da plataforma acadêmica modular. Usa HTML, CSS e JavaScript puros, sem dependências externas, e guarda o estado no `localStorage` do navegador.

## Como executar

Na raiz do repositório:

```powershell
powershell -ExecutionPolicy Bypass -File .\executar-prototipo.ps1
```

O script inicia um servidor local e abre `http://localhost:8765/`. Também é possível executar manualmente:

```powershell
python -m http.server 8765 --directory prototipo
```

Depois acesse `http://localhost:8765/`.

## Perfis de demonstração

| Perfil | Login | Grupo | Módulos |
| --- | --- | --- | --- |
| Ana Beatriz | `ana.aluno` | Alunos | Avaliações, Financeiro, Presença, Agenda, Biblioteca |
| Bruno Nogueira | `bruno.aluno` | Alunos | Os cinco módulos |
| Carlos Mendes | `carlos.prof` | Professores | Avaliações, Presença, Agenda, Biblioteca |
| Maria Oliveira | `maria.secretaria` | Secretaria | Financeiro, Presença, Agenda, Biblioteca |
| João Ferreira | `joao.financeiro` | Financeiro | Financeiro |
| Lúcia Ramos | `lucia.biblioteca` | Biblioteca | Agenda, Biblioteca |
| Helena Prado | `helena.coordenacao` | Coordenação | Avaliações, Presença, Agenda, Biblioteca |
| Root | `root` | TI | Todos + administração |

A senha não é solicitada: o protótipo simula a escolha de um perfil. A matriz de módulos pode ser alterada em **Acesso e módulos** quando a sessão é `root`.

## O que está implementado

- **Painel** com indicadores, pendências e atalhos por módulo.
- **Avaliações**: tentativa com questões objetivas, cálculo de nota, limite de tentativas, publicação e encerramento, visualização de resultados e estatísticas.
- **Financeiro**: mensalidades por competência, pagamento total ou parcial, atualização de status, histórico e métodos.
- **Presença**: sessões, chamada por matrícula, justificativa, frequência e encerramento/reabertura.
- **Agenda**: grade semanal, eventos, solicitação de alteração, aprovação/rejeição e atualização da sala.
- **Biblioteca**: acervos, livros, exemplares, disponibilidade, detalhes e histórico de buscas.
- **Acesso**: matriz grupo × módulo, papéis e usuários.
- **Persistência local**: as alterações ficam no navegador; o botão **Restaurar demonstração** volta aos dados originais.

## Testes no navegador

Com o servidor em execução, abra:

- `http://localhost:8765/tests/smoke.html` — fluxos principais de aluno, professor, secretaria e root.
- `http://localhost:8765/tests/routes.html` — todas as rotas de todos os perfis, bloqueios de módulo e largura móvel de 390 px.

Os testes escrevem `PASS`/`FAIL` na página e definem o título `TEST_OK` ou `ROUTES_OK` quando tudo passa.

## Estrutura

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Estrutura, ícones SVG e pontos de montagem. |
| `styles.css` | Layout responsivo, componentes, tabelas, modais e temas. |
| `data.js` | Dados fictícios dos cinco módulos e do núcleo acadêmico. |
| `app.js` | Rotas por hash, autorização por grupo, estado e interações. |
| `tests/` | Roteiros de fumaça e de rotas. |

## Limites do protótipo

- Os dados são fictícios e vivem no navegador.
- O login é uma seleção de perfil; não há autenticação real.
- Ações sensíveis são simuladas com estado local, sem chamadas de servidor.
- O código C# existente permanece como referência de arquitetura; esta entrega concentra tema, modelagem e protótipo web.