using System;
using System.Collections.Generic;
using System.Data.SQLite;
using ProjetoFinal_C_.Models;
using ProjetoFinal_C_.Utils;

namespace ProjetoFinal_C_.DAO
{
    public class ColaboradorDAO
    {
        public List<Colaborador> Listar()
        {
            try
            {
                List<Colaborador> lista = new List<Colaborador>();
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "SELECT cod_colaborador, nome_colaborador, num_cpf, funcao, " +
                    "remuneracao, dt_contratacao, num_telefone " +
                    "FROM tb_equipe ORDER BY nome_colaborador;", cn))
                using (SQLiteDataReader leitor = cmd.ExecuteReader())
                {
                    while (leitor.Read())
                    {
                        lista.Add(new Colaborador
                        {
                            CodColaborador = Convert.ToInt32(leitor["cod_colaborador"]),
                            NomeColaborador = leitor["nome_colaborador"].ToString(),
                            NumCpf = leitor["num_cpf"].ToString(),
                            Funcao = leitor["funcao"].ToString(),
                            Remuneracao = Convert.ToDecimal(leitor["remuneracao"]),
                            DtContratacao = DateTime.Parse(leitor["dt_contratacao"].ToString()),
                            NumTelefone = leitor["num_telefone"] == DBNull.Value
                                ? ""
                                : leitor["num_telefone"].ToString()
                        });
                    }
                }
                return lista;
            }
            catch (Exception)
            {
                throw new Exception("Não foi possível carregar a equipe.");
            }
        }

        public bool CpfEmUso(string cpf, int codIgnorar)
        {
            try
            {
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "SELECT COUNT(*) FROM tb_equipe " +
                    "WHERE num_cpf = @cpf AND cod_colaborador <> @ignorar;", cn))
                {
                    cmd.Parameters.AddWithValue("@cpf", cpf);
                    cmd.Parameters.AddWithValue("@ignorar", codIgnorar);
                    return Convert.ToInt32(cmd.ExecuteScalar()) > 0;
                }
            }
            catch (Exception)
            {
                throw new Exception("Não foi possível verificar o CPF informado.");
            }
        }

        public void Incluir(Colaborador c)
        {
            try
            {
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "INSERT INTO tb_equipe (nome_colaborador, num_cpf, funcao, remuneracao, " +
                    "dt_contratacao, num_telefone) VALUES (@a, @b, @c, @d, @e, @f);", cn))
                {
                    Parametrizar(cmd, c);
                    cmd.ExecuteNonQuery();
                    c.CodColaborador = (int)cn.LastInsertRowId;
                }
            }
            catch (SQLiteException ex)
                when (ex.ResultCode == SQLiteErrorCode.Constraint)
            {
                throw new Exception("Já existe um colaborador com este CPF.");
            }
            catch (SQLiteException)
            {
                throw new Exception("Não foi possível gravar o colaborador.");
            }
        }

        public void Alterar(Colaborador c)
        {
            try
            {
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "UPDATE tb_equipe SET nome_colaborador = @a, num_cpf = @b, funcao = @c, " +
                    "remuneracao = @d, dt_contratacao = @e, num_telefone = @f " +
                    "WHERE cod_colaborador = @cod;", cn))
                {
                    Parametrizar(cmd, c);
                    cmd.Parameters.AddWithValue("@cod", c.CodColaborador);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (SQLiteException ex)
                when (ex.ResultCode == SQLiteErrorCode.Constraint)
            {
                throw new Exception("Já existe outro colaborador com este CPF.");
            }
            catch (SQLiteException)
            {
                throw new Exception("Não foi possível atualizar o colaborador.");
            }
        }

        public void Remover(int codColaborador)
        {
            try
            {
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "DELETE FROM tb_equipe WHERE cod_colaborador = @cod;", cn))
                {
                    cmd.Parameters.AddWithValue("@cod", codColaborador);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (SQLiteException ex)
                when (ex.ResultCode == SQLiteErrorCode.Constraint)
            {
                throw new Exception(
                    "Este colaborador possui pedidos registrados e não pode ser removido.");
            }
            catch (SQLiteException)
            {
                throw new Exception("Não foi possível remover o colaborador.");
            }
        }

        private static void Parametrizar(SQLiteCommand cmd, Colaborador c)
        {
            cmd.Parameters.AddWithValue("@a", c.NomeColaborador);
            cmd.Parameters.AddWithValue("@b", c.NumCpf);
            cmd.Parameters.AddWithValue("@c", c.Funcao);
            cmd.Parameters.AddWithValue("@d", c.Remuneracao);
            cmd.Parameters.AddWithValue("@e", c.DtContratacao.ToString("yyyy-MM-dd"));
            cmd.Parameters.AddWithValue("@f",
                string.IsNullOrWhiteSpace(c.NumTelefone) ? (object)DBNull.Value : c.NumTelefone);
        }
    }
}