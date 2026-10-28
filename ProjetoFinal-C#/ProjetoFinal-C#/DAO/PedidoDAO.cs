using System;
using System.Collections.Generic;
using System.Data.SQLite;
using ProjetoFinal_C_.Models;
using ProjetoFinal_C_.Utils;

namespace ProjetoFinal_C_.DAO
{
    public class PedidoDAO
    {
        /// <summary>
        /// Grava o pedido completo (cabeçalho + itens + baixa de acervo +
        /// movimentações de estoque) em uma única transação, com rollback
        /// em caso de qualquer falha.
        /// </summary>
        public void Registrar(Pedido pedido, List<PedidoItem> itens)
        {
            if (pedido == null)
            {
                throw new Exception("Dados do pedido inválidos.");
            }
            if (itens == null || itens.Count == 0)
            {
                throw new Exception("O pedido precisa conter ao menos um item.");
            }

            try
            {
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteTransaction tr = cn.BeginTransaction())
                {
                    try
                    {
                        long codPedido;

                        using (SQLiteCommand cab = new SQLiteCommand(
                            "INSERT INTO tb_pedidos (dt_hora_pedido, cod_colaborador, " +
                            "nome_cliente, forma_pagamento, valor_total) " +
                            "VALUES (@a, @b, @c, @d, @e);", cn, tr))
                        {
                            cab.Parameters.AddWithValue("@a",
                                pedido.DtHoraPedido.ToString("yyyy-MM-dd HH:mm:ss"));
                            cab.Parameters.AddWithValue("@b", pedido.CodColaborador);
                            cab.Parameters.AddWithValue("@c",
                                string.IsNullOrWhiteSpace(pedido.NomeCliente)
                                    ? (object)DBNull.Value
                                    : pedido.NomeCliente);
                            cab.Parameters.AddWithValue("@d", pedido.FormaPagamento);
                            cab.Parameters.AddWithValue("@e", pedido.ValorTotal);
                            cab.ExecuteNonQuery();
                            codPedido = cn.LastInsertRowId;
                        }

                        string agora = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

                        foreach (PedidoItem item in itens)
                        {
                            using (SQLiteCommand it = new SQLiteCommand(
                                "INSERT INTO tb_pedido_itens (cod_pedido, cod_obra, " +
                                "qtd_vendida, valor_cobrado, abatimento_pct, valor_liquido) " +
                                "VALUES (@a, @b, @c, @d, @e, @f);", cn, tr))
                            {
                                it.Parameters.AddWithValue("@a", codPedido);
                                it.Parameters.AddWithValue("@b", item.CodObra);
                                it.Parameters.AddWithValue("@c", item.QtdVendida);
                                it.Parameters.AddWithValue("@d", item.ValorCobrado);
                                it.Parameters.AddWithValue("@e", item.AbatimentoPct);
                                it.Parameters.AddWithValue("@f", item.ValorLiquido);
                                it.ExecuteNonQuery();
                            }

                            using (SQLiteCommand baixa = new SQLiteCommand(
                                "UPDATE tb_obras SET qtd_acervo = qtd_acervo - @q " +
                                "WHERE cod_obra = @o;", cn, tr))
                            {
                                baixa.Parameters.AddWithValue("@q", item.QtdVendida);
                                baixa.Parameters.AddWithValue("@o", item.CodObra);
                                baixa.ExecuteNonQuery();
                            }

                            using (SQLiteCommand mov = new SQLiteCommand(
                                "INSERT INTO tb_movimento_estoque (cod_obra, tipo_movimento, " +
                                "qtd_movimentada, dt_hora_movimento, origem_movimento) " +
                                "VALUES (@o, 'SAIDA', @q, @dh, @org);", cn, tr))
                            {
                                mov.Parameters.AddWithValue("@o", item.CodObra);
                                mov.Parameters.AddWithValue("@q", item.QtdVendida);
                                mov.Parameters.AddWithValue("@dh", agora);
                                mov.Parameters.AddWithValue("@org", "PEDIDO " + codPedido);
                                mov.ExecuteNonQuery();
                            }
                        }

                        tr.Commit();
                        pedido.CodPedido = (int)codPedido;
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
                throw new Exception(
                    "Não foi possível registrar o pedido: confira o colaborador e as obras selecionadas.");
            }
            catch (SQLiteException)
            {
                throw new Exception("Não foi possível registrar o pedido no banco de dados.");
            }
        }

        /// <summary>
        /// Pedidos do período (inclusive a data final), com o colaborador.
        /// </summary>
        public List<Pedido> ListarPorPeriodo(DateTime inicio, DateTime fim)
        {
            try
            {
                List<Pedido> lista = new List<Pedido>();
                DateTime fimTotal = fim.Date.AddDays(1).AddSeconds(-1);

                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "SELECT p.cod_pedido, p.dt_hora_pedido, p.cod_colaborador, " +
                    "p.nome_cliente, p.forma_pagamento, p.valor_total, c.nome_colaborador " +
                    "FROM tb_pedidos p " +
                    "INNER JOIN tb_equipe c ON c.cod_colaborador = p.cod_colaborador " +
                    "WHERE p.dt_hora_pedido >= @ini AND p.dt_hora_pedido <= @fim " +
                    "ORDER BY p.dt_hora_pedido;", cn))
                {
                    cmd.Parameters.AddWithValue("@ini",
                        inicio.Date.ToString("yyyy-MM-dd HH:mm:ss"));
                    cmd.Parameters.AddWithValue("@fim",
                        fimTotal.ToString("yyyy-MM-dd HH:mm:ss"));

                    using (SQLiteDataReader leitor = cmd.ExecuteReader())
                    {
                        while (leitor.Read())
                        {
                            lista.Add(new Pedido
                            {
                                CodPedido = Convert.ToInt32(leitor["cod_pedido"]),
                                DtHoraPedido = DateTime.Parse(leitor["dt_hora_pedido"].ToString()),
                                CodColaborador = Convert.ToInt32(leitor["cod_colaborador"]),
                                NomeColaborador = leitor["nome_colaborador"].ToString(),
                                NomeCliente = leitor["nome_cliente"] == DBNull.Value
                                    ? ""
                                    : leitor["nome_cliente"].ToString(),
                                FormaPagamento = leitor["forma_pagamento"].ToString(),
                                ValorTotal = Convert.ToDecimal(leitor["valor_total"])
                            });
                        }
                    }
                }
                return lista;
            }
            catch (Exception)
            {
                throw new Exception("Não foi possível carregar os pedidos do período.");
            }
        }

