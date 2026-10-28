"use client";

import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { icons } from "@/constants/icons";
import { totaisDoAcervo } from "@/features/biblioteca/selectors";
import { useViewer } from "@/store/viewer-context";

/** Coleções do acervo com a contagem de títulos e exemplares. */
export function AcervosPanel() {
  const { data } = useViewer();
  const BookIcon = icons.biblioteca;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {data.acervos.map((acervo) => {
        const totais = totaisDoAcervo(data, acervo.id);
        return (
          <Card key={acervo.id} className="flex items-start gap-3 p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-pink-50 text-pink-700">
              <BookIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg text-slate-900">{acervo.nome}</h3>
                <StatusBadge status={acervo.ativo ? "ATIVA" : "CANCELADA"} />
              </div>
              <p className="mt-1 text-[13px] text-stone-600">{acervo.descricao}</p>
              <div className="mt-2 flex gap-3 text-[12px] text-stone-600">
                <span>{totais.titulos} título(s)</span>
                <span>{totais.exemplares} exemplar(es)</span>
                <span>{acervo.area}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}