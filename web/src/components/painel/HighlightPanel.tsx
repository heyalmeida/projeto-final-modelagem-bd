"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { kpiToneClasses } from "@/components/ui/KpiCard";
import { BookCard } from "@/components/biblioteca/BookCard";
import { icons } from "@/constants/icons";
import { MiniAssessmentCard } from "@/components/painel/MiniAssessmentCard";
import { usePainelResumo } from "@/features/painel/hooks/use-painel-resumo";
import { formatDate, formatDateTime, money } from "@/lib/utils";

/**
 * Segundo painel do dashboard. O conteúdo segue a prioridade dos módulos do
 * perfil: avaliações → biblioteca → financeiro → agenda.
 */
export function HighlightPanel() {
  const resumo = usePainelResumo();
  const ArrowIcon = icons.arrowRight;
  const CheckIcon = icons.check;
  const CalendarIcon = icons.agenda;

  if (resumo.destaque === "avaliacoes") {
    return (
      <Panel>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg text-slate-900">Avaliações em destaque</h2>
          <ButtonLink href="/avaliacoes" variant="ghost">
            Ver todas <ArrowIcon className="h-4 w-4" />
          </ButtonLink>
        </div>
        {resumo.avaliacoesDestaque.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {resumo.avaliacoesDestaque.map((avaliacao) => (
              <MiniAssessmentCard key={avaliacao.id} avaliacao={avaliacao} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="avaliacoes"
            title="Sem avaliações abertas"
            text="Quando uma avaliação for publicada, ela aparece aqui."
          />
        )}
      </Panel>
    );
  }

  if (resumo.destaque === "biblioteca") {
    return (
      <Panel>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg text-slate-900">Acervo em destaque</h2>
          <ButtonLink href="/biblioteca" variant="ghost">
            Abrir biblioteca <ArrowIcon className="h-4 w-4" />
          </ButtonLink>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {resumo.livrosDestaque.map((livro) => (
            <BookCard key={livro.id} livro={livro} compact />
          ))}
        </div>
      </Panel>
    );
  }

  if (resumo.destaque === "financeiro") {
    return (
      <Panel>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg text-slate-900">Últimos pagamentos</h2>
          <ButtonLink href="/financeiro" variant="ghost">
            Ver financeiro <ArrowIcon className="h-4 w-4" />
          </ButtonLink>
        </div>
        {resumo.pagamentosRecentes.length ? (
          <div>
            {resumo.pagamentosRecentes.map((pagamento) => (
              <div key={pagamento.id} className="flex items-center gap-3 border-b border-stone-100 py-2.5 last:border-0">
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${kpiToneClasses.green}`}>
                  <CheckIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-slate-800">{pagamento.aluno}</div>
                  <div className="text-[12px] text-stone-600">
                    {pagamento.competencia} · {formatDateTime(pagamento.data)}
                  </div>
                </div>
                <strong className="text-[13.5px] text-slate-800">{money(pagamento.valor)}</strong>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="financeiro" title="Sem pagamentos" text="As baixas registradas aparecem aqui." />
        )}
      </Panel>
    );
  }

  if (resumo.destaque === "agenda") {
    return (
      <Panel>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg text-slate-900">Próximos eventos</h2>
          <ButtonLink href="/agenda" variant="ghost">
            Abrir agenda <ArrowIcon className="h-4 w-4" />
          </ButtonLink>
        </div>
        {resumo.proximosEventos.length ? (
          <div>
            {resumo.proximosEventos.map((evento) => (
              <div key={evento.id} className="flex items-center gap-3 border-b border-stone-100 py-2.5 last:border-0">
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${kpiToneClasses.blue}`}>
                  <CalendarIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-slate-800">{evento.titulo}</div>
                  <div className="text-[12px] text-stone-600">
                    {formatDate(evento.inicio)} · {evento.local}
                  </div>
                </div>
                <StatusBadge status={evento.status} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="agenda" title="Sem eventos" text="Nenhum evento futuro publicado." />
        )}
      </Panel>
    );
  }

  return null;
}