        /// <summary>
        /// Itens de um pedido específico (para o balanço).
        /// </summary>
        public List<PedidoItem> ListarItens(int codPedido)
        {
            try
            {
                List<PedidoItem> lista = new List<PedidoItem>();
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "SELECT i.cod_item, i.cod_pedido, i.cod_obra, i.qtd_vendida, " +
                    "i.valor_cobrado, i.abatimento_pct, i.valor_liquido, o.nome_obra " +
                    "FROM tb_pedido_itens i " +
                    "INNER JOIN tb_obras o ON o.cod_obra = i.cod_obra " +
                    "WHERE i.cod_pedido = @cod ORDER BY i.cod_item;", cn))
                {
                    cmd.Parameters.AddWithValue("@cod", codPedido);
                    using (SQLiteDataReader leitor = cmd.ExecuteReader())
                    {
                        while (leitor.Read())
                        {
                            lista.Add(new PedidoItem
                            {
                                CodItem = Convert.ToInt32(leitor["cod_item"]),
                                CodPedido = Convert.ToInt32(leitor["cod_pedido"]),
                                CodObra = Convert.ToInt32(leitor["cod_obra"]),
                                NomeObra = leitor["nome_obra"].ToString(),
                                QtdVendida = Convert.ToInt32(leitor["qtd_vendida"]),
                                ValorCobrado = Convert.ToDecimal(leitor["valor_cobrado"]),
                                AbatimentoPct = Convert.ToDecimal(leitor["abatimento_pct"]),
                                ValorLiquido = Convert.ToDecimal(leitor["valor_liquido"])
                            });
                        }
                    }
                }
                return lista;
            }
            catch (Exception)
            {
                throw new Exception("Não foi possível carregar os itens do pedido.");
            }
        }
    }
}