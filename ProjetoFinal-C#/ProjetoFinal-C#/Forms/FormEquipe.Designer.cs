namespace ProjetoFinal_C_.Forms
{
    partial class FormEquipe
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
            this.txtNomeColaborador = new System.Windows.Forms.TextBox();
            this.rotuloCpf = new System.Windows.Forms.Label();
            this.txtCpf = new System.Windows.Forms.TextBox();
            this.rotuloFuncao = new System.Windows.Forms.Label();
            this.txtFuncao = new System.Windows.Forms.TextBox();
            this.rotuloRemuneracao = new System.Windows.Forms.Label();
            this.txtRemuneracao = new System.Windows.Forms.TextBox();
            this.rotuloContratacao = new System.Windows.Forms.Label();
            this.calendContratacao = new System.Windows.Forms.DateTimePicker();
            this.rotuloTelefone = new System.Windows.Forms.Label();
            this.txtTelefone = new System.Windows.Forms.TextBox();
            this.btnGravar = new System.Windows.Forms.Button();
            this.btnAlterar = new System.Windows.Forms.Button();
            this.btnRemover = new System.Windows.Forms.Button();
            this.btnLimpar = new System.Windows.Forms.Button();
            this.rotuloSituacao = new System.Windows.Forms.Label();
            this.gradeEquipe = new System.Windows.Forms.DataGridView();
            this.colNome = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colCpf = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colFuncao = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colRemuneracao = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colContratacao = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colTelefone = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.cartaoPrincipal.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gradeEquipe)).BeginInit();
            this.SuspendLayout();
            // 
            // cartaoPrincipal
            // 
            this.cartaoPrincipal.BackColor = System.Drawing.Color.White;
            this.cartaoPrincipal.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.cartaoPrincipal.Controls.Add(this.gradeEquipe);
            this.cartaoPrincipal.Controls.Add(this.rotuloSituacao);
            this.cartaoPrincipal.Controls.Add(this.btnLimpar);
            this.cartaoPrincipal.Controls.Add(this.btnRemover);
            this.cartaoPrincipal.Controls.Add(this.btnAlterar);
            this.cartaoPrincipal.Controls.Add(this.btnGravar);
            this.cartaoPrincipal.Controls.Add(this.txtTelefone);
            this.cartaoPrincipal.Controls.Add(this.rotuloTelefone);
            this.cartaoPrincipal.Controls.Add(this.calendContratacao);
            this.cartaoPrincipal.Controls.Add(this.rotuloContratacao);
            this.cartaoPrincipal.Controls.Add(this.txtRemuneracao);
            this.cartaoPrincipal.Controls.Add(this.rotuloRemuneracao);
            this.cartaoPrincipal.Controls.Add(this.txtFuncao);
            this.cartaoPrincipal.Controls.Add(this.rotuloFuncao);
            this.cartaoPrincipal.Controls.Add(this.txtCpf);
            this.cartaoPrincipal.Controls.Add(this.rotuloCpf);
            this.cartaoPrincipal.Controls.Add(this.txtNomeColaborador);
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
            this.tituloTela.Text = "Equipe de Colaboradores";
            this.tituloTela.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // rotuloNome
            // 
            this.rotuloNome.AutoSize = true;
            this.rotuloNome.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloNome.Location = new System.Drawing.Point(20, 62);
            this.rotuloNome.Name = "rotuloNome";
            this.rotuloNome.Size = new System.Drawing.Size(110, 13);
            this.rotuloNome.TabIndex = 1;
            this.rotuloNome.Text = "Nome completo:";
            // 
            // txtNomeColaborador
            // 
            this.txtNomeColaborador.Location = new System.Drawing.Point(140, 58);
            this.txtNomeColaborador.Name = "txtNomeColaborador";
            this.txtNomeColaborador.Size = new System.Drawing.Size(250, 20);
            this.txtNomeColaborador.TabIndex = 2;
            // 
            // rotuloCpf
            // 
            this.rotuloCpf.AutoSize = true;
            this.rotuloCpf.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloCpf.Location = new System.Drawing.Point(420, 62);
            this.rotuloCpf.Name = "rotuloCpf";
            this.rotuloCpf.Size = new System.Drawing.Size(32, 13);
            this.rotuloCpf.TabIndex = 3;
            this.rotuloCpf.Text = "CPF:";
            // 
            // txtCpf
            // 
            this.txtCpf.Location = new System.Drawing.Point(490, 58);
            this.txtCpf.Name = "txtCpf";
            this.txtCpf.Size = new System.Drawing.Size(270, 20);
            this.txtCpf.TabIndex = 4;
            // 
            // rotuloFuncao
            // 
            this.rotuloFuncao.AutoSize = true;
            this.rotuloFuncao.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloFuncao.Location = new System.Drawing.Point(20, 102);
            this.rotuloFuncao.Name = "rotuloFuncao";
            this.rotuloFuncao.Size = new System.Drawing.Size(47, 13);
            this.rotuloFuncao.TabIndex = 5;
            this.rotuloFuncao.Text = "Função:";
            // 
            // txtFuncao
            // 
            this.txtFuncao.Location = new System.Drawing.Point(140, 98);
            this.txtFuncao.Name = "txtFuncao";
            this.txtFuncao.Size = new System.Drawing.Size(250, 20);
            this.txtFuncao.TabIndex = 6;
            // 
            // rotuloRemuneracao
            // 
            this.rotuloRemuneracao.AutoSize = true;
            this.rotuloRemuneracao.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloRemuneracao.Location = new System.Drawing.Point(420, 102);
            this.rotuloRemuneracao.Name = "rotuloRemuneracao";
            this.rotuloRemuneracao.Size = new System.Drawing.Size(85, 13);
            this.rotuloRemuneracao.TabIndex = 7;
            this.rotuloRemuneracao.Text = "Remuneração:";
            // 
            // txtRemuneracao
            // 
            this.txtRemuneracao.Location = new System.Drawing.Point(490, 98);
            this.txtRemuneracao.Name = "txtRemuneracao";
            this.txtRemuneracao.Size = new System.Drawing.Size(120, 20);
            this.txtRemuneracao.TabIndex = 8;
            // 
            // rotuloContratacao
            // 
            this.rotuloContratacao.AutoSize = true;
            this.rotuloContratacao.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloContratacao.Location = new System.Drawing.Point(625, 102);
            this.rotuloContratacao.Name = "rotuloContratacao";
            this.rotuloContratacao.Size = new System.Drawing.Size(75, 13);
            this.rotuloContratacao.TabIndex = 9;
            this.rotuloContratacao.Text = "Contratação:";
            // 
            // calendContratacao
            // 
            this.calendContratacao.CustomFormat = "dd/MM/yyyy";
            this.calendContratacao.Format = System.Windows.Forms.DateTimePickerFormat.Custom;
            this.calendContratacao.Location = new System.Drawing.Point(490, 138);
            this.calendContratacao.Name = "calendContratacao";
            this.calendContratacao.Size = new System.Drawing.Size(120, 20);
            this.calendContratacao.TabIndex = 10;
            // 
            // rotuloTelefone
            // 
            this.rotuloTelefone.AutoSize = true;
            this.rotuloTelefone.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloTelefone.Location = new System.Drawing.Point(20, 142);
            this.rotuloTelefone.Name = "rotuloTelefone";
            this.rotuloTelefone.Size = new System.Drawing.Size(56, 13);
            this.rotuloTelefone.TabIndex = 11;
            this.rotuloTelefone.Text = "Telefone:";
            // 
            // txtTelefone
            // 
            this.txtTelefone.Location = new System.Drawing.Point(140, 138);
            this.txtTelefone.Name = "txtTelefone";
            this.txtTelefone.Size = new System.Drawing.Size(250, 20);
            this.txtTelefone.TabIndex = 12;
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
            this.btnGravar.TabIndex = 13;
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
            this.btnAlterar.TabIndex = 14;
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
            this.btnRemover.TabIndex = 15;
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
            this.btnLimpar.TabIndex = 16;
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
            this.rotuloSituacao.TabIndex = 17;
            this.rotuloSituacao.Text = "Preencha os dados e use Gravar para incluir.";
            this.rotuloSituacao.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // gradeEquipe
            // 
            this.gradeEquipe.AllowUserToAddRows = false;
            this.gradeEquipe.AllowUserToDeleteRows = false;
            this.gradeEquipe.AllowUserToResizeRows = false;
            this.gradeEquipe.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.gradeEquipe.BackgroundColor = System.Drawing.Color.White;
            this.gradeEquipe.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.gradeEquipe.CellBorderStyle = System.Windows.Forms.DataGridViewCellBorderStyle.SingleHorizontal;
            this.gradeEquipe.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.gradeEquipe.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colNome,
            this.colCpf,
            this.colFuncao,
            this.colRemuneracao,
            this.colContratacao,
            this.colTelefone});
            this.gradeEquipe.Location = new System.Drawing.Point(20, 270);
            this.gradeEquipe.MultiSelect = false;
            this.gradeEquipe.Name = "gradeEquipe";
            this.gradeEquipe.ReadOnly = true;
            this.gradeEquipe.RowHeadersVisible = false;
            this.gradeEquipe.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.gradeEquipe.Size = new System.Drawing.Size(740, 280);
            this.gradeEquipe.TabIndex = 18;
            this.gradeEquipe.SelectionChanged += new System.EventHandler(this.GradeEquipe_SelectionChanged);
            // 
            // colNome
            // 
            this.colNome.DataPropertyName = "NomeColaborador";
            this.colNome.FillWeight = 150F;
            this.colNome.HeaderText = "Colaborador";
            this.colNome.Name = "colNome";
            this.colNome.ReadOnly = true;
            // 
            // colCpf
            // 
            this.colCpf.DataPropertyName = "NumCpf";
            this.colCpf.FillWeight = 110F;
            this.colCpf.HeaderText = "CPF";
            this.colCpf.Name = "colCpf";
            this.colCpf.ReadOnly = true;
            // 
            // colFuncao
            // 
            this.colFuncao.DataPropertyName = "Funcao";
            this.colFuncao.FillWeight = 110F;
            this.colFuncao.HeaderText = "Função";
            this.colFuncao.Name = "colFuncao";
            this.colFuncao.ReadOnly = true;
            // 
            // colRemuneracao
            // 
            this.colRemuneracao.DataPropertyName = "Remuneracao";
            this.colRemuneracao.DefaultCellStyle.Format = "N2";
            this.colRemuneracao.FillWeight = 90F;
            this.colRemuneracao.HeaderText = "Remuneração (R$)";
            this.colRemuneracao.Name = "colRemuneracao";
            this.colRemuneracao.ReadOnly = true;
            // 
            // colContratacao
            // 
            this.colContratacao.DataPropertyName = "DtContratacao";
            this.colContratacao.DefaultCellStyle.Format = "dd/MM/yyyy";
            this.colContratacao.FillWeight = 90F;
            this.colContratacao.HeaderText = "Contratação";
            this.colContratacao.Name = "colContratacao";
            this.colContratacao.ReadOnly = true;
            // 
            // colTelefone
            // 
            this.colTelefone.DataPropertyName = "NumTelefone";
            this.colTelefone.FillWeight = 110F;
            this.colTelefone.HeaderText = "Telefone";
            this.colTelefone.Name = "colTelefone";
            this.colTelefone.ReadOnly = true;
            // 
            // FormEquipe
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(245)))), ((int)(((byte)(243)))), ((int)(((byte)(248)))));
            this.ClientSize = new System.Drawing.Size(820, 600);
            this.Controls.Add(this.cartaoPrincipal);
            this.Name = "FormEquipe";
            this.Text = "Equipe de Colaboradores";
            this.Load += new System.EventHandler(this.FormEquipe_Load);
            this.Resize += new System.EventHandler(this.FormEquipe_Resize);
            this.cartaoPrincipal.ResumeLayout(false);
            this.cartaoPrincipal.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gradeEquipe)).EndInit();
            this.ResumeLayout(false);
        }

        #endregion

        private System.Windows.Forms.Panel cartaoPrincipal;
        private System.Windows.Forms.Label tituloTela;
        private System.Windows.Forms.Label rotuloNome;
        private System.Windows.Forms.TextBox txtNomeColaborador;
        private System.Windows.Forms.Label rotuloCpf;
        private System.Windows.Forms.TextBox txtCpf;
        private System.Windows.Forms.Label rotuloFuncao;
        private System.Windows.Forms.TextBox txtFuncao;
        private System.Windows.Forms.Label rotuloRemuneracao;
        private System.Windows.Forms.TextBox txtRemuneracao;
        private System.Windows.Forms.Label rotuloContratacao;
        private System.Windows.Forms.DateTimePicker calendContratacao;
        private System.Windows.Forms.Label rotuloTelefone;
        private System.Windows.Forms.TextBox txtTelefone;
        private System.Windows.Forms.Button btnGravar;
        private System.Windows.Forms.Button btnAlterar;
        private System.Windows.Forms.Button btnRemover;
        private System.Windows.Forms.Button btnLimpar;
        private System.Windows.Forms.Label rotuloSituacao;
        private System.Windows.Forms.DataGridView gradeEquipe;
        private System.Windows.Forms.DataGridViewTextBoxColumn colNome;
        private System.Windows.Forms.DataGridViewTextBoxColumn colCpf;
        private System.Windows.Forms.DataGridViewTextBoxColumn colFuncao;
        private System.Windows.Forms.DataGridViewTextBoxColumn colRemuneracao;
        private System.Windows.Forms.DataGridViewTextBoxColumn colContratacao;
        private System.Windows.Forms.DataGridViewTextBoxColumn colTelefone;
    }
}