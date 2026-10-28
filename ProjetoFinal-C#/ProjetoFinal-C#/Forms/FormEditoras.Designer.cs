namespace ProjetoFinal_C_.Forms
{
    partial class FormEditoras
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
            this.txtNomeEditora = new System.Windows.Forms.TextBox();
            this.rotuloCidade = new System.Windows.Forms.Label();
            this.txtCidade = new System.Windows.Forms.TextBox();
            this.btnGravar = new System.Windows.Forms.Button();
            this.btnAlterar = new System.Windows.Forms.Button();
            this.btnRemover = new System.Windows.Forms.Button();
            this.btnLimpar = new System.Windows.Forms.Button();
            this.rotuloSituacao = new System.Windows.Forms.Label();
            this.gradeEditoras = new System.Windows.Forms.DataGridView();
            this.colNome = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colCidade = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.cartaoPrincipal.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gradeEditoras)).BeginInit();
            this.SuspendLayout();
            // 
            // cartaoPrincipal
            // 
            this.cartaoPrincipal.BackColor = System.Drawing.Color.White;
            this.cartaoPrincipal.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.cartaoPrincipal.Controls.Add(this.gradeEditoras);
            this.cartaoPrincipal.Controls.Add(this.rotuloSituacao);
            this.cartaoPrincipal.Controls.Add(this.btnLimpar);
            this.cartaoPrincipal.Controls.Add(this.btnRemover);
            this.cartaoPrincipal.Controls.Add(this.btnAlterar);
            this.cartaoPrincipal.Controls.Add(this.btnGravar);
            this.cartaoPrincipal.Controls.Add(this.txtCidade);
            this.cartaoPrincipal.Controls.Add(this.rotuloCidade);
            this.cartaoPrincipal.Controls.Add(this.txtNomeEditora);
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
            this.tituloTela.Text = "Cadastro de Editoras (Administrador)";
            this.tituloTela.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // rotuloNome
            // 
            this.rotuloNome.AutoSize = true;
            this.rotuloNome.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloNome.Location = new System.Drawing.Point(20, 62);
            this.rotuloNome.Name = "rotuloNome";
            this.rotuloNome.Size = new System.Drawing.Size(107, 13);
            this.rotuloNome.TabIndex = 1;
            this.rotuloNome.Text = "Nome da editora:";
            // 
            // txtNomeEditora
            // 
            this.txtNomeEditora.Location = new System.Drawing.Point(140, 58);
            this.txtNomeEditora.Name = "txtNomeEditora";
            this.txtNomeEditora.Size = new System.Drawing.Size(300, 20);
            this.txtNomeEditora.TabIndex = 2;
            // 
            // rotuloCidade
            // 
            this.rotuloCidade.AutoSize = true;
            this.rotuloCidade.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloCidade.Location = new System.Drawing.Point(20, 102);
            this.rotuloCidade.Name = "rotuloCidade";
            this.rotuloCidade.Size = new System.Drawing.Size(47, 13);
            this.rotuloCidade.TabIndex = 3;
            this.rotuloCidade.Text = "Cidade:";
            // 
            // txtCidade
            // 
            this.txtCidade.Location = new System.Drawing.Point(140, 98);
            this.txtCidade.Name = "txtCidade";
            this.txtCidade.Size = new System.Drawing.Size(300, 20);
            this.txtCidade.TabIndex = 4;
            // 
            // btnGravar
            // 
            this.btnGravar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(242)))), ((int)(((byte)(197)))), ((int)(((byte)(76)))));
            this.btnGravar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnGravar.FlatAppearance.BorderSize = 0;
            this.btnGravar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnGravar.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnGravar.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(30)))), ((int)(((byte)(90)))));
            this.btnGravar.Location = new System.Drawing.Point(20, 160);
            this.btnGravar.Name = "btnGravar";
            this.btnGravar.Size = new System.Drawing.Size(110, 36);
            this.btnGravar.TabIndex = 5;
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
            this.btnAlterar.Location = new System.Drawing.Point(140, 160);
            this.btnAlterar.Name = "btnAlterar";
            this.btnAlterar.Size = new System.Drawing.Size(110, 36);
            this.btnAlterar.TabIndex = 6;
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
            this.btnRemover.Location = new System.Drawing.Point(260, 160);
            this.btnRemover.Name = "btnRemover";
            this.btnRemover.Size = new System.Drawing.Size(110, 36);
            this.btnRemover.TabIndex = 7;
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
            this.btnLimpar.Location = new System.Drawing.Point(380, 160);
            this.btnLimpar.Name = "btnLimpar";
            this.btnLimpar.Size = new System.Drawing.Size(110, 36);
            this.btnLimpar.TabIndex = 8;
            this.btnLimpar.Text = "Limpar";
            this.btnLimpar.UseVisualStyleBackColor = false;
            this.btnLimpar.Click += new System.EventHandler(this.BtnLimpar_Click);
            // 
            // rotuloSituacao
            // 
            this.rotuloSituacao.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Italic, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloSituacao.ForeColor = System.Drawing.Color.Gray;
            this.rotuloSituacao.Location = new System.Drawing.Point(520, 170);
            this.rotuloSituacao.Name = "rotuloSituacao";
            this.rotuloSituacao.Size = new System.Drawing.Size(240, 20);
            this.rotuloSituacao.TabIndex = 9;
            this.rotuloSituacao.Text = "Preencha os dados e use Gravar para incluir.";
            this.rotuloSituacao.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // gradeEditoras
            // 
            this.gradeEditoras.AllowUserToAddRows = false;
            this.gradeEditoras.AllowUserToDeleteRows = false;
            this.gradeEditoras.AllowUserToResizeRows = false;
            this.gradeEditoras.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.gradeEditoras.BackgroundColor = System.Drawing.Color.White;
            this.gradeEditoras.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.gradeEditoras.CellBorderStyle = System.Windows.Forms.DataGridViewCellBorderStyle.SingleHorizontal;
            this.gradeEditoras.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.gradeEditoras.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colNome,
            this.colCidade});
            this.gradeEditoras.Location = new System.Drawing.Point(20, 220);
            this.gradeEditoras.MultiSelect = false;
            this.gradeEditoras.Name = "gradeEditoras";
            this.gradeEditoras.ReadOnly = true;
            this.gradeEditoras.RowHeadersVisible = false;
            this.gradeEditoras.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.gradeEditoras.Size = new System.Drawing.Size(740, 330);
            this.gradeEditoras.TabIndex = 10;
            this.gradeEditoras.SelectionChanged += new System.EventHandler(this.GradeEditoras_SelectionChanged);
            // 
            // colNome
            // 
            this.colNome.DataPropertyName = "NomeEditora";
            this.colNome.FillWeight = 150F;
            this.colNome.HeaderText = "Editora";
            this.colNome.Name = "colNome";
            this.colNome.ReadOnly = true;
            // 
            // colCidade
            // 
            this.colCidade.DataPropertyName = "CidadeEditora";
            this.colCidade.FillWeight = 100F;
            this.colCidade.HeaderText = "Cidade";
            this.colCidade.Name = "colCidade";
            this.colCidade.ReadOnly = true;
            // 
            // FormEditoras
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(245)))), ((int)(((byte)(243)))), ((int)(((byte)(248)))));
            this.ClientSize = new System.Drawing.Size(820, 600);
            this.Controls.Add(this.cartaoPrincipal);
            this.Name = "FormEditoras";
            this.Text = "Cadastro de Editoras";
            this.Load += new System.EventHandler(this.FormEditoras_Load);
            this.Resize += new System.EventHandler(this.FormEditoras_Resize);
            this.cartaoPrincipal.ResumeLayout(false);
            this.cartaoPrincipal.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gradeEditoras)).EndInit();
            this.ResumeLayout(false);
        }

        #endregion

        private System.Windows.Forms.Panel cartaoPrincipal;
        private System.Windows.Forms.Label tituloTela;
        private System.Windows.Forms.Label rotuloNome;
        private System.Windows.Forms.TextBox txtNomeEditora;
        private System.Windows.Forms.Label rotuloCidade;
        private System.Windows.Forms.TextBox txtCidade;
        private System.Windows.Forms.Button btnGravar;
        private System.Windows.Forms.Button btnAlterar;
        private System.Windows.Forms.Button btnRemover;
        private System.Windows.Forms.Button btnLimpar;
        private System.Windows.Forms.Label rotuloSituacao;
        private System.Windows.Forms.DataGridView gradeEditoras;
        private System.Windows.Forms.DataGridViewTextBoxColumn colNome;
        private System.Windows.Forms.DataGridViewTextBoxColumn colCidade;
    }
}