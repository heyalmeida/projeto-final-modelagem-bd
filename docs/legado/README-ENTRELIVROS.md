# EntreLivros — Sistema de Controle de Livraria

Trabalho final da disciplina de Desenvolvimento de Sistemas.
**WinForms (.NET Framework 4.7.2) + SQLite**, arquitetura em camadas
(`Models`, `DAO`, `Utils`, `Forms`).

> O SQLite é **embutido** (não exige servidor instalado): o banco inteiro
> fica em um único arquivo `EntreLivrosDB.db` junto ao executável —
> basta copiar o `.exe` + `.db` para apresentar em outro computador.

## Como executar

### Sem Visual Studio (Windows + SDK do .NET)

1. Instale o SDK do .NET 8 (uma vez só):
   `winget install Microsoft.DotNet.SDK.8` ou
   <https://dotnet.microsoft.com/download>.
2. Na raiz do repositório, rode:

   ```powershell
   powershell -ExecutionPolicy Bypass -File .\executar.ps1
   ```

O script baixa os pacotes NuGet e as reference assemblies do .NET Framework
4.7.2 (na primeira execução), compila com o MSBuild do SDK e abre o sistema.
Use `-SomenteCompilar` para gerar apenas o executável em
`ProjetoFinal-C#\ProjetoFinal-C#\bin\Debug`. O Windows 10/11 já traz o
runtime .NET Framework 4.8 necessário para rodar.

### Com Visual Studio 2022+

1. Abra a solução no Visual Studio 2022+.
2. Restaure o pacote NuGet `Stub.System.Data.SQLite.Core.NetFramework`
   (restauração automática ao compilar; a pasta `packages/` é gerada).
3. Compile e execute (F5).

Nos dois casos, o banco `EntreLivrosDB.db` é criado automaticamente na
pasta do executável na primeira execução (uma cópia pronta com dados de
demonstração está na raiz do repositório: `EntreLivrosDB.db`).

## Usuários e perfis de acesso (3 tipos validados no login)

> Guia completo de funcionamento, credenciais e gerenciamento de contas:
> **[USUARIOS_E_CREDENCIAIS.md](USUARIOS_E_CREDENCIAIS.md)**

| Usuário | Senha | Perfil | O que pode usar |
| --- | --- | --- | --- |
| `admin` | `admin123` | **ADMIN** | As 8 telas, com poderes totais |
| `vendedor` | `loja123` | **FUNCIONARIO** | 5 telas (sem Editoras, Equipe e Contas) e sem remover obras |
| `consulta` | `ver123` | **USUARIO** | Apenas Painel, Acervo (consulta) e Balanço |

## As 8 telas funcionais e a matriz de permissões

| # | Tela | Form | ADMIN | FUNCIONARIO | USUARIO | Função |
| --- | --- | --- | :---: | :---: | :---: | --- |
| 1 | Painel | `FormPainel` | ✔ | ✔ | ✔ | Indicadores: obras, acervo, valor, pedidos do dia, faturamento 30 dias, alerta de obras sem estoque |
| 2 | Acervo de Obras | `FormAcervo` | ✔ | ✔ (sem Remover) | ✔ (só consulta) | Cadastro/edição/remoção de obras |
| 3 | Editoras | `FormEditoras` | ✔ | ✘ | ✘ | Cadastro de editoras |
| 4 | Equipe | `FormEquipe` | ✔ | ✘ | ✘ | Cadastro de colaboradores |
| 5 | Pedidos | `FormPedidos` | ✔ | ✔ | ✘ | Vendas com abatimento por item e baixa de estoque |
| 6 | Movimentos de Estoque | `FormMovimentos` | ✔ | ✔ | ✘ | Entradas/saídas manuais + histórico |
| 7 | Balanço | `FormBalanco` | ✔ | ✔ | ✔ | Relatório por período, faturamento e ticket médio |
| 8 | Contas de Acesso | `FormContas` | ✔ | ✘ | ✘ | Criar/editar/remover contas e definir perfis |

> A validação acontece em **três camadas**: o menu lateral oculta o que o
> perfil não pode usar; o clique no botão revalida; e a própria tela
> revalida no construtor (bloqueando com `UnauthorizedAccessException`)
> ou desabilitando botões específicos (ex.: USUARIO não edita o acervo,
> FUNCIONARIO não remove obras).

Também há telas de apoio: **Acesso** (`FormAcesso`, login — que também
prepara o banco de dados automaticamente ao abrir) e **Busca de Obra**
(`FormBuscaObra`, popup modal do pedido).

## Banco de dados

7 tabelas (`tb_editoras`, `tb_obras`, `tb_equipe`, `tb_acessos`,
`tb_pedidos`, `tb_pedido_itens`, `tb_movimento_estoque`) com chaves
estrangeiras, checks e índices — detalhes em
[DOCUMENTACAO_BANCO_DE_DADOS.md](DOCUMENTACAO_BANCO_DE_DADOS.md).

## Boas práticas aplicadas

- 100% das queries parametrizadas (sem SQL injection);
- `try/catch` em todas as operações de banco com mensagens claras;
- validação de dados antes do DAO, com cultura pt-BR (vírgula decimal);
- transação com rollback no registro de pedidos e movimentações;
- grids recarregados automaticamente após gravação/alteração/remoção;
- banco portável em arquivo único (sem instalação de servidor);
- permissões por perfil validadas no menu, no clique e dentro de cada tela.