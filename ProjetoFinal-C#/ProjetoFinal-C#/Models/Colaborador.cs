using System;

namespace ProjetoFinal_C_.Models
{
    public class Colaborador
    {
        public int CodColaborador { get; set; }
        public string NomeColaborador { get; set; }
        public string NumCpf { get; set; }
        public string Funcao { get; set; }
        public decimal Remuneracao { get; set; }
        public DateTime DtContratacao { get; set; }
        public string NumTelefone { get; set; }
    }
}