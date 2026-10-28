using System;
using System.Drawing;
using System.Windows.Forms;
using ProjetoFinal_C_.Forms;

namespace ProjetoFinal_C_.Forms
{
    /// <summary>
    /// Janela central do EntreLivros: navegação lateral à esquerda e área
    /// de conteúdo à direita, onde as 8 telas funcionais são embutidas.
    /// O menu é filtrado pelo perfil do operador autenticado e cada tela
    /// revalida a permissão ao ser aberta:
    /// - ADMIN: acesso total (8 telas);
    /// - FUNCIONARIO: sem Editoras, Equipe e Contas (5 telas) e sem
    ///   remoção de obras no Acervo;
    /// - USUARIO: somente Painel, Acervo (consulta) e Balanço (3 telas).
    /// </summary>
    public partial class FormPrincipal : Form
    {
        private Form _telaCorrente;
        private readonly string _operador;
        private readonly string _perfil;

        public FormPrincipal(string operador, string perfil)
        {
            InitializeComponent();
            _operador = operador;
            _perfil = string.IsNullOrEmpty(perfil) ? "FUNCIONARIO" : perfil.ToUpper();
            rotuloOperador.Text = "Operador: " + _operador + " (" + _perfil + ")";
            AplicarPermissoes();
            AdaptarNavegacao();

            // Abre o painel de visão geral assim que o sistema carrega.
            ExibirTela(() => new FormPainel(_operador, _perfil));
        }

        /// <summary>
        /// Embute a tela indicada na área de conteúdo, descarregando
        /// a tela anterior. Se a tela rejeitar o perfil (UnauthorizedAccess),
        /// informa o usuário e mantém a tela atual.
        /// </summary>
        private void ExibirTela(Func<Form> criarTela)
        {
            Form novaTela;
            try
            {
                novaTela = criarTela();
            }
            catch (UnauthorizedAccessException)
            {
                MessageBox.Show(
                    "Seu perfil (" + _perfil + ") não tem permissão para abrir esta tela.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Stop);
                return;
            }

            if (_telaCorrente != null)
            {
                areaConteudo.Controls.Remove(_telaCorrente);
                _telaCorrente.Dispose();
                _telaCorrente = null;
            }

            novaTela.TopLevel = false;
            novaTela.FormBorderStyle = FormBorderStyle.None;
            novaTela.Dock = DockStyle.Fill;
            areaConteudo.Controls.Add(novaTela);
            novaTela.Show();
            _telaCorrente = novaTela;
        }

        /// <summary>
        /// Mostra/oculta as opções da navegação conforme o perfil.
        /// </summary>
        private void AplicarPermissoes()
        {
            // ADMIN: tudo visível.
            btnPainel.Visible = true;
            btnAcervo.Visible = true;
            btnBalanco.Visible = true;

            bool ehAdmin = _perfil == "ADMIN";
            bool ehFuncionario = _perfil == "FUNCIONARIO";

            btnEditoras.Visible = ehAdmin;
            btnEquipe.Visible = ehAdmin;
            btnContas.Visible = ehAdmin;

            // Pedidos e Movimentos: ADMIN e FUNCIONARIO (não USUARIO).
            btnPedidos.Visible = ehAdmin || ehFuncionario;
            btnMovimentos.Visible = ehAdmin || ehFuncionario;
        }

        private void BtnPainel_Click(object sender, EventArgs e)
        {
            ExibirTela(() => new FormPainel(_operador, _perfil));
        }

        private void BtnAcervo_Click(object sender, EventArgs e)
        {
            ExibirTela(() => new FormAcervo(_perfil));
        }

        private void BtnEditoras_Click(object sender, EventArgs e)
        {
            // Validação dupla: o menu já oculta, mas o clique revalida.
            if (_perfil != "ADMIN")
            {
                SemPermissao("gerenciar editoras");
                return;
            }
            ExibirTela(() => new FormEditoras(_perfil));
        }

        private void BtnEquipe_Click(object sender, EventArgs e)
        {
            if (_perfil != "ADMIN")
            {
                SemPermissao("gerenciar a equipe");
                return;
            }
            ExibirTela(() => new FormEquipe(_perfil));
        }

        private void BtnPedidos_Click(object sender, EventArgs e)
        {
            if (_perfil == "USUARIO")
            {
                SemPermissao("registrar pedidos");
                return;
            }
            ExibirTela(() => new FormPedidos(_perfil));
        }

        private void BtnMovimentos_Click(object sender, EventArgs e)
        {
            if (_perfil == "USUARIO")
            {
                SemPermissao("movimentar o estoque");
                return;
            }
            ExibirTela(() => new FormMovimentos(_perfil));
        }

        private void BtnBalanco_Click(object sender, EventArgs e)
        {
            ExibirTela(() => new FormBalanco());
        }

        private void BtnContas_Click(object sender, EventArgs e)
        {
            if (_perfil != "ADMIN")
            {
                SemPermissao("gerenciar contas de acesso");
                return;
            }
            ExibirTela(() => new FormContas(_perfil));
        }

        private void BtnEncerrarSessao_Click(object sender, EventArgs e)
        {
            DialogResult opcao = MessageBox.Show(
                "Deseja realmente encerrar a sessão?", "EntreLivros",
                MessageBoxButtons.YesNo, MessageBoxIcon.Question);

            if (opcao == DialogResult.Yes)
            {
                Close();
            }
        }

        private void SemPermissao(string acao)
        {
            MessageBox.Show(
                "Seu perfil (" + _perfil + ") não tem permissão para " + acao + ".",
                "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Stop);
        }

        private void FormPrincipal_Resize(object sender, EventArgs e)
        {
            AdaptarNavegacao();
        }

        /// <summary>
        /// Ajusta proporcionalmente os elementos da navegação quando a
        /// janela é redimensionada (com limites de segurança).
        /// </summary>
        private void AdaptarNavegacao()
        {
            float escala = Math.Max(0.92f, Math.Min(1.3f, ClientSize.Height / 640f));

            marcaPrincipal.Font = new Font("Tahoma", 15F * escala, FontStyle.Bold);
            marcaSecundaria.Font = new Font("Tahoma", 8F * escala);
            rotuloOperador.Font = new Font("Tahoma", 7.5F * escala);

            RedimensionarBotao(btnPainel, escala);
            RedimensionarBotao(btnAcervo, escala);
            RedimensionarBotao(btnEditoras, escala);
            RedimensionarBotao(btnEquipe, escala);
            RedimensionarBotao(btnPedidos, escala);
            RedimensionarBotao(btnMovimentos, escala);
            RedimensionarBotao(btnBalanco, escala);
            RedimensionarBotao(btnContas, escala);
            RedimensionarBotao(btnEncerrarSessao, escala);
        }

        private void RedimensionarBotao(Button botao, float escala)
        {
            botao.Height = (int)(38 * escala);
            botao.Font = new Font("Tahoma", Math.Max(8F, 9.5F * escala));
        }
    }
}