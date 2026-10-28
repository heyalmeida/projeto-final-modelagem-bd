using System;
using System.Collections.Generic;
using System.Windows.Forms;
using ProjetoFinal_C_.DAO;
using ProjetoFinal_C_.Models;
using ProjetoFinal_C_.Utils;

namespace ProjetoFinal_C_.Forms
{
    public partial class FormPedidos : Form
    {
        private readonly ObraDAO _obraDAO = new ObraDAO();
        private readonly ColaboradorDAO _colaboradorDAO = new ColaboradorDAO();
        private readonly PedidoDAO _pedidoDAO = new PedidoDAO();
        private readonly List<PedidoItem> _sacola = new List<PedidoItem>();
        private Obra _obraCorrente;

        public FormPedidos(string perfil)
        {
            InitializeComponent();

            // Validação de permissão DENTRO da tela (além do menu):
            // o perfil USUARIO (consulta) não registra pedidos.
            if (perfil == "USUARIO")
            {
                throw new UnauthorizedAccessException(
                    "O perfil de consulta não possui acesso ao registro de pedidos.");
            }
        }

        private void FormPedidos_Load(object sender, EventArgs e)
        {
            RecentrarCartao();
            CarregarColaboradores();
            cboPagamento.SelectedIndex = 0;
            AtualizarSacola();
        }

        private void FormPedidos_Resize(object sender, EventArgs e)
        {
            RecentrarCartao();
        }

        private void RecentrarCartao()
        {
            cartaoPrincipal.Left = Math.Max(0, (ClientSize.Width - cartaoPrincipal.Width) / 2);
            cartaoPrincipal.Top = Math.Max(0, (ClientSize.Height - cartaoPrincipal.Height) / 2);
        }

