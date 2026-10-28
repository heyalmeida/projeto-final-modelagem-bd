using System;
using System.Collections.Generic;
using System.Windows.Forms;
using ProjetoFinal_C_.DAO;
using ProjetoFinal_C_.Models;
using ProjetoFinal_C_.Utils;

namespace ProjetoFinal_C_.Forms
{
    /// <summary>
    /// Controle de movimentações de estoque (entradas e saídas manuais)
    /// com histórico. Acesso para ADMIN e FUNCIONARIO; o perfil
    /// USUARIO (consulta) não pode abrir esta tela.
    /// </summary>
    public partial class FormMovimentos : Form
    {
        private readonly MovimentoDAO _movimentoDAO = new MovimentoDAO();
        private readonly ObraDAO _obraDAO = new ObraDAO();

        public FormMovimentos(string perfil)
        {
            InitializeComponent();

            // Validação de permissão DENTRO da tela (além do menu).
            if (perfil == "USUARIO")
            {
                throw new UnauthorizedAccessException(
                    "O perfil de consulta não possui acesso ao controle de estoque.");
            }
        }

        private void FormMovimentos_Load(object sender, EventArgs e)
        {
            RecentrarCartao();
            CarregarObras();
            cboTipo.SelectedIndex = 0;
            CarregarHistorico();
        }

        private void FormMovimentos_Resize(object sender, EventArgs e)
        {
            RecentrarCartao();
        }

        private void RecentrarCartao()
        {
            cartaoPrincipal.Left = Math.Max(0, (ClientSize.Width - cartaoPrincipal.Width) / 2);
            cartaoPrincipal.Top = Math.Max(0, (ClientSize.Height - cartaoPrincipal.Height) / 2);
        }

        private void CarregarObras()
        {
            try
            {
                cboObra.DataSource = _obraDAO.Listar();
                cboObra.DisplayMember = "NomeObra";
                cboObra.ValueMember = "CodObra";
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void CarregarHistorico()
        {
            try
            {
                List<Movimento> movimentos = _movimentoDAO.Listar();
                gradeHistorico.DataSource = movimentos;
                gradeHistorico.ClearSelection();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void BtnRegistrar_Click(object sender, EventArgs e)
        {
            Obra obra = cboObra.SelectedItem as Obra;

            if (obra == null)
            {
                MessageBox.Show("Selecione a obra.", "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            string tipo = cboTipo.SelectedItem == null
                ? ""
                : cboTipo.SelectedItem.ToString();

            if (tipo != "ENTRADA" && tipo != "SAIDA")
            {
                MessageBox.Show("Selecione o tipo de movimentação.", "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            if (!Formato.TentarNumero(txtQuantidade.Text, out int quantidade) ||
                quantidade <= 0)
            {
                MessageBox.Show("Quantidade inválida. Informe um inteiro maior que zero.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtQuantidade.Focus();
                return;
            }

            string origem = string.IsNullOrWhiteSpace(txtOrigem.Text)
                ? "MANUAL"
                : txtOrigem.Text.Trim().ToUpper();

            Movimento movimento = new Movimento
            {
                CodObra = obra.CodObra,
                TipoMovimento = tipo,
                QtdMovimentada = quantidade,
                DtHoraMovimento = DateTime.Now,
                OrigemMovimento = origem
            };

            try
            {
                // Grava a movimentação e ajusta o acervo em transação.
                _movimentoDAO.Registrar(movimento);
                MessageBox.Show(
                    "Movimentação registrada: " + tipo + " de " + quantidade +
                    " exemplar(es) de \"" + obra.NomeObra + "\".",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Information);
                txtQuantidade.Clear();
                txtOrigem.Clear();
                CarregarObras();
                CarregarHistorico();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void BtnAtualizarHistorico_Click(object sender, EventArgs e)
        {
            CarregarHistorico();
        }
    }
}