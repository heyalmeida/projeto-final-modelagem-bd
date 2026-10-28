using System.Globalization;

namespace ProjetoFinal_C_.Utils
{
    /// <summary>
    /// Auxílios de leitura e formatação de valores digitados pelo
    /// usuário, sempre na cultura pt-BR (vírgula decimal).
    /// </summary>
    public static class Formato
    {
        private static readonly CultureInfo PtBr = CultureInfo.GetCultureInfo("pt-BR");

        /// <summary>
        /// Tenta converter texto em decimal (ex: "39,90").
        /// </summary>
        public static bool TentarDinheiro(string texto, out decimal valor)
        {
            return decimal.TryParse((texto ?? string.Empty).Trim(),
                NumberStyles.Number, PtBr, out valor);
        }

        /// <summary>
        /// Tenta converter texto em número inteiro.
        /// </summary>
        public static bool TentarNumero(string texto, out int valor)
        {
            return int.TryParse((texto ?? string.Empty).Trim(),
                NumberStyles.Integer, PtBr, out valor);
        }

        /// <summary>
        /// Formata decimal como dinheiro pt-BR ("39,90").
        /// </summary>
        public static string Dinheiro(decimal valor)
        {
            return valor.ToString("N2", PtBr);
        }
    }
}