        private void CarregarColaboradores()
        {
            try
            {
                cboColaborador.DataSource = _colaboradorDAO.Listar();
                cboColaborador.DisplayMember = "NomeColaborador";
                cboColaborador.ValueMember = "CodColaborador";
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        /// <summary>
        /// Abre o popup modal de busca de obras (apenas com exemplares).
        /// O valor é preenchido automaticamente na escolha da obra.
        /// </summary>
        private void BtnBuscarObra_Click(object sender, EventArgs e)
        {
            try
            {
                using (FormBuscaObra busca = new FormBuscaObra())
                {
                    if (busca.ShowDialog(this) == DialogResult.OK &&
                        busca.ObraEscolhida != null)
                    {
                        _obraCorrente = busca.ObraEscolhida;
                        txtObra.Text = _obraCorrente.NomeObra + " — " + _obraCorrente.NomeAutor;
                        txtValorObra.Text = Formato.Dinheiro(_obraCorrente.ValorUnitario);
                        rotuloDisponibilidade.Text =
                            "Exemplares disponíveis: " + _obraCorrente.QtdAcervo;
                        txtQuantidade.Clear();
                        txtAbatimento.Clear();
                        txtQuantidade.Focus();
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void BtnIncluirItem_Click(object sender, EventArgs e)
        {
            if (_obraCorrente == null)
            {
                MessageBox.Show("Use \"Buscar Obra\" para escolher uma obra primeiro.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            if (!Formato.TentarNumero(txtQuantidade.Text, out int quantidade) || quantidade <= 0)
            {
                MessageBox.Show("Quantidade inválida. Informe um inteiro maior que zero.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtQuantidade.Focus();
                return;
            }

            // Abatimento é opcional: em branco conta como zero.
            decimal abatimento = 0;
            if (!string.IsNullOrWhiteSpace(txtAbatimento.Text) &&
                !Formato.TentarDinheiro(txtAbatimento.Text, out abatimento))
            {
                MessageBox.Show("Abatimento inválido. Informe um percentual entre 0 e 100.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtAbatimento.Focus();
                return;
            }

            if (abatimento < 0 || abatimento > 100)
            {
                MessageBox.Show("O abatimento deve ficar entre 0% e 100%.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtAbatimento.Focus();
                return;
            }

            // Considera exemplares já reservados na sacola para a mesma obra.
            int reservados = 0;
            foreach (PedidoItem item in _sacola)
            {
                if (item.CodObra == _obraCorrente.CodObra)
                {
                    reservados += item.QtdVendida;
                }
            }

            if (reservados + quantidade > _obraCorrente.QtdAcervo)
            {
                MessageBox.Show(
                    "Quantidade acima da disponível. Restam " +
                    (_obraCorrente.QtdAcervo - reservados) + " exemplar(es).",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                txtQuantidade.Focus();
                return;
            }

            PedidoItem novo = new PedidoItem
            {
                CodObra = _obraCorrente.CodObra,
                NomeObra = _obraCorrente.NomeObra,
                QtdVendida = quantidade,
                ValorCobrado = _obraCorrente.ValorUnitario,
                AbatimentoPct = abatimento,
                ValorLiquido = Math.Round(
                    quantidade * _obraCorrente.ValorUnitario * (1 - abatimento / 100m), 2)
            };

            _sacola.Add(novo);
            AtualizarSacola();
            LimparCamposItem();
        }

        private void BtnRetirarItem_Click(object sender, EventArgs e)
        {
            if (gradeSacola.CurrentRow == null)
            {
                MessageBox.Show("Selecione um item da sacola para retirar.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            PedidoItem item = gradeSacola.CurrentRow.Tag as PedidoItem;
            if (item != null)
            {
                _sacola.Remove(item);
                AtualizarSacola();
            }
        }

        private void BtnConcluirPedido_Click(object sender, EventArgs e)
        {
            Colaborador colaborador = cboColaborador.SelectedItem as Colaborador;

            if (colaborador == null)
            {
                MessageBox.Show("Selecione o colaborador responsável pelo pedido.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            if (_sacola.Count == 0)
            {
                MessageBox.Show("Inclua ao menos uma obra na sacola.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            DialogResult opcao = MessageBox.Show(
                "Confirmar o pedido no valor de R$ " +
                Formato.Dinheiro(CalcularTotal()) + "?",
                "EntreLivros", MessageBoxButtons.YesNo, MessageBoxIcon.Question);

            if (opcao != DialogResult.Yes)
            {
                return;
            }

            Pedido pedido = new Pedido
            {
                DtHoraPedido = DateTime.Now,
                CodColaborador = colaborador.CodColaborador,
                NomeCliente = txtCliente.Text.Trim(),
                FormaPagamento = cboPagamento.SelectedItem.ToString(),
                ValorTotal = CalcularTotal()
            };

            try
            {
                // Grava cabeçalho + itens + baixa de acervo + movimentações
                // de estoque, tudo em uma única transação.
                _pedidoDAO.Registrar(pedido, _sacola);
                MessageBox.Show(
                    "Pedido concluído!\n\nNº do pedido: " + pedido.CodPedido +
                    "\nValor: R$ " + Formato.Dinheiro(pedido.ValorTotal),
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Information);
                LimparTudo();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void BtnDescartar_Click(object sender, EventArgs e)
        {
            if (_sacola.Count > 0)
            {
                DialogResult opcao = MessageBox.Show(
                    "Descartar todos os itens da sacola atual?",
                    "EntreLivros", MessageBoxButtons.YesNo, MessageBoxIcon.Question);

                if (opcao != DialogResult.Yes)
                {
                    return;
                }
            }

            LimparTudo();
        }

        /// <summary>
        /// Reconstrói a sacola exibida e recalcula o valor do pedido.
        /// </summary>
        private void AtualizarSacola()
        {
            gradeSacola.Rows.Clear();

            foreach (PedidoItem item in _sacola)
            {
                gradeSacola.Rows.Add(
                    item.NomeObra,
                    item.QtdVendida,
                    Formato.Dinheiro(item.ValorCobrado),
                    Formato.Dinheiro(item.AbatimentoPct),
                    Formato.Dinheiro(item.ValorLiquido));
                gradeSacola.Rows[gradeSacola.Rows.Count - 1].Tag = item;
            }

            rotuloTotal.Text = "Valor do pedido: R$ " +
                Formato.Dinheiro(CalcularTotal());
        }

        private decimal CalcularTotal()
        {
            decimal total = 0;
            foreach (PedidoItem item in _sacola)
            {
                total += item.ValorLiquido;
            }
            return total;
        }

        private void LimparCamposItem()
        {
            _obraCorrente = null;
            txtObra.Clear();
            txtValorObra.Clear();
            txtQuantidade.Clear();
            txtAbatimento.Clear();
            rotuloDisponibilidade.Text = "";
        }

        private void LimparTudo()
        {
            _sacola.Clear();
            txtCliente.Clear();
            if (cboPagamento.Items.Count > 0)
            {
                cboPagamento.SelectedIndex = 0;
            }
            LimparCamposItem();
            AtualizarSacola();
        }
    }
}