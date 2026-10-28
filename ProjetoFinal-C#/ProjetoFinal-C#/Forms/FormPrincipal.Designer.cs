namespace ProjetoFinal_C_.Forms
{
    partial class FormPrincipal
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Código gerado pelo Windows Form Designer

        private void InitializeComponent()
        {
            this.areaConteudo = new System.Windows.Forms.Panel();
            this.painelNavegacao = new System.Windows.Forms.Panel();
            this.btnEncerrarSessao = new System.Windows.Forms.Button();
            this.btnContas = new System.Windows.Forms.Button();
            this.btnBalanco = new System.Windows.Forms.Button();
            this.btnMovimentos = new System.Windows.Forms.Button();
            this.btnPedidos = new System.Windows.Forms.Button();
            this.btnEquipe = new System.Windows.Forms.Button();
            this.btnEditoras = new System.Windows.Forms.Button();
            this.btnAcervo = new System.Windows.Forms.Button();
            this.btnPainel = new System.Windows.Forms.Button();
            this.rotuloOperador = new System.Windows.Forms.Label();
            this.marcaSecundaria = new System.Windows.Forms.Label();
            this.marcaPrincipal = new System.Windows.Forms.Label();
            this.painelNavegacao.SuspendLayout();
            this.SuspendLayout();
            // 
            // areaConteudo
            // 
            this.areaConteudo.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(245)))), ((int)(((byte)(243)))), ((int)(((byte)(248)))));
            this.areaConteudo.Dock = System.Windows.Forms.DockStyle.Fill;
            this.areaConteudo.Location = new System.Drawing.Point(230, 0);
            this.areaConteudo.Name = "areaConteudo";
            this.areaConteudo.Padding = new System.Windows.Forms.Padding(10);
            this.areaConteudo.Size = new System.Drawing.Size(870, 640);
            this.areaConteudo.TabIndex = 0;
            // 
            // painelNavegacao
            // 
            this.painelNavegacao.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(30)))), ((int)(((byte)(90)))));
            this.painelNavegacao.Controls.Add(this.btnEncerrarSessao);
            this.painelNavegacao.Controls.Add(this.btnContas);
            this.painelNavegacao.Controls.Add(this.btnBalanco);
            this.painelNavegacao.Controls.Add(this.btnMovimentos);
            this.painelNavegacao.Controls.Add(this.btnPedidos);
            this.painelNavegacao.Controls.Add(this.btnEquipe);
            this.painelNavegacao.Controls.Add(this.btnEditoras);
            this.painelNavegacao.Controls.Add(this.btnAcervo);
            this.painelNavegacao.Controls.Add(this.btnPainel);
            this.painelNavegacao.Controls.Add(this.rotuloOperador);
            this.painelNavegacao.Controls.Add(this.marcaSecundaria);
            this.painelNavegacao.Controls.Add(this.marcaPrincipal);
            this.painelNavegacao.Dock = System.Windows.Forms.DockStyle.Left;
            this.painelNavegacao.Location = new System.Drawing.Point(0, 0);
            this.painelNavegacao.Name = "painelNavegacao";
            this.painelNavegacao.Size = new System.Drawing.Size(230, 640);
            this.painelNavegacao.TabIndex = 1;
            // 
            // marcaPrincipal
            // 
            this.marcaPrincipal.Font = new System.Drawing.Font("Tahoma", 15F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.marcaPrincipal.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(242)))), ((int)(((byte)(197)))), ((int)(((byte)(76)))));
            this.marcaPrincipal.Location = new System.Drawing.Point(20, 20);
            this.marcaPrincipal.Name = "marcaPrincipal";
            this.marcaPrincipal.Size = new System.Drawing.Size(190, 28);
            this.marcaPrincipal.TabIndex = 0;
            this.marcaPrincipal.Text = "EntreLivros";
            // 
            // marcaSecundaria
            // 
            this.marcaSecundaria.Font = new System.Drawing.Font("Tahoma", 8F, System.Drawing.FontStyle.Italic, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.marcaSecundaria.ForeColor = System.Drawing.Color.Silver;
            this.marcaSecundaria.Location = new System.Drawing.Point(20, 48);
            this.marcaSecundaria.Name = "marcaSecundaria";
            this.marcaSecundaria.Size = new System.Drawing.Size(190, 16);
            this.marcaSecundaria.TabIndex = 1;
            this.marcaSecundaria.Text = "Controle de Livraria";
            // 
            // rotuloOperador
            // 
            this.rotuloOperador.Font = new System.Drawing.Font("Tahoma", 7.5F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloOperador.ForeColor = System.Drawing.Color.Gainsboro;
            this.rotuloOperador.Location = new System.Drawing.Point(20, 78);
            this.rotuloOperador.Name = "rotuloOperador";
            this.rotuloOperador.Size = new System.Drawing.Size(190, 16);
            this.rotuloOperador.TabIndex = 2;
            this.rotuloOperador.Text = "Operador:";
            // 
            // btnPainel
            // 
            this.btnPainel.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(62)))), ((int)(((byte)(44)))), ((int)(((byte)(120)))));
            this.btnPainel.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnPainel.FlatAppearance.BorderSize = 0;
            this.btnPainel.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnPainel.Font = new System.Drawing.Font("Tahoma", 9.5F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnPainel.ForeColor = System.Drawing.Color.White;
            this.btnPainel.Location = new System.Drawing.Point(20, 110);
            this.btnPainel.Name = "btnPainel";
            this.btnPainel.Size = new System.Drawing.Size(190, 38);
            this.btnPainel.TabIndex = 3;
            this.btnPainel.Text = "Painel";
            this.btnPainel.UseVisualStyleBackColor = false;
            this.btnPainel.Click += new System.EventHandler(this.BtnPainel_Click);
            // 
            // btnAcervo
            // 
            this.btnAcervo.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(62)))), ((int)(((byte)(44)))), ((int)(((byte)(120)))));
            this.btnAcervo.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnAcervo.FlatAppearance.BorderSize = 0;
            this.btnAcervo.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnAcervo.Font = new System.Drawing.Font("Tahoma", 9.5F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnAcervo.ForeColor = System.Drawing.Color.White;
            this.btnAcervo.Location = new System.Drawing.Point(20, 154);
            this.btnAcervo.Name = "btnAcervo";
            this.btnAcervo.Size = new System.Drawing.Size(190, 38);
            this.btnAcervo.TabIndex = 4;
            this.btnAcervo.Text = "Acervo de Obras";
            this.btnAcervo.UseVisualStyleBackColor = false;
            this.btnAcervo.Click += new System.EventHandler(this.BtnAcervo_Click);
            // 
            // btnEditoras
            // 
            this.btnEditoras.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(62)))), ((int)(((byte)(44)))), ((int)(((byte)(120)))));
            this.btnEditoras.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnEditoras.FlatAppearance.BorderSize = 0;
            this.btnEditoras.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnEditoras.Font = new System.Drawing.Font("Tahoma", 9.5F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnEditoras.ForeColor = System.Drawing.Color.White;
            this.btnEditoras.Location = new System.Drawing.Point(20, 198);
            this.btnEditoras.Name = "btnEditoras";
            this.btnEditoras.Size = new System.Drawing.Size(190, 38);
            this.btnEditoras.TabIndex = 5;
            this.btnEditoras.Text = "Editoras";
            this.btnEditoras.UseVisualStyleBackColor = false;
            this.btnEditoras.Click += new System.EventHandler(this.BtnEditoras_Click);
            // 
            // btnEquipe
            // 
            this.btnEquipe.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(62)))), ((int)(((byte)(44)))), ((int)(((byte)(120)))));
            this.btnEquipe.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnEquipe.FlatAppearance.BorderSize = 0;
            this.btnEquipe.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnEquipe.Font = new System.Drawing.Font("Tahoma", 9.5F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnEquipe.ForeColor = System.Drawing.Color.White;
            this.btnEquipe.Location = new System.Drawing.Point(20, 242);
            this.btnEquipe.Name = "btnEquipe";
            this.btnEquipe.Size = new System.Drawing.Size(190, 38);
            this.btnEquipe.TabIndex = 6;
            this.btnEquipe.Text = "Equipe";
            this.btnEquipe.UseVisualStyleBackColor = false;
            this.btnEquipe.Click += new System.EventHandler(this.BtnEquipe_Click);
            // 
            // btnPedidos
            // 
            this.btnPedidos.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(62)))), ((int)(((byte)(44)))), ((int)(((byte)(120)))));
            this.btnPedidos.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnPedidos.FlatAppearance.BorderSize = 0;
            this.btnPedidos.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnPedidos.Font = new System.Drawing.Font("Tahoma", 9.5F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnPedidos.ForeColor = System.Drawing.Color.White;
            this.btnPedidos.Location = new System.Drawing.Point(20, 286);
            this.btnPedidos.Name = "btnPedidos";
            this.btnPedidos.Size = new System.Drawing.Size(190, 38);
            this.btnPedidos.TabIndex = 7;
            this.btnPedidos.Text = "Pedidos";
            this.btnPedidos.UseVisualStyleBackColor = false;
            this.btnPedidos.Click += new System.EventHandler(this.BtnPedidos_Click);
            // 
            // btnMovimentos
            // 
            this.btnMovimentos.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(62)))), ((int)(((byte)(44)))), ((int)(((byte)(120)))));
            this.btnMovimentos.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnMovimentos.FlatAppearance.BorderSize = 0;
            this.btnMovimentos.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnMovimentos.Font = new System.Drawing.Font("Tahoma", 9.5F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnMovimentos.ForeColor = System.Drawing.Color.White;
            this.btnMovimentos.Location = new System.Drawing.Point(20, 330);
            this.btnMovimentos.Name = "btnMovimentos";
            this.btnMovimentos.Size = new System.Drawing.Size(190, 38);
            this.btnMovimentos.TabIndex = 8;
            this.btnMovimentos.Text = "Movimentos de Estoque";
            this.btnMovimentos.UseVisualStyleBackColor = false;
            this.btnMovimentos.Click += new System.EventHandler(this.BtnMovimentos_Click);
            // 
            // btnBalanco
            // 
            this.btnBalanco.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(62)))), ((int)(((byte)(44)))), ((int)(((byte)(120)))));
            this.btnBalanco.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnBalanco.FlatAppearance.BorderSize = 0;
            this.btnBalanco.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnBalanco.Font = new System.Drawing.Font("Tahoma", 9.5F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnBalanco.ForeColor = System.Drawing.Color.White;
            this.btnBalanco.Location = new System.Drawing.Point(20, 374);
            this.btnBalanco.Name = "btnBalanco";
            this.btnBalanco.Size = new System.Drawing.Size(190, 38);
            this.btnBalanco.TabIndex = 9;
            this.btnBalanco.Text = "Balanço";
            this.btnBalanco.UseVisualStyleBackColor = false;
            this.btnBalanco.Click += new System.EventHandler(this.BtnBalanco_Click);
            // 
            // btnContas
            // 
            this.btnContas.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(62)))), ((int)(((byte)(44)))), ((int)(((byte)(120)))));
            this.btnContas.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnContas.FlatAppearance.BorderSize = 0;
            this.btnContas.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnContas.Font = new System.Drawing.Font("Tahoma", 9.5F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnContas.ForeColor = System.Drawing.Color.White;
            this.btnContas.Location = new System.Drawing.Point(20, 418);
            this.btnContas.Name = "btnContas";
            this.btnContas.Size = new System.Drawing.Size(190, 38);
            this.btnContas.TabIndex = 10;
            this.btnContas.Text = "Contas de Acesso";
            this.btnContas.UseVisualStyleBackColor = false;
            this.btnContas.Click += new System.EventHandler(this.BtnContas_Click);
            // 
            // btnEncerrarSessao
            // 
            this.btnEncerrarSessao.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left)));
            this.btnEncerrarSessao.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(146)))), ((int)(((byte)(36)))), ((int)(((byte)(64)))));
            this.btnEncerrarSessao.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnEncerrarSessao.FlatAppearance.BorderSize = 0;
            this.btnEncerrarSessao.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnEncerrarSessao.Font = new System.Drawing.Font("Tahoma", 9.5F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnEncerrarSessao.ForeColor = System.Drawing.Color.White;
            this.btnEncerrarSessao.Location = new System.Drawing.Point(20, 565);
            this.btnEncerrarSessao.Name = "btnEncerrarSessao";
            this.btnEncerrarSessao.Size = new System.Drawing.Size(190, 38);
            this.btnEncerrarSessao.TabIndex = 11;
            this.btnEncerrarSessao.Text = "Encerrar sessão";
            this.btnEncerrarSessao.UseVisualStyleBackColor = false;
            this.btnEncerrarSessao.Click += new System.EventHandler(this.BtnEncerrarSessao_Click);
            // 
            // FormPrincipal
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1100, 640);
            this.Controls.Add(this.areaConteudo);
            this.Controls.Add(this.painelNavegacao);
            this.MinimumSize = new System.Drawing.Size(1000, 620);
            this.Name = "FormPrincipal";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "EntreLivros — Painel de Gestão";
            this.Resize += new System.EventHandler(this.FormPrincipal_Resize);
            this.painelNavegacao.ResumeLayout(false);
            this.ResumeLayout(false);
        }

        #endregion

        private System.Windows.Forms.Panel areaConteudo;
        private System.Windows.Forms.Panel painelNavegacao;
        private System.Windows.Forms.Label marcaPrincipal;
        private System.Windows.Forms.Label marcaSecundaria;
        private System.Windows.Forms.Label rotuloOperador;
        private System.Windows.Forms.Button btnPainel;
        private System.Windows.Forms.Button btnAcervo;
        private System.Windows.Forms.Button btnEditoras;
        private System.Windows.Forms.Button btnEquipe;
        private System.Windows.Forms.Button btnPedidos;
        private System.Windows.Forms.Button btnMovimentos;
        private System.Windows.Forms.Button btnBalanco;
        private System.Windows.Forms.Button btnContas;
        private System.Windows.Forms.Button btnEncerrarSessao;
    }
}