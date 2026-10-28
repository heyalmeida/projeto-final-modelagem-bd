"use client";

import { useState } from "react";
import { AlertNote } from "@/components/ui/AlertNote";
import { Button } from "@/components/ui/Button";
import { Field, FormError } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { gradeDaTurma } from "@/features/agenda/selectors";
import { useAgendaActions } from "@/features/agenda/hooks/use-agenda-actions";
import type { SolicitacaoInput } from "@/features/agenda/schemas";
import type { SolicitacaoTipo } from "@/types/domain";
import { useViewer } from "@/store/viewer-context";

const TIPOS: ReadonlyArray<{ id: SolicitacaoTipo; label: string }> = [
  { id: "NOVO_HORARIO", label: "Novo horário" },
  { id: "SUBSTITUICAO", label: "Substituição" },
  { id: "CANCELAMENTO", label: "Cancelamento" },
];

interface SolicitacaoModalProps {
  turmaId: string;
  /** Executado depois de persistir a solicitação. */
  onSuccess: () => void;
  onClose: () => void;
}

/** Nova solicitação de alteração de horário, sempre nasce pendente. */
export function SolicitacaoModal({ turmaId, onSuccess, onClose }: SolicitacaoModalProps) {
  const viewer = useViewer();
  const { solicitarAlteracao } = useAgendaActions();

  const horarios = gradeDaTurma(viewer.data, turmaId);
  const [gradeId, setGradeId] = useState(() => horarios[0]?.id ?? "");
  const [tipo, setTipo] = useState<SolicitacaoTipo>("NOVO_HORARIO");
  const [salaProposta, setSalaProposta] = useState("");
  const [justificativa, setJustificativa] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const enviar = () => {
    const input: SolicitacaoInput = { gradeId, tipo, justificativa, salaProposta };
    const resultado = solicitarAlteracao(input, viewer.user.id);
    if (!resultado.ok) {
      setErro(resultado.error);
      return;
    }
    onSuccess();
  };

  return (
    <Modal
      open
      onClose={onClose}
      eyebrow="Agenda"
      title="Solicitar alteração de horário"
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="solicitacao-form">
            Enviar solicitação
          </Button>
        </>
      }
    >
      <form
        id="solicitacao-form"
        onSubmit={(event) => {
          event.preventDefault();
          enviar();
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field htmlFor="solicitacao-horario" label="Horário" className="sm:col-span-2">
            <Select id="solicitacao-horario" value={gradeId} onChange={(event) => setGradeId(event.target.value)}>
              {horarios.map((horario) => (
                <option key={horario.id} value={horario.id}>
                  {horario.dia} · {horario.inicio}–{horario.fim} · {horario.componente}
                </option>
              ))}
            </Select>
          </Field>

          <Field htmlFor="solicitacao-tipo" label="Tipo">
            <Select
              id="solicitacao-tipo"
              value={tipo}
              onChange={(event) => setTipo(event.target.value as SolicitacaoTipo)}
            >
              {TIPOS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field htmlFor="solicitacao-sala" label="Sala proposta (opcional)">
            <Input
              id="solicitacao-sala"
              value={salaProposta}
              onChange={(event) => setSalaProposta(event.target.value)}
              placeholder="Ex.: 305"
            />
          </Field>

          <Field htmlFor="solicitacao-justificativa" label="Justificativa" className="sm:col-span-2">
            <Textarea
              id="solicitacao-justificativa"
              value={justificativa}
              onChange={(event) => {
                setErro(null);
                setJustificativa(event.target.value);
              }}
              required
              placeholder="Explique o motivo da alteração."
            />
          </Field>
        </div>

        {erro ? <FormError className="mt-2">{erro}</FormError> : null}

        <AlertNote icon="clock" className="mt-3">
          A solicitação nasce pendente e será analisada pela coordenação. A grade só muda após a aprovação.
        </AlertNote>
      </form>
    </Modal>
  );
}