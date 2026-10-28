using System;

namespace ProjetoFinal_C_.Models
{
    public class Movimento
    {
        public int CodMovimento { get; set; }
        public int CodObra { get; set; }
        public string NomeObra { get; set; }
        public string TipoMovimento { get; set; }
        public int QtdMovimentada { get; set; }
        public DateTime DtHoraMovimento { get; set; }
        public string OrigemMovimento { get; set; }
    }
}