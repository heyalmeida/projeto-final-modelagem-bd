namespace ProjetoFinal_C_.Forms
{
    partial class FormBalanco
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
            this.rotuloInicio = new System.Windows.Forms.Label();
            this.calInicio = new System.Windows.Forms.DateTimePicker();
            this.rotuloFim = new System.Windows.Forms.Label();
            this.calFim = new System.Windows.Forms.DateTimePicker();
            this.btnConsultar = new System.Windows.Forms.Button();
            this.gradePedidos = new System.Windows.Forms.DataGridView();
            this.colPedido = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colData = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colAtendente = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colCliente = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colPagto = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colValor = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.rotuloFaturamento = new System.Windows.Forms.Label();
            this.rotuloEstatisticas = new System.Windows.Forms.Label();
            this.rotuloItens = new System.Windows.Forms.Label();
            this.gradeItens = new System.Windows.Forms.DataGridView();
            this.colItemObra = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colItemQtd = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colItemValor = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colItemAbat = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colItemLiquido = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.cartaoPrincipal.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gradePedidos)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.gradeItens)).BeginInit();
            this.SuspendLayout();
            // 
            // cartaoPrincipal
            // 
            this.cartaoPrincipal.BackColor = System.Drawing.Color.White;
            this.cartaoPrincipal.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.cartaoPrincipal.Controls.Add(this.gradeItens);
            this.cartaoPrincipal.Controls.Add(this.rotuloItens);
            this.cartaoPrincipal.Controls.Add(this.rotuloEstatisticas);
            this.cartaoPrincipal.Controls.Add(this.rotuloFaturamento);
            this.cartaoPrincipal.Controls.Add(this.gradePedidos);
            this.cartaoPrincipal.Controls.Add(this.btnConsultar);
            this.cartaoPrincipal.Controls.Add(this.calFim);
            this.cartaoPrincipal.Controls.Add(this.rotuloFim);
            this.cartaoPrincipal.Controls.Add(this.calInicio);
            this.cartaoPrincipal.Controls.Add(this.rotuloInicio);
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
            this.tituloTela.Text = "Balanço de Pedidos";
            this.tituloTela.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // rotuloInicio
            // 
            this.rotuloInicio.AutoSize = true;
            this.rotuloInicio.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloInicio.Location = new System.Drawing.Point(20, 62);
            this.rotuloInicio.Name = "rotuloInicio";
            this.rotuloInicio.Size = new System.Drawing.Size(38, 13);
            this.rotuloInicio.TabIndex = 1;
            this.rotuloInicio.Text = "De:";
            // 
            // calInicio
            // 
            this.calInicio.CustomFormat = "dd/MM/yyyy";
            this.calInicio.Format = System.Windows.Forms.DateTimePickerFormat.Custom;
            this.calInicio.Location = new System.Drawing.Point(60, 58);
            this.calInicio.Name = "calInicio";
            this.calInicio.Size = new System.Drawing.Size(110, 20);
            this.calInicio.TabIndex = 2;
            // 
            // rotuloFim
            // 
            this.rotuloFim.AutoSize = true;
            this.rotuloFim.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloFim.Location = new System.Drawing.Point(190, 62);
            this.rotuloFim.Name = "rotuloFim";
            this.rotuloFim.Size = new System.Drawing.Size(20, 13);
            this.rotuloFim.TabIndex = 3;
            this.rotuloFim.Text = "a";
            // 
            // calFim
            // 
            this.calFim.CustomFormat = "dd/MM/yyyy";
            this.calFim.Format = System.Windows.Forms.DateTimePickerFormat.Custom;
            this.calFim.Location = new System.Drawing.Point(230, 58);
            this.calFim.Name = "calFim";
            this.calFim.Size = new System.Drawing.Size(110, 20);
            this.calFim.TabIndex = 4;
            // 
            // btnConsultar
            // 
            this.btnConsultar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(97)))), ((int)(((byte)(81)))), ((int)(((byte)(168)))));
            this.btnConsultar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnConsultar.FlatAppearance.BorderSize = 0;
            this.btnConsultar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnConsultar.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnConsultar.ForeColor = System.Drawing.Color.White;
            this.btnConsultar.Location = new System.Drawing.Point(370, 52);
            this.btnConsultar.Name = "btnConsultar";
            this.btnConsultar.Size = new System.Drawing.Size(130, 32);
            this.btnConsultar.TabIndex = 5;
            this.btnConsultar.Text = "Consultar";
            this.btnConsultar.UseVisualStyleBackColor = false;
            this.btnConsultar.Click += new System.EventHandler(this.BtnConsultar_Click);
            // 
            // gradePedidos
            // 
            this.gradePedidos.AllowUserToAddRows = false;
            this.gradePedidos.AllowUserToDeleteRows = false;
            this.gradePedidos.AllowUserToResizeRows = false;
            this.gradePedidos.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.gradePedidos.BackgroundColor = System.Drawing.Color.White;
            this.gradePedidos.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.gradePedidos.CellBorderStyle = System.Windows.Forms.DataGridViewCellBorderStyle.SingleHorizontal;
            this.gradePedidos.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.gradePedidos.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colPedido,
            this.colData,
            this.colAtendente,
            this.colCliente,
            this.colPagto,
            this.colValor});
            this.gradePedidos.Location = new System.Drawing.Point(20, 95);
            this.gradePedidos.MultiSelect = false;
            this.gradePedidos.Name = "gradePedidos";
            this.gradePedidos.ReadOnly = true;
            this.gradePedidos.RowHeadersVisible = false;
            this.gradePedidos.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.gradePedidos.Size = new System.Drawing.Size(740, 160);
            this.gradePedidos.TabIndex = 6;
            this.gradePedidos.SelectionChanged += new System.EventHandler(this.GradePedidos_SelectionChanged);
            // 
            // colPedido
            // 
            this.colPedido.DataPropertyName = "CodPedido";
            this.colPedido.FillWeight = 55F;
            this.colPedido.HeaderText = "Pedido";
            this.colPedido.Name = "colPedido";
            this.colPedido.ReadOnly = true;
            // 
            // colData
            // 
            this.colData.DataPropertyName = "DtHoraPedido";
            this.colData.DefaultCellStyle.Format = "dd/MM/yyyy HH:mm";
            this.colData.FillWeight = 110F;
            this.colData.HeaderText = "Data/hora";
            this.colData.Name = "colData";
            this.colData.ReadOnly = true;
            // 
            // colAtendente
            // 
            this.colAtendente.DataPropertyName = "NomeColaborador";
            this.colAtendente.FillWeight = 130F;
            this.colAtendente.HeaderText = "Atendente";
            this.colAtendente.Name = "colAtendente";
            this.colAtendente.ReadOnly = true;
            // 
            // colCliente
            // 
            this.colCliente.DataPropertyName = "NomeCliente";
            this.colCliente.FillWeight = 110F;
            this.colCliente.HeaderText = "Cliente";
            this.colCliente.Name = "colCliente";
            this.colCliente.ReadOnly = true;
            // 
            // colPagto
            // 
            this.colPagto.DataPropertyName = "FormaPagamento";
            this.colPagto.FillWeight = 90F;
            this.colPagto.HeaderText = "Pagamento";
            this.colPagto.Name = "colPagto";
            this.colPagto.ReadOnly = true;
            // 
            // colValor
            // 
            this.colValor.DataPropertyName = "ValorTotal";
            this.colValor.DefaultCellStyle.Format = "N2";
            this.colValor.FillWeight = 80F;
            this.colValor.HeaderText = "Valor (R$)";
            this.colValor.Name = "colValor";
            this.colValor.ReadOnly = true;            // 
            // rotuloFaturamento
            // 
            this.rotuloFaturamento.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloFaturamento.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(30)))), ((int)(((byte)(90)))));
            this.rotuloFaturamento.Location = new System.Drawing.Point(20, 265);
            this.rotuloFaturamento.Name = "rotuloFaturamento";
            this.rotuloFaturamento.Size = new System.Drawing.Size(450, 25);
            this.rotuloFaturamento.TabIndex = 7;
            this.rotuloFaturamento.Text = "Faturamento do período: R$ 0,00";
            // 
            // rotuloEstatisticas
            // 
            this.rotuloEstatisticas.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloEstatisticas.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(97)))), ((int)(((byte)(81)))), ((int)(((byte)(168)))));
            this.rotuloEstatisticas.Location = new System.Drawing.Point(490, 268);
            this.rotuloEstatisticas.Name = "rotuloEstatisticas";
            this.rotuloEstatisticas.Size = new System.Drawing.Size(270, 20);
            this.rotuloEstatisticas.TabIndex = 8;
            this.rotuloEstatisticas.Text = "Pedidos: 0    |    Ticket médio: R$ 0,00";
            this.rotuloEstatisticas.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // rotuloItens
            // 
            this.rotuloItens.AutoSize = true;
            this.rotuloItens.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloItens.Location = new System.Drawing.Point(20, 300);
            this.rotuloItens.Name = "rotuloItens";
            this.rotuloItens.Size = new System.Drawing.Size(210, 14);
            this.rotuloItens.TabIndex = 9;
            this.rotuloItens.Text = "Obras do pedido selecionado:";
            // 
            // gradeItens
            // 
            this.gradeItens.AllowUserToAddRows = false;
            this.gradeItens.AllowUserToDeleteRows = false;
            this.gradeItens.AllowUserToResizeRows = false;
            this.gradeItens.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.gradeItens.BackgroundColor = System.Drawing.Color.White;
            this.gradeItens.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.gradeItens.CellBorderStyle = System.Windows.Forms.DataGridViewCellBorderStyle.SingleHorizontal;
            this.gradeItens.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.gradeItens.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colItemObra,
            this.colItemQtd,
            this.colItemValor,
            this.colItemAbat,
            this.colItemLiquido});
            this.gradeItens.Location = new System.Drawing.Point(20, 325);
            this.gradeItens.MultiSelect = false;
            this.gradeItens.Name = "gradeItens";
            this.gradeItens.ReadOnly = true;
            this.gradeItens.RowHeadersVisible = false;
            this.gradeItens.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.gradeItens.Size = new System.Drawing.Size(740, 225);
            this.gradeItens.TabIndex = 10;
            // 
            // colItemObra
            // 
            this.colItemObra.FillWeight = 180F;
            this.colItemObra.HeaderText = "Obra";
            this.colItemObra.Name = "colItemObra";
            this.colItemObra.ReadOnly = true;
            // 
            // colItemQtd
            // 
            this.colItemQtd.FillWeight = 70F;
            this.colItemQtd.HeaderText = "Quantidade";
            this.colItemQtd.Name = "colItemQtd";
            this.colItemQtd.ReadOnly = true;
            // 
            // colItemValor
            // 
            this.colItemValor.FillWeight = 80F;
            this.colItemValor.HeaderText = "Valor (R$)";
            this.colItemValor.Name = "colItemValor";
            this.colItemValor.ReadOnly = true;
            // 
            // colItemAbat
            // 
            this.colItemAbat.FillWeight = 70F;
            this.colItemAbat.HeaderText = "Abatimento (%)";
            this.colItemAbat.Name = "colItemAbat";
            this.colItemAbat.ReadOnly = true;
            // 
            // colItemLiquido
            // 
            this.colItemLiquido.FillWeight = 90F;
            this.colItemLiquido.HeaderText = "Líquido (R$)";
            this.colItemLiquido.Name = "colItemLiquido";
            this.colItemLiquido.ReadOnly = true;
            // 
            // FormBalanco
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(245)))), ((int)(((byte)(243)))), ((int)(((byte)(248)))));
            this.ClientSize = new System.Drawing.Size(820, 600);
            this.Controls.Add(this.cartaoPrincipal);
            this.Name = "FormBalanco";
            this.Text = "Balanço de Pedidos";
            this.Load += new System.EventHandler(this.FormBalanco_Load);
            this.Resize += new System.EventHandler(this.FormBalanco_Resize);
            this.cartaoPrincipal.ResumeLayout(false);
            this.cartaoPrincipal.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gradePedidos)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.gradeItens)).EndInit();
            this.ResumeLayout(false);
        }

        #endregion

        private System.Windows.Forms.Panel cartaoPrincipal;
        private System.Windows.Forms.Label tituloTela;
        private System.Windows.Forms.Label rotuloInicio;
        private System.Windows.Forms.DateTimePicker calInicio;
            private System.Windows.Forms.Label rotuloFim;
        private System.Windows.Forms.DateTimePicker calFim;
        private System.Windows.Forms.Button btnConsultar;
        private System.Windows.Forms.DataGridView gradePedidos;
        private System.Windows.Forms.DataGridViewTextBoxColumn colPedido;
        private System.Windows.Forms.DataGridViewTextBoxColumn colData;
        private System.Windows.Forms.DataGridViewTextBoxColumn colAtendente;
        private System.Windows.Forms.DataGridViewTextBoxColumn colCliente;
        private System.Windows.Forms.DataGridViewTextBoxColumn colPagto;
        private System.Windows.Forms.DataGridViewTextBoxColumn colValor;
        private System.Windows.Forms.Label rotuloFaturamento;
        private System.Windows.Forms.Label rotuloEstatisticas;
        private System.Windows.Forms.Label rotuloItens;
        private System.Windows.Forms.DataGridView gradeItens;
        private System.Windows.Forms.DataGridViewTextBoxColumn colItemObra;
        private System.Windows.Forms.DataGridViewTextBoxColumn colItemQtd;
        private System.Windows.Forms.DataGridViewTextBoxColumn colItemValor;
        private System.Windows.Forms.DataGridViewTextBoxColumn colItemAbat;
        private System.Windows.Forms.DataGridViewTextBoxColumn colItemLiquido;
    }
}