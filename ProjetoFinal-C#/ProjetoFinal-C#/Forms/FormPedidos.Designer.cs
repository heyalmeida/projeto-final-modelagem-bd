namespace ProjetoFinal_C_.Forms
{
    partial class FormPedidos
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
            this.rotuloColaborador = new System.Windows.Forms.Label();
            this.cboColaborador = new System.Windows.Forms.ComboBox();
            this.rotuloCliente = new System.Windows.Forms.Label();
            this.txtCliente = new System.Windows.Forms.TextBox();
            this.rotuloPagamento = new System.Windows.Forms.Label();
            this.cboPagamento = new System.Windows.Forms.ComboBox();
            this.grupoItem = new System.Windows.Forms.GroupBox();
            this.btnIncluirItem = new System.Windows.Forms.Button();
            this.rotuloAbatimento = new System.Windows.Forms.Label();
            this.txtAbatimento = new System.Windows.Forms.TextBox();
            this.rotuloQuantidade = new System.Windows.Forms.Label();
            this.txtQuantidade = new System.Windows.Forms.TextBox();
            this.txtValorObra = new System.Windows.Forms.TextBox();
            this.rotuloValorObra = new System.Windows.Forms.Label();
            this.txtObra = new System.Windows.Forms.TextBox();
            this.btnBuscarObra = new System.Windows.Forms.Button();
            this.gradeSacola = new System.Windows.Forms.DataGridView();
            this.colObra = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colQtd = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colValor = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colAbat = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colLiquido = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.rotuloTotal = new System.Windows.Forms.Label();
            this.rotuloDisponibilidade = new System.Windows.Forms.Label();
            this.btnRetirarItem = new System.Windows.Forms.Button();
            this.btnConcluirPedido = new System.Windows.Forms.Button();
            this.btnDescartar = new System.Windows.Forms.Button();
            this.cartaoPrincipal.SuspendLayout();
            this.grupoItem.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gradeSacola)).BeginInit();
            this.SuspendLayout();
            // 
            // cartaoPrincipal
            // 
            this.cartaoPrincipal.BackColor = System.Drawing.Color.White;
            this.cartaoPrincipal.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.cartaoPrincipal.Controls.Add(this.rotuloDisponibilidade);
            this.cartaoPrincipal.Controls.Add(this.btnDescartar);
            this.cartaoPrincipal.Controls.Add(this.btnConcluirPedido);
            this.cartaoPrincipal.Controls.Add(this.btnRetirarItem);
            this.cartaoPrincipal.Controls.Add(this.rotuloTotal);
            this.cartaoPrincipal.Controls.Add(this.gradeSacola);
            this.cartaoPrincipal.Controls.Add(this.grupoItem);
            this.cartaoPrincipal.Controls.Add(this.cboPagamento);
            this.cartaoPrincipal.Controls.Add(this.rotuloPagamento);
            this.cartaoPrincipal.Controls.Add(this.txtCliente);
            this.cartaoPrincipal.Controls.Add(this.rotuloCliente);
            this.cartaoPrincipal.Controls.Add(this.cboColaborador);
            this.cartaoPrincipal.Controls.Add(this.rotuloColaborador);
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
            this.tituloTela.Text = "Registro de Pedidos";
            this.tituloTela.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // rotuloColaborador
            // 
            this.rotuloColaborador.AutoSize = true;
            this.rotuloColaborador.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloColaborador.Location = new System.Drawing.Point(20, 62);
            this.rotuloColaborador.Name = "rotuloColaborador";
            this.rotuloColaborador.Size = new System.Drawing.Size(80, 13);
            this.rotuloColaborador.TabIndex = 1;
            this.rotuloColaborador.Text = "Atendido por:";
            // 
            // cboColaborador
            // 
            this.cboColaborador.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboColaborador.FormattingEnabled = true;
            this.cboColaborador.Location = new System.Drawing.Point(110, 58);
            this.cboColaborador.Name = "cboColaborador";
            this.cboColaborador.Size = new System.Drawing.Size(250, 21);
            this.cboColaborador.TabIndex = 2;
            // 
            // rotuloCliente
            // 
            this.rotuloCliente.AutoSize = true;
            this.rotuloCliente.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloCliente.Location = new System.Drawing.Point(380, 62);
            this.rotuloCliente.Name = "rotuloCliente";
            this.rotuloCliente.Size = new System.Drawing.Size(103, 13);
            this.rotuloCliente.TabIndex = 3;
            this.rotuloCliente.Text = "Cliente (opcional):";
            // 
            // txtCliente
            // 
            this.txtCliente.Location = new System.Drawing.Point(490, 58);
            this.txtCliente.Name = "txtCliente";
            this.txtCliente.Size = new System.Drawing.Size(270, 20);
            this.txtCliente.TabIndex = 4;
            // 
            // rotuloPagamento
            // 
            this.rotuloPagamento.AutoSize = true;
            this.rotuloPagamento.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloPagamento.Location = new System.Drawing.Point(20, 100);
            this.rotuloPagamento.Name = "rotuloPagamento";
            this.rotuloPagamento.Size = new System.Drawing.Size(80, 13);
            this.rotuloPagamento.TabIndex = 5;
            this.rotuloPagamento.Text = "Pagamento:";
            // 
            // cboPagamento
            // 
            this.cboPagamento.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboPagamento.FormattingEnabled = true;
            this.cboPagamento.Items.AddRange(new object[] {
            "Dinheiro",
            "Cartão de Débito",
            "Cartão de Crédito",
            "Pix"});
            this.cboPagamento.Location = new System.Drawing.Point(110, 96);
            this.cboPagamento.Name = "cboPagamento";
            this.cboPagamento.Size = new System.Drawing.Size(250, 21);
            this.cboPagamento.TabIndex = 6;
            // 
            // grupoItem
            // 
            this.grupoItem.Controls.Add(this.btnIncluirItem);
            this.grupoItem.Controls.Add(this.rotuloAbatimento);
            this.grupoItem.Controls.Add(this.txtAbatimento);
            this.grupoItem.Controls.Add(this.rotuloQuantidade);
            this.grupoItem.Controls.Add(this.txtQuantidade);
            this.grupoItem.Controls.Add(this.txtValorObra);
            this.grupoItem.Controls.Add(this.rotuloValorObra);
            this.grupoItem.Controls.Add(this.txtObra);
            this.grupoItem.Controls.Add(this.btnBuscarObra);
            this.grupoItem.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.grupoItem.Location = new System.Drawing.Point(20, 130);
            this.grupoItem.Name = "grupoItem";
            this.grupoItem.Size = new System.Drawing.Size(740, 115);
            this.grupoItem.TabIndex = 7;
            this.grupoItem.TabStop = false;
            this.grupoItem.Text = "Obra do pedido";
            // 
            // btnBuscarObra
            // 
            this.btnBuscarObra.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(97)))), ((int)(((byte)(81)))), ((int)(((byte)(168)))));
            this.btnBuscarObra.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnBuscarObra.FlatAppearance.BorderSize = 0;
            this.btnBuscarObra.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnBuscarObra.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnBuscarObra.ForeColor = System.Drawing.Color.White;
            this.btnBuscarObra.Location = new System.Drawing.Point(15, 30);
            this.btnBuscarObra.Name = "btnBuscarObra";
            this.btnBuscarObra.Size = new System.Drawing.Size(130, 30);
            this.btnBuscarObra.TabIndex = 0;
            this.btnBuscarObra.Text = "Buscar Obra";
            this.btnBuscarObra.UseVisualStyleBackColor = false;
            this.btnBuscarObra.Click += new System.EventHandler(this.BtnBuscarObra_Click);
            // 
            // txtObra
            // 
            this.txtObra.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtObra.Location = new System.Drawing.Point(160, 34);
            this.txtObra.Name = "txtObra";
            this.txtObra.ReadOnly = true;
            this.txtObra.Size = new System.Drawing.Size(290, 22);
            this.txtObra.TabIndex = 1;
            // 
            // rotuloValorObra
            // 
            this.rotuloValorObra.AutoSize = true;
            this.rotuloValorObra.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloValorObra.Location = new System.Drawing.Point(465, 37);
            this.rotuloValorObra.Name = "rotuloValorObra";
            this.rotuloValorObra.Size = new System.Drawing.Size(42, 14);
            this.rotuloValorObra.TabIndex = 2;
            this.rotuloValorObra.Text = "Valor:";
            // 
            // txtValorObra
            // 
            this.txtValorObra.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtValorObra.Location = new System.Drawing.Point(540, 34);
            this.txtValorObra.Name = "txtValorObra";
            this.txtValorObra.ReadOnly = true;
            this.txtValorObra.Size = new System.Drawing.Size(185, 22);
            this.txtValorObra.TabIndex = 3;
            // 
            // rotuloQuantidade
            // 
            this.rotuloQuantidade.AutoSize = true;
            this.rotuloQuantidade.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloQuantidade.Location = new System.Drawing.Point(15, 77);
            this.rotuloQuantidade.Name = "rotuloQuantidade";
            this.rotuloQuantidade.Size = new System.Drawing.Size(76, 14);
            this.rotuloQuantidade.TabIndex = 4;
            this.rotuloQuantidade.Text = "Quantidade:";
            // 
            // txtQuantidade
            // 
            this.txtQuantidade.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtQuantidade.Location = new System.Drawing.Point(105, 74);
            this.txtQuantidade.Name = "txtQuantidade";
            this.txtQuantidade.Size = new System.Drawing.Size(70, 22);
            this.txtQuantidade.TabIndex = 5;
            // 
            // rotuloAbatimento
            // 
            this.rotuloAbatimento.AutoSize = true;
            this.rotuloAbatimento.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloAbatimento.Location = new System.Drawing.Point(200, 77);
            this.rotuloAbatimento.Name = "rotuloAbatimento";
            this.rotuloAbatimento.Size = new System.Drawing.Size(112, 14);
            this.rotuloAbatimento.TabIndex = 6;
            this.rotuloAbatimento.Text = "Abatimento (%):";
            // 
            // txtAbatimento
            // 
            this.txtAbatimento.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtAbatimento.Location = new System.Drawing.Point(325, 74);
            this.txtAbatimento.Name = "txtAbatimento";
            this.txtAbatimento.Size = new System.Drawing.Size(70, 22);
            this.txtAbatimento.TabIndex = 7;
            // 
            // btnIncluirItem
            // 
            this.btnIncluirItem.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(242)))), ((int)(((byte)(197)))), ((int)(((byte)(76)))));
            this.btnIncluirItem.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnIncluirItem.FlatAppearance.BorderSize = 0;
            this.btnIncluirItem.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnIncluirItem.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnIncluirItem.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(30)))), ((int)(((byte)(90)))));
            this.btnIncluirItem.Location = new System.Drawing.Point(540, 71);
            this.btnIncluirItem.Name = "btnIncluirItem";
            this.btnIncluirItem.Size = new System.Drawing.Size(185, 28);
            this.btnIncluirItem.TabIndex = 8;
            this.btnIncluirItem.Text = "Incluir na sacola";
            this.btnIncluirItem.UseVisualStyleBackColor = false;
            this.btnIncluirItem.Click += new System.EventHandler(this.BtnIncluirItem_Click);            // 
            // gradeSacola
            // 
            this.gradeSacola.AllowUserToAddRows = false;
            this.gradeSacola.AllowUserToDeleteRows = false;
            this.gradeSacola.AllowUserToResizeRows = false;
            this.gradeSacola.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.gradeSacola.BackgroundColor = System.Drawing.Color.White;
            this.gradeSacola.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.gradeSacola.CellBorderStyle = System.Windows.Forms.DataGridViewCellBorderStyle.SingleHorizontal;
            this.gradeSacola.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.gradeSacola.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colObra,
            this.colQtd,
            this.colValor,
            this.colAbat,
            this.colLiquido});
            this.gradeSacola.Location = new System.Drawing.Point(20, 260);
            this.gradeSacola.MultiSelect = false;
            this.gradeSacola.Name = "gradeSacola";
            this.gradeSacola.ReadOnly = true;
            this.gradeSacola.RowHeadersVisible = false;
            this.gradeSacola.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.gradeSacola.Size = new System.Drawing.Size(740, 170);
            this.gradeSacola.TabIndex = 8;
            // 
            // colObra
            // 
            this.colObra.FillWeight = 180F;
            this.colObra.HeaderText = "Obra";
            this.colObra.Name = "colObra";
            this.colObra.ReadOnly = true;
            // 
            // colQtd
            // 
            this.colQtd.FillWeight = 70F;
            this.colQtd.HeaderText = "Quantidade";
            this.colQtd.Name = "colQtd";
            this.colQtd.ReadOnly = true;
            // 
            // colValor
            // 
            this.colValor.FillWeight = 80F;
            this.colValor.HeaderText = "Valor (R$)";
            this.colValor.Name = "colValor";
            this.colValor.ReadOnly = true;
            // 
            // colAbat
            // 
            this.colAbat.FillWeight = 70F;
            this.colAbat.HeaderText = "Abatimento (%)";
            this.colAbat.Name = "colAbat";
            this.colAbat.ReadOnly = true;
            // 
            // colLiquido
            // 
            this.colLiquido.FillWeight = 90F;
            this.colLiquido.HeaderText = "Líquido (R$)";
            this.colLiquido.Name = "colLiquido";
            this.colLiquido.ReadOnly = true;
            // 
            // rotuloTotal
            // 
            this.rotuloTotal.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloTotal.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(30)))), ((int)(((byte)(90)))));
            this.rotuloTotal.Location = new System.Drawing.Point(20, 440);
            this.rotuloTotal.Name = "rotuloTotal";
            this.rotuloTotal.Size = new System.Drawing.Size(420, 25);
            this.rotuloTotal.TabIndex = 9;
            this.rotuloTotal.Text = "Valor do pedido: R$ 0,00";
            // 
            // btnRetirarItem
            // 
            this.btnRetirarItem.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(146)))), ((int)(((byte)(36)))), ((int)(((byte)(64)))));
            this.btnRetirarItem.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnRetirarItem.FlatAppearance.BorderSize = 0;
            this.btnRetirarItem.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnRetirarItem.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnRetirarItem.ForeColor = System.Drawing.Color.White;
            this.btnRetirarItem.Location = new System.Drawing.Point(20, 490);
            this.btnRetirarItem.Name = "btnRetirarItem";
            this.btnRetirarItem.Size = new System.Drawing.Size(140, 36);
            this.btnRetirarItem.TabIndex = 10;
            this.btnRetirarItem.Text = "Retirar item";
            this.btnRetirarItem.UseVisualStyleBackColor = false;
            this.btnRetirarItem.Click += new System.EventHandler(this.BtnRetirarItem_Click);
            // 
            // btnConcluirPedido
            // 
            this.btnConcluirPedido.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(242)))), ((int)(((byte)(197)))), ((int)(((byte)(76)))));
            this.btnConcluirPedido.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnConcluirPedido.FlatAppearance.BorderSize = 0;
            this.btnConcluirPedido.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnConcluirPedido.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnConcluirPedido.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(30)))), ((int)(((byte)(90)))));
            this.btnConcluirPedido.Location = new System.Drawing.Point(175, 490);
            this.btnConcluirPedido.Name = "btnConcluirPedido";
            this.btnConcluirPedido.Size = new System.Drawing.Size(160, 36);
            this.btnConcluirPedido.TabIndex = 11;
            this.btnConcluirPedido.Text = "Concluir pedido";
            this.btnConcluirPedido.UseVisualStyleBackColor = false;
            this.btnConcluirPedido.Click += new System.EventHandler(this.BtnConcluirPedido_Click);
            // 
            // btnDescartar
            // 
            this.btnDescartar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(120)))), ((int)(((byte)(112)))), ((int)(((byte)(140)))));
            this.btnDescartar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnDescartar.FlatAppearance.BorderSize = 0;
            this.btnDescartar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnDescartar.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnDescartar.ForeColor = System.Drawing.Color.White;
            this.btnDescartar.Location = new System.Drawing.Point(350, 490);
            this.btnDescartar.Name = "btnDescartar";
            this.btnDescartar.Size = new System.Drawing.Size(110, 36);
            this.btnDescartar.TabIndex = 12;
            this.btnDescartar.Text = "Descartar";
            this.btnDescartar.UseVisualStyleBackColor = false;
            this.btnDescartar.Click += new System.EventHandler(this.BtnDescartar_Click);
            // 
            // rotuloDisponibilidade
            // 
            this.rotuloDisponibilidade.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Italic, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloDisponibilidade.ForeColor = System.Drawing.Color.Gray;
            this.rotuloDisponibilidade.Location = new System.Drawing.Point(480, 500);
            this.rotuloDisponibilidade.Name = "rotuloDisponibilidade";
            this.rotuloDisponibilidade.Size = new System.Drawing.Size(280, 20);
            this.rotuloDisponibilidade.TabIndex = 13;
            this.rotuloDisponibilidade.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // FormPedidos
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(245)))), ((int)(((byte)(243)))), ((int)(((byte)(248)))));
            this.ClientSize = new System.Drawing.Size(820, 600);
            this.Controls.Add(this.cartaoPrincipal);
            this.Name = "FormPedidos";
            this.Text = "Registro de Pedidos";
            this.Load += new System.EventHandler(this.FormPedidos_Load);
            this.Resize += new System.EventHandler(this.FormPedidos_Resize);
            this.cartaoPrincipal.ResumeLayout(false);
            this.grupoItem.ResumeLayout(false);
            this.grupoItem.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gradeSacola)).EndInit();
            this.ResumeLayout(false);
        }

        #endregion

        private System.Windows.Forms.Panel cartaoPrincipal;
        private System.Windows.Forms.Label tituloTela;
        private System.Windows.Forms.Label rotuloColaborador;
        private System.Windows.Forms.ComboBox cboColaborador;
        private System.Windows.Forms.Label rotuloCliente;
        private System.Windows.Forms.TextBox txtCliente;
        private System.Windows.Forms.Label rotuloPagamento;
        private System.Windows.Forms.ComboBox cboPagamento;
        private System.Windows.Forms.GroupBox grupoItem;
        private System.Windows.Forms.Button btnBuscarObra;
        private System.Windows.Forms.TextBox txtObra;
        private System.Windows.Forms.Label rotuloValorObra;
        private System.Windows.Forms.TextBox txtValorObra;
        private System.Windows.Forms.Label rotuloQuantidade;
        private System.Windows.Forms.TextBox txtQuantidade;
        private System.Windows.Forms.Label rotuloAbatimento;
        private System.Windows.Forms.TextBox txtAbatimento;
        private System.Windows.Forms.Button btnIncluirItem;
        private System.Windows.Forms.DataGridView gradeSacola;
        private System.Windows.Forms.DataGridViewTextBoxColumn colObra;
        private System.Windows.Forms.DataGridViewTextBoxColumn colQtd;
        private System.Windows.Forms.DataGridViewTextBoxColumn colValor;
        private System.Windows.Forms.DataGridViewTextBoxColumn colAbat;
        private System.Windows.Forms.DataGridViewTextBoxColumn colLiquido;
        private System.Windows.Forms.Label rotuloTotal;
        private System.Windows.Forms.Button btnRetirarItem;
        private System.Windows.Forms.Button btnConcluirPedido;
        private System.Windows.Forms.Button btnDescartar;
        private System.Windows.Forms.Label rotuloDisponibilidade;
    }
}