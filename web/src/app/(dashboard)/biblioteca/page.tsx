import { Suspense } from "react";
import { BibliotecaBoard } from "@/components/biblioteca/BibliotecaBoard";
import { ModuleGuard } from "@/components/layout/ModuleGuard";

export default function BibliotecaPage() {
  return (
    <ModuleGuard module="biblioteca" title="Biblioteca">
      {/* A leitura de `?busca=` exige uma fronteira de Suspense na renderização estática. */}
      <Suspense fallback={<div className="h-64 rounded-2xl border border-stone-200 bg-white" />}>
        <BibliotecaBoard />
      </Suspense>
    </ModuleGuard>
  );
}