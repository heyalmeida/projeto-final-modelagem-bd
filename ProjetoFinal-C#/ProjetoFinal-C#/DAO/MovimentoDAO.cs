using System;
using System.Collections.Generic;
using System.Data.SQLite;
using ProjetoFinal_C_.Models;
using ProjetoFinal_C_.Utils;

namespace ProjetoFinal_C_.DAO
{
    public class MovimentoDAO
    {
        /// <summary>
        /// Registra uma movimentação de estoque (ENTRADA ou SAIDA) e
        /// atualiza o acervo da obra, tudo em uma única transação.
        /// </summary>
        public void Registrar(Movimento mov)
        {
            if (mov == null)
            {
                throw new Exception("Dados da movimentação inválidos.");
            }

            if (mov.TipoMovimento != "ENTRADA" && mov.TipoMovimento != "SAIDA")
            {
                throw new Exception("Tipo de movimentação inválido.");
            }

            try
            {
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteTransaction tr = cn.BeginTransaction())
                {
                    try
                    {
                        // Para saída, confere se há acervo suficiente.
                        if (mov.TipoMovimento == "SAIDA")
                        {
                            using (SQLiteCommand chk = new SQLiteCommand(
                                "SELECT qtd_acervo FROM tb_obras WHERE cod_obra = @o;",
                                cn, tr))
                            {
                                chk.Parameters.AddWithValue("@o", mov.CodObra);
                                object resultado = chk.ExecuteScalar();

                                if (resultado == null)
                                {
                                    throw new Exception("Obra não encontrada.");
                                }

                                int acervo = Convert.ToInt32(resultado);
                                if (acervo < mov.QtdMovimentada)
                                {
                                    throw new Exception(
                                        "Acervo insuficiente para a saída. Disponível: " +
                                        acervo + " exemplar(es).");
                                }
                            }
                        }

                        using (SQLiteCommand cmd = new SQLiteCommand(
                            "INSERT INTO tb_movimento_estoque (cod_obra, tipo_movimento, " +
                            "qtd_movimentada, dt_hora_movimento, origem_movimento) " +
                            "VALUES (@o, @t, @q, @dh, @org);", cn, tr))
                        {
                            cmd.Parameters.AddWithValue("@o", mov.CodObra);
                            cmd.Parameters.AddWithValue("@t", mov.TipoMovimento);
                            cmd.Parameters.AddWithValue("@q", mov.QtdMovimentada);
                            cmd.Parameters.AddWithValue("@dh",
                                mov.DtHoraMovimento.ToString("yyyy-MM-dd HH:mm:ss"));
                            cmd.Parameters.AddWithValue("@org", mov.OrigemMovimento);
                            cmd.ExecuteNonQuery();
                        }

                        using (SQLiteCommand upd = new SQLiteCommand(
                            mov.TipoMovimento == "ENTRADA"
                                ? "UPDATE tb_obras SET qtd_acervo = qtd_acervo + @q WHERE cod_obra = @o;"
                                : "UPDATE tb_obras SET qtd_acervo = qtd_acervo - @q WHERE cod_obra = @o;",
                            cn, tr))
                        {
                            upd.Parameters.AddWithValue("@q", mov.QtdMovimentada);
                            upd.Parameters.AddWithValue("@o", mov.CodObra);
                            upd.ExecuteNonQuery();
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
            catch (SQLiteException)
            {
                throw new Exception("Não foi possível registrar a movimentação de estoque.");
            }
        }

        /// <summary>
        /// Histórico de movimentações (mais recentes primeiro).
        /// </summary>
        public List<Movimento> Listar()
        {
            try
            {
                List<Movimento> lista = new List<Movimento>();
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "SELECT m.cod_movimento, m.cod_obra, m.tipo_movimento, " +
                    "m.qtd_movimentada, m.dt_hora_movimento, m.origem_movimento, " +
                    "o.nome_obra FROM tb_movimento_estoque m " +
                    "INNER JOIN tb_obras o ON o.cod_obra = m.cod_obra " +
                    "ORDER BY m.dt_hora_movimento DESC, m.cod_movimento DESC " +
                    "LIMIT 300;", cn))
                using (SQLiteDataReader leitor = cmd.ExecuteReader())
                {
                    while (leitor.Read())
                    {
                        lista.Add(new Movimento
                        {
                            CodMovimento = Convert.ToInt32(leitor["cod_movimento"]),
                            CodObra = Convert.ToInt32(leitor["cod_obra"]),
                            NomeObra = leitor["nome_obra"].ToString(),
                            TipoMovimento = leitor["tipo_movimento"].ToString(),
                            QtdMovimentada = Convert.ToInt32(leitor["qtd_movimentada"]),
                            DtHoraMovimento = DateTime.Parse(
                                leitor["dt_hora_movimento"].ToString()),
                            OrigemMovimento = leitor["origem_movimento"].ToString()
                        });
                    }
                }
                return lista;
            }
            catch (Exception)
            {
                throw new Exception("Não foi possível carregar o histórico de movimentações.");
            }
        }
    }
}