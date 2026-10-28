"use client";

import { useState } from "react";
import { eventoSchema, type EventoInput } from "@/features/agenda/schemas";
import { useAgendaActions } from "@/features/agenda/hooks/use-agenda-actions";
import { Button } from "@/components/ui/Button";
import { Field, FormError } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { siteConfig } from "@/config/site";
import { useViewer } from "@/store/viewer-context";

const TIPOS = ["Palestra", "Workshop", "Semana acadêmica", "Feira", "Outro"];

interface EventoModalProps {
  onClose: () => void;
}

/** Publicação de um evento acadêmico na agenda institucional. */
export function EventoModal({ onClose }: EventoModalProps) {
  const viewer = useViewer();
  const { criarEventoAcademico } = useAgendaActions();

  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [inicio, setInicio] = useState(`${siteConfig.todayDate}T19:00`);
  const [fim, setFim] = useState(`${siteConfig.todayDate}T21:00`);
  const [local, setLocal] = useState("");
  const [publico, setPublico] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const salvar = () => {
    const input: EventoInput = { titulo, tipo, inicio, fim, local, publico };
    const parsed = eventoSchema.safeParse(input);
    if (!parsed.success) {
      setErro(parsed.error.issues[0]?.message ?? "Evento inválido.");
      return;
    }
    const resultado = criarEventoAcademico(parsed.data, viewer.user.id);
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
      title="Novo evento"
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="evento-form">
            Publicar evento
          </Button>
        </>
      }
    >
      <form
        id="evento-form"
        onSubmit={(event) => {
          event.preventDefault();
          salvar();
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field htmlFor="evento-titulo" label="Título" className="sm:col-span-2">
            <Input
              id="evento-titulo"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              placeholder="Ex.: Palestra de Carreira em Dados"
            />
          </Field>

          <Field htmlFor="evento-tipo" label="Tipo">
            <Select id="evento-tipo" value={tipo} onChange={(event) => setTipo(event.target.value)}>
              {TIPOS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Field>

          <Field htmlFor="evento-local" label="Local">
            <Input
              id="evento-local"
              value={local}
              onChange={(event) => setLocal(event.target.value)}
              placeholder="Ex.: Auditório A"
            />
          </Field>

          <Field htmlFor="evento-inicio" label="Início">
            <Input
              id="evento-inicio"
              type="datetime-local"
              value={inicio}
              onChange={(event) => setInicio(event.target.value)}
            />
          </Field>

          <Field htmlFor="evento-fim" label="Término">
            <Input id="evento-fim" type="datetime-local" value={fim} onChange={(event) => setFim(event.target.value)} />
          </Field>

          <Field htmlFor="evento-publico" label="Público" className="sm:col-span-2">
            <Input
              id="evento-publico"
              value={publico}
              onChange={(event) => setPublico(event.target.value)}
              placeholder="Ex.: Alunos e professores"
            />
          </Field>
        </div>

        {erro ? <FormError className="mt-3">{erro}</FormError> : null}
      </form>
    </Modal>
  );
}