using System;
using System.Collections.Generic;
using System.Windows.Forms;
using ProjetoFinal_C_.DAO;
using ProjetoFinal_C_.Models;
using ProjetoFinal_C_.Utils;

namespace ProjetoFinal_C_.Forms
{
    /// <summary>
    /// Painel de visão geral com indicadores do negócio.
    /// Disponível para todos os perfis (ADMIN, FUNCIONARIO e USUARIO).
    /// </summary>
    public partial class FormPainel : Form
    {
        private readonly ObraDAO _obraDAO = new ObraDAO();
        private readonly PedidoDAO _pedidoDAO = new PedidoDAO();
        private readonly ColaboradorDAO _colaboradorDAO = new ColaboradorDAO();
        private readonly string _operador;
        private readonly string _perfil;

        public FormPainel(string operador, string perfil)
        {
            InitializeComponent();
            _operador = operador;
            _perfil = perfil;
        }

        private void FormPainel_Load(object sender, EventArgs e)
        {
            RecentrarCartao();
            rotuloBoasVindas.Text = "Bem-vindo(a), " + _operador +
                " — perfil " + _perfil;
            CarregarIndicadores();
        }

        private void FormPainel_Resize(object sender, EventArgs e)
        {
            RecentrarCartao();
        }

        private void RecentrarCartao()
        {
            cartaoPrincipal.Left = Math.Max(0, (ClientSize.Width - cartaoPrincipal.Width) / 2);
            cartaoPrincipal.Top = Math.Max(0, (ClientSize.Height - cartaoPrincipal.Height) / 2);
        }

        private void CarregarIndicadores()
        {
            try
            {
                // Acervo
                List<Obra> obras = _obraDAO.Listar();
                int totalObras = obras.Count;
                int totalExemplares = 0;
                decimal valorAcervo = 0;
                int semEstoque = 0;

                foreach (Obra obra in obras)
                {
                    totalExemplares += obra.QtdAcervo;
                    valorAcervo += obra.ValorUnitario * obra.QtdAcervo;
                    if (obra.QtdAcervo == 0)
                    {
                        semEstoque++;
                    }
                }

                // Pedidos de hoje
                List<Pedido> hoje = _pedidoDAO.ListarPorPeriodo(
                    DateTime.Today, DateTime.Today);

                // Faturamento dos últimos 30 dias
                List<Pedido> periodo = _pedidoDAO.ListarPorPeriodo(
                    DateTime.Today.AddDays(-30), DateTime.Today);
                decimal faturamento = 0;
                foreach (Pedido pedido in periodo)
                {
                    faturamento += pedido.ValorTotal;
                }

                // Equipe
                int totalColaboradores = _colaboradorDAO.Listar().Count;

                rotObras.Text = totalObras.ToString();
                rotExemplares.Text = totalExemplares.ToString();
                rotValorAcervo.Text = "R$ " + Formato.Dinheiro(valorAcervo);
                rotPedidosHoje.Text = hoje.Count.ToString();
                rotFaturamento.Text = "R$ " + Formato.Dinheiro(faturamento);
                rotEquipe.Text = totalColaboradores.ToString();
                rotSemEstoque.Text = semEstoque.ToString();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void BtnAtualizar_Click(object sender, EventArgs e)
        {
            CarregarIndicadores();
        }
    }
}