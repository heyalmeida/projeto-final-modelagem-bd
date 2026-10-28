using System;
using System.Collections.Generic;
using System.Windows.Forms;
using ProjetoFinal_C_.DAO;
using ProjetoFinal_C_.Models;

namespace ProjetoFinal_C_.Forms
{
    /// <summary>
    /// Gestão de contas de acesso (usuário, senha e perfil).
    /// Acesso exclusivo do perfil ADMIN (validado no menu e na tela).
    /// </summary>
    public partial class FormContas : Form
    {
        private readonly AcessoDAO _acessoDAO = new AcessoDAO();
        private Acesso _contaCorrente;

        public FormContas(string perfil)
        {
            InitializeComponent();

            // Validação de permissão DENTRO da tela (além do menu).
            if (perfil != "ADMIN")
            {
                throw new UnauthorizedAccessException(
                    "Apenas administradores podem gerenciar contas de acesso.");
            }
        }

        private void FormContas_Load(object sender, EventArgs e)
        {
            RecentrarCartao();
            cboPerfil.SelectedIndex = 0;
            CarregarGrid();
        }

        private void FormContas_Resize(object sender, EventArgs e)
        {
            RecentrarCartao();
        }

        private void RecentrarCartao()
        {
            cartaoPrincipal.Left = Math.Max(0, (ClientSize.Width - cartaoPrincipal.Width) / 2);
            cartaoPrincipal.Top = Math.Max(0, (ClientSize.Height - cartaoPrincipal.Height) / 2);
        }

        private void CarregarGrid()
        {
            try
            {
                List<Acesso> contas = _acessoDAO.Listar();
                gradeContas.DataSource = contas;
                gradeContas.ClearSelection();
                LimparFormulario();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void GradeContas_SelectionChanged(object sender, EventArgs e)
        {
            if (gradeContas.CurrentRow == null ||
                gradeContas.CurrentRow.DataBoundItem == null)
            {
                return;
            }

            _contaCorrente = gradeContas.CurrentRow.DataBoundItem as Acesso;
            if (_contaCorrente == null)
            {
                return;
            }

            txtUsuario.Text = _contaCorrente.Usuario;
            txtSenha.Text = _contaCorrente.Senha;
            cboPerfil.SelectedItem = _contaCorrente.Perfil;
            rotuloSituacao.Text = "Em edição: " + _contaCorrente.Usuario;
        }

        private void BtnGravar_Click(object sender, EventArgs e)
        {
            Acesso conta;
            if (!ColetarDados(out conta))
            {
                return;
            }

            try
            {
                _acessoDAO.Incluir(conta);
                MessageBox.Show("Conta de acesso criada com sucesso!", "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
                CarregarGrid();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void BtnAlterar_Click(object sender, EventArgs e)
        {
            if (_contaCorrente == null)
            {
                MessageBox.Show("Selecione uma conta na lista para alterar.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            Acesso conta;
            if (!ColetarDados(out conta))
            {
                return;
            }
            conta.CodAcesso = _contaCorrente.CodAcesso;

            try
            {
                _acessoDAO.Alterar(conta);
                MessageBox.Show("Conta atualizada com sucesso!", "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
                CarregarGrid();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void BtnRemover_Click(object sender, EventArgs e)
        {
            if (_contaCorrente == null)
            {
                MessageBox.Show("Selecione uma conta na lista para remover.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            DialogResult opcao = MessageBox.Show(
                "Remover a conta \"" + _contaCorrente.Usuario + "\"?",
                "EntreLivros", MessageBoxButtons.YesNo, MessageBoxIcon.Question);

            if (opcao != DialogResult.Yes)
            {
                return;
            }

            try
            {
                _acessoDAO.Remover(_contaCorrente);
                MessageBox.Show("Conta removida.", "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
                CarregarGrid();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void BtnLimpar_Click(object sender, EventArgs e)
        {
            LimparFormulario();
        }

        private void LimparFormulario()
        {
            _contaCorrente = null;
            txtUsuario.Clear();
            txtSenha.Clear();
            if (cboPerfil.Items.Count > 0)
            {
                cboPerfil.SelectedIndex = 0;
            }
            rotuloSituacao.Text = "Preencha os dados e use Gravar para incluir.";
            gradeContas.ClearSelection();
            txtUsuario.Focus();
        }

        private bool ColetarDados(out Acesso conta)
        {
            conta = null;

            if (string.IsNullOrWhiteSpace(txtUsuario.Text))
            {
                MessageBox.Show("Informe o nome de usuário.", "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtUsuario.Focus();
                return false;
            }

            if (string.IsNullOrWhiteSpace(txtSenha.Text))
            {
                MessageBox.Show("Informe a senha da conta.", "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtSenha.Focus();
                return false;
            }

            if (txtSenha.Text.Length < 4)
            {
                MessageBox.Show("A senha precisa ter ao menos 4 caracteres.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtSenha.Focus();
                return false;
            }

            string perfil = cboPerfil.SelectedItem == null
                ? ""
                : cboPerfil.SelectedItem.ToString();

            if (perfil != "ADMIN" && perfil != "FUNCIONARIO" && perfil != "USUARIO")
            {
                MessageBox.Show("Selecione um perfil válido (ADMIN, FUNCIONARIO ou USUARIO).",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return false;
            }

            conta = new Acesso
            {
                Usuario = txtUsuario.Text.Trim(),
                Senha = txtSenha.Text,
                Perfil = perfil
            };
            return true;
        }
    }
}