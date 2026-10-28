import { FinanceiroBoard } from "@/components/financeiro/FinanceiroBoard";
import { ModuleGuard } from "@/components/layout/ModuleGuard";

export default function FinanceiroPage() {
  return (
    <ModuleGuard module="financeiro" title="Financeiro">
      <FinanceiroBoard />
    </ModuleGuard>
  );
}