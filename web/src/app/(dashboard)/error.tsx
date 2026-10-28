"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Card";

/** Limite de erro das páginas do dashboard, com opção de nova tentativa. */
export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[EduGestor] erro ao renderizar o dashboard:", error);
  }, [error]);

  return (
    <Panel className="mx-auto my-[8vh] max-w-lg text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-red-600">Erro inesperado</p>
      <h1 className="mt-1 font-display text-[33.5px] text-slate-900">Algo saiu do previsto</h1>
      <p className="mt-2 text-[14px] text-stone-600">
        Não foi possível renderizar esta página. Tente novamente; os dados locais permanecem intactos.
      </p>
      <Button variant="primary" className="mt-4" onClick={reset}>
        Tentar novamente
      </Button>
    </Panel>
  );
}