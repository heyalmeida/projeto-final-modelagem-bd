"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { KpiCard } from "@/components/ui/KpiCard";
import { Panel } from "@/components/ui/Card";
import { DonutChart } from "@/components/ui/charts/DonutChart";
import { DataTable, TableHeaderRow } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { RadialGauge } from "@/components/ui/RadialGauge";
import { siteConfig } from "@/config/site";
import { minhasMatriculas, turmaById } from "@/features/core/selectors";
import {
  frequenciaDaMatricula,
  frequenciaDoAluno,
  registrosDoAluno,
} from "@/features/presenca/selectors";
import { formatDate, formatPercent } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

/** Visão do aluno: frequência, histórico de presença e frequência por matrícula. */
export function PresencaAluno() {
  const viewer = useViewer();
  const registros = registrosDoAluno(viewer);
  const frequencia = frequenciaDoAluno(viewer);
  const matriculas = minhasMatriculas(viewer);

  const presentes = registros.filter(({ registro }) => registro.status === "PRESENTE").length;
  const ausentes = registros.filter(({ registro }) => registro.status === "AUSENTE").length;
  const justificadas = registros.filter(({ registro }) => registro.status === "JUSTIFICADO").length;
  const aprovado = frequencia !== null && frequencia >= siteConfig.approval.minAttendance;

  return (
    <>
      <PageHeader
        eyebrow="Módulo Presença"
        title="Sua frequência"
        sub="Acompanhe presenças, faltas e justificativas por sessão."
        actions={
          <Badge tone={aprovado ? "ok" : "danger"} className="text-[11px] font-bold">
            {frequencia === null ? "Sem registros" : `${frequencia}% de frequência`}
          </Badge>
        }
      />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <KpiCard label="Presenças" value={String(presentes)} hint="registros confirmados" icon="check" tone="green" />
            <KpiCard label="Faltas" value={String(ausentes)} hint="ausências sem justificativa" icon="alert" tone="red" />
            <KpiCard label="Justificadas" value={String(justificadas)} hint="contam para a frequência" icon="file" tone="amber" />
          </div>

          <Panel>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display text-lg text-slate-900">Histórico de presença</h2>
              <span className="text-[12.5px] text-stone-600">{registros.length} registro(s)</span>
            </div>

            {registros.length ? (
              <DataTable label="Histórico de presença">
                <thead>
                  <TableHeaderRow>
                    <th>Data</th>
                    <th>Sessão</th>
                    <th>Turma</th>
                    <th>Status</th>
                    <th>Justificativa</th>
                  </TableHeaderRow>
                </thead>
                <tbody>
                  {registros.map(({ registro, sessao }) => (
                    <tr key={registro.id}>
                      <td className="whitespace-nowrap">{sessao ? formatDate(sessao.data) : "—"}</td>
                      <td>{sessao ? sessao.tema : "—"}</td>
                      <td>{sessao ? turmaById(viewer.data, sessao.turmaId).codigo : "—"}</td>
                      <td>
                        <StatusBadge status={registro.status} />
                      </td>
                      <td className="text-[12px] text-stone-600">{registro.justificativa || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            ) : (
              <EmptyState icon="presenca" title="Sem registros" text="Ainda não há chamadas registradas para você." />
            )}
          </Panel>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Panel>
            <div className="mb-3">
              <h2 className="font-display text-lg text-slate-900">Distribuição dos registros</h2>
              <p className="text-[11.5px] text-stone-600">Como suas presenças estão distribuídas no semestre.</p>
            </div>
            <DonutChart
              centerLabel="registros"
              slices={[
                { label: "Presentes", value: presentes, color: "#0f766e" },
                { label: "Justificadas", value: justificadas, color: "#d97706" },
                { label: "Ausentes", value: ausentes, color: "#dc2626" },
              ]}
            />
          </Panel>

          <Panel>
            <div className="mb-2">
              <h2 className="font-display text-lg text-slate-900">Frequência</h2>
            </div>
            <div className="flex justify-center py-3">
              <RadialGauge
                value={frequencia}
                label={`mínimo ${siteConfig.approval.minAttendance}%`}
                threshold={siteConfig.approval.minAttendance}
                size={148}
                thickness={10}
              />
            </div>
            <p className="text-center text-[12.5px] text-stone-600">
              A frequência considera presenças e justificativas sobre o total de sessões registradas.
            </p>
          </Panel>

          <Panel>
            <div className="mb-2">
              <h2 className="font-display text-lg text-slate-900">Matrículas</h2>
            </div>
            {matriculas.map((matricula) => {
              const taxa = frequenciaDaMatricula(viewer.data, matricula.id);
              const turma = turmaById(viewer.data, matricula.turmaId);
              return (
                <div
                  key={matricula.id}
                  className="flex items-baseline justify-between border-b border-dashed border-stone-200 py-2 text-[13.5px] last:border-0"
                >
                  <span className="text-stone-600">
                    {turma.codigo} · {turma.componente}
                  </span>
                  <strong className="font-display text-[20px] text-slate-900">{formatPercent(taxa)}</strong>
                </div>
              );
            })}
            {!matriculas.length ? <p className="text-[13px] text-stone-600">Sem matrícula ativa.</p> : null}
          </Panel>
        </div>
      </div>
    </>
  );
}