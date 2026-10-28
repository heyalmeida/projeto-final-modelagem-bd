import { acervoSchema, livroSchema, type AcervoInput, type ExemplarStatusInput, type LivroInput } from "@/features/biblioteca/schemas";
import { siteConfig } from "@/config/site";
import { createId } from "@/lib/utils";
import type { AppData, ExemplarStatus, MutationResult } from "@/types/domain";

/** Mutações da biblioteca: acervos, títulos, exemplares e histórico de busca. */

const CORES_POR_AREA: Record<string, string> = {
  Engenharia: "#0f766e",
  Gestão: "#b45309",
  Design: "#be185d",
};

export const corDaArea = (area: string): string => CORES_POR_AREA[area] ?? "#1d4ed8";

function proximoTombo(draft: AppData): string {
  const maior = draft.exemplares.reduce((max, exemplar) => {
    const numero = Number(exemplar.tombo.replace(/\D/g, ""));
    return Number.isFinite(numero) && numero > max ? numero : max;
  }, 1000);
  return `T${maior + 1}`;
}

export function criarAcervo(draft: AppData, input: AcervoInput, responsavelId: string): MutationResult {
  const parsed = acervoSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Acervo inválido." };

  const duplicado = draft.acervos.some(
    (acervo) => acervo.nome.toLowerCase() === parsed.data.nome.toLowerCase(),
  );
  if (duplicado) return { ok: false, error: "Já existe um acervo com esse nome." };

  draft.acervos.push({
    id: createId("ac"),
    nome: parsed.data.nome,
    descricao: parsed.data.descricao,
    area: parsed.data.area,
    responsavelId,
    ativo: true,
  });
  return { ok: true };
}

export function criarLivro(draft: AppData, input: LivroInput): MutationResult {
  const parsed = livroSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Livro inválido." };

  const acervo = draft.acervos.find((item) => item.id === parsed.data.acervoId);
  if (!acervo) return { ok: false, error: "Acervo não encontrado." };

  const isbn = parsed.data.isbn.replace(/\s/g, "");
  const duplicado = draft.livros.some((livro) => livro.isbn.replace(/\s/g, "") === isbn);
  if (duplicado) return { ok: false, error: "Já existe um título com esse ISBN." };

  const livroId = createId("li");
  draft.livros.push({
    id: livroId,
    acervoId: acervo.id,
    titulo: parsed.data.titulo,
    autor: parsed.data.autor,
    isbn: parsed.data.isbn,
    editora: parsed.data.editora,
    ano: parsed.data.ano,
    area: parsed.data.area,
    cor: corDaArea(parsed.data.area),
  });

  for (let indice = 0; indice < parsed.data.exemplares; indice += 1) {
    draft.exemplares.push({
      id: `ex-${livroId}-${indice + 1}`,
      livroId,
      tombo: proximoTombo(draft),
      status: "DISPONIVEL",
      localizacao: `${parsed.data.area} · Estante ${draft.livros.length}`,
      dataAquisicao: siteConfig.todayDate,
    });
  }
  return { ok: true };
}

/** Acrescenta um exemplar a um título já catalogado. */
export function adicionarExemplar(draft: AppData, livroId: string): MutationResult {
  const livro = draft.livros.find((item) => item.id === livroId);
  if (!livro) return { ok: false, error: "Título não encontrado." };

  const quantidade = draft.exemplares.filter((exemplar) => exemplar.livroId === livroId).length;
  draft.exemplares.push({
    id: `ex-${livroId}-${quantidade + 1}-${Date.now()}`,
    livroId,
    tombo: proximoTombo(draft),
    status: "DISPONIVEL",
    localizacao: `${livro.area} · Estante ${quantidade + 1}`,
    dataAquisicao: siteConfig.todayDate,
  });
  return { ok: true };
}

/** Circulação do exemplar: disponível, emprestado, manutenção ou baixado. */
export function alternarStatusExemplar(
  draft: AppData,
  exemplarId: string,
  status: ExemplarStatusInput,
): MutationResult {
  const exemplar = draft.exemplares.find((item) => item.id === exemplarId);
  if (!exemplar) return { ok: false, error: "Exemplar não encontrado." };
  exemplar.status = status as ExemplarStatus;
  return { ok: true };
}

/** Registra a busca no histórico (somente quando há termo). */
export function registrarBusca(
  draft: AppData,
  input: { usuarioId: string; termo: string; area: string; resultados: number },
): MutationResult {
  const busca = input.termo.trim();
  if (!busca) return { ok: false, error: "Informe o termo da busca." };
  draft.historico.push({
    id: createId("hb"),
    usuarioId: input.usuarioId,
    termo: busca,
    filtros: input.area === "TODOS" ? "Todos" : input.area,
    data: new Date().toISOString(),
    resultados: input.resultados,
  });
  return { ok: true };
}