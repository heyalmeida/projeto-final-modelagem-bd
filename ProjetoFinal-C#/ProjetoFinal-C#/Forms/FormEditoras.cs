using System;
using System.Collections.Generic;
using System.Windows.Forms;
using ProjetoFinal_C_.DAO;
using ProjetoFinal_C_.Models;

namespace ProjetoFinal_C_.Forms
{
    /// <summary>
    /// Cadastro de editoras. Acesso exclusivo do perfil ADMIN
    /// (validado no menu e novamente ao abrir a tela).
    /// </summary>
    public partial class FormEditoras : Form
    {
        private readonly EditoraDAO _editoraDAO = new EditoraDAO();
        private Editora _editoraCorrente;

        public FormEditoras(string perfil)
        {
            InitializeComponent();

            // Validação de permissão DENTRO da tela (além do menu).
            if (perfil != "ADMIN")
            {
                throw new UnauthorizedAccessException(
                    "Apenas administradores podem gerenciar editoras.");
            }
        }

        private void FormEditoras_Load(object sender, EventArgs e)
        {
            RecentrarCartao();
            CarregarGrid();
        }

        private void FormEditoras_Resize(object sender, EventArgs e)
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
                List<Editora> editoras = _editoraDAO.Listar();
                gradeEditoras.DataSource = editoras;
                gradeEditoras.ClearSelection();
                LimparFormulario();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void GradeEditoras_SelectionChanged(object sender, EventArgs e)
        {
            if (gradeEditoras.CurrentRow == null ||
                gradeEditoras.CurrentRow.DataBoundItem == null)
            {
                return;
            }

            _editoraCorrente = gradeEditoras.CurrentRow.DataBoundItem as Editora;
            if (_editoraCorrente == null)
            {
                return;
            }

            txtNomeEditora.Text = _editoraCorrente.NomeEditora;
            txtCidade.Text = _editoraCorrente.CidadeEditora;
            rotuloSituacao.Text = "Em edição: " + _editoraCorrente.NomeEditora;
        }

        private void BtnGravar_Click(object sender, EventArgs e)
        {
            Editora editora;
            if (!ColetarDados(out editora))
            {
                return;
            }

            try
            {
                _editoraDAO.Incluir(editora);
                MessageBox.Show("Editora gravada com sucesso!", "EntreLivros",
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
            if (_editoraCorrente == null)
            {
                MessageBox.Show("Selecione uma editora na lista para alterar.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            Editora editora;
            if (!ColetarDados(out editora))
            {
                return;
            }
            editora.CodEditora = _editoraCorrente.CodEditora;

            try
            {
                _editoraDAO.Alterar(editora);
                MessageBox.Show("Editora atualizada com sucesso!", "EntreLivros",
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
            if (_editoraCorrente == null)
            {
                MessageBox.Show("Selecione uma editora na lista para remover.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            DialogResult opcao = MessageBox.Show(
                "Remover definitivamente a editora \"" +
                _editoraCorrente.NomeEditora + "\"?",
                "EntreLivros", MessageBoxButtons.YesNo, MessageBoxIcon.Question);

            if (opcao != DialogResult.Yes)
            {
                return;
            }

            try
            {
                _editoraDAO.Remover(_editoraCorrente.CodEditora);
                MessageBox.Show("Editora removida.", "EntreLivros",
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
            _editoraCorrente = null;
            txtNomeEditora.Clear();
            txtCidade.Clear();
            rotuloSituacao.Text = "Preencha os dados e use Gravar para incluir.";
            gradeEditoras.ClearSelection();
            txtNomeEditora.Focus();
        }

        private bool ColetarDados(out Editora editora)
        {
            editora = null;

            if (string.IsNullOrWhiteSpace(txtNomeEditora.Text))
            {
                MessageBox.Show("Informe o nome da editora.", "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtNomeEditora.Focus();
                return false;
            }

            if (string.IsNullOrWhiteSpace(txtCidade.Text))
            {
                MessageBox.Show("Informe a cidade da editora.", "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtCidade.Focus();
                return false;
            }

            editora = new Editora
            {
                NomeEditora = txtNomeEditora.Text.Trim(),
                CidadeEditora = txtCidade.Text.Trim()
            };
            return true;
        }
    }
}