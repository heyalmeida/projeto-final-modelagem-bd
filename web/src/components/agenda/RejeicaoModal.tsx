"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, FormError } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { useAgendaActions } from "@/features/agenda/hooks/use-agenda-actions";

interface RejeicaoModalProps {
  solicitacaoId: string;
  onClose: () => void;
}

/** Rejeição de solicitação com motivo obrigatório. */
export function RejeicaoModal({ solicitacaoId, onClose }: RejeicaoModalProps) {
  const { rejeitarSolicitacao } = useAgendaActions();
  const [motivo, setMotivo] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const rejeitar = () => {
    const resultado = rejeitarSolicitacao({ solicitacaoId, motivo });
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
      eyebrow="Agenda"
      title="Rejeitar solicitação"
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="danger" type="submit" form="rejeicao-form">
            Rejeitar
          </Button>
        </>
      }
    >
      <form
        id="rejeicao-form"
        onSubmit={(event) => {
          event.preventDefault();
          rejeitar();
        }}
      >
        <p className="mb-3 text-[13.5px] text-stone-600">
          Explique o motivo da rejeição. O solicitante verá a resposta no histórico.
        </p>

        <Field htmlFor="rejeicao-motivo" label="Motivo">
          <Textarea
            id="rejeicao-motivo"
            value={motivo}
            onChange={(event) => {
              setErro(null);
              setMotivo(event.target.value);
            }}
            required
          />
        </Field>

        {erro ? <FormError className="mt-2">{erro}</FormError> : null}
      </form>
    </Modal>
  );
}