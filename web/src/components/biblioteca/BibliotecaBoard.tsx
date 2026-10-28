"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AcervosPanel } from "@/components/biblioteca/AcervosPanel";
import { BibliotecaHeader } from "@/components/biblioteca/BibliotecaHeader";
import { BibliotecaStats } from "@/components/biblioteca/BibliotecaStats";
import { ExemplaresPanel } from "@/components/biblioteca/ExemplaresPanel";
import { HistoricoPanel } from "@/components/biblioteca/HistoricoPanel";
import { LivrosPanel } from "@/components/biblioteca/LivrosPanel";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { livrosFiltrados } from "@/features/biblioteca/selectors";
import type { BibliotecaTab } from "@/features/biblioteca/types";
import { useBibliotecaActions } from "@/features/biblioteca/hooks/use-biblioteca-actions";
import { useToast } from "@/providers/toast-provider";
import { useViewer } from "@/store/viewer-context";

const TABS: ReadonlyArray<TabItem<BibliotecaTab>> = [
  { id: "livros", label: "Livros" },
  { id: "acervo", label: "Acervos" },
  { id: "exemplares", label: "Exemplares" },
  { id: "historico", label: "Histórico" },
];

/**
 * Orquestra as seções da biblioteca: abas, filtros do catálogo e o registro da
 * busca no histórico. O termo inicial vem da busca global do cabeçalho.
 */
export function BibliotecaBoard() {
  const viewer = useViewer();
  const searchParams = useSearchParams();
  const { registrarBusca } = useBibliotecaActions();
  const { toast } = useToast();

  const [tab, setTab] = useState<BibliotecaTab>("livros");
  const [termo, setTermo] = useState(() => searchParams.get("busca") ?? "");
  const [area, setArea] = useState("TODOS");

  const buscar = () => {
    const consulta = termo.trim();
    setTermo(consulta);
    if (!consulta) return;

    const resultados = livrosFiltrados(viewer.data, consulta, area).length;
    registrarBusca({ usuarioId: viewer.user.id, termo: consulta, area, resultados });
    toast(
      resultados ? `${resultados} livro(s) encontrado(s).` : "Nenhum livro encontrado para a busca.",
      resultados ? "success" : "warn",
    );
  };

  const limpar = () => {
    setTermo("");
    setArea("TODOS");
  };

  return (
    <>
      <BibliotecaHeader />
      <BibliotecaStats />

      <div className="mb-3">
        <Tabs items={TABS} value={tab} onChange={setTab} label="Seções da biblioteca" />
      </div>

      {tab === "livros" ? (
        <LivrosPanel
          termo={termo}
          area={area}
          onTermoChange={setTermo}
          onAreaChange={setArea}
          onBuscar={buscar}
          onLimpar={limpar}
        />
      ) : tab === "acervo" ? (
        <AcervosPanel />
      ) : tab === "exemplares" ? (
        <ExemplaresPanel />
      ) : (
        <HistoricoPanel />
      )}
    </>
  );
}