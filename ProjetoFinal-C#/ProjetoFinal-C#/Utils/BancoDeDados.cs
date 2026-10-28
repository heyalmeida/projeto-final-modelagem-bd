using System;
using System.Data.SQLite;
using System.IO;

namespace ProjetoFinal_C_.Utils
{
    /// <summary>
    /// Camada de acesso ao banco SQLite do EntreLivros.
    /// O arquivo EntreLivrosDB.db fica junto ao executável e é criado
    /// automaticamente na primeira execução, com o esquema completo e
    /// dados de demonstração.
    /// </summary>
    public static class BancoDeDados
    {
        private static readonly string CaminhoBanco =
            Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "EntreLivrosDB.db");

        private static bool _jaVerificado;

        /// <summary>
        /// Cria/verifica o banco. Chamado pela tela de abertura.
        /// </summary>
        public static void InicializarBanco()
        {
            GarantirBanco();
        }

        /// <summary>
        /// Devolve uma conexão ABERTA com chaves estrangeiras ativas.
        /// </summary>
        public static SQLiteConnection ObterConexao()
        {
            GarantirBanco();

            SQLiteConnection conexao = new SQLiteConnection(
                "Data Source=" + CaminhoBanco + ";Version=3;");
            conexao.Open();

            using (SQLiteCommand pragma = new SQLiteCommand(
                "PRAGMA foreign_keys = ON;", conexao))
            {
                pragma.ExecuteNonQuery();
            }

            return conexao;
        }

        private static void GarantirBanco()
        {
            if (_jaVerificado)
            {
                return;
            }

            if (!File.Exists(CaminhoBanco))
            {
                SQLiteConnection.CreateFile(CaminhoBanco);

                using (SQLiteConnection conexao = new SQLiteConnection(
                    "Data Source=" + CaminhoBanco + ";Version=3;"))
                {
                    conexao.Open();
                    using (SQLiteTransaction tr = conexao.BeginTransaction())
                    {
                        try
                        {
                            MontarEsquema(conexao, tr);
                            SemearDados(conexao, tr);
                            tr.Commit();
                        }
                        catch
                        {
                            tr.Rollback();
                            throw;
                        }
                    }
                }
            }
            else
            {
                // Banco já existe: aplica migrações de versões anteriores
                // (por exemplo, inclusão da coluna perfil em tb_acessos).
                using (SQLiteConnection conexao = new SQLiteConnection(
                    "Data Source=" + CaminhoBanco + ";Version=3;"))
                {
                    conexao.Open();
                    MigrarBancoExistente(conexao);
                }
            }

            _jaVerificado = true;
        }

        /// <summary>
        /// Migra bancos criados por versões antigas do sistema:
        /// 1) adiciona a coluna perfil em tb_acessos (se faltar);
        /// 2) garante os três acessos padrão (admin, vendedor, consulta).
        /// </summary>
        private static void MigrarBancoExistente(SQLiteConnection cn)
        {
            try
            {
                bool temPerfil = false;
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "PRAGMA table_info(tb_acessos);", cn))
                using (SQLiteDataReader leitor = cmd.ExecuteReader())
                {
                    while (leitor.Read())
                    {
                        if (leitor["name"].ToString().Equals("perfil",
                            StringComparison.OrdinalIgnoreCase))
                        {
                            temPerfil = true;
                        }
                    }
                }

