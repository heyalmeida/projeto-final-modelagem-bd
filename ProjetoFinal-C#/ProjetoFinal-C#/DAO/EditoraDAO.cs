using System;
using System.Collections.Generic;
using System.Data.SQLite;
using ProjetoFinal_C_.Models;
using ProjetoFinal_C_.Utils;

namespace ProjetoFinal_C_.DAO
{
    public class EditoraDAO
    {
        public List<Editora> Listar()
        {
            try
            {
                List<Editora> lista = new List<Editora>();

                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "SELECT cod_editora, nome_editora, cidade_editora " +
                    "FROM tb_editoras ORDER BY nome_editora;", cn))
                using (SQLiteDataReader leitor = cmd.ExecuteReader())
                {
                    while (leitor.Read())
                    {
                        lista.Add(new Editora
                        {
                            CodEditora = Convert.ToInt32(leitor["cod_editora"]),
                            NomeEditora = leitor["nome_editora"].ToString(),
                            CidadeEditora = leitor["cidade_editora"].ToString()
                        });
                    }
                }
                return lista;
            }
            catch (Exception)
            {
                throw new Exception("Não foi possível carregar as editoras.");
            }
        }

        public void Incluir(Editora e)
        {
            try
            {
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "INSERT INTO tb_editoras (nome_editora, cidade_editora) " +
                    "VALUES (@a, @b);", cn))
                {
                    cmd.Parameters.AddWithValue("@a", e.NomeEditora);
                    cmd.Parameters.AddWithValue("@b", e.CidadeEditora);
                    cmd.ExecuteNonQuery();
                    e.CodEditora = (int)cn.LastInsertRowId;
                }
            }
            catch (SQLiteException ex)
                when (ex.ResultCode == SQLiteErrorCode.Constraint)
            {
                throw new Exception("Já existe uma editora com este nome.");
            }
            catch (SQLiteException)
            {
                throw new Exception("Não foi possível gravar a editora.");
            }
        }

        public void Alterar(Editora e)
        {
            try
            {
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "UPDATE tb_editoras SET nome_editora = @a, cidade_editora = @b " +
                    "WHERE cod_editora = @cod;", cn))
                {
                    cmd.Parameters.AddWithValue("@a", e.NomeEditora);
                    cmd.Parameters.AddWithValue("@b", e.CidadeEditora);
                    cmd.Parameters.AddWithValue("@cod", e.CodEditora);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (SQLiteException ex)
                when (ex.ResultCode == SQLiteErrorCode.Constraint)
            {
                throw new Exception("Já existe outra editora com este nome.");
            }
            catch (SQLiteException)
            {
                throw new Exception("Não foi possível atualizar a editora.");
            }
        }

        public void Remover(int codEditora)
        {
            try
            {
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "DELETE FROM tb_editoras WHERE cod_editora = @cod;", cn))
                {
                    cmd.Parameters.AddWithValue("@cod", codEditora);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (SQLiteException ex)
                when (ex.ResultCode == SQLiteErrorCode.Constraint)
            {
                throw new Exception(
                    "Esta editora possui obras vinculadas e não pode ser removida.");
            }
            catch (SQLiteException)
            {
                throw new Exception("Não foi possível remover a editora.");
            }
        }
    }
}