"use client";

import { useState } from "react";
import { DIAS_SEMANA, type DiaSemana } from "@/features/agenda/schemas";
import { useAgendaActions } from "@/features/agenda/hooks/use-agenda-actions";
import { Button } from "@/components/ui/Button";
import { Field, FormError } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import type { GradeHoraria } from "@/types/domain";

interface HorarioModalProps {
  turmaId: string;
  /** Horário em edição; `null` cria um novo. */
  entrada: GradeHoraria | null;
  onClose: () => void;
}

const VIGENCIA_INICIO = "2026-08-01";
const VIGENCIA_FIM = "2026-12-15";

/**
 * Criação e edição de horário da grade. Ao salvar, a mutação valida choque de
 * horário para a turma e para o professor antes de gravar.
 */
export function HorarioModal({ turmaId, entrada, onClose }: HorarioModalProps) {
  const { criarHorario, atualizarHorario, alternarHorario } = useAgendaActions();

  const [dia, setDia] = useState<DiaSemana>((entrada?.dia as DiaSemana) ?? "Segunda");
  const [inicio, setInicio] = useState(entrada?.inicio ?? "19:00");
  const [fim, setFim] = useState(entrada?.fim ?? "20:40");
  const [componente, setComponente] = useState(entrada?.componente ?? "");
  const [sala, setSala] = useState(entrada?.sala ?? "");
  const [vigenciaInicio, setVigenciaInicio] = useState(entrada?.vigenciaInicio ?? VIGENCIA_INICIO);
  const [vigenciaFim, setVigenciaFim] = useState(entrada?.vigenciaFim ?? VIGENCIA_FIM);
  const [erro, setErro] = useState<string | null>(null);

  const salvar = () => {
    const input = { turmaId, dia, inicio, fim, componente, sala, vigenciaInicio, vigenciaFim };
    const resultado = entrada ? atualizarHorario(entrada.id, input) : criarHorario(input);
    if (!resultado.ok) {
      setErro(resultado.error);
      return;
    }
    onClose();
  };

  const alternarSituacao = () => {
    if (!entrada) return;
    const resultado = alternarHorario(entrada.id);
    if (resultado.ok) onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      eyebrow="Agenda"
      title={entrada ? "Editar horário" : "Novo horário na grade"}
      footer={
        <>
          {entrada ? (
            <Button variant={entrada.status === "ATIVA" ? "danger" : "secondary"} onClick={alternarSituacao}>
              {entrada.status === "ATIVA" ? "Inativar horário" : "Reativar horário"}
            </Button>
          ) : null}
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="horario-form">
            Salvar horário
          </Button>
        </>
      }
    >
      <form
        id="horario-form"
        onSubmit={(event) => {
          event.preventDefault();
          salvar();
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field htmlFor="horario-dia" label="Dia da semana">
            <Select
              id="horario-dia"
              value={dia}
              onChange={(event) => setDia(event.target.value as DiaSemana)}
            >
              {DIAS_SEMANA.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Field>

          <Field htmlFor="horario-sala" label="Sala">
            <Input
              id="horario-sala"
              value={sala}
              onChange={(event) => setSala(event.target.value)}
              placeholder="Ex.: 302 ou Lab. 3"
            />
          </Field>

          <Field htmlFor="horario-inicio" label="Início">
            <Input
              id="horario-inicio"
              type="time"
              value={inicio}
              onChange={(event) => setInicio(event.target.value)}
            />
          </Field>

          <Field htmlFor="horario-fim" label="Término">
            <Input id="horario-fim" type="time" value={fim} onChange={(event) => setFim(event.target.value)} />
          </Field>

          <Field htmlFor="horario-componente" label="Componente curricular" className="sm:col-span-2">
            <Input
              id="horario-componente"
              value={componente}
              onChange={(event) => setComponente(event.target.value)}
              placeholder="Ex.: Engenharia de Requisitos"
            />
          </Field>

          <Field htmlFor="horario-vigencia-inicio" label="Início da vigência">
            <Input
              id="horario-vigencia-inicio"
              type="date"
              value={vigenciaInicio}
              onChange={(event) => setVigenciaInicio(event.target.value)}
            />
          </Field>

          <Field htmlFor="horario-vigencia-fim" label="Fim da vigência">
            <Input
              id="horario-vigencia-fim"
              type="date"
              value={vigenciaFim}
              onChange={(event) => setVigenciaFim(event.target.value)}
            />
          </Field>
        </div>

        {erro ? <FormError className="mt-3">{erro}</FormError> : null}

        <p className="mt-3 text-[11px] text-stone-600">
          Ao salvar, o sistema confere choque de horário para a turma e para o professor do componente no mesmo dia e
          janela.
        </p>
      </form>
    </Modal>
  );
}