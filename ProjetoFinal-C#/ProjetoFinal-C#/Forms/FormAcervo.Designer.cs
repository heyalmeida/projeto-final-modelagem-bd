namespace ProjetoFinal_C_.Forms
{
    partial class FormAcervo
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
            this.rotuloNome = new System.Windows.Forms.Label();
            this.txtNomeObra = new System.Windows.Forms.TextBox();
            this.rotuloAutor = new System.Windows.Forms.Label();
            this.txtAutor = new System.Windows.Forms.TextBox();
            this.rotuloEditora = new System.Windows.Forms.Label();
            this.cboEditora = new System.Windows.Forms.ComboBox();
            this.rotuloBarras = new System.Windows.Forms.Label();
            this.txtCodigoBarras = new System.Windows.Forms.TextBox();
            this.rotuloCategoria = new System.Windows.Forms.Label();
            this.txtCategoria = new System.Windows.Forms.TextBox();
            this.rotuloValor = new System.Windows.Forms.Label();
            this.txtValor = new System.Windows.Forms.TextBox();
            this.rotuloQtd = new System.Windows.Forms.Label();
            this.txtQtd = new System.Windows.Forms.TextBox();
            this.rotuloAno = new System.Windows.Forms.Label();
            this.txtAno = new System.Windows.Forms.TextBox();
            this.btnGravar = new System.Windows.Forms.Button();
            this.btnAlterar = new System.Windows.Forms.Button();
            this.btnRemover = new System.Windows.Forms.Button();
            this.btnLimpar = new System.Windows.Forms.Button();
            this.rotuloSituacao = new System.Windows.Forms.Label();
            this.gradeAcervo = new System.Windows.Forms.DataGridView();
            this.colNome = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colAutor = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colEditora = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colBarras = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colCategoria = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colValor = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colQtd = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colAno = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.cartaoPrincipal.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gradeAcervo)).BeginInit();
            this.SuspendLayout();
            // 
            // cartaoPrincipal
            // 
            this.cartaoPrincipal.BackColor = System.Drawing.Color.White;
            this.cartaoPrincipal.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.cartaoPrincipal.Controls.Add(this.gradeAcervo);
            this.cartaoPrincipal.Controls.Add(this.rotuloSituacao);
            this.cartaoPrincipal.Controls.Add(this.btnLimpar);
            this.cartaoPrincipal.Controls.Add(this.btnRemover);
            this.cartaoPrincipal.Controls.Add(this.btnAlterar);
            this.cartaoPrincipal.Controls.Add(this.btnGravar);
            this.cartaoPrincipal.Controls.Add(this.txtAno);
            this.cartaoPrincipal.Controls.Add(this.rotuloAno);
            this.cartaoPrincipal.Controls.Add(this.txtQtd);
            this.cartaoPrincipal.Controls.Add(this.rotuloQtd);
            this.cartaoPrincipal.Controls.Add(this.txtValor);
            this.cartaoPrincipal.Controls.Add(this.rotuloValor);
            this.cartaoPrincipal.Controls.Add(this.txtCategoria);
            this.cartaoPrincipal.Controls.Add(this.rotuloCategoria);
            this.cartaoPrincipal.Controls.Add(this.txtCodigoBarras);
            this.cartaoPrincipal.Controls.Add(this.rotuloBarras);
            this.cartaoPrincipal.Controls.Add(this.cboEditora);
            this.cartaoPrincipal.Controls.Add(this.rotuloEditora);
            this.cartaoPrincipal.Controls.Add(this.txtAutor);
            this.cartaoPrincipal.Controls.Add(this.rotuloAutor);
            this.cartaoPrincipal.Controls.Add(this.txtNomeObra);
            this.cartaoPrincipal.Controls.Add(this.rotuloNome);
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
            this.tituloTela.Text = "Acervo de Obras";
            this.tituloTela.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // rotuloNome
            // 
            this.rotuloNome.AutoSize = true;
            this.rotuloNome.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloNome.Location = new System.Drawing.Point(20, 62);
            this.rotuloNome.Name = "rotuloNome";
            this.rotuloNome.Size = new System.Drawing.Size(95, 13);
            this.rotuloNome.TabIndex = 1;
            this.rotuloNome.Text = "Nome da obra:";
            // 
            // txtNomeObra
            // 
            this.txtNomeObra.Location = new System.Drawing.Point(125, 58);
            this.txtNomeObra.Name = "txtNomeObra";
            this.txtNomeObra.Size = new System.Drawing.Size(250, 20);
            this.txtNomeObra.TabIndex = 2;
            // 
            // rotuloAutor
            // 
            this.rotuloAutor.AutoSize = true;
            this.rotuloAutor.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloAutor.Location = new System.Drawing.Point(400, 62);
            this.rotuloAutor.Name = "rotuloAutor";
            this.rotuloAutor.Size = new System.Drawing.Size(40, 13);
            this.rotuloAutor.TabIndex = 3;
            this.rotuloAutor.Text = "Autor:";
            // 
            // txtAutor
            // 
            this.txtAutor.Location = new System.Drawing.Point(490, 58);
            this.txtAutor.Name = "txtAutor";
            this.txtAutor.Size = new System.Drawing.Size(270, 20);
            this.txtAutor.TabIndex = 4;
            // 
            // rotuloEditora
            // 
            this.rotuloEditora.AutoSize = true;
            this.rotuloEditora.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloEditora.Location = new System.Drawing.Point(20, 102);
            this.rotuloEditora.Name = "rotuloEditora";
            this.rotuloEditora.Size = new System.Drawing.Size(50, 13);
            this.rotuloEditora.TabIndex = 5;
            this.rotuloEditora.Text = "Editora:";
            // 
            // cboEditora
            // 
            this.cboEditora.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboEditora.FormattingEnabled = true;
            this.cboEditora.Location = new System.Drawing.Point(125, 98);
            this.cboEditora.Name = "cboEditora";
            this.cboEditora.Size = new System.Drawing.Size(250, 21);
            this.cboEditora.TabIndex = 6;
            // 
            // rotuloBarras
            // 
            this.rotuloBarras.AutoSize = true;
            this.rotuloBarras.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloBarras.Location = new System.Drawing.Point(400, 102);
            this.rotuloBarras.Name = "rotuloBarras";
            this.rotuloBarras.Size = new System.Drawing.Size(91, 13);
            this.rotuloBarras.TabIndex = 7;
            this.rotuloBarras.Text = "Cód. de barras:";
            // 
            // txtCodigoBarras
            // 
            this.txtCodigoBarras.Location = new System.Drawing.Point(490, 98);
            this.txtCodigoBarras.Name = "txtCodigoBarras";
            this.txtCodigoBarras.Size = new System.Drawing.Size(270, 20);
            this.txtCodigoBarras.TabIndex = 8;
            // 
            // rotuloCategoria
            // 
            this.rotuloCategoria.AutoSize = true;
            this.rotuloCategoria.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloCategoria.Location = new System.Drawing.Point(20, 142);
            this.rotuloCategoria.Name = "rotuloCategoria";
            this.rotuloCategoria.Size = new System.Drawing.Size(62, 13);
            this.rotuloCategoria.TabIndex = 9;
            this.rotuloCategoria.Text = "Categoria:";
            // 
            // txtCategoria
            // 
            this.txtCategoria.Location = new System.Drawing.Point(125, 138);
            this.txtCategoria.Name = "txtCategoria";
            this.txtCategoria.Size = new System.Drawing.Size(250, 20);
            this.txtCategoria.TabIndex = 10;
            // 
            // rotuloValor
            // 
            this.rotuloValor.AutoSize = true;
            this.rotuloValor.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloValor.Location = new System.Drawing.Point(400, 142);
            this.rotuloValor.Name = "rotuloValor";
            this.rotuloValor.Size = new System.Drawing.Size(82, 13);
            this.rotuloValor.TabIndex = 11;
            this.rotuloValor.Text = "Valor unitário:";
            // 
            // txtValor
            // 
            this.txtValor.Location = new System.Drawing.Point(490, 138);
            this.txtValor.Name = "txtValor";
            this.txtValor.Size = new System.Drawing.Size(120, 20);
            this.txtValor.TabIndex = 12;
            // 
            // rotuloQtd
            // 
            this.rotuloQtd.AutoSize = true;
            this.rotuloQtd.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloQtd.Location = new System.Drawing.Point(625, 142);
            this.rotuloQtd.Name = "rotuloQtd";
            this.rotuloQtd.Size = new System.Drawing.Size(40, 13);
            this.rotuloQtd.TabIndex = 13;
            this.rotuloQtd.Text = "Acervo:";
            // 
            // txtQtd
            // 
            this.txtQtd.Location = new System.Drawing.Point(690, 138);
            this.txtQtd.Name = "txtQtd";
            this.txtQtd.Size = new System.Drawing.Size(70, 20);
            this.txtQtd.TabIndex = 14;
            // 
            // rotuloAno
            // 
            this.rotuloAno.AutoSize = true;
            this.rotuloAno.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloAno.Location = new System.Drawing.Point(20, 182);
            this.rotuloAno.Name = "rotuloAno";
            this.rotuloAno.Size = new System.Drawing.Size(100, 13);
            this.rotuloAno.TabIndex = 15;
            this.rotuloAno.Text = "Ano publicação:";
            // 
            // txtAno
            // 
            this.txtAno.Location = new System.Drawing.Point(125, 178);
            this.txtAno.Name = "txtAno";
            this.txtAno.Size = new System.Drawing.Size(90, 20);
            this.txtAno.TabIndex = 16;
            // 
            // btnGravar
            // 
            this.btnGravar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(242)))), ((int)(((byte)(197)))), ((int)(((byte)(76)))));
            this.btnGravar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnGravar.FlatAppearance.BorderSize = 0;
            this.btnGravar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnGravar.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnGravar.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(30)))), ((int)(((byte)(90)))));
            this.btnGravar.Location = new System.Drawing.Point(20, 220);
            this.btnGravar.Name = "btnGravar";
            this.btnGravar.Size = new System.Drawing.Size(110, 36);
            this.btnGravar.TabIndex = 17;
            this.btnGravar.Text = "Gravar";
            this.btnGravar.UseVisualStyleBackColor = false;
            this.btnGravar.Click += new System.EventHandler(this.BtnGravar_Click);
            // 
            // btnAlterar
            // 
            this.btnAlterar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(97)))), ((int)(((byte)(81)))), ((int)(((byte)(168)))));
            this.btnAlterar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnAlterar.FlatAppearance.BorderSize = 0;
            this.btnAlterar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnAlterar.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnAlterar.ForeColor = System.Drawing.Color.White;
            this.btnAlterar.Location = new System.Drawing.Point(140, 220);
            this.btnAlterar.Name = "btnAlterar";
            this.btnAlterar.Size = new System.Drawing.Size(110, 36);
            this.btnAlterar.TabIndex = 18;
            this.btnAlterar.Text = "Alterar";
            this.btnAlterar.UseVisualStyleBackColor = false;
            this.btnAlterar.Click += new System.EventHandler(this.BtnAlterar_Click);
            // 
            // btnRemover
            // 
            this.btnRemover.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(146)))), ((int)(((byte)(36)))), ((int)(((byte)(64)))));
            this.btnRemover.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnRemover.FlatAppearance.BorderSize = 0;
            this.btnRemover.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnRemover.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnRemover.ForeColor = System.Drawing.Color.White;
            this.btnRemover.Location = new System.Drawing.Point(260, 220);
            this.btnRemover.Name = "btnRemover";
            this.btnRemover.Size = new System.Drawing.Size(110, 36);
            this.btnRemover.TabIndex = 19;
            this.btnRemover.Text = "Remover";
            this.btnRemover.UseVisualStyleBackColor = false;
            this.btnRemover.Click += new System.EventHandler(this.BtnRemover_Click);
            // 
            // btnLimpar
            // 
            this.btnLimpar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(120)))), ((int)(((byte)(112)))), ((int)(((byte)(140)))));
            this.btnLimpar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnLimpar.FlatAppearance.BorderSize = 0;
            this.btnLimpar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnLimpar.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnLimpar.ForeColor = System.Drawing.Color.White;
            this.btnLimpar.Location = new System.Drawing.Point(380, 220);
            this.btnLimpar.Name = "btnLimpar";
            this.btnLimpar.Size = new System.Drawing.Size(110, 36);
            this.btnLimpar.TabIndex = 20;
            this.btnLimpar.Text = "Limpar";
            this.btnLimpar.UseVisualStyleBackColor = false;
            this.btnLimpar.Click += new System.EventHandler(this.BtnLimpar_Click);
            // 
            // rotuloSituacao
            // 
            this.rotuloSituacao.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Italic, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloSituacao.ForeColor = System.Drawing.Color.Gray;
            this.rotuloSituacao.Location = new System.Drawing.Point(520, 230);
            this.rotuloSituacao.Name = "rotuloSituacao";
            this.rotuloSituacao.Size = new System.Drawing.Size(240, 20);
            this.rotuloSituacao.TabIndex = 21;
            this.rotuloSituacao.Text = "Preencha os dados e use Gravar para incluir.";
            this.rotuloSituacao.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // gradeAcervo
            // 
            this.gradeAcervo.AllowUserToAddRows = false;
            this.gradeAcervo.AllowUserToDeleteRows = false;
            this.gradeAcervo.AllowUserToResizeRows = false;
            this.gradeAcervo.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.gradeAcervo.BackgroundColor = System.Drawing.Color.White;
            this.gradeAcervo.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.gradeAcervo.CellBorderStyle = System.Windows.Forms.DataGridViewCellBorderStyle.SingleHorizontal;
            this.gradeAcervo.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.gradeAcervo.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colNome,
            this.colAutor,
            this.colEditora,
            this.colBarras,
            this.colCategoria,
            this.colValor,
            this.colQtd,
            this.colAno});
            this.gradeAcervo.Location = new System.Drawing.Point(20, 270);
            this.gradeAcervo.MultiSelect = false;
            this.gradeAcervo.Name = "gradeAcervo";
            this.gradeAcervo.ReadOnly = true;
            this.gradeAcervo.RowHeadersVisible = false;
            this.gradeAcervo.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.gradeAcervo.Size = new System.Drawing.Size(740, 280);
            this.gradeAcervo.TabIndex = 22;
            this.gradeAcervo.SelectionChanged += new System.EventHandler(this.GradeAcervo_SelectionChanged);
            // 
            // colNome
            // 
            this.colNome.DataPropertyName = "NomeObra";
            this.colNome.FillWeight = 140F;
            this.colNome.HeaderText = "Obra";
            this.colNome.Name = "colNome";
            this.colNome.ReadOnly = true;
            // 
            // colAutor
            // 
            this.colAutor.DataPropertyName = "NomeAutor";
            this.colAutor.FillWeight = 110F;
            this.colAutor.HeaderText = "Autor";
            this.colAutor.Name = "colAutor";
            this.colAutor.ReadOnly = true;
            // 
            // colEditora
            // 
            this.colEditora.DataPropertyName = "NomeEditora";
            this.colEditora.FillWeight = 100F;
            this.colEditora.HeaderText = "Editora";
            this.colEditora.Name = "colEditora";
            this.colEditora.ReadOnly = true;
            // 
            // colBarras
            // 
            this.colBarras.DataPropertyName = "CodigoBarras";
            this.colBarras.FillWeight = 110F;
            this.colBarras.HeaderText = "Cód. Barras";
            this.colBarras.Name = "colBarras";
            this.colBarras.ReadOnly = true;
            // 
            // colCategoria
            // 
            this.colCategoria.DataPropertyName = "Categoria";
            this.colCategoria.FillWeight = 90F;
            this.colCategoria.HeaderText = "Categoria";
            this.colCategoria.Name = "colCategoria";
            this.colCategoria.ReadOnly = true;
            // 
            // colValor
            // 
            this.colValor.DataPropertyName = "ValorUnitario";
            this.colValor.DefaultCellStyle.Format = "N2";
            this.colValor.FillWeight = 70F;
            this.colValor.HeaderText = "Valor (R$)";
            this.colValor.Name = "colValor";
            this.colValor.ReadOnly = true;
            // 
            // colQtd
            // 
            this.colQtd.DataPropertyName = "QtdAcervo";
            this.colQtd.FillWeight = 55F;
            this.colQtd.HeaderText = "Acervo";
            this.colQtd.Name = "colQtd";
            this.colQtd.ReadOnly = true;
            // 
            // colAno
            // 
            this.colAno.DataPropertyName = "AnoPublicacao";
            this.colAno.FillWeight = 55F;
            this.colAno.HeaderText = "Ano";
            this.colAno.Name = "colAno";
            this.colAno.ReadOnly = true;
            // 
            // FormAcervo
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(245)))), ((int)(((byte)(243)))), ((int)(((byte)(248)))));
            this.ClientSize = new System.Drawing.Size(820, 600);
            this.Controls.Add(this.cartaoPrincipal);
            this.Name = "FormAcervo";
            this.Text = "Acervo de Obras";
            this.Load += new System.EventHandler(this.FormAcervo_Load);
            this.Resize += new System.EventHandler(this.FormAcervo_Resize);
            this.cartaoPrincipal.ResumeLayout(false);
            this.cartaoPrincipal.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gradeAcervo)).EndInit();
            this.ResumeLayout(false);
        }

        #endregion

        private System.Windows.Forms.Panel cartaoPrincipal;
        private System.Windows.Forms.Label tituloTela;
        private System.Windows.Forms.Label rotuloNome;
        private System.Windows.Forms.TextBox txtNomeObra;
        private System.Windows.Forms.Label rotuloAutor;
        private System.Windows.Forms.TextBox txtAutor;
        private System.Windows.Forms.Label rotuloEditora;
        private System.Windows.Forms.ComboBox cboEditora;
        private System.Windows.Forms.Label rotuloBarras;
        private System.Windows.Forms.TextBox txtCodigoBarras;
        private System.Windows.Forms.Label rotuloCategoria;
        private System.Windows.Forms.TextBox txtCategoria;
        private System.Windows.Forms.Label rotuloValor;
        private System.Windows.Forms.TextBox txtValor;
        private System.Windows.Forms.Label rotuloQtd;
        private System.Windows.Forms.TextBox txtQtd;
        private System.Windows.Forms.Label rotuloAno;
        private System.Windows.Forms.TextBox txtAno;
        private System.Windows.Forms.Button btnGravar;
        private System.Windows.Forms.Button btnAlterar;
        private System.Windows.Forms.Button btnRemover;
        private System.Windows.Forms.Button btnLimpar;
        private System.Windows.Forms.Label rotuloSituacao;
        private System.Windows.Forms.DataGridView gradeAcervo;
        private System.Windows.Forms.DataGridViewTextBoxColumn colNome;
        private System.Windows.Forms.DataGridViewTextBoxColumn colAutor;
        private System.Windows.Forms.DataGridViewTextBoxColumn colEditora;
        private System.Windows.Forms.DataGridViewTextBoxColumn colBarras;
        private System.Windows.Forms.DataGridViewTextBoxColumn colCategoria;
        private System.Windows.Forms.DataGridViewTextBoxColumn colValor;
        private System.Windows.Forms.DataGridViewTextBoxColumn colQtd;
        private System.Windows.Forms.DataGridViewTextBoxColumn colAno;
    }
}