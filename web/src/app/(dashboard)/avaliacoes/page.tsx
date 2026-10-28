import { AvaliacoesBoard } from "@/components/avaliacoes/AvaliacoesBoard";
import { ModuleGuard } from "@/components/layout/ModuleGuard";

export default function AvaliacoesPage() {
  return (
    <ModuleGuard module="avaliacoes" title="Avaliações">
      <AvaliacoesBoard />
    </ModuleGuard>
  );
}