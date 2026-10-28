using System;
using System.Collections.Generic;
using System.Windows.Forms;
using ProjetoFinal_C_.DAO;
using ProjetoFinal_C_.Models;
using ProjetoFinal_C_.Utils;

namespace ProjetoFinal_C_.Forms
{
    public partial class FormAcervo : Form
    {
        private readonly ObraDAO _obraDAO = new ObraDAO();
        private readonly EditoraDAO _editoraDAO = new EditoraDAO();
        private Obra _obraCorrente;
        private readonly string _perfil;

        /// <summary>
        /// perfil: ADMIN (tudo), FUNCIONARIO (sem remoção) ou
        /// USUARIO (somente consulta — edição bloqueada).
        /// </summary>
        public FormAcervo(string perfil)
        {
            InitializeComponent();
            _perfil = string.IsNullOrEmpty(perfil) ? "FUNCIONARIO" : perfil.ToUpper();
        }

        private void FormAcervo_Load(object sender, EventArgs e)
        {
            RecentrarCartao();
            AplicarPermissoes();
            CarregarEditoras();
            CarregarAcervo();
        }

        /// <summary>
        /// Validação de permissões DENTRO da tela (além do menu):
        /// - USUARIO: apenas consulta (botões de edição desabilitados);
        /// - FUNCIONARIO: grava/altera, mas não remove obras;
        /// - ADMIN: acesso completo.
        /// </summary>
        private void AplicarPermissoes()
        {
            if (_perfil == "USUARIO")
            {
                btnGravar.Enabled = false;
                btnAlterar.Enabled = false;
                btnRemover.Enabled = false;
                btnLimpar.Enabled = false;
                rotuloSituacao.Text = "Perfil de consulta: edição bloqueada.";
            }
            else if (_perfil == "FUNCIONARIO")
            {
                btnRemover.Enabled = false;
                rotuloSituacao.Text = "Perfil funcionário: remoção bloqueada.";
            }
        }

        private void FormAcervo_Resize(object sender, EventArgs e)
        {
            RecentrarCartao();
        }

        /// <summary>
        /// Mantém o cartão centralizado dentro da área de conteúdo.
        /// </summary>
        private void RecentrarCartao()
        {
            cartaoPrincipal.Left = Math.Max(0, (ClientSize.Width - cartaoPrincipal.Width) / 2);
            cartaoPrincipal.Top = Math.Max(0, (ClientSize.Height - cartaoPrincipal.Height) / 2);
        }

