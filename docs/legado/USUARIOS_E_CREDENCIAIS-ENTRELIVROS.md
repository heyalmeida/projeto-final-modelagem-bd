# Usuários e Credenciais — EntreLivros

Este documento explica como funciona o controle de acesso do sistema
**EntreLivros**: os tipos de usuário, o que cada um pode fazer, as
credenciais padrão criadas automaticamente e como o administrador
gerencia as contas.

---

## 1. Onde os usuários ficam guardados

Os acessos ficam na tabela **`tb_acessos`** do banco SQLite
(`EntreLivrosDB.db`, criado automaticamente na pasta do executável):

| Coluna | Tipo | Descrição |
| --- | --- | --- |
| `cod_acesso` | INTEGER PK | Identificador da conta |
| `usuario` | TEXT UNIQUE | Nome de login (não pode repetir) |
| `senha` | TEXT | Senha em texto simples (mínimo 4 caracteres) |
| `perfil` | TEXT | Um dos 3 perfis, garantido por `CHECK` |

O banco impede perfis inválidos diretamente no schema:

```sql
perfil TEXT NOT NULL DEFAULT 'FUNCIONARIO'
        CHECK (perfil IN ('ADMIN','FUNCIONARIO','USUARIO'))
```

---

## 2. Credenciais padrão (criadas automaticamente)

Na primeira execução o sistema cria **três contas de demonstração** —
uma de cada perfil:

| Usuário | Senha | Perfil |
| --- | --- | --- |
| **admin** | **admin123** | ADMIN |
| **vendedor** | **loja123** | FUNCIONARIO |
| **consulta** | **ver123** | USUARIO |

> Se o banco já existir de uma versão antiga, a **migração automática**
> (executada ao abrir a tela de login) adiciona a coluna `perfil` e
> garante que essas três contas existam, sem apagar dados.

⚠️ **Para a apresentação/entrega:** se quiser trocar as senhas, entre
como `admin` e altere na tela **Contas de Acesso**.

---

## 3. Os três perfis e o que cada um pode fazer

### Matriz de permissões das 8 telas

| # | Tela | ADMIN | FUNCIONARIO | USUARIO |
| --- | --- | :---: | :---: | :---: |
| 1 | Painel | ✔ | ✔ | ✔ |
| 2 | Acervo de Obras | ✔ completo | ✔ sem **Remover** | ✔ somente consulta |
| 3 | Editoras | ✔ | ✘ | ✘ |
| 4 | Equipe | ✔ | ✘ | ✘ |
| 5 | Pedidos | ✔ | ✔ | ✘ |
| 6 | Movimentos de Estoque | ✔ | ✔ | ✘ |
| 7 | Balanço | ✔ | ✔ | ✔ |
| 8 | Contas de Acesso | ✔ | ✘ | ✘ |

### Resumo por perfil

**ADMIN — acesso total**
- Usa todas as 8 telas com todos os botões;
- Único perfil que gerencia **Editoras**, **Equipe** e **Contas de Acesso**;
- Único que pode **remover obras** do acervo.

**FUNCIONARIO — operação da loja**
- Usa Painel, Acervo, Pedidos, Movimentos e Balanço;
- Pode **cadastrar e alterar** obras, mas **não pode remover** (o botão
  Remover fica desabilitado no Acervo);
- Não vê Editoras, Equipe nem Contas de Acesso.

**USUARIO — somente consulta**
- Usa apenas Painel, Acervo (leitura) e Balanço;
- No Acervo todos os botões de edição (Gravar/Alterar/Remover/Limpar)
  ficam desabilitados — ele apenas visualiza a lista;
- Não registra pedidos nem movimenta estoque.

---

## 4. Como a validação acontece (3 camadas)

O perfil vem do banco no momento do login (`AcessoDAO.ValidarCredenciais`)
e é validado em **três pontos**, para que nenhuma tela seja acessada
indevidamente:

1. **Menu lateral** (`FormPrincipal.AplicarPermissoes`) — os botões das
   telas que o perfil não pode usar ficam **ocultos**;
2. **Clique no botão** — mesmo que o botão apareça, o clique **revalida**
   o perfil e exibe a mensagem *"Seu perfil (X) não tem permissão para…"*;
3. **Dentro da tela** — cada tela restrita **revalida no construtor** e
   lança `UnauthorizedAccessException` se o perfil não for permitido
   (Editoras, Equipe, Contas, Pedidos e Movimentos); o Acervo, que é
   compartilhado, **desabilita os botões** conforme o perfil.

O nome do operador e o perfil aparecem sempre no topo da navegação
lateral: `Operador: admin (ADMIN)`.

---

## 5. Gerenciando contas (somente ADMIN)

Na tela **Contas de Acesso** o administrador pode:

- **Gravar** — criar uma nova conta (usuário + senha + perfil);
- **Alterar** — trocar senha e/ou perfil de uma conta existente;
- **Remover** — excluir uma conta.

Regras de negócio aplicadas:

| Regra | Onde |
| --- | --- |
| Nome de usuário não pode repetir | `UNIQUE` no banco + mensagem amigável |
| Senha mínima de 4 caracteres | validação antes de gravar |
| Perfil tem que ser ADMIN, FUNCIONARIO ou USUARIO | validação + `CHECK` no banco |
| **Não é possível remover o último ADMIN** | bloqueio no `AcessoDAO.Remover` |

> O bloqueio do último administrador evita que o sistema fique sem
> nenhuma conta capaz de gerenciar os acessos.

---

## 6. Fluxo de autenticação (resumo técnico)

```
Executável inicia
   └─> FormAcesso (login) é aberto
         └─ Load: BancoDeDados.InicializarBanco()  (cria/migra o banco)
         └─ Usuário digita login/senha e clica em "Acessar sistema"
               └─ AcessoDAO.ValidarCredenciais(usuario, senha)
                     ├─ null  -> "Credenciais não reconhecidas."
                     └─ Acesso (com perfil)
                           └─> FormPrincipal(usuario, perfil)
                                 ├─ AplicarPermissoes()  (menu filtrado)
                                 └─ Abre o FormPainel automaticamente
```

- A consulta usa **parâmetros SQL** (`@usuario`, `@senha`) — sem risco
  de SQL Injection;
- Todo o fluxo está protegido por `try/catch` com mensagens claras.

---

## 7. Perguntas rápidas

**Esqueci a senha do admin. E agora?**
Apague o arquivo `EntreLivrosDB.db` — na próxima execução o banco é
recriado com as credenciais padrão (perde os dados de demonstração).
Alternativa: abra o banco com qualquer ferramenta SQLite e altere a
linha em `tb_acessos`.

**Posso criar mais administradores?**
Sim. Entre como `admin` → Contas de Acesso → Gravar com perfil ADMIN.

**Como testo os três perfis rapidamente?**
Rode o sistema e faça login 3 vezes, na ordem: `admin/admin123`
(tudo liberado) → `vendedor/loja123` (menu com 5 telas, sem Remover no
Acervo) → `consulta/ver123` (menu com 3 telas, Acervo apenas leitura).
