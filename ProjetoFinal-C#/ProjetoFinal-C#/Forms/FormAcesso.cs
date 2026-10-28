using System;
using System.Windows.Forms;
using ProjetoFinal_C_.DAO;
using ProjetoFinal_C_.Models;
using ProjetoFinal_C_.Utils;

namespace ProjetoFinal_C_.Forms
{
    public partial class FormAcesso : Form
    {
        private readonly AcessoDAO _acessoDAO = new AcessoDAO();

        public FormAcesso()
        {
            InitializeComponent();
        }

        private void FormAcesso_Load(object sender, EventArgs e)
        {
            // Prepara o banco (cria/migra na primeira execução) antes
            // de qualquer tentativa de login.
            try
            {
                BancoDeDados.InicializarBanco();
            }
            catch (Exception)
            {
                MessageBox.Show(
                    "Não foi possível criar o banco EntreLivrosDB.db na pasta do " +
                    "executável. Verifique as permissões de escrita da pasta.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void BtnAcessar_Click(object sender, EventArgs e)
        {
            string usuario = txtUsuario.Text.Trim();
            string senha = txtSenhaAcesso.Text;

            if (usuario.Length == 0 || senha.Length == 0)
            {
                MessageBox.Show("Informe usuário e senha para continuar.", "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            try
            {
                Acesso acesso = _acessoDAO.ValidarCredenciais(usuario, senha);

                if (acesso == null)
                {
                    MessageBox.Show("Credenciais não reconhecidas.", "EntreLivros",
                        MessageBoxButtons.OK, MessageBoxIcon.Error);
                    txtSenhaAcesso.Clear();
                    txtSenhaAcesso.Focus();
                    return;
                }

                Hide();
                using (FormPrincipal principal = new FormPrincipal(
                    acesso.Usuario, acesso.Perfil))
                {
                    principal.ShowDialog();
                }
                Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void BtnEncerrar_Click(object sender, EventArgs e)
        {
            Close();
        }
    }
}