using System;
using System.Collections.Generic;
using System.Windows.Forms;
using ProjetoFinal_C_.DAO;
using ProjetoFinal_C_.Models;
using ProjetoFinal_C_.Utils;

namespace ProjetoFinal_C_.Forms
{
    public partial class FormBalanco : Form
    {
        private readonly PedidoDAO _pedidoDAO = new PedidoDAO();

        public FormBalanco()
        {
            InitializeComponent();
        }

        private void FormBalanco_Load(object sender, EventArgs e)
        {
            RecentrarCartao();
            calInicio.Value = DateTime.Today.AddMonths(-1);
            calFim.Value = DateTime.Today;
            Consultar();
        }

        private void FormBalanco_Resize(object sender, EventArgs e)
        {
            RecentrarCartao();
        }

        private void RecentrarCartao()
        {
            cartaoPrincipal.Left = Math.Max(0, (ClientSize.Width - cartaoPrincipal.Width) / 2);
            cartaoPrincipal.Top = Math.Max(0, (ClientSize.Height - cartaoPrincipal.Height) / 2);
        }

        private void BtnConsultar_Click(object sender, EventArgs e)
        {
            Consultar();
        }

        /// <summary>
        /// Carrega os pedidos do período, o valor total e as estatísticas.
        /// </summary>
        private void Consultar()
        {
            if (calInicio.Value.Date > calFim.Value.Date)
            {
                MessageBox.Show("A data inicial não pode vir depois da data final.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            try
            {
                List<Pedido> pedidos = _pedidoDAO.ListarPorPeriodo(
                    calInicio.Value, calFim.Value);

                gradePedidos.DataSource = pedidos;
                gradePedidos.ClearSelection();
                gradeItens.Rows.Clear();

                decimal faturamento = 0;
                foreach (Pedido pedido in pedidos)
                {
                    faturamento += pedido.ValorTotal;
                }

                int quantidadePedidos = pedidos.Count;
                decimal ticket = quantidadePedidos > 0
                    ? faturamento / quantidadePedidos
                    : 0;

                rotuloFaturamento.Text = "Faturamento do período: R$ " +
                    Formato.Dinheiro(faturamento);
                rotuloEstatisticas.Text =
                    "Pedidos: " + quantidadePedidos +
                    "    |    Ticket médio: R$ " + Formato.Dinheiro(ticket);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        /// <summary>
        /// Ao selecionar um pedido, exibe os itens dele.
        /// </summary>
        private void GradePedidos_SelectionChanged(object sender, EventArgs e)
        {
            gradeItens.Rows.Clear();

            if (gradePedidos.CurrentRow == null ||
                gradePedidos.CurrentRow.DataBoundItem == null)
            {
                return;
            }

            Pedido pedido = gradePedidos.CurrentRow.DataBoundItem as Pedido;
            if (pedido == null)
            {
                return;
            }

            try
            {
                List<PedidoItem> itens = _pedidoDAO.ListarItens(pedido.CodPedido);

                foreach (PedidoItem item in itens)
                {
                    gradeItens.Rows.Add(
                        item.NomeObra,
                        item.QtdVendida,
                        Formato.Dinheiro(item.ValorCobrado),
                        Formato.Dinheiro(item.AbatimentoPct),
                        Formato.Dinheiro(item.ValorLiquido));
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}