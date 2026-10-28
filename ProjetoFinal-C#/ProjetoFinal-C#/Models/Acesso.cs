namespace ProjetoFinal_C_.Models
{
    public class Acesso
    {
        public int CodAcesso { get; set; }
        public string Usuario { get; set; }
        public string Senha { get; set; }

        /// <summary>
        /// Perfil de acesso: ADMIN, FUNCIONARIO ou USUARIO.
        /// </summary>
        public string Perfil { get; set; }

        public bool EhAdmin
        {
            get { return Perfil == "ADMIN"; }
        }

        public bool EhFuncionario
        {
            get { return Perfil == "FUNCIONARIO"; }
        }

        public bool EhUsuarioConsulta
        {
            get { return Perfil == "USUARIO"; }
        }
    }
}