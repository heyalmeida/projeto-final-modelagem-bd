"use client";

import { useState } from "react";
import { NovoLancamentoModal } from "@/components/financeiro/NovoLancamentoModal";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { resumoFinanceiro } from "@/features/financeiro/selectors";
import { canManageFinance } from "@/lib/auth";
import { useViewer } from "@/store/viewer-context";

/** Cabeçalho do financeiro: pendências e lançamento de cobrança (equipe). */
export function FinanceiroHeader() {
  const viewer = useViewer();
  const resumo = resumoFinanceiro(viewer);
  const podeLancar = canManageFinance(viewer.user, viewer.group);
  const [lancando, setLancando] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Módulo Financeiro"
        title="Mensalidades e pagamentos"
        sub="Cobranças por competência, baixas parciais, estornos e métodos de pagamento."
        actions={
          <>
            <Badge tone={resumo.vencidas ? "danger" : "ok"} className="text-[10.5px] font-bold">
              {resumo.vencidas} vencida(s)
            </Badge>
            {podeLancar ? (
              <Button variant="primary" onClick={() => setLancando(true)}>
                Lançar cobrança
              </Button>
            ) : null}
          </>
        }
      />

      {lancando ? <NovoLancamentoModal onClose={() => setLancando(false)} /> : null}
    </>
  );
}