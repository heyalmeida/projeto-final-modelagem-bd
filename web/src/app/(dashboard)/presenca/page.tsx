import { ModuleGuard } from "@/components/layout/ModuleGuard";
import { PresencaBoard } from "@/components/presenca/PresencaBoard";

export default function PresencaPage() {
  return (
    <ModuleGuard module="presenca" title="Presença">
      <PresencaBoard />
    </ModuleGuard>
  );
}