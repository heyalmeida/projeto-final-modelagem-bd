"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, FormError } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { siteConfig } from "@/config/site";
import { opcoesDeMatricula } from "@/features/financeiro/selectors";
import { useFinanceiroActions } from "@/features/financeiro/hooks/use-financeiro-actions";
import { ultimaCompetencia, somarMeses } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

interface NovoLancamentoModalProps {
  onClose: () => void;
}

/**
 * Lançamento de cobrança: matrícula, competência, vencimento, valor e desconto.
 * A mutação bloqueia competência duplicada para a mesma matrícula.
 */
export function NovoLancamentoModal({ onClose }: NovoLancamentoModalProps) {
  const viewer = useViewer();
  const { lancarMensalidade } = useFinanceiroActions();

  const opcoes = opcoesDeMatricula(viewer.data);
  const [matriculaId, setMatriculaId] = useState(opcoes[0]?.id ?? "");
  const [competencia, setCompetencia] = useState(() =>
    somarMeses(
      ultimaCompetencia(
        viewer.data.mensalidades
          .filter((mensalidade) => mensalidade.matriculaId === (opcoes[0]?.id ?? ""))
          .map((mensalidade) => mensalidade.competencia),
      ),
      1,
    ),
  );
  const [vencimento, setVencimento] = useState("2026-11-10");
  const [valor, setValor] = useState("980.00");
  const [desconto, setDesconto] = useState("0.00");
  const [erro, setErro] = useState<string | null>(null);

  const trocarMatricula = (novoId: string) => {
    setMatriculaId(novoId);
    // Sugere a competência seguinte à última cobrança da matrícula escolhida.
    const competencias = viewer.data.mensalidades
      .filter((mensalidade) => mensalidade.matriculaId === novoId)
      .map((mensalidade) => mensalidade.competencia);
    if (competencias.length) setCompetencia(somarMeses(ultimaCompetencia(competencias), 1));
  };

  const salvar = () => {
    const resultado = lancarMensalidade({
      matriculaId,
      competencia,
      vencimento,
      valor: Number(valor),
      desconto: Number(desconto || "0"),
    });
    if (!resultado.ok) {
      setErro(resultado.error);
      return;
    }
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      eyebrow="Módulo Financeiro"
      title="Lançar cobrança"
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="lancamento-form">
            Lançar cobrança
          </Button>
        </>
      }
    >
      <form
        id="lancamento-form"
        onSubmit={(event) => {
          event.preventDefault();
          salvar();
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field htmlFor="lancamento-matricula" label="Aluno · turma" className="sm:col-span-2">
            <Select
              id="lancamento-matricula"
              value={matriculaId}
              onChange={(event) => trocarMatricula(event.target.value)}
            >
              {opcoes.map((opcao) => (
                <option key={opcao.id} value={opcao.id}>
                  {opcao.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            htmlFor="lancamento-competencia"
            label="Competência"
            hint={`Referência atual: ${siteConfig.currentCompetencia}`}
          >
            <Input
              id="lancamento-competencia"
              type="month"
              value={competencia}
              onChange={(event) => setCompetencia(event.target.value)}
            />
          </Field>

          <Field htmlFor="lancamento-vencimento" label="Vencimento">
            <Input
              id="lancamento-vencimento"
              type="date"
              value={vencimento}
              onChange={(event) => setVencimento(event.target.value)}
            />
          </Field>

          <Field htmlFor="lancamento-valor" label="Valor">
            <Input
              id="lancamento-valor"
              type="number"
              min="0.01"
              step="0.01"
              value={valor}
              onChange={(event) => setValor(event.target.value)}
              required
            />
          </Field>

          <Field htmlFor="lancamento-desconto" label="Desconto (opcional)">
            <Input
              id="lancamento-desconto"
              type="number"
              min="0"
              step="0.01"
              value={desconto}
              onChange={(event) => setDesconto(event.target.value)}
            />
          </Field>
        </div>

        {erro ? <FormError className="mt-3">{erro}</FormError> : null}

        <p className="mt-3 text-[11px] text-stone-600">
          Cada matrícula aceita uma cobrança por competência; o status inicial é aberta e é recalculado a cada baixa ou
          estorno.
        </p>
      </form>
    </Modal>
  );
}