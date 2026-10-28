import { canManageLibrary, currentGroup } from "@/lib/auth";
import type { Acervo, AppData, Exemplar, HistoricoBusca, Livro, Viewer } from "@/types/domain";

/** Catálogo, disponibilidade dos exemplares e histórico de buscas. */

const normalizar = (valor: string): string => valor.toLowerCase();

export function livrosFiltrados(data: AppData, termo: string, area: string): Livro[] {
  const busca = normalizar(termo.trim());
  return data.livros.filter((livro) => {
    const correspondeTermo =
      !busca ||
      [livro.titulo, livro.autor, livro.isbn, livro.area, livro.editora].some((valor) =>
        normalizar(String(valor)).includes(busca),
      );
    const correspondeArea = area === "TODOS" || livro.area === area;
    return correspondeTermo && correspondeArea;
  });
}

export function areasDisponiveis(data: AppData): string[] {
  return ["TODOS", ...Array.from(new Set(data.livros.map((livro) => livro.area)))];
}

export const exemplaresDoLivro = (data: AppData, livroId: string): Exemplar[] =>
  data.exemplares.filter((exemplar) => exemplar.livroId === livroId);

export function disponibilidadeDoLivro(data: AppData, livroId: string): { disponiveis: number; total: number } {
  const exemplares = exemplaresDoLivro(data, livroId);
  return {
    disponiveis: exemplares.filter((exemplar) => exemplar.status === "DISPONIVEL").length,
    total: exemplares.length,
  };
}

export function totaisDoAcervo(data: AppData, acervoId: string): { titulos: number; exemplares: number } {
  const livros = data.livros.filter((livro) => livro.acervoId === acervoId);
  const ids = livros.map((livro) => livro.id);
  return {
    titulos: livros.length,
    exemplares: data.exemplares.filter((exemplar) => ids.includes(exemplar.livroId)).length,
  };
}

export interface ResumoAcervo {
  acervos: number;
  titulos: number;
  exemplares: number;
  disponiveis: number;
  buscas: number;
  percentualDisponivel: number;
}

export function resumoAcervo(data: AppData): ResumoAcervo {
  const disponiveis = data.exemplares.filter((exemplar) => exemplar.status === "DISPONIVEL").length;
  return {
    acervos: data.acervos.length,
    titulos: data.livros.length,
    exemplares: data.exemplares.length,
    disponiveis,
    buscas: data.historico.length,
    percentualDisponivel: data.exemplares.length ? Math.round((disponiveis / data.exemplares.length) * 100) : 0,
  };
}

/** Quem gerencia a biblioteca vê o histórico completo; os demais, só as próprias buscas. */
export function historicoVisivel(viewer: Viewer): HistoricoBusca[] {
  const grupo = currentGroup(viewer.data, viewer.user);
  const lista = canManageLibrary(viewer.user, grupo)
    ? viewer.data.historico
    : viewer.data.historico.filter((registro) => registro.usuarioId === viewer.user.id);
  return [...lista].sort((a, b) => String(b.data).localeCompare(String(a.data)));
}

export const acervoPorId = (data: AppData, id: string): Acervo | undefined =>
  data.acervos.find((acervo) => acervo.id === id);