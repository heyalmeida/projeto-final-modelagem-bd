namespace ProjetoFinal_C_.Forms
{
    partial class FormBuscaObra
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
            this.avisoTopo = new System.Windows.Forms.Label();
            this.gradeObras = new System.Windows.Forms.DataGridView();
            this.colObra = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colAutor = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colCategoria = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colValor = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.colAcervo = new System.Windows.Forms.DataGridViewTextBoxColumn();
            this.btnEscolher = new System.Windows.Forms.Button();
            this.btnVoltar = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.gradeObras)).BeginInit();
            this.SuspendLayout();
            // 
            // avisoTopo
            // 
            this.avisoTopo.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(30)))), ((int)(((byte)(90)))));
            this.avisoTopo.Dock = System.Windows.Forms.DockStyle.Top;
            this.avisoTopo.Font = new System.Drawing.Font("Tahoma", 11.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.avisoTopo.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(242)))), ((int)(((byte)(197)))), ((int)(((byte)(76)))));
            this.avisoTopo.Location = new System.Drawing.Point(0, 0);
            this.avisoTopo.Name = "avisoTopo";
            this.avisoTopo.Size = new System.Drawing.Size(700, 40);
            this.avisoTopo.TabIndex = 0;
            this.avisoTopo.Text = "  Busca de obras — apenas com exemplares disponíveis";
            this.avisoTopo.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // gradeObras
            // 
            this.gradeObras.AllowUserToAddRows = false;
            this.gradeObras.AllowUserToDeleteRows = false;
            this.gradeObras.AllowUserToResizeRows = false;
            this.gradeObras.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.Fill;
            this.gradeObras.BackgroundColor = System.Drawing.Color.White;
            this.gradeObras.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.gradeObras.CellBorderStyle = System.Windows.Forms.DataGridViewCellBorderStyle.SingleHorizontal;
            this.gradeObras.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.gradeObras.Columns.AddRange(new System.Windows.Forms.DataGridViewColumn[] {
            this.colObra,
            this.colAutor,
            this.colCategoria,
            this.colValor,
            this.colAcervo});
            this.gradeObras.Location = new System.Drawing.Point(12, 52);
            this.gradeObras.MultiSelect = false;
            this.gradeObras.Name = "gradeObras";
            this.gradeObras.ReadOnly = true;
            this.gradeObras.RowHeadersVisible = false;
            this.gradeObras.SelectionMode = System.Windows.Forms.DataGridViewSelectionMode.FullRowSelect;
            this.gradeObras.Size = new System.Drawing.Size(676, 310);
            this.gradeObras.TabIndex = 1;
            this.gradeObras.CellDoubleClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.GradeObras_CellDoubleClick);
            // 
            // colObra
            // 
            this.colObra.DataPropertyName = "NomeObra";
            this.colObra.FillWeight = 160F;
            this.colObra.HeaderText = "Obra";
            this.colObra.Name = "colObra";
            this.colObra.ReadOnly = true;
            // 
            // colAutor
            // 
            this.colAutor.DataPropertyName = "NomeAutor";
            this.colAutor.FillWeight = 120F;
            this.colAutor.HeaderText = "Autor";
            this.colAutor.Name = "colAutor";
            this.colAutor.ReadOnly = true;
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
            this.colValor.FillWeight = 80F;
            this.colValor.HeaderText = "Valor (R$)";
            this.colValor.Name = "colValor";
            this.colValor.ReadOnly = true;
            // 
            // colAcervo
            // 
            this.colAcervo.DataPropertyName = "QtdAcervo";
            this.colAcervo.FillWeight = 60F;
            this.colAcervo.HeaderText = "Acervo";
            this.colAcervo.Name = "colAcervo";
            this.colAcervo.ReadOnly = true;
            // 
            // btnEscolher
            // 
            this.btnEscolher.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(242)))), ((int)(((byte)(197)))), ((int)(((byte)(76)))));
            this.btnEscolher.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnEscolher.FlatAppearance.BorderSize = 0;
            this.btnEscolher.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnEscolher.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnEscolher.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(45)))), ((int)(((byte)(30)))), ((int)(((byte)(90)))));
            this.btnEscolher.Location = new System.Drawing.Point(250, 382);
            this.btnEscolher.Name = "btnEscolher";
            this.btnEscolher.Size = new System.Drawing.Size(130, 36);
            this.btnEscolher.TabIndex = 2;
            this.btnEscolher.Text = "Escolher";
            this.btnEscolher.UseVisualStyleBackColor = false;
            this.btnEscolher.Click += new System.EventHandler(this.BtnEscolher_Click);
            // 
            // btnVoltar
            // 
            this.btnVoltar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(120)))), ((int)(((byte)(112)))), ((int)(((byte)(140)))));
            this.btnVoltar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnVoltar.DialogResult = System.Windows.Forms.DialogResult.Cancel;
            this.btnVoltar.FlatAppearance.BorderSize = 0;
            this.btnVoltar.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.btnVoltar.Font = new System.Drawing.Font("Tahoma", 9.75F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnVoltar.ForeColor = System.Drawing.Color.White;
            this.btnVoltar.Location = new System.Drawing.Point(395, 382);
            this.btnVoltar.Name = "btnVoltar";
            this.btnVoltar.Size = new System.Drawing.Size(130, 36);
            this.btnVoltar.TabIndex = 3;
            this.btnVoltar.Text = "Voltar";
            this.btnVoltar.UseVisualStyleBackColor = false;
            this.btnVoltar.Click += new System.EventHandler(this.BtnVoltar_Click);
            // 
            // FormBuscaObra
            // 
            this.AcceptButton = this.btnEscolher;
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.White;
            this.CancelButton = this.btnVoltar;
            this.ClientSize = new System.Drawing.Size(700, 435);
            this.Controls.Add(this.btnVoltar);
            this.Controls.Add(this.btnEscolher);
            this.Controls.Add(this.gradeObras);
            this.Controls.Add(this.avisoTopo);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "FormBuscaObra";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Text = "Buscar Obra";
            this.Load += new System.EventHandler(this.FormBuscaObra_Load);
            ((System.ComponentModel.ISupportInitialize)(this.gradeObras)).EndInit();
            this.ResumeLayout(false);
        }

        #endregion

        private System.Windows.Forms.Label avisoTopo;
        private System.Windows.Forms.DataGridView gradeObras;
        private System.Windows.Forms.DataGridViewTextBoxColumn colObra;
        private System.Windows.Forms.DataGridViewTextBoxColumn colAutor;
        private System.Windows.Forms.DataGridViewTextBoxColumn colCategoria;
        private System.Windows.Forms.DataGridViewTextBoxColumn colValor;
        private System.Windows.Forms.DataGridViewTextBoxColumn colAcervo;
        private System.Windows.Forms.Button btnEscolher;
        private System.Windows.Forms.Button btnVoltar;
    }
}