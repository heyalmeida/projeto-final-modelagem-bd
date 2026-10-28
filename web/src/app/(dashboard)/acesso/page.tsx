import { AcessoHeader } from "@/components/acesso/AcessoHeader";
import { ModulosMatrix } from "@/components/acesso/ModulosMatrix";
import { UsuariosTable } from "@/components/acesso/UsuariosTable";
import { ModuleGuard } from "@/components/layout/ModuleGuard";

export default function AcessoPage() {
  return (
    <ModuleGuard superuser title="Acesso e módulos">
      <AcessoHeader />
      <div className="grid items-start gap-4 xl:grid-cols-2">
        <ModulosMatrix />
        <UsuariosTable />
      </div>
    </ModuleGuard>
  );
}