        private void CarregarEditoras()
        {
            try
            {
                cboEditora.DataSource = _editoraDAO.Listar();
                cboEditora.DisplayMember = "NomeEditora";
                cboEditora.ValueMember = "CodEditora";
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        /// <summary>
        /// Recarrega o grid do acervo (após incluir, alterar ou remover).
        /// </summary>
        private void CarregarAcervo()
        {
            try
            {
                List<Obra> obras = _obraDAO.Listar();
                gradeAcervo.DataSource = obras;
                gradeAcervo.ClearSelection();
                LimparFormulario();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void GradeAcervo_SelectionChanged(object sender, EventArgs e)
        {
            if (gradeAcervo.CurrentRow == null ||
                gradeAcervo.CurrentRow.DataBoundItem == null)
            {
                return;
            }

            _obraCorrente = gradeAcervo.CurrentRow.DataBoundItem as Obra;
            if (_obraCorrente == null)
            {
                return;
            }

            txtNomeObra.Text = _obraCorrente.NomeObra;
            txtAutor.Text = _obraCorrente.NomeAutor;
            cboEditora.SelectedValue = _obraCorrente.CodEditora;
            txtCodigoBarras.Text = _obraCorrente.CodigoBarras;
            txtCategoria.Text = _obraCorrente.Categoria;
            txtValor.Text = Formato.Dinheiro(_obraCorrente.ValorUnitario);
            txtQtd.Text = _obraCorrente.QtdAcervo.ToString();
            txtAno.Text = _obraCorrente.AnoPublicacao.ToString();
            rotuloSituacao.Text = "Em edição: " + _obraCorrente.NomeObra;
        }

        private void BtnGravar_Click(object sender, EventArgs e)
        {
            Obra obra;
            if (!ColetarDados(out obra))
            {
                return;
            }

            try
            {
                if (_obraDAO.CodigoBarrasEmUso(obra.CodigoBarras, 0))
                {
                    MessageBox.Show("Este código de barras já pertence a outra obra.",
                        "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                _obraDAO.Incluir(obra);
                MessageBox.Show("Obra incluída no acervo com sucesso!", "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
                CarregarAcervo();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void BtnAlterar_Click(object sender, EventArgs e)
        {
            if (_obraCorrente == null)
            {
                MessageBox.Show("Selecione uma obra na lista para alterar.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            Obra obra;
            if (!ColetarDados(out obra))
            {
                return;
            }
            obra.CodObra = _obraCorrente.CodObra;

            try
            {
                if (_obraDAO.CodigoBarrasEmUso(obra.CodigoBarras, obra.CodObra))
                {
                    MessageBox.Show("Este código de barras já pertence a outra obra.",
                        "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                _obraDAO.Alterar(obra);
                MessageBox.Show("Obra atualizada com sucesso!", "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
                CarregarAcervo();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void BtnRemover_Click(object sender, EventArgs e)
        {
            if (_obraCorrente == null)
            {
                MessageBox.Show("Selecione uma obra na lista para remover.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            DialogResult opcao = MessageBox.Show(
                "Remover definitivamente a obra \"" + _obraCorrente.NomeObra + "\" do acervo?",
                "EntreLivros", MessageBoxButtons.YesNo, MessageBoxIcon.Question);

            if (opcao != DialogResult.Yes)
            {
                return;
            }

            try
            {
                _obraDAO.Remover(_obraCorrente.CodObra);
                MessageBox.Show("Obra removida do acervo.", "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
                CarregarAcervo();
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
            _obraCorrente = null;
            txtNomeObra.Clear();
            txtAutor.Clear();
            if (cboEditora.Items.Count > 0)
            {
                cboEditora.SelectedIndex = 0;
            }
            txtCodigoBarras.Clear();
            txtCategoria.Clear();
            txtValor.Clear();
            txtQtd.Clear();
            txtAno.Clear();
            rotuloSituacao.Text = _perfil == "USUARIO"
                ? "Perfil de consulta: edição bloqueada."
                : (_perfil == "FUNCIONARIO"
                    ? "Perfil funcionário: remoção bloqueada."
                    : "Preencha os dados e use Gravar para incluir.");
            gradeAcervo.ClearSelection();
            txtNomeObra.Focus();
        }

        /// <summary>
        /// Valida os campos ANTES de acionar o DAO.
        /// </summary>
        private bool ColetarDados(out Obra obra)
        {
            obra = null;

            if (string.IsNullOrWhiteSpace(txtNomeObra.Text))
            {
                Avisar("Informe o nome da obra.", txtNomeObra);
                return false;
            }

            if (string.IsNullOrWhiteSpace(txtAutor.Text))
            {
                Avisar("Informe o autor da obra.", txtAutor);
                return false;
            }

            Editora editora = cboEditora.SelectedItem as Editora;
            if (editora == null)
            {
                Avisar("Selecione a editora da obra.", cboEditora);
                return false;
            }

            if (string.IsNullOrWhiteSpace(txtCodigoBarras.Text))
            {
                Avisar("Informe o código de barras (ISBN) da obra.", txtCodigoBarras);
                return false;
            }

            if (string.IsNullOrWhiteSpace(txtCategoria.Text))
            {
                Avisar("Informe a categoria da obra.", txtCategoria);
                return false;
            }

            if (!Formato.TentarDinheiro(txtValor.Text, out decimal valor))
            {
                Avisar("Valor unitário inválido. Use vírgula (ex: 39,90).", txtValor);
                return false;
            }

            if (valor <= 0)
            {
                Avisar("O valor unitário precisa ser maior que zero.", txtValor);
                return false;
            }

            if (!Formato.TentarNumero(txtQtd.Text, out int qtd))
            {
                Avisar("Quantidade em acervo inválida. Use número inteiro.", txtQtd);
                return false;
            }

            if (qtd < 0)
            {
                Avisar("A quantidade em acervo não pode ser negativa.", txtQtd);
                return false;
            }

            if (!Formato.TentarNumero(txtAno.Text, out int ano))
            {
                Avisar("Ano de publicação inválido.", txtAno);
                return false;
            }

            if (ano < 1400 || ano > DateTime.Now.Year)
            {
                Avisar("Informe um ano de publicação plausível.", txtAno);
                return false;
            }

            obra = new Obra
            {
                NomeObra = txtNomeObra.Text.Trim(),
                NomeAutor = txtAutor.Text.Trim(),
                CodEditora = editora.CodEditora,
                CodigoBarras = txtCodigoBarras.Text.Trim(),
                Categoria = txtCategoria.Text.Trim(),
                ValorUnitario = valor,
                QtdAcervo = qtd,
                AnoPublicacao = ano
            };

            return true;
        }

        private static void Avisar(string mensagem, Control controle)
        {
            MessageBox.Show(mensagem, "EntreLivros",
                MessageBoxButtons.OK, MessageBoxIcon.Warning);
            controle.Focus();
        }
    }
}