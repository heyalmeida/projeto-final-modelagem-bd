namespace ProjetoFinal_C_.Forms
{
    partial class FormAcesso
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
            this.painelRaiz = new System.Windows.Forms.Panel();
            this.cartaoEntrada = new System.Windows.Forms.Panel();
            this.btnEncerrar = new System.Windows.Forms.Button();
            this.btnAcessar = new System.Windows.Forms.Button();
            this.txtSenhaAcesso = new System.Windows.Forms.TextBox();
            this.rotuloSenha = new System.Windows.Forms.Label();
            this.txtUsuario = new System.Windows.Forms.TextBox();
            this.rotuloUsuario = new System.Windows.Forms.Label();
            this.marcaInstitucional = new System.Windows.Forms.Label();
            this.marcaRodape = new System.Windows.Forms.Label();
            this.painelRaiz.SuspendLayout();
            this.cartaoEntrada.SuspendLayout();
            this.SuspendLayout();
            // 
            // painelRaiz
            // 
            this.painelRaiz.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(30)))), ((int)(((byte)(90)))));
            this.painelRaiz.Controls.Add(this.marcaRodape);
            this.painelRaiz.Controls.Add(this.marcaInstitucional);
            this.painelRaiz.Controls.Add(this.cartaoEntrada);
            this.painelRaiz.Dock = System.Windows.Forms.DockStyle.Fill;
            this.painelRaiz.Location = new System.Drawing.Point(0, 0);
            this.painelRaiz.Name = "painelRaiz";
            this.painelRaiz.Size = new System.Drawing.Size(440, 480);
            this.painelRaiz.TabIndex = 0;
            // 
            // marcaInstitucional
            // 
            this.marcaInstitucional.Font = new System.Drawing.Font("Tahoma", 24F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.marcaInstitucional.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(242)))), ((int)(((byte)(197)))), ((int)(((byte)(76)))));
            this.marcaInstitucional.Location = new System.Drawing.Point(0, 50);
            this.marcaInstitucional.Name = "marcaInstitucional";
            this.marcaInstitucional.Size = new System.Drawing.Size(440, 45);
            this.marcaInstitucional.TabIndex = 0;
            this.marcaInstitucional.Text = "EntreLivros";
            this.marcaInstitucional.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // marcaRodape
            // 
            this.marcaRodape.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Italic, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.marcaRodape.ForeColor = System.Drawing.Color.Silver;
            this.marcaRodape.Location = new System.Drawing.Point(0, 440);
            this.marcaRodape.Name = "marcaRodape";
            this.marcaRodape.Size = new System.Drawing.Size(440, 25);
            this.marcaRodape.TabIndex = 1;
            this.marcaRodape.Text = "Controle de Livraria";
            this.marcaRodape.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // cartaoEntrada
            // 
            this.cartaoEntrada.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(62)))), ((int)(((byte)(44)))), ((int)(((byte)(120)))));
            this.cartaoEntrada.Controls.Add(this.btnEncerrar);
            this.cartaoEntrada.Controls.Add(this.btnAcessar);
            this.cartaoEntrada.Controls.Add(this.txtSenhaAcesso);
            this.cartaoEntrada.Controls.Add(this.rotuloSenha);
            this.cartaoEntrada.Controls.Add(this.txtUsuario);
            this.cartaoEntrada.Controls.Add(this.rotuloUsuario);
            this.cartaoEntrada.Location = new System.Drawing.Point(55, 135);
            this.cartaoEntrada.Name = "cartaoEntrada";
            this.cartaoEntrada.Size = new System.Drawing.Size(330, 270);
            this.cartaoEntrada.TabIndex = 2;
            // 
            // rotuloUsuario
            // 
            this.rotuloUsuario.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloUsuario.ForeColor = System.Drawing.Color.White;
            this.rotuloUsuario.Location = new System.Drawing.Point(25, 25);
            this.rotuloUsuario.Name = "rotuloUsuario";
            this.rotuloUsuario.Size = new System.Drawing.Size(280, 18);
            this.rotuloUsuario.TabIndex = 0;
            this.rotuloUsuario.Text = "Usuário:";
            // 
            // txtUsuario
            // 
            this.txtUsuario.Font = new System.Drawing.Font("Tahoma", 11F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtUsuario.Location = new System.Drawing.Point(25, 46);
            this.txtUsuario.Name = "txtUsuario";
            this.txtUsuario.Size = new System.Drawing.Size(280, 24);
            this.txtUsuario.TabIndex = 1;
            // 
            // rotuloSenha
            // 
            this.rotuloSenha.Font = new System.Drawing.Font("Tahoma", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.rotuloSenha.ForeColor = System.Drawing.Color.White;
            this.rotuloSenha.Location = new System.Drawing.Point(25, 88);
            this.rotuloSenha.Name = "rotuloSenha";
            this.rotuloSenha.Size = new System.Drawing.Size(280, 18);
            this.rotuloSenha.TabIndex = 2;
            this.rotuloSenha.Text = "Senha de acesso:";
            // 
            // txtSenhaAcesso
            // 
            this.txtSenhaAcesso.Font = new System.Drawing.Font("Tahoma", 11F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtSenhaAcesso.Location = new System.Drawing.Point(25, 109);
            this.txtSenhaAcesso.Name = "txtSenhaAcesso";
            this.txtSenhaAcesso.Size = new System.Drawing.Size(280, 24);
            this.txtSenhaAcesso.TabIndex = 3;
            this.txtSenhaAcesso.UseSystemPasswordChar = true;
            // 
            // btnAcessar
            // 
            this.btnAcessar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(242)))), ((int)(((byte)(197)))), ((int)(((byte)(76)))));
            this.btnAcessar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnAcessar.FlatAppearance.BorderSize = 0;
            this.btnAcessar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnAcessar.Font = new System.Drawing.Font("Tahoma", 10.5F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnAcessar.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(30)))), ((int)(((byte)(90)))));
            this.btnAcessar.Location = new System.Drawing.Point(25, 160);
            this.btnAcessar.Name = "btnAcessar";
            this.btnAcessar.Size = new System.Drawing.Size(280, 42);
            this.btnAcessar.TabIndex = 4;
            this.btnAcessar.Text = "Acessar sistema";
            this.btnAcessar.UseVisualStyleBackColor = false;
            this.btnAcessar.Click += new System.EventHandler(this.BtnAcessar_Click);
            // 
            // btnEncerrar
            // 
            this.btnEncerrar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(88)))), ((int)(((byte)(70)))), ((int)(((byte)(140)))));
            this.btnEncerrar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnEncerrar.FlatAppearance.BorderSize = 0;
            this.btnEncerrar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnEncerrar.Font = new System.Drawing.Font("Tahoma", 10.5F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnEncerrar.ForeColor = System.Drawing.Color.White;
            this.btnEncerrar.Location = new System.Drawing.Point(25, 212);
            this.btnEncerrar.Name = "btnEncerrar";
            this.btnEncerrar.Size = new System.Drawing.Size(280, 42);
            this.btnEncerrar.TabIndex = 5;
            this.btnEncerrar.Text = "Encerrar";
            this.btnEncerrar.UseVisualStyleBackColor = false;
            this.btnEncerrar.Click += new System.EventHandler(this.BtnEncerrar_Click);
            // 
            // FormAcesso
            // 
            this.AcceptButton = this.btnAcessar;
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(440, 480);
            this.Controls.Add(this.painelRaiz);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Name = "FormAcesso";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "EntreLivros — Acesso";
            this.Load += new System.EventHandler(this.FormAcesso_Load);
            this.painelRaiz.ResumeLayout(false);
            this.cartaoEntrada.ResumeLayout(false);
            this.cartaoEntrada.PerformLayout();
            this.ResumeLayout(false);
        }

        #endregion

        private System.Windows.Forms.Panel painelRaiz;
        private System.Windows.Forms.Panel cartaoEntrada;
        private System.Windows.Forms.Label rotuloUsuario;
        private System.Windows.Forms.TextBox txtUsuario;
        private System.Windows.Forms.Label rotuloSenha;
        private System.Windows.Forms.TextBox txtSenhaAcesso;
        private System.Windows.Forms.Button btnAcessar;
        private System.Windows.Forms.Button btnEncerrar;
        private System.Windows.Forms.Label marcaInstitucional;
        private System.Windows.Forms.Label marcaRodape;
    }
}