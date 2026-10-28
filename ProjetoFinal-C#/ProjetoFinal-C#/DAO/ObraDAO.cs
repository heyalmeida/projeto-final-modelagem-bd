using System;
using System.Collections.Generic;
using System.Data.SQLite;
using ProjetoFinal_C_.Models;
using ProjetoFinal_C_.Utils;

namespace ProjetoFinal_C_.DAO
{
    public class ObraDAO
    {
        private const string Campos =
            "o.cod_obra, o.nome_obra, o.nome_autor, o.cod_editora, o.codigo_barras, " +
            "o.categoria, o.valor_unitario, o.qtd_acervo, o.ano_publicacao, e.nome_editora ";

        private const string Juncao =
            "FROM tb_obras o INNER JOIN tb_editoras e ON e.cod_editora = o.cod_editora ";

        public List<Obra> Listar()
        {
            try
            {
                List<Obra> lista = new List<Obra>();
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "SELECT " + Campos + Juncao + "ORDER BY o.nome_obra;", cn))
                using (SQLiteDataReader leitor = cmd.ExecuteReader())
                {
                    while (leitor.Read())
                    {
                        lista.Add(Mapear(leitor));
                    }
                }
                return lista;
            }
            catch (Exception)
            {
                throw new Exception("Não foi possível carregar o acervo de obras.");
            }
        }

        /// <summary>
        /// Somente obras com exemplares disponíveis (usado no pedido).
        /// </summary>
        public List<Obra> ListarDisponiveis()
        {
            try
            {
                List<Obra> lista = new List<Obra>();
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "SELECT " + Campos + Juncao + "WHERE o.qtd_acervo > 0 ORDER BY o.nome_obra;", cn))
                using (SQLiteDataReader leitor = cmd.ExecuteReader())
                {
                    while (leitor.Read())
                    {
                        lista.Add(Mapear(leitor));
                    }
                }
                return lista;
            }
            catch (Exception)
            {
                throw new Exception("Não foi possível carregar as obras disponíveis.");
            }
        }

        public bool CodigoBarrasEmUso(string codigoBarras, int codIgnorar)
        {
            try
            {
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "SELECT COUNT(*) FROM tb_obras " +
                    "WHERE codigo_barras = @cb AND cod_obra <> @ignorar;", cn))
                {
                    cmd.Parameters.AddWithValue("@cb", codigoBarras);
                    cmd.Parameters.AddWithValue("@ignorar", codIgnorar);
                    return Convert.ToInt32(cmd.ExecuteScalar()) > 0;
                }
            }
            catch (Exception)
            {
                throw new Exception("Não foi possível verificar o código de barras.");
            }
        }

        public void Incluir(Obra obra)
        {
            try
            {
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteTransaction tr = cn.BeginTransaction())
                {
                    try
                    {
                        using (SQLiteCommand cmd = new SQLiteCommand(
                            "INSERT INTO tb_obras (nome_obra, nome_autor, cod_editora, " +
                            "codigo_barras, categoria, valor_unitario, qtd_acervo, ano_publicacao) " +
                            "VALUES (@a, @b, @c, @d, @e, @f, @g, @h);", cn, tr))
                        {
                            Parametrizar(cmd, obra);
                            cmd.ExecuteNonQuery();
                            obra.CodObra = (int)cn.LastInsertRowId;
                        }

                        if (obra.QtdAcervo > 0)
                        {
                            using (SQLiteCommand mov = new SQLiteCommand(
                                "INSERT INTO tb_movimento_estoque (cod_obra, tipo_movimento, " +
                                "qtd_movimentada, dt_hora_movimento, origem_movimento) " +
                                "VALUES (@o, 'ENTRADA', @q, @dh, 'CADASTRO');", cn, tr))
                            {
                                mov.Parameters.AddWithValue("@o", obra.CodObra);
                                mov.Parameters.AddWithValue("@q", obra.QtdAcervo);
                                mov.Parameters.AddWithValue("@dh",
                                    DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                                mov.ExecuteNonQuery();
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
            catch (SQLiteException ex)
                when (ex.ResultCode == SQLiteErrorCode.Constraint)
            {
                throw new Exception("Já existe uma obra cadastrada com este código de barras.");
            }
            catch (SQLiteException)
            {
                throw new Exception("Não foi possível gravar a obra no banco de dados.");
            }
        }

        public void Alterar(Obra obra)
        {
            try
            {
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "UPDATE tb_obras SET nome_obra = @a, nome_autor = @b, cod_editora = @c, " +
                    "codigo_barras = @d, categoria = @e, valor_unitario = @f, " +
                    "qtd_acervo = @g, ano_publicacao = @h WHERE cod_obra = @cod;", cn))
                {
                    Parametrizar(cmd, obra);
                    cmd.Parameters.AddWithValue("@cod", obra.CodObra);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (SQLiteException ex)
                when (ex.ResultCode == SQLiteErrorCode.Constraint)
            {
                throw new Exception("Já existe outra obra com este código de barras.");
            }
            catch (SQLiteException)
            {
                throw new Exception("Não foi possível atualizar a obra no banco de dados.");
            }
        }

        public void Remover(int codObra)
        {
            try
            {
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "DELETE FROM tb_obras WHERE cod_obra = @cod;", cn))
                {
                    cmd.Parameters.AddWithValue("@cod", codObra);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (SQLiteException ex)
                when (ex.ResultCode == SQLiteErrorCode.Constraint)
            {
                throw new Exception(
                    "Esta obra possui pedidos registrados e não pode ser removida.");
            }
            catch (SQLiteException)
            {
                throw new Exception("Não foi possível remover a obra do banco de dados.");
            }
        }

        private static Obra Mapear(SQLiteDataReader leitor)
        {
            return new Obra
            {
                CodObra = Convert.ToInt32(leitor["cod_obra"]),
                NomeObra = leitor["nome_obra"].ToString(),
                NomeAutor = leitor["nome_autor"].ToString(),
                CodEditora = Convert.ToInt32(leitor["cod_editora"]),
                NomeEditora = leitor["nome_editora"].ToString(),
                CodigoBarras = leitor["codigo_barras"].ToString(),
                Categoria = leitor["categoria"].ToString(),
                ValorUnitario = Convert.ToDecimal(leitor["valor_unitario"]),
                QtdAcervo = Convert.ToInt32(leitor["qtd_acervo"]),
                AnoPublicacao = Convert.ToInt32(leitor["ano_publicacao"])
            };
        }

        private static void Parametrizar(SQLiteCommand cmd, Obra obra)
        {
            cmd.Parameters.AddWithValue("@a", obra.NomeObra);
            cmd.Parameters.AddWithValue("@b", obra.NomeAutor);
            cmd.Parameters.AddWithValue("@c", obra.CodEditora);
            cmd.Parameters.AddWithValue("@d", obra.CodigoBarras);
            cmd.Parameters.AddWithValue("@e", obra.Categoria);
            cmd.Parameters.AddWithValue("@f", obra.ValorUnitario);
            cmd.Parameters.AddWithValue("@g", obra.QtdAcervo);
            cmd.Parameters.AddWithValue("@h", obra.AnoPublicacao);
        }
    }
}