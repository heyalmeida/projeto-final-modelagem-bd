namespace ProjetoFinal_C_.Models
{
    public class Obra
    {
        public int CodObra { get; set; }
        public string NomeObra { get; set; }
        public string NomeAutor { get; set; }
        public int CodEditora { get; set; }
        public string NomeEditora { get; set; }
        public string CodigoBarras { get; set; }
        public string Categoria { get; set; }
        public decimal ValorUnitario { get; set; }
        public int QtdAcervo { get; set; }
        public int AnoPublicacao { get; set; }
    }
}