using System;
using System.Data.SQLite;
using ProjetoFinal_C_.Models;
using ProjetoFinal_C_.Utils;

namespace ProjetoFinal_C_.DAO
{
    public class AcessoDAO
    {
        /// <summary>
        /// Perfis válidos no sistema (usados na validação do acesso).
        /// </summary>
        public const string PerfilAdmin = "ADMIN";
        public const string PerfilFuncionario = "FUNCIONARIO";
        public const string PerfilUsuario = "USUARIO";

        /// <summary>
        /// Confere usuário e senha e devolve o acesso com o perfil.
        /// Retorna null quando as credenciais não batem.
        /// </summary>
        public Acesso ValidarCredenciais(string usuario, string senha)
        {
            try
            {
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "SELECT cod_acesso, usuario, senha, perfil FROM tb_acessos " +
                    "WHERE usuario = @usuario AND senha = @senha;", cn))
                {
                    cmd.Parameters.AddWithValue("@usuario", usuario);
                    cmd.Parameters.AddWithValue("@senha", senha);

                    using (SQLiteDataReader leitor = cmd.ExecuteReader())
                    {
                        if (leitor.Read())
                        {
                            return new Acesso
                            {
                                CodAcesso = Convert.ToInt32(leitor["cod_acesso"]),
                                Usuario = leitor["usuario"].ToString(),
                                Senha = leitor["senha"].ToString(),
                                Perfil = leitor["perfil"] == DBNull.Value
                                    ? PerfilFuncionario
                                    : leitor["perfil"].ToString().ToUpper()
                            };
                        }
                        return null;
                    }
                }
            }
            catch (SQLiteException)
            {
                throw new Exception(
                    "Falha ao consultar o banco EntreLivrosDB.db. Verifique o arquivo na pasta do programa.");
            }
            catch (Exception)
            {
                throw new Exception("Erro inesperado ao validar o acesso.");
            }
        }

        /// <summary>
        /// Lista todos os acessos cadastrados (uso administrativo).
        /// </summary>
        public System.Collections.Generic.List<Acesso> Listar()
        {
            try
            {
                System.Collections.Generic.List<Acesso> lista =
                    new System.Collections.Generic.List<Acesso>();

                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "SELECT cod_acesso, usuario, senha, perfil " +
                    "FROM tb_acessos ORDER BY usuario;", cn))
                using (SQLiteDataReader leitor = cmd.ExecuteReader())
                {
                    while (leitor.Read())
                    {
                        lista.Add(new Acesso
                        {
                            CodAcesso = Convert.ToInt32(leitor["cod_acesso"]),
                            Usuario = leitor["usuario"].ToString(),
                            Senha = leitor["senha"].ToString(),
                            Perfil = leitor["perfil"] == DBNull.Value
                                ? PerfilFuncionario
                                : leitor["perfil"].ToString().ToUpper()
                        });
                    }
                }
                return lista;
            }
            catch (Exception)
            {
                throw new Exception("Não foi possível carregar os acessos.");
            }
        }

        /// <summary>
        /// Inclui uma nova conta de acesso.
        /// </summary>
        public void Incluir(Acesso a)
        {
            try
            {
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "INSERT INTO tb_acessos (usuario, senha, perfil) " +
                    "VALUES (@a, @b, @c);", cn))
                {
                    cmd.Parameters.AddWithValue("@a", a.Usuario);
                    cmd.Parameters.AddWithValue("@b", a.Senha);
                    cmd.Parameters.AddWithValue("@c", a.Perfil);
                    cmd.ExecuteNonQuery();
                    a.CodAcesso = (int)cn.LastInsertRowId;
                }
            }
            catch (SQLiteException ex)
                when (ex.ResultCode == SQLiteErrorCode.Constraint)
            {
                throw new Exception("Já existe uma conta com este nome de usuário.");
            }
            catch (SQLiteException)
            {
                throw new Exception("Não foi possível gravar a conta de acesso.");
            }
        }

        /// <summary>
        /// Altera senha e/ou perfil de uma conta existente.
        /// </summary>
        public void Alterar(Acesso a)
        {
            try
            {
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                using (SQLiteCommand cmd = new SQLiteCommand(
                    "UPDATE tb_acessos SET usuario = @a, senha = @b, perfil = @c " +
                    "WHERE cod_acesso = @cod;", cn))
                {
                    cmd.Parameters.AddWithValue("@a", a.Usuario);
                    cmd.Parameters.AddWithValue("@b", a.Senha);
                    cmd.Parameters.AddWithValue("@c", a.Perfil);
                    cmd.Parameters.AddWithValue("@cod", a.CodAcesso);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (SQLiteException ex)
                when (ex.ResultCode == SQLiteErrorCode.Constraint)
            {
                throw new Exception("Já existe outra conta com este nome de usuário.");
            }
            catch (SQLiteException)
            {
                throw new Exception("Não foi possível atualizar a conta de acesso.");
            }
        }

        /// <summary>
        /// Remove uma conta de acesso. Impede remover o último ADMIN
        /// do sistema, para nunca perder o acesso administrativo.
        /// </summary>
        public void Remover(Acesso a)
        {
            if (a == null)
            {
                throw new Exception("Selecione uma conta para remover.");
            }

            try
            {
                using (SQLiteConnection cn = BancoDeDados.ObterConexao())
                {
                    if (a.Perfil == PerfilAdmin)
                    {
                        using (SQLiteCommand chk = new SQLiteCommand(
                            "SELECT COUNT(*) FROM tb_acessos WHERE perfil = @p;",
                            cn))
                        {
                            chk.Parameters.AddWithValue("@p", PerfilAdmin);
                            if (Convert.ToInt32(chk.ExecuteScalar()) <= 1)
                            {
                                throw new Exception(
                                    "Não é possível remover o único administrador do sistema.");
                            }
                        }
                    }

                    using (SQLiteCommand cmd = new SQLiteCommand(
                        "DELETE FROM tb_acessos WHERE cod_acesso = @cod;", cn))
                    {
                        cmd.Parameters.AddWithValue("@cod", a.CodAcesso);
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (SQLiteException)
            {
                throw new Exception("Não foi possível remover a conta de acesso.");
            }
        }
    }
}
