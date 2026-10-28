namespace ProjetoFinal_C_.Models
{
    public class PedidoItem
    {
        public int CodItem { get; set; }
        public int CodPedido { get; set; }
        public int CodObra { get; set; }
        public string NomeObra { get; set; }
        public int QtdVendida { get; set; }
        public decimal ValorCobrado { get; set; }
        public decimal AbatimentoPct { get; set; }
        public decimal ValorLiquido { get; set; }
    }
}