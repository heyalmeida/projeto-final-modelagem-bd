using System;
using System.Collections.Generic;
using System.Windows.Forms;
using ProjetoFinal_C_.DAO;
using ProjetoFinal_C_.Models;

namespace ProjetoFinal_C_.Forms
{
    /// <summary>
    /// Janela modal de escolha de obra para o pedido.
    /// Exibe somente obras com exemplares disponíveis.
    /// </summary>
    public partial class FormBuscaObra : Form
    {
        private readonly ObraDAO _obraDAO = new ObraDAO();

        public Obra ObraEscolhida { get; private set; }

        public FormBuscaObra()
        {
            InitializeComponent();
        }

        private void FormBuscaObra_Load(object sender, EventArgs e)
        {
            CarregarObras();
        }

        private void CarregarObras()
        {
            try
            {
                List<Obra> obras = _obraDAO.ListarDisponiveis();
                gradeObras.DataSource = obras;
                gradeObras.ClearSelection();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void BtnEscolher_Click(object sender, EventArgs e)
        {
            ConfirmarEscolha();
        }

        private void BtnVoltar_Click(object sender, EventArgs e)
        {
            ObraEscolhida = null;
            DialogResult = DialogResult.Cancel;
            Close();
        }

        private void GradeObras_CellDoubleClick(object sender,
            DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                ConfirmarEscolha();
            }
        }

        private void ConfirmarEscolha()
        {
            if (gradeObras.CurrentRow == null ||
                gradeObras.CurrentRow.DataBoundItem == null)
            {
                MessageBox.Show("Escolha uma obra na lista.", "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            ObraEscolhida = gradeObras.CurrentRow.DataBoundItem as Obra;

            if (ObraEscolhida == null)
            {
                MessageBox.Show("Não foi possível recuperar a obra escolhida.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            DialogResult = DialogResult.OK;
            Close();
        }
    }
}