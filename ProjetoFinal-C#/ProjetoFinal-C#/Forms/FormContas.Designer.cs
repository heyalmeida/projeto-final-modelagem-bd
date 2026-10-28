namespace ProjetoFinal_C_.Forms
{
    partial class FormContas
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
            this.rotuloUsuario = new System.Windows.Forms.Label();
            this.txtUsuario = new System.Windows.Forms.TextBox();
            this.rotuloSenha = new System.Windows.Forms.Label();
            this.txtSenha = new System.Windows.Forms.TextBox();
            this.rotuloPerfil = new System.Windows.Forms.Label();
            this.cboPerfil = new System.Windows.Forms.ComboBox();
            this.btnGravar = new System.Windows.Forms.Button();
            this.btnAlterar = new System.Windows.Forms.Button();
            this.btnRemover = new System.Windows.Forms.Button();
            this.btnLimpar = new System.Windows.Forms.Button();
            this.rotuloSituacao = new System.Windows.Forms.Label();
            this.gradeContas = new System.Windows.Forms.DataGridView();
            this.colUsuario = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colPerfil = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.cartaoPrincipal.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gradeContas)).BeginInit();
            this.SuspendLayout();
            // 
            // cartaoPrincipal
            // 
            this.cartaoPrincipal.BackColor = System.Drawing.Color.White;
            this.cartaoPrincipal.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.cartaoPrincipal.Controls.Add(this.gradeContas);
            this.cartaoPrincipal.Controls.Add(this.rotuloSituacao);
            this.cartaoPrincipal.Controls.Add(this.btnLimpar);
            this.cartaoPrincipal.Controls.Add(this.btnRemover);
            this.cartaoPrincipal.Controls.Add(this.btnAlterar);
            this.cartaoPrincipal.Controls.Add(this.btnGravar);
            this.cartaoPrincipal.Controls.Add(this.cboPerfil);
            this.cartaoPrincipal.Controls.Add(this.rotuloPerfil);
            this.cartaoPrincipal.Controls.Add(this.txtSenha);
            this.cartaoPrincipal.Controls.Add(this.rotuloSenha);
            this.cartaoPrincipal.Controls.Add(this.txtUsuario);
            this.cartaoPrincipal.Controls.Add(this.rotuloUsuario);
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
            this.tituloTela.Text = "Contas de Acesso (Administrador)";
            this.tituloTela.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // rotuloUsuario
            // 
            this.rotuloUsuario.AutoSize = true;
            this.rotuloUsuario.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloUsuario.Location = new System.Drawing.Point(20, 62);
            this.rotuloUsuario.Name = "rotuloUsuario";
            this.rotuloUsuario.Size = new System.Drawing.Size(100, 13);
            this.rotuloUsuario.TabIndex = 1;
            this.rotuloUsuario.Text = "Usuário (login):";
            // 
            // txtUsuario
            // 
            this.txtUsuario.Location = new System.Drawing.Point(140, 58);
            this.txtUsuario.Name = "txtUsuario";
            this.txtUsuario.Size = new System.Drawing.Size(240, 20);
            this.txtUsuario.TabIndex = 2;
            // 
            // rotuloSenha
            // 
            this.rotuloSenha.AutoSize = true;
            this.rotuloSenha.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloSenha.Location = new System.Drawing.Point(410, 62);
            this.rotuloSenha.Name = "rotuloSenha";
            this.rotuloSenha.Size = new System.Drawing.Size(41, 13);
            this.rotuloSenha.TabIndex = 3;
            this.rotuloSenha.Text = "Senha:";
            // 
            // txtSenha
            // 
            this.txtSenha.Location = new System.Drawing.Point(490, 58);
            this.txtSenha.Name = "txtSenha";
            this.txtSenha.Size = new System.Drawing.Size(270, 20);
            this.txtSenha.TabIndex = 4;
            // 
            // rotuloPerfil
            // 
            this.rotuloPerfil.AutoSize = true;
            this.rotuloPerfil.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloPerfil.Location = new System.Drawing.Point(20, 105);
            this.rotuloPerfil.Name = "rotuloPerfil";
            this.rotuloPerfil.Size = new System.Drawing.Size(38, 13);
            this.rotuloPerfil.TabIndex = 5;
            this.rotuloPerfil.Text = "Perfil:";
            // 
            // cboPerfil
            // 
            this.cboPerfil.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.cboPerfil.FormattingEnabled = true;
            this.cboPerfil.Items.AddRange(new object[] {
            "ADMIN",
            "FUNCIONARIO",
            "USUARIO"});
            this.cboPerfil.Location = new System.Drawing.Point(140, 101);
            this.cboPerfil.Name = "cboPerfil";
            this.cboPerfil.Size = new System.Drawing.Size(240, 21);
            this.cboPerfil.TabIndex = 6;
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
            this.btnGravar.TabIndex = 7;
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
            this.btnAlterar.TabIndex = 8;
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
            this.btnRemover.TabIndex = 9;
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
            this.btnLimpar.TabIndex = 10;
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
            this.rotuloSituacao.TabIndex = 11;
            this.rotuloSituacao.Text = "Preencha os dados e use Gravar para incluir.";
            this.rotuloSituacao.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            // 
            // gradeContas
            // 
            this.gradeContas.AllowUserToAddRows = false;
            this.gradeContas.AllowUserToDeleteRows = false;
            this.gradeContas.AllowUserToResizeRows = false;
            this.gradeContas.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.gradeContas.BackgroundColor = System.Drawing.Color.White;
            this.gradeContas.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.gradeContas.CellBorderStyle = System.Windows.Forms.DataGridViewCellBorderStyle.SingleHorizontal;
            this.gradeContas.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.gradeContas.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colUsuario,
            this.colPerfil});
            this.gradeContas.Location = new System.Drawing.Point(20, 220);
            this.gradeContas.MultiSelect = false;
            this.gradeContas.Name = "gradeContas";
            this.gradeContas.ReadOnly = true;
            this.gradeContas.RowHeadersVisible = false;
            this.gradeContas.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.gradeContas.Size = new System.Drawing.Size(740, 330);
            this.gradeContas.TabIndex = 12;
            this.gradeContas.SelectionChanged += new System.EventHandler(this.GradeContas_SelectionChanged);
            // 
            // colUsuario
            // 
            this.colUsuario.DataPropertyName = "Usuario";
            this.colUsuario.FillWeight = 150F;
            this.colUsuario.HeaderText = "Usuário";
            this.colUsuario.Name = "colUsuario";
            this.colUsuario.ReadOnly = true;
            // 
            // colPerfil
            // 
            this.colPerfil.DataPropertyName = "Perfil";
            this.colPerfil.FillWeight = 100F;
            this.colPerfil.HeaderText = "Perfil";
            this.colPerfil.Name = "colPerfil";
            this.colPerfil.ReadOnly = true;
            // 
            // FormContas
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(245)))), ((int)(((byte)(243)))), ((int)(((byte)(248)))));
            this.ClientSize = new System.Drawing.Size(820, 600);
            this.Controls.Add(this.cartaoPrincipal);
            this.Name = "FormContas";
            this.Text = "Contas de Acesso";
            this.Load += new System.EventHandler(this.FormContas_Load);
            this.Resize += new System.EventHandler(this.FormContas_Resize);
            this.cartaoPrincipal.ResumeLayout(false);
            this.cartaoPrincipal.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gradeContas)).EndInit();
            this.ResumeLayout(false);
        }

        #endregion

        private System.Windows.Forms.Panel cartaoPrincipal;
        private System.Windows.Forms.Label tituloTela;
        private System.Windows.Forms.Label rotuloUsuario;
            private System.Windows.Forms.TextBox txtUsuario;
        private System.Windows.Forms.Label rotuloSenha;
        private System.Windows.Forms.TextBox txtSenha;
        private System.Windows.Forms.Label rotuloPerfil;
        private System.Windows.Forms.ComboBox cboPerfil;
        private System.Windows.Forms.Button btnGravar;
        private System.Windows.Forms.Button btnAlterar;
        private System.Windows.Forms.Button btnRemover;
        private System.Windows.Forms.Button btnLimpar;
        private System.Windows.Forms.Label rotuloSituacao;
        private System.Windows.Forms.DataGridView gradeContas;
        private System.Windows.Forms.DataGridViewTextBoxColumn colUsuario;
        private System.Windows.Forms.DataGridViewTextBoxColumn colPerfil;
    }
}