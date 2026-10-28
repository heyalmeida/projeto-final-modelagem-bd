using System;

namespace ProjetoFinal_C_.Models
{
    public class Pedido
    {
        public int CodPedido { get; set; }
        public DateTime DtHoraPedido { get; set; }
        public int CodColaborador { get; set; }
        public string NomeColaborador { get; set; }
        public string NomeCliente { get; set; }
        public string FormaPagamento { get; set; }
        public decimal ValorTotal { get; set; }
    }
}