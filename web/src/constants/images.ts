/**
 * Imagens de apoio (Unsplash). Ficam centralizadas aqui para trocar o acervo
 * visual sem tocar nos componentes.
 */

const unsplash = (id: string, width: number): string =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const images = {
  /** Fachada/campus — fundo da tela de acesso. */
  campus: unsplash("photo-1541339907198-e08756dedf3f", 1600),
  /** Estantes da biblioteca — fallback das capas. */
  biblioteca: unsplash("photo-1507842217343-583bb7270b66", 1200),
} as const;

const capasPorArea: Record<string, string> = {
  Engenharia: unsplash("photo-1519389950473-47ba0277781c", 800),
  Gestão: unsplash("photo-1454165804606-c3d57bc86b40", 800),
  Design: unsplash("photo-1524995997946-a1c2e315a42f", 800),
};

/** Imagem de capa de um título, derivada da área do conhecimento. */
export function capaDoLivro(area: string): string {
  return capasPorArea[area] ?? images.biblioteca;
}