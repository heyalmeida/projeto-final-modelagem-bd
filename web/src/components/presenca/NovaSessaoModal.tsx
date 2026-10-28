"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, FormError } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { siteConfig } from "@/config/site";
import { turmasVisiveis } from "@/features/core/selectors";
import { usePresencaActions } from "@/features/presenca/hooks/use-presenca-actions";
import { useViewer } from "@/store/viewer-context";

/** Nova sessão de aula: turma, data, janela e tema (chamada nasce aberta). */
export function NovaSessaoModal({ onClose }: { onClose: () => void }) {
  const viewer = useViewer();
  const { criarSessao } = usePresencaActions();

  const turmas = turmasVisiveis(viewer);
  const [turmaId, setTurmaId] = useState(turmas[0]?.id ?? "");
  const [data, setData] = useState<string>(siteConfig.todayDate);
  const [inicio, setInicio] = useState("19:00");
  const [fim, setFim] = useState("20:40");
  const [tema, setTema] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const salvar = () => {
    const resultado = criarSessao({ turmaId, data, inicio, fim, tema });
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
      eyebrow="Módulo Presença"
      title="Nova sessão de aula"
      footer={
        <>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" form="sessao-form">
            Criar sessão
          </Button>
        </>
      }
    >
      <form
        id="sessao-form"
        onSubmit={(event) => {
          event.preventDefault();
          salvar();
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Field htmlFor="sessao-turma" label="Turma" className="sm:col-span-2">
            <Select id="sessao-turma" value={turmaId} onChange={(event) => setTurmaId(event.target.value)}>
              {turmas.map((turma) => (
                <option key={turma.id} value={turma.id}>
                  {turma.codigo} · {turma.componente}
                </option>
              ))}
            </Select>
          </Field>

          <Field htmlFor="sessao-data" label="Data">
            <Input id="sessao-data" type="date" value={data} onChange={(event) => setData(event.target.value)} />
          </Field>

          <Field htmlFor="sessao-tema" label="Tema">
            <Input
              id="sessao-tema"
              value={tema}
              onChange={(event) => setTema(event.target.value)}
              placeholder="Ex.: Modelagem conceitual"
            />
          </Field>

          <Field htmlFor="sessao-inicio" label="Início">
            <Input id="sessao-inicio" type="time" value={inicio} onChange={(event) => setInicio(event.target.value)} />
          </Field>

          <Field htmlFor="sessao-fim" label="Término">
            <Input id="sessao-fim" type="time" value={fim} onChange={(event) => setFim(event.target.value)} />
          </Field>
        </div>

        {erro ? <FormError className="mt-3">{erro}</FormError> : null}

        <p className="mt-3 text-[11px] text-stone-600">
          A sessão nasce aberta para receber a chamada; o professor vinculado é o da turma.
        </p>
      </form>
    </Modal>
  );
}