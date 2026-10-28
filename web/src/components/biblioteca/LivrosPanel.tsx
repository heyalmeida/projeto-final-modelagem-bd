"use client";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Panel } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { icons } from "@/constants/icons";
import { BookCard } from "@/components/biblioteca/BookCard";
import { areasDisponiveis, livrosFiltrados } from "@/features/biblioteca/selectors";
import { inputClasses } from "@/components/ui/Input";
import { useViewer } from "@/store/viewer-context";

interface LivrosPanelProps {
  termo: string;
  area: string;
  onTermoChange: (valor: string) => void;
  onAreaChange: (valor: string) => void;
  onBuscar: () => void;
  onLimpar: () => void;
}

/** Busca do catálogo e grade de títulos. */
export function LivrosPanel({ termo, area, onTermoChange, onAreaChange, onBuscar, onLimpar }: LivrosPanelProps) {
  const { data } = useViewer();
  const livros = livrosFiltrados(data, termo, area);
  const areas = areasDisponiveis(data);
  const SearchIcon = icons.search;

  return (
    <>
      <form
        className="mb-3 flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          onBuscar();
        }}
      >
        <div className="relative min-w-[220px] flex-1 sm:max-w-[420px]">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
          <input
            name="q"
            type="search"
            value={termo}
            onChange={(event) => onTermoChange(event.target.value)}
            placeholder="Buscar por título, autor, ISBN ou área..."
            aria-label="Buscar no acervo"
            className={`${inputClasses} pl-9`}
          />
        </div>
        <Select
          name="area"
          value={area}
          onChange={(event) => onAreaChange(event.target.value)}
          className="w-auto"
          aria-label="Filtrar por área"
        >
          {areas.map((item) => (
            <option key={item} value={item}>
              {item === "TODOS" ? "Todas as áreas" : item}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="primary">
          <SearchIcon className="h-4 w-4" /> Buscar
        </Button>
        {termo ? (
          <Button variant="ghost" onClick={onLimpar}>
            Limpar
          </Button>
        ) : null}
      </form>

      {livros.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {livros.map((livro) => (
            <BookCard key={livro.id} livro={livro} />
          ))}
        </div>
      ) : (
        <Panel>
          <EmptyState icon="search" title="Nenhum livro encontrado" text="Tente outro termo ou remova o filtro de área." />
        </Panel>
      )}
    </>
  );
}