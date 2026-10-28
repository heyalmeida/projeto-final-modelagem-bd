"use client";

import { useState } from "react";
import { AlertNote } from "@/components/ui/AlertNote";
import { Button } from "@/components/ui/Button";
import { Field, FormError } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useFinanceiroActions } from "@/features/financeiro/hooks/use-financeiro-actions";
import { alunoDaMensalidade, saldoDa } from "@/features/financeiro/selectors";
import { formatCompetencia, formatDate, money } from "@/lib/utils";
import { useViewer } from "@/store/viewer-context";

interface PagamentoModalProps {
  mensalidadeId: string;
  onClose: () => void;
}

/** Registro de baixa (total ou parcial) de uma mensalidade. */
export function PagamentoModal({ mensalidadeId, onClose }: PagamentoModalProps) {
  const viewer = useViewer();
  const { registrarPagamento } = useFinanceiroActions();

  const mensalidade = viewer.data.mensalidades.find((item) => item.id === mensalidadeId);
  const saldo = mensalidade ? saldoDa(viewer.data, mensalidade) : 0;

  const [valor, setValor] = useState(() => saldo.toFixed(2));
  const [metodoId, setMetodoId] = useState(() => viewer.data.metodos.find((metodo) => metodo.ativo)?.id ?? "mp-pix");
  const [erro, setErro] = useState<string | null>(null);

  if (!mensalidade) return null;

  const metodosAtivos = viewer.data.metodos.filter((metodo) => metodo.ativo);

  const confirmar = () => {
    const resultado = registrarPagamento({
      mensalidadeId,
      metodoId,
      valor,
      usuarioId: viewer.user.id,
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
      eyebrow="Registrar pagamento"
      title={`Mensalidade ${formatCompetencia(mensalidade.competencia)}`}
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="pagamento-form">
            Confirmar pagamento
          </Button>
        </>
      }
    >
      <AlertNote icon="financeiro" title={alunoDaMensalidade(viewer.data, mensalidade).nome} className="mb-3">
        Saldo devedor: {money(saldo)} · vencimento {formatDate(mensalidade.vencimento)}
      </AlertNote>

      <form
        id="pagamento-form"
        onSubmit={(event) => {
          event.preventDefault();
          confirmar();
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            htmlFor="pagamento-valor"
            label="Valor do pagamento"
            hint={`Aceita baixa parcial até ${money(saldo)}.`}
          >
            <Input
              id="pagamento-valor"
              name="valor"
              type="number"
              min="0.01"
              step="0.01"
              max={saldo.toFixed(2)}
              value={valor}
              onChange={(event) => {
                setErro(null);
                setValor(event.target.value);
              }}
              required
            />
          </Field>

          <Field htmlFor="pagamento-metodo" label="Método">
            <Select
              id="pagamento-metodo"
              name="metodoId"
              value={metodoId}
              onChange={(event) => setMetodoId(event.target.value)}
            >
              {metodosAtivos.map((metodo) => (
                <option key={metodo.id} value={metodo.id}>
                  {metodo.nome}
                  {metodo.taxa ? ` · taxa ${metodo.taxa}%` : ""}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {erro ? <FormError className="mt-2">{erro}</FormError> : null}
      </form>
    </Modal>
  );
}