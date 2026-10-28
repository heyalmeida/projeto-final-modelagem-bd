using System;
using System.Windows.Forms;
using ProjetoFinal_C_.Forms;

namespace ProjetoFinal_C_
{
    internal static class Program
    {
        /// <summary>
        /// Ponto de entrada do EntreLivros: abre diretamente a tela
        /// de acesso (login).
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            Application.Run(new FormAcesso());
        }
    }
}