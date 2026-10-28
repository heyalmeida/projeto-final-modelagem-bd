namespace ProjetoFinal_C_.Forms
{
    partial class FormPainel
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
            this.cartaoPrincipal = new System.Windows.Forms.Panel();
            this.tituloTela = new System.Windows.Forms.Label();
            this.rotuloBoasVindas = new System.Windows.Forms.Label();
            this.btnAtualizar = new System.Windows.Forms.Button();
            this.rotSemEstoque = new System.Windows.Forms.Label();
            this.rotEquipe = new System.Windows.Forms.Label();
            this.rotFaturamento = new System.Windows.Forms.Label();
            this.rotPedidosHoje = new System.Windows.Forms.Label();
            this.rotValorAcervo = new System.Windows.Forms.Label();
            this.rotExemplares = new System.Windows.Forms.Label();
            this.rotObras = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // cartaoPrincipal
            // 
            this.cartaoPrincipal.BackColor = System.Drawing.Color.White;
            this.cartaoPrincipal.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.cartaoPrincipal.Controls.Add(this.btnAtualizar);
            this.cartaoPrincipal.Controls.Add(this.rotuloBoasVindas);
            this.cartaoPrincipal.Controls.Add(this.tituloTela);
            this.cartaoPrincipal.Location = new System.Drawing.Point(0, 0);
            this.cartaoPrincipal.Name = "cartaoPrincipal";
            this.cartaoPrincipal.Size = new System.Drawing.Size(780, 570);
            this.cartaoPrincipal.TabIndex = 0;
            // 
            // tituloTela
            // 
            this.tituloTela.Font = new System.Drawing.Font("Tahoma", 16F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.tituloTela.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(30)))), ((int)(((byte)(90)))));
            this.tituloTela.Location = new System.Drawing.Point(0, 12);
            this.tituloTela.Name = "tituloTela";
            this.tituloTela.Size = new System.Drawing.Size(780, 32);
            this.tituloTela.TabIndex = 0;
            this.tituloTela.Text = "Painel de Visão Geral";
            this.tituloTela.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // rotuloBoasVindas
            // 
            this.rotuloBoasVindas.Font = new System.Drawing.Font("Tahoma", 10.5F, System.Drawing.FontStyle.Italic, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloBoasVindas.ForeColor = System.Drawing.Color.Gray;
            this.rotuloBoasVindas.Location = new System.Drawing.Point(0, 50);
            this.rotuloBoasVindas.Name = "rotuloBoasVindas";
            this.rotuloBoasVindas.Size = new System.Drawing.Size(780, 24);
            this.rotuloBoasVindas.TabIndex = 1;
            this.rotuloBoasVindas.Text = "Bem-vindo(a)";
            this.rotuloBoasVindas.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // rotObras (cartão 1)
            // 
            this.rotObras.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(245)))), ((int)(((byte)(240)))), ((int)(((byte)(255)))));
            this.rotObras.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.rotObras.Font = new System.Drawing.Font("Tahoma", 26F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotObras.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(30)))), ((int)(((byte)(90)))));
            this.rotObras.Location = new System.Drawing.Point(20, 100);
            this.rotObras.Name = "rotObras";
            this.rotObras.Size = new System.Drawing.Size(235, 110);
            this.rotObras.TabIndex = 2;
            this.rotObras.Text = "0";
            this.rotObras.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // rotExemplares (cartão 2)
            // 
            this.rotExemplares.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(245)))), ((int)(((byte)(240)))), ((int)(((byte)(255)))));
            this.rotExemplares.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.rotExemplares.Font = new System.Drawing.Font("Tahoma", 26F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotExemplares.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(30)))), ((int)(((byte)(90)))));
            this.rotExemplares.Location = new System.Drawing.Point(272, 100);
            this.rotExemplares.Name = "rotExemplares";
            this.rotExemplares.Size = new System.Drawing.Size(235, 110);
            this.rotExemplares.TabIndex = 3;
            this.rotExemplares.Text = "0";
            this.rotExemplares.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // rotValorAcervo (cartão 3)
            // 
            this.rotValorAcervo.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(245)))), ((int)(((byte)(240)))), ((int)(((byte)(255)))));
            this.rotValorAcervo.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.rotValorAcervo.Font = new System.Drawing.Font("Tahoma", 20F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotValorAcervo.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(30)))), ((int)(((byte)(90)))));
            this.rotValorAcervo.Location = new System.Drawing.Point(524, 100);
            this.rotValorAcervo.Name = "rotValorAcervo";
            this.rotValorAcervo.Size = new System.Drawing.Size(235, 110);
            this.rotValorAcervo.TabIndex = 4;
            this.rotValorAcervo.Text = "R$ 0,00";
            this.rotValorAcervo.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // rotPedidosHoje (cartão 4)
            // 
            this.rotPedidosHoje.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(248)))), ((int)(((byte)(235)))));
            this.rotPedidosHoje.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.rotPedidosHoje.Font = new System.Drawing.Font("Tahoma", 26F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotPedidosHoje.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(160)))), ((int)(((byte)(110)))), ((int)(((byte)(10)))));
            this.rotPedidosHoje.Location = new System.Drawing.Point(20, 240);
            this.rotPedidosHoje.Name = "rotPedidosHoje";
            this.rotPedidosHoje.Size = new System.Drawing.Size(235, 110);
            this.rotPedidosHoje.TabIndex = 5;
            this.rotPedidosHoje.Text = "0";
            this.rotPedidosHoje.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // rotFaturamento (cartão 5)
            // 
            this.rotFaturamento.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(248)))), ((int)(((byte)(235)))));
            this.rotFaturamento.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.rotFaturamento.Font = new System.Drawing.Font("Tahoma", 20F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotFaturamento.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(160)))), ((int)(((byte)(110)))), ((int)(((byte)(10)))));
            this.rotFaturamento.Location = new System.Drawing.Point(272, 240);
            this.rotFaturamento.Name = "rotFaturamento";
            this.rotFaturamento.Size = new System.Drawing.Size(235, 110);
            this.rotFaturamento.TabIndex = 6;
            this.rotFaturamento.Text = "R$ 0,00";
            this.rotFaturamento.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // rotEquipe (cartão 6)
            // 
            this.rotEquipe.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(240)))), ((int)(((byte)(248)))), ((int)(((byte)(244)))));
            this.rotEquipe.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.rotEquipe.Font = new System.Drawing.Font("Tahoma", 26F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotEquipe.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(26)))), ((int)(((byte)(94)))), ((int)(((byte)(64)))));
            this.rotEquipe.Location = new System.Drawing.Point(524, 240);
            this.rotEquipe.Name = "rotEquipe";
            this.rotEquipe.Size = new System.Drawing.Size(235, 110);
            this.rotEquipe.TabIndex = 7;
            this.rotEquipe.Text = "0";
            this.rotEquipe.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // rotSemEstoque (cartão 7 — alerta)
            // 
            this.rotSemEstoque.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(253)))), ((int)(((byte)(238)))), ((int)(((byte)(240)))));
            this.rotSemEstoque.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.rotSemEstoque.Font = new System.Drawing.Font("Tahoma", 26F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotSemEstoque.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(146)))), ((int)(((byte)(36)))), ((int)(((byte)(64)))));
            this.rotSemEstoque.Location = new System.Drawing.Point(20, 380);
            this.rotSemEstoque.Name = "rotSemEstoque";
            this.rotSemEstoque.Size = new System.Drawing.Size(487, 90);
            this.rotSemEstoque.TabIndex = 8;
            this.rotSemEstoque.Text = "0";
            this.rotSemEstoque.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // btnAtualizar
            // 
            this.btnAtualizar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(97)))), ((int)(((byte)(81)))), ((int)(((byte)(168)))));
            this.btnAtualizar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnAtualizar.FlatAppearance.BorderSize = 0;
            this.btnAtualizar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnAtualizar.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnAtualizar.ForeColor = System.Drawing.Color.White;
            this.btnAtualizar.Location = new System.Drawing.Point(524, 410);
            this.btnAtualizar.Name = "btnAtualizar";
            this.btnAtualizar.Size = new System.Drawing.Size(235, 40);
            this.btnAtualizar.TabIndex = 9;
            this.btnAtualizar.Text = "Atualizar indicadores";
            this.btnAtualizar.UseVisualStyleBackColor = false;
            this.btnAtualizar.Click += new System.EventHandler(this.BtnAtualizar_Click);
            // 
            // FormPainel
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(245)))), ((int)(((byte)(243)))), ((int)(((byte)(248)))));
            this.ClientSize = new System.Drawing.Size(820, 600);
            this.Controls.Add(this.cartaoPrincipal);
            this.cartaoPrincipal.Controls.Add(this.rotObras);
            this.cartaoPrincipal.Controls.Add(this.rotExemplares);
            this.cartaoPrincipal.Controls.Add(this.rotValorAcervo);
            this.cartaoPrincipal.Controls.Add(this.rotPedidosHoje);
            this.cartaoPrincipal.Controls.Add(this.rotFaturamento);
            this.cartaoPrincipal.Controls.Add(this.rotEquipe);
            this.cartaoPrincipal.Controls.Add(this.rotSemEstoque);
            this.Name = "FormPainel";
            this.Text = "Painel de Visão Geral";
            this.Load += new System.EventHandler(this.FormPainel_Load);
            this.Resize += new System.EventHandler(this.FormPainel_Resize);
            this.ResumeLayout(false);
        }

        #endregion

        private System.Windows.Forms.Panel cartaoPrincipal;
        private System.Windows.Forms.Label tituloTela;
        private System.Windows.Forms.Label rotuloBoasVindas;
        private System.Windows.Forms.Label rotObras;
        private System.Windows.Forms.Label rotExemplares;
        private System.Windows.Forms.Label rotValorAcervo;
        private System.Windows.Forms.Label rotPedidosHoje;
        private System.Windows.Forms.Label rotFaturamento;
        private System.Windows.Forms.Label rotEquipe;
        private System.Windows.Forms.Label rotSemEstoque;
        private System.Windows.Forms.Button btnAtualizar;
    }
}