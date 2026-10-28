namespace ProjetoFinal_C_.Forms
{
    partial class FormMovimentos
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
            this.grupoMovimento = new System.Windows.Forms.GroupBox();
            this.btnRegistrar = new System.Windows.Forms.Button();
            this.rotuloOrigem = new System.Windows.Forms.Label();
            this.txtOrigem = new System.Windows.Forms.TextBox();
            this.rotuloQuantidade = new System.Windows.Forms.Label();
            this.txtQuantidade = new System.Windows.Forms.TextBox();
            this.rotuloTipo = new System.Windows.Forms.Label();
            this.cboTipo = new System.Windows.Forms.ComboBox();
            this.rotuloObra = new System.Windows.Forms.Label();
            this.cboObra = new System.Windows.Forms.ComboBox();
            this.rotuloHistorico = new System.Windows.Forms.Label();
            this.btnAtualizarHistorico = new System.Windows.Forms.Button();
            this.gradeHistorico = new System.Windows.Forms.DataGridView();
            this.colObra = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colTipo = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colQtd = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colData = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colOrigem = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.cartaoPrincipal.SuspendLayout();
            this.grupoMovimento.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gradeHistorico)).BeginInit();
            this.SuspendLayout();
            // 
            // cartaoPrincipal
            // 
            this.cartaoPrincipal.BackColor = System.Drawing.Color.White;
            this.cartaoPrincipal.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.cartaoPrincipal.Controls.Add(this.gradeHistorico);
            this.cartaoPrincipal.Controls.Add(this.btnAtualizarHistorico);
            this.cartaoPrincipal.Controls.Add(this.rotuloHistorico);
            this.cartaoPrincipal.Controls.Add(this.grupoMovimento);
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
            this.tituloTela.Text = "Movimentações de Estoque";
            this.tituloTela.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // grupoMovimento
            // 
            this.grupoMovimento.Controls.Add(this.btnRegistrar);
            this.grupoMovimento.Controls.Add(this.rotuloOrigem);
            this.grupoMovimento.Controls.Add(this.txtOrigem);
            this.grupoMovimento.Controls.Add(this.rotuloQuantidade);
            this.grupoMovimento.Controls.Add(this.txtQuantidade);
            this.grupoMovimento.Controls.Add(this.rotuloTipo);
            this.grupoMovimento.Controls.Add(this.cboTipo);
            this.grupoMovimento.Controls.Add(this.rotuloObra);
            this.grupoMovimento.Controls.Add(this.cboObra);
            this.grupoMovimento.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.grupoMovimento.Location = new System.Drawing.Point(20, 60);
            this.grupoMovimento.Name = "grupoMovimento";
            this.grupoMovimento.Size = new System.Drawing.Size(740, 125);
            this.grupoMovimento.TabIndex = 1;
            this.grupoMovimento.TabStop = false;
            this.grupoMovimento.Text = "Registrar movimentação";
            // 
            // rotuloObra
            // 
            this.rotuloObra.AutoSize = true;
            this.rotuloObra.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloObra.Location = new System.Drawing.Point(15, 32);
            this.rotuloObra.Name = "rotuloObra";
            this.rotuloObra.Size = new System.Drawing.Size(40, 14);
            this.rotuloObra.TabIndex = 0;
            this.rotuloObra.Text = "Obra:";
            // 
            // cboObra
            // 
            this.cboObra.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboObra.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.cboObra.FormattingEnabled = true;
            this.cboObra.Location = new System.Drawing.Point(105, 28);
            this.cboObra.Name = "cboObra";
            this.cboObra.Size = new System.Drawing.Size(330, 22);
            this.cboObra.TabIndex = 1;
            // 
            // rotuloTipo
            // 
            this.rotuloTipo.AutoSize = true;
            this.rotuloTipo.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloTipo.Location = new System.Drawing.Point(455, 32);
            this.rotuloTipo.Name = "rotuloTipo";
            this.rotuloTipo.Size = new System.Drawing.Size(38, 14);
            this.rotuloTipo.TabIndex = 2;
            this.rotuloTipo.Text = "Tipo:";
            // 
            // cboTipo
            // 
            this.cboTipo.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboTipo.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.cboTipo.FormattingEnabled = true;
            this.cboTipo.Items.AddRange(new object[] {
            "ENTRADA",
            "SAIDA"});
            this.cboTipo.Location = new System.Drawing.Point(540, 28);
            this.cboTipo.Name = "cboTipo";
            this.cboTipo.Size = new System.Drawing.Size(185, 22);
            this.cboTipo.TabIndex = 3;
            // 
            // rotuloQuantidade
            // 
            this.rotuloQuantidade.AutoSize = true;
            this.rotuloQuantidade.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloQuantidade.Location = new System.Drawing.Point(15, 76);
            this.rotuloQuantidade.Name = "rotuloQuantidade";
            this.rotuloQuantidade.Size = new System.Drawing.Size(76, 14);
            this.rotuloQuantidade.TabIndex = 4;
            this.rotuloQuantidade.Text = "Quantidade:";
            // 
            // txtQuantidade
            // 
            this.txtQuantidade.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtQuantidade.Location = new System.Drawing.Point(105, 72);
            this.txtQuantidade.Name = "txtQuantidade";
            this.txtQuantidade.Size = new System.Drawing.Size(80, 22);
            this.txtQuantidade.TabIndex = 5;
            // 
            // rotuloOrigem
            // 
            this.rotuloOrigem.AutoSize = true;
            this.rotuloOrigem.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloOrigem.Location = new System.Drawing.Point(210, 76);
            this.rotuloOrigem.Name = "rotuloOrigem";
            this.rotuloOrigem.Size = new System.Drawing.Size(97, 14);
            this.rotuloOrigem.TabIndex = 6;
            this.rotuloOrigem.Text = "Origem/motivo:";
            // 
            // txtOrigem
            // 
            this.txtOrigem.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtOrigem.Location = new System.Drawing.Point(320, 72);
            this.txtOrigem.Name = "txtOrigem";
            this.txtOrigem.Size = new System.Drawing.Size(180, 22);
            this.txtOrigem.TabIndex = 7;
            // 
            // btnRegistrar
            // 
            this.btnRegistrar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(242)))), ((int)(((byte)(197)))), ((int)(((byte)(76)))));
            this.btnRegistrar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnRegistrar.FlatAppearance.BorderSize = 0;
            this.btnRegistrar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnRegistrar.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnRegistrar.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(30)))), ((int)(((byte)(90)))));
            this.btnRegistrar.Location = new System.Drawing.Point(540, 70);
            this.btnRegistrar.Name = "btnRegistrar";
            this.btnRegistrar.Size = new System.Drawing.Size(185, 28);
            this.btnRegistrar.TabIndex = 8;
            this.btnRegistrar.Text = "Registrar movimentação";
            this.btnRegistrar.UseVisualStyleBackColor = false;
            this.btnRegistrar.Click += new System.EventHandler(this.BtnRegistrar_Click);
            // 
            // rotuloHistorico
            // 
            this.rotuloHistorico.AutoSize = true;
            this.rotuloHistorico.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloHistorico.Location = new System.Drawing.Point(20, 205);
            this.rotuloHistorico.Name = "rotuloHistorico";
            this.rotuloHistorico.Size = new System.Drawing.Size(185, 14);
            this.rotuloHistorico.TabIndex = 2;
            this.rotuloHistorico.Text = "Histórico (mais recentes):";
            // 
            // btnAtualizarHistorico
            // 
            this.btnAtualizarHistorico.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(97)))), ((int)(((byte)(81)))), ((int)(((byte)(168)))));
            this.btnAtualizarHistorico.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnAtualizarHistorico.FlatAppearance.BorderSize = 0;
            this.btnAtualizarHistorico.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnAtualizarHistorico.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnAtualizarHistorico.ForeColor = System.Drawing.Color.White;
            this.btnAtualizarHistorico.Location = new System.Drawing.Point(630, 198);
            this.btnAtualizarHistorico.Name = "btnAtualizarHistorico";
            this.btnAtualizarHistorico.Size = new System.Drawing.Size(130, 28);
            this.btnAtualizarHistorico.TabIndex = 3;
            this.btnAtualizarHistorico.Text = "Atualizar";
            this.btnAtualizarHistorico.UseVisualStyleBackColor = false;
            this.btnAtualizarHistorico.Click += new System.EventHandler(this.BtnAtualizarHistorico_Click);
            // 
            // gradeHistorico
            // 
            this.gradeHistorico.AllowUserToAddRows = false;
            this.gradeHistorico.AllowUserToDeleteRows = false;
            this.gradeHistorico.AllowUserToResizeRows = false;
            this.gradeHistorico.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.gradeHistorico.BackgroundColor = System.Drawing.Color.White;
            this.gradeHistorico.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.gradeHistorico.CellBorderStyle = System.Windows.Forms.DataGridViewCellBorderStyle.SingleHorizontal;
            this.gradeHistorico.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.gradeHistorico.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colObra,
            this.colTipo,
            this.colQtd,
            this.colData,
            this.colOrigem});
            this.gradeHistorico.Location = new System.Drawing.Point(20, 235);
            this.gradeHistorico.MultiSelect = false;
            this.gradeHistorico.Name = "gradeHistorico";
            this.gradeHistorico.ReadOnly = true;
            this.gradeHistorico.RowHeadersVisible = false;
            this.gradeHistorico.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.gradeHistorico.Size = new System.Drawing.Size(740, 315);
            this.gradeHistorico.TabIndex = 4;
            // 
            // colObra
            // 
            this.colObra.DataPropertyName = "NomeObra";
            this.colObra.FillWeight = 160F;
            this.colObra.HeaderText = "Obra";
            this.colObra.Name = "colObra";
            this.colObra.ReadOnly = true;
            // 
            // colTipo
            // 
            this.colTipo.DataPropertyName = "TipoMovimento";
            this.colTipo.FillWeight = 70F;
            this.colTipo.HeaderText = "Tipo";
            this.colTipo.Name = "colTipo";
            this.colTipo.ReadOnly = true;
            // 
            // colQtd
            // 
            this.colQtd.DataPropertyName = "QtdMovimentada";
            this.colQtd.FillWeight = 70F;
            this.colQtd.HeaderText = "Quantidade";
            this.colQtd.Name = "colQtd";
            this.colQtd.ReadOnly = true;
            // 
            // colData
            // 
            this.colData.DataPropertyName = "DtHoraMovimento";
            this.colData.DefaultCellStyle.Format = "dd/MM/yyyy HH:mm";
            this.colData.FillWeight = 110F;
            this.colData.HeaderText = "Data/hora";
            this.colData.Name = "colData";
            this.colData.ReadOnly = true;
            // 
            // colOrigem
            // 
            this.colOrigem.DataPropertyName = "OrigemMovimento";
            this.colOrigem.FillWeight = 110F;
            this.colOrigem.HeaderText = "Origem";
            this.colOrigem.Name = "colOrigem";
            this.colOrigem.ReadOnly = true;
            // 
            // FormMovimentos
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(245)))), ((int)(((byte)(243)))), ((int)(((byte)(248)))));
            this.ClientSize = new System.Drawing.Size(820, 600);
            this.Controls.Add(this.cartaoPrincipal);
            this.Name = "FormMovimentos";
            this.Text = "Movimentações de Estoque";
            this.Load += new System.EventHandler(this.FormMovimentos_Load);
            this.Resize += new System.EventHandler(this.FormMovimentos_Resize);
            this.cartaoPrincipal.ResumeLayout(false);
            this.grupoMovimento.ResumeLayout(false);
            this.grupoMovimento.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gradeHistorico)).EndInit();
            this.ResumeLayout(false);
        }

        #endregion

        private System.Windows.Forms.Panel cartaoPrincipal;
        private System.Windows.Forms.Label tituloTela;
        private System.Windows.Forms.GroupBox grupoMovimento;
        private System.Windows.Forms.Label rotuloObra;
        private System.Windows.Forms.ComboBox cboObra;
        private System.Windows.Forms.Label rotuloTipo;
        private System.Windows.Forms.ComboBox cboTipo;
        private System.Windows.Forms.Label rotuloQuantidade;
        private System.Windows.Forms.TextBox txtQuantidade;
        private System.Windows.Forms.Label rotuloOrigem;
        private System.Windows.Forms.TextBox txtOrigem;
        private System.Windows.Forms.Button btnRegistrar;
        private System.Windows.Forms.Label rotuloHistorico;
        private System.Windows.Forms.Button btnAtualizarHistorico;
        private System.Windows.Forms.DataGridView gradeHistorico;
        private System.Windows.Forms.DataGridViewTextBoxColumn colObra;
        private System.Windows.Forms.DataGridViewTextBoxColumn colTipo;
        private System.Windows.Forms.DataGridViewTextBoxColumn colQtd;
        private System.Windows.Forms.DataGridViewTextBoxColumn colData;
        private System.Windows.Forms.DataGridViewTextBoxColumn colOrigem;
    }
}