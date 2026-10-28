import { FinanceiroChart } from "@/components/painel/FinanceiroChart";
import { HighlightPanel } from "@/components/painel/HighlightPanel";
import { ModuleGrid } from "@/components/painel/ModuleGrid";
import { PainelHeader } from "@/components/painel/PainelHeader";
import { PendingList } from "@/components/painel/PendingList";
import { StatsSection } from "@/components/painel/StatsSection";
import { SummaryPanel } from "@/components/painel/SummaryPanel";
import { UpcomingList } from "@/components/painel/UpcomingList";

export default function PainelPage() {
  return (
    <>
      <PainelHeader />
      <StatsSection />
      <ModuleGrid />
      <FinanceiroChart />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
        <div className="flex min-w-0 flex-col gap-4">
          <UpcomingList />
          <HighlightPanel />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <PendingList />
          <SummaryPanel />
        </div>
      </div>
    </>
  );
}