import { AgendaBoard } from "@/components/agenda/AgendaBoard";
import { ModuleGuard } from "@/components/layout/ModuleGuard";

export default function AgendaPage() {
  return (
    <ModuleGuard module="agenda" title="Agenda">
      <AgendaBoard />
    </ModuleGuard>
  );
}