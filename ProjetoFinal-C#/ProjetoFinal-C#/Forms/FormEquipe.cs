using System;
using System.Collections.Generic;
using System.Windows.Forms;
using ProjetoFinal_C_.DAO;
using ProjetoFinal_C_.Models;
using ProjetoFinal_C_.Utils;

namespace ProjetoFinal_C_.Forms
{
    public partial class FormEquipe : Form
    {
        private readonly ColaboradorDAO _colaboradorDAO = new ColaboradorDAO();
        private Colaborador _colaboradorCorrente;

        public FormEquipe(string perfil)
        {
            InitializeComponent();

            // Validação de permissão DENTRO da tela (além do menu).
            if (perfil != "ADMIN")
            {
                throw new UnauthorizedAccessException(
                    "Apenas administradores podem gerenciar a equipe.");
            }
        }

        private void FormEquipe_Load(object sender, EventArgs e)
        {
            RecentrarCartao();
            CarregarEquipe();
        }

        private void FormEquipe_Resize(object sender, EventArgs e)
        {
            RecentrarCartao();
        }

        private void RecentrarCartao()
        {
            cartaoPrincipal.Left = Math.Max(0, (ClientSize.Width - cartaoPrincipal.Width) / 2);
            cartaoPrincipal.Top = Math.Max(0, (ClientSize.Height - cartaoPrincipal.Height) / 2);
        }

        private void CarregarEquipe()
        {
            try
            {
                List<Colaborador> equipe = _colaboradorDAO.Listar();
                gradeEquipe.DataSource = equipe;
                gradeEquipe.ClearSelection();
                LimparFormulario();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void GradeEquipe_SelectionChanged(object sender, EventArgs e)
        {
            if (gradeEquipe.CurrentRow == null ||
                gradeEquipe.CurrentRow.DataBoundItem == null)
            {
                return;
            }

            _colaboradorCorrente = gradeEquipe.CurrentRow.DataBoundItem as Colaborador;
            if (_colaboradorCorrente == null)
            {
                return;
            }

            txtNomeColaborador.Text = _colaboradorCorrente.NomeColaborador;
            txtCpf.Text = _colaboradorCorrente.NumCpf;
            txtFuncao.Text = _colaboradorCorrente.Funcao;
            txtRemuneracao.Text = Formato.Dinheiro(_colaboradorCorrente.Remuneracao);
            calendContratacao.Value = _colaboradorCorrente.DtContratacao;
            txtTelefone.Text = _colaboradorCorrente.NumTelefone;
            rotuloSituacao.Text = "Em edição: " + _colaboradorCorrente.NomeColaborador;
        }

        private void BtnGravar_Click(object sender, EventArgs e)
        {
            Colaborador c;
            if (!ColetarDados(out c))
            {
                return;
            }

            try
            {
                if (_colaboradorDAO.CpfEmUso(c.NumCpf, 0))
                {
                    MessageBox.Show("Este CPF já está cadastrado na equipe.",
                        "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                _colaboradorDAO.Incluir(c);
                MessageBox.Show("Colaborador incluído com sucesso!", "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
                CarregarEquipe();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void BtnAlterar_Click(object sender, EventArgs e)
        {
            if (_colaboradorCorrente == null)
            {
                MessageBox.Show("Selecione um colaborador na lista para alterar.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            Colaborador c;
            if (!ColetarDados(out c))
            {
                return;
            }
            c.CodColaborador = _colaboradorCorrente.CodColaborador;

            try
            {
                if (_colaboradorDAO.CpfEmUso(c.NumCpf, c.CodColaborador))
                {
                    MessageBox.Show("Este CPF já pertence a outro colaborador.",
                        "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                _colaboradorDAO.Alterar(c);
                MessageBox.Show("Colaborador atualizado com sucesso!", "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
                CarregarEquipe();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void BtnRemover_Click(object sender, EventArgs e)
        {
            if (_colaboradorCorrente == null)
            {
                MessageBox.Show("Selecione um colaborador na lista para remover.",
                    "EntreLivros", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            DialogResult opcao = MessageBox.Show(
                "Remover \"" + _colaboradorCorrente.NomeColaborador + "\" da equipe?",
                "EntreLivros", MessageBoxButtons.YesNo, MessageBoxIcon.Question);

            if (opcao != DialogResult.Yes)
            {
                return;
            }

            try
            {
                _colaboradorDAO.Remover(_colaboradorCorrente.CodColaborador);
                MessageBox.Show("Colaborador removido da equipe.", "EntreLivros",
                    MessageBoxButtons.OK, MessageBoxIcon.Information);
                CarregarEquipe();
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
            _colaboradorCorrente = null;
            txtNomeColaborador.Clear();
            txtCpf.Clear();
            txtFuncao.Clear();
            txtRemuneracao.Clear();
            calendContratacao.Value = DateTime.Today;
            txtTelefone.Clear();
            rotuloSituacao.Text = "Preencha os dados e use Gravar para incluir.";
            gradeEquipe.ClearSelection();
            txtNomeColaborador.Focus();
        }

        private bool ColetarDados(out Colaborador c)
        {
            c = null;

            if (string.IsNullOrWhiteSpace(txtNomeColaborador.Text))
            {
                Avisar("Informe o nome do colaborador.", txtNomeColaborador);
                return false;
            }

            if (string.IsNullOrWhiteSpace(txtCpf.Text))
            {
                Avisar("Informe o CPF do colaborador.", txtCpf);
                return false;
            }

            if (string.IsNullOrWhiteSpace(txtFuncao.Text))
            {
                Avisar("Informe a função do colaborador.", txtFuncao);
                return false;
            }

            if (!Formato.TentarDinheiro(txtRemuneracao.Text, out decimal remuneracao))
            {
                Avisar("Remuneração inválida. Use vírgula (ex: 2500,00).", txtRemuneracao);
                return false;
            }

            if (remuneracao <= 0)
            {
                Avisar("A remuneração precisa ser maior que zero.", txtRemuneracao);
                return false;
            }

            if (calendContratacao.Value.Date > DateTime.Today)
            {
                Avisar("A data de contratação não pode ser futura.", calendContratacao);
                return false;
            }

            c = new Colaborador
            {
                NomeColaborador = txtNomeColaborador.Text.Trim(),
                NumCpf = txtCpf.Text.Trim(),
                Funcao = txtFuncao.Text.Trim(),
                Remuneracao = remuneracao,
                DtContratacao = calendContratacao.Value.Date,
                NumTelefone = txtTelefone.Text.Trim()
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