                using (SQLiteTransaction tr = cn.BeginTransaction())
                {
                    try
                    {
                        if (!temPerfil)
                        {
                            using (SQLiteCommand cmd = new SQLiteCommand(
                                "ALTER TABLE tb_acessos ADD COLUMN perfil TEXT NOT NULL " +
                                "DEFAULT 'FUNCIONARIO';", cn, tr))
                            {
                                cmd.ExecuteNonQuery();
                            }
                        }

                        string[,] acessos =
                        {
                            { "admin",    "admin123", "ADMIN" },
                            { "vendedor", "loja123",  "FUNCIONARIO" },
                            { "consulta", "ver123",   "USUARIO" }
                        };
                        for (int i = 0; i < acessos.GetLength(0); i++)
                        {
                            string login = acessos[i, 0], senha = acessos[i, 1],
                                   perfil = acessos[i, 2];
                            using (SQLiteCommand cmd = new SQLiteCommand(
                                "INSERT OR IGNORE INTO tb_acessos (usuario, senha, perfil) " +
                                "VALUES (@a, @b, @c);", cn, tr))
                            {
                                cmd.Parameters.AddWithValue("@a", login);
                                cmd.Parameters.AddWithValue("@b", senha);
                                cmd.Parameters.AddWithValue("@c", perfil);
                                cmd.ExecuteNonQuery();
                            }
                        }

                        tr.Commit();
                    }
                    catch
                    {
                        tr.Rollback();
                        throw;
                    }
                }
            }
            catch (Exception)
            {
                // Problemas na migração não devem impedir o uso do sistema;
                // o login falhará com mensagem clara se a estrutura estiver
                // incompatível.
            }
        }

        private static void MontarEsquema(SQLiteConnection cn, SQLiteTransaction tr)
        {
            string[] blocos =
            {
                "CREATE TABLE tb_editoras (" +
                " cod_editora    INTEGER PRIMARY KEY AUTOINCREMENT," +
                " nome_editora   TEXT NOT NULL UNIQUE," +
                " cidade_editora TEXT NOT NULL);",

                "CREATE TABLE tb_obras (" +
                " cod_obra       INTEGER PRIMARY KEY AUTOINCREMENT," +
                " nome_obra      TEXT NOT NULL," +
                " nome_autor     TEXT NOT NULL," +
                " cod_editora    INTEGER NOT NULL," +
                " codigo_barras  TEXT NOT NULL UNIQUE," +
                " categoria      TEXT NOT NULL," +
                " valor_unitario REAL NOT NULL CHECK (valor_unitario > 0)," +
                " qtd_acervo     INTEGER NOT NULL CHECK (qtd_acervo >= 0)," +
                " ano_publicacao INTEGER," +
                " FOREIGN KEY (cod_editora) REFERENCES tb_editoras(cod_editora));",

                "CREATE TABLE tb_equipe (" +
                " cod_colaborador  INTEGER PRIMARY KEY AUTOINCREMENT," +
                " nome_colaborador TEXT NOT NULL," +
                " num_cpf          TEXT NOT NULL UNIQUE," +
                " funcao           TEXT NOT NULL," +
                " remuneracao      REAL NOT NULL CHECK (remuneracao > 0)," +
                " dt_contratacao   TEXT NOT NULL," +
                " num_telefone     TEXT);",

                "CREATE TABLE tb_acessos (" +
                " cod_acesso INTEGER PRIMARY KEY AUTOINCREMENT," +
                " usuario    TEXT NOT NULL UNIQUE," +
                " senha      TEXT NOT NULL," +
                " perfil     TEXT NOT NULL DEFAULT 'FUNCIONARIO' CHECK (perfil IN ('ADMIN','FUNCIONARIO','USUARIO')));",

                "CREATE TABLE tb_pedidos (" +
                " cod_pedido      INTEGER PRIMARY KEY AUTOINCREMENT," +
                " dt_hora_pedido  TEXT NOT NULL," +
                " cod_colaborador INTEGER NOT NULL," +
                " nome_cliente    TEXT," +
                " forma_pagamento TEXT NOT NULL DEFAULT 'Dinheiro'," +
                " valor_total     REAL NOT NULL CHECK (valor_total >= 0)," +
                " FOREIGN KEY (cod_colaborador) REFERENCES tb_equipe(cod_colaborador));",

                "CREATE TABLE tb_pedido_itens (" +
                " cod_item       INTEGER PRIMARY KEY AUTOINCREMENT," +
                " cod_pedido     INTEGER NOT NULL," +
                " cod_obra       INTEGER NOT NULL," +
                " qtd_vendida    INTEGER NOT NULL CHECK (qtd_vendida > 0)," +
                " valor_cobrado  REAL NOT NULL CHECK (valor_cobrado > 0)," +
                " abatimento_pct REAL NOT NULL DEFAULT 0 CHECK (abatimento_pct BETWEEN 0 AND 100)," +
                " valor_liquido  REAL NOT NULL," +
                " FOREIGN KEY (cod_pedido) REFERENCES tb_pedidos(cod_pedido)," +
                " FOREIGN KEY (cod_obra) REFERENCES tb_obras(cod_obra));",

                "CREATE TABLE tb_movimento_estoque (" +
                " cod_movimento     INTEGER PRIMARY KEY AUTOINCREMENT," +
                " cod_obra          INTEGER NOT NULL," +
                " tipo_movimento    TEXT NOT NULL CHECK (tipo_movimento IN ('ENTRADA','SAIDA'))," +
                " qtd_movimentada   INTEGER NOT NULL CHECK (qtd_movimentada > 0)," +
                " dt_hora_movimento TEXT NOT NULL," +
                " origem_movimento  TEXT NOT NULL," +
                " FOREIGN KEY (cod_obra) REFERENCES tb_obras(cod_obra));",

                "CREATE INDEX ix_obra_editora ON tb_obras(cod_editora);",
                "CREATE INDEX ix_pedido_colaborador ON tb_pedidos(cod_colaborador);",
                "CREATE INDEX ix_pedido_data ON tb_pedidos(dt_hora_pedido);",
                "CREATE INDEX ix_item_pedido ON tb_pedido_itens(cod_pedido);",
                "CREATE INDEX ix_item_obra ON tb_pedido_itens(cod_obra);",
                "CREATE INDEX ix_movto_obra ON tb_movimento_estoque(cod_obra);"
            };

            foreach (string sql in blocos)
            {
                using (SQLiteCommand cmd = new SQLiteCommand(sql, cn, tr))
                {
                    cmd.ExecuteNonQuery();
                }
            }
        }

        private static void SemearDados(SQLiteConnection cn, SQLiteTransaction tr)
        {
            // Três tipos de acesso: ADMIN (tudo), FUNCIONARIO (operação)
            // e USUARIO (somente consulta).
            string[,] acessos =
            {
                { "admin",       "admin123", "ADMIN" },
                { "vendedor",    "loja123",  "FUNCIONARIO" },
                { "consulta",    "ver123",   "USUARIO" }
            };
            for (int i = 0; i < acessos.GetLength(0); i++)
            {
                string login = acessos[i, 0], senha = acessos[i, 1], perfil = acessos[i, 2];
                Executar(cn, tr,
                    "INSERT INTO tb_acessos (usuario, senha, perfil) VALUES (@a, @b, @c);",
                    p =>
                    {
                        p.AddWithValue("@a", login);
                        p.AddWithValue("@b", senha);
                        p.AddWithValue("@c", perfil);
                    });
            }

            string[,] editoras =
            {
                { "Editora Globo", "Porto Alegre" },
                { "Companhia das Letras", "São Paulo" },
                { "Editora Record", "Rio de Janeiro" },
                { "Editora Rocco", "Rio de Janeiro" }
            };
            for (int i = 0; i < editoras.GetLength(0); i++)
            {
                string nome = editoras[i, 0], cidade = editoras[i, 1];
                Executar(cn, tr,
                    "INSERT INTO tb_editoras (nome_editora, cidade_editora) VALUES (@a, @b);",
                    p => { p.AddWithValue("@a", nome); p.AddWithValue("@b", cidade); });
            }

            string[,] obras =
            {
                { "Vidas Secas", "Graciliano Ramos", "1", "9788508136061", "Ficção Regionalista", "36,50", "12", "1938" },
                { "Capitães da Areia", "Jorge Amado", "1", "9788508090393", "Ficção Regionalista", "42,00", "7", "1937" },
                { "A Hora da Estrela", "Clarice Lispector", "2", "9788535926209", "Contemporâneo", "29,90", "15", "1977" },
                { "Ensaio sobre a Cegueira", "José Saramago", "2", "9788535914873", "Contemporâneo", "54,90", "9", "1995" },
                { "O Alquimista", "Paulo Coelho", "3", "9788508015293", "Ficção", "39,70", "20", "1988" },
                { "Mar Morto", "Jorge Amado", "1", "9788508040707", "Ficção Regionalista", "44,30", "4", "1936" },
                { "Harry Potter e a Pedra Filosofal", "J. K. Rowling", "4", "9788532530783", "Fantasia", "59,90", "11", "1997" },
                { "O Pequeno Príncipe", "Antoine de Saint-Exupéry", "3", "9788501004430", "Infantil", "27,50", "18", "1943" }
            };
            for (int i = 0; i < obras.GetLength(0); i++)
            {
                string o = obras[i, 0], a = obras[i, 1], e = obras[i, 2],
                       cb = obras[i, 3], cat = obras[i, 4], v = obras[i, 5],
                       q = obras[i, 6], ano = obras[i, 7];
                Executar(cn, tr,
                    "INSERT INTO tb_obras (nome_obra, nome_autor, cod_editora, codigo_barras, " +
                    "categoria, valor_unitario, qtd_acervo, ano_publicacao) " +
                    "VALUES (@a, @b, @c, @d, @e, @f, @g, @h);",
                    p =>
                    {
                        p.AddWithValue("@a", o); p.AddWithValue("@b", a); p.AddWithValue("@c", int.Parse(e)); p.AddWithValue("@d", cb);
                        p.AddWithValue("@e", cat);
                        p.AddWithValue("@f", decimal.Parse(v, System.Globalization.CultureInfo.GetCultureInfo("pt-BR")));
                        p.AddWithValue("@g", int.Parse(q)); p.AddWithValue("@h", int.Parse(ano));
                    });
            }

            string[,] equipe =
            {
                { "Beatriz Camargo", "111.222.333-44", "Atendente", "2200,00", "2021-03-08", "(51) 99876-1122" },
                { "Rafael Toledo", "222.333.444-55", "Caixa", "2450,00", "2022-07-19", "(51) 99655-3344" },
                { "Celina Ferraz", "333.444.555-66", "Gerente de Loja", "5200,00", "2019-11-02", "(51) 99433-8890" },
                { "Otávio Braga", "444.555.666-77", "Repositor", "1980,00", "2023-02-14", "(51) 99211-7755" }
            };
            for (int i = 0; i < equipe.GetLength(0); i++)
            {
                string n = equipe[i, 0], c = equipe[i, 1], f = equipe[i, 2],
                       r = equipe[i, 3], d = equipe[i, 4], t = equipe[i, 5];
                Executar(cn, tr,
                    "INSERT INTO tb_equipe (nome_colaborador, num_cpf, funcao, remuneracao, " +
                    "dt_contratacao, num_telefone) VALUES (@a, @b, @c, @d, @e, @f);",
                    p =>
                    {
                        p.AddWithValue("@a", n); p.AddWithValue("@b", c); p.AddWithValue("@c", f);
                        p.AddWithValue("@d", decimal.Parse(r, System.Globalization.CultureInfo.GetCultureInfo("pt-BR")));
                        p.AddWithValue("@e", d); p.AddWithValue("@f", t);
                    });
            }

            SemearPedidoDemonstracao(cn, tr);
        }

        /// <summary>
        /// Cria um pedido de demonstração (2 itens, abatimento em um deles)
        /// com baixa de estoque e registros de movimentação correspondentes.
        /// </summary>
        private static void SemearPedidoDemonstracao(SQLiteConnection cn, SQLiteTransaction tr)
        {
            // obra 1: 2 x 36,50 sem abatimento = 73,00
            // obra 3: 1 x 29,90 com 10% de abatimento = 26,91
            decimal totalPedido = 73.00m + 26.91m;
            Executar(cn, tr,
                "INSERT INTO tb_pedidos (dt_hora_pedido, cod_colaborador, nome_cliente, " +
                "forma_pagamento, valor_total) VALUES (@a, @b, @c, @d, @e);",
                p =>
                {
                    p.AddWithValue("@a", "2026-08-20 10:15:00"); p.AddWithValue("@b", 1);
                    p.AddWithValue("@c", "Cliente Demonstração"); p.AddWithValue("@d", "Pix"); p.AddWithValue("@e", totalPedido);
                });

            Executar(cn, tr,
                "INSERT INTO tb_pedido_itens (cod_pedido, cod_obra, qtd_vendida, valor_cobrado, " +
                "abatimento_pct, valor_liquido) VALUES (1, 1, @q1, @v1, @d1, @t1);",
                p => { p.AddWithValue("@q1", 2); p.AddWithValue("@v1", 36.50m); p.AddWithValue("@d1", 0m); p.AddWithValue("@t1", 73.00m); });

            Executar(cn, tr,
                "INSERT INTO tb_pedido_itens (cod_pedido, cod_obra, qtd_vendida, valor_cobrado, " +
                "abatimento_pct, valor_liquido) VALUES (1, 3, @q2, @v2, @d2, @t2);",
                p => { p.AddWithValue("@q2", 1); p.AddWithValue("@v2", 29.90m); p.AddWithValue("@d2", 10m); p.AddWithValue("@t2", 26.91m); });

            Executar(cn, tr,
                "UPDATE tb_obras SET qtd_acervo = qtd_acervo - 2 WHERE cod_obra = 1;", _ => { });
            Executar(cn, tr,
                "UPDATE tb_obras SET qtd_acervo = qtd_acervo - 1 WHERE cod_obra = 3;", _ => { });

            Executar(cn, tr,
                "INSERT INTO tb_movimento_estoque (cod_obra, tipo_movimento, qtd_movimentada, " +
                "dt_hora_movimento, origem_movimento) VALUES (1, 'SAIDA', 2, '2026-08-20 10:15:00', 'PEDIDO 1');",
                _ => { });
            Executar(cn, tr,
                "INSERT INTO tb_movimento_estoque (cod_obra, tipo_movimento, qtd_movimentada, " +
                "dt_hora_movimento, origem_movimento) VALUES (3, 'SAIDA', 1, '2026-08-20 10:15:00', 'PEDIDO 1');",
                _ => { });
        }

        private delegate void Configurar(SQLiteParameterCollection parametros);

        private static void Executar(SQLiteConnection cn, SQLiteTransaction tr,
            string sql, Configurar configurar)
        {
            using (SQLiteCommand cmd = new SQLiteCommand(sql, cn, tr))
            {
                configurar(cmd.Parameters);
                cmd.ExecuteNonQuery();
            }
        }
    }
}