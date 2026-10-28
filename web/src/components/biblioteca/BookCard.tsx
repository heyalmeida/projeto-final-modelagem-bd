"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CoverImage } from "@/components/ui/CoverImage";
import { BookDetailModal } from "@/components/biblioteca/BookDetailModal";
import { icons } from "@/constants/icons";
import { capaDoLivro } from "@/constants/images";
import { disponibilidadeDoLivro } from "@/features/biblioteca/selectors";
import { cn } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";
import type { Livro } from "@/types/domain";

interface BookCardProps {
  livro: Livro;
  /** Versão reduzida usada no painel. */
  compact?: boolean;
}

/** Cartão de título com disponibilidade e acesso à ficha completa. */
export function BookCard({ livro, compact = false }: BookCardProps) {
  const { data } = useViewer();
  const [detalheAberto, setDetalheAberto] = useState(false);
  const { disponiveis, total } = disponibilidadeDoLivro(data, livro.id);
  const ArrowIcon = icons.arrowRight;

  return (
    <>
      <Card className="flex flex-col overflow-hidden">
        <div
          className={cn("relative flex items-end overflow-hidden px-3", compact ? "h-[74px]" : "h-[92px]")}
          style={{ background: `linear-gradient(135deg, ${livro.cor}, #0b1f33)` }}
        >
          <CoverImage
            src={capaDoLivro(livro.area)}
            sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw"
            className="opacity-80"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(11,31,51,.25) 0%, rgba(11,31,51,.9) 100%)" }}
          />
          <span className="absolute bottom-2 left-3 top-2 w-1 rounded bg-white/40" />
          <span className="relative pl-3 font-display text-[15.5px] leading-tight text-white drop-shadow">
            {livro.titulo}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3">
          <h3 className="text-[14px] font-bold leading-snug text-slate-800">{livro.titulo}</h3>
          <p className="text-[12px] text-stone-600">
            {livro.autor} · {livro.ano}
          </p>
          <p className="text-[11px] text-stone-500">
            {livro.area} · {livro.editora}
          </p>
          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <Badge tone={disponiveis ? "ok" : "warn"} className="text-[11px] font-bold">
              {disponiveis} de {total} disponível(is)
            </Badge>
            <Button onClick={() => setDetalheAberto(true)}>
              Detalhes <ArrowIcon className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      <BookDetailModal livro={livro} open={detalheAberto} onClose={() => setDetalheAberto(false)} />
    </>
